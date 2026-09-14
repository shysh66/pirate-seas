const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const root = join(__dirname, '..');
const contractPath = join(root, 'curriculum', 'mission-contracts.json');
const ASSESSMENT_TYPES = new Set(['exposure', 'guided', 'independent', 'review']);
const DISTRACTOR_POLICIES = new Set(['none', 'same-category', 'review-mix']);

function loadContent() {
  const app = { innerHTML: '' };
  const windowObject = {};
  const context = vm.createContext({
    console,
    document: { querySelector: () => app },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    window: windowObject,
    setTimeout: () => 1
  });
  vm.runInContext(readFileSync(join(root, 'app.js'), 'utf8'), context);
  return windowObject.PirateSeas.CONTENT;
}

function hasAlternatives(mission) {
  const variants = [mission, mission.preVariant].filter(Boolean);
  return variants.some(variant => {
    if (['choice', 'checkpoint', 'sail'].includes(variant.kind)) return (variant.rounds || []).some(round => round.options?.length > 1);
    if (variant.kind === 'dialogue') return (variant.turns || []).some(turn => turn.options?.length > 1);
    if (variant.kind === 'sort') return variant.buckets?.length > 1;
    if (variant.kind === 'swap') return (variant.rounds || []).some(round => round.choices?.length > 1);
    if (variant.kind === 'case') return variant.pairs?.length > 1;
    if (variant.kind === 'memory') return variant.pairs?.length > 1;
    if (variant.kind === 'sequence') return variant.target?.length > 1;
    if (variant.kind === 'flag') return variant.flags?.length > 1;
    return false;
  });
}

function instructionLimit(unit) {
  if (unit.id === 'F00') return 30;
  return 48;
}

function uniqueStrings(value) {
  return Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim()) && new Set(value).size === value.length;
}

function lintCurriculum(content, manifest) {
  const errors = [];
  const contracts = manifest?.missions || {};
  const missionIds = new Set(content.flatMap(unit => unit.missions.map(mission => mission.id)));

  for (const id of Object.keys(contracts)) if (!missionIds.has(id)) errors.push(`${id}: contract has no authored mission`);

  const taught = new Set();
  for (const unit of content) {
    for (const mission of unit.missions) {
      const contract = contracts[mission.id];
      if (!contract) {
        errors.push(`${mission.id}: missing teaching contract`);
        continue;
      }

      if (typeof contract.focus !== 'string' || !contract.focus.trim()) errors.push(`${mission.id}: focus is required`);
      for (const field of ['teaches', 'requires', 'assesses']) {
        if (!uniqueStrings(contract[field])) errors.push(`${mission.id}: ${field} must be a duplicate-free string array`);
      }
      if (!ASSESSMENT_TYPES.has(contract.assessment)) errors.push(`${mission.id}: invalid assessment type`);

      const distractors = contract.distractors;
      if (!distractors || !DISTRACTOR_POLICIES.has(distractors.policy)) errors.push(`${mission.id}: distractor policy is required`);
      if (hasAlternatives(mission) && distractors?.policy === 'none') errors.push(`${mission.id}: activities with alternatives need a distractor policy`);
      if (distractors?.policy === 'same-category' && (typeof distractors.category !== 'string' || !distractors.category.trim())) {
        errors.push(`${mission.id}: same-category distractors need an explicit category`);
      }
      if (distractors?.policy === 'review-mix' && contract.assessment !== 'review') errors.push(`${mission.id}: review-mix is only valid for review missions`);

      const limit = instructionLimit(unit);
      if ([...String(mission.instructionHe || '')].length > limit) errors.push(`${mission.id}: instruction exceeds ${limit} visible characters`);
      if ([...String(mission.preVariant?.instructionHe || '')].length > 60) errors.push(`${mission.id}: alternate instruction exceeds 60 visible characters`);

      for (const concept of contract.requires || []) {
        if (!taught.has(concept)) errors.push(`${mission.id}: requires untaught concept ${concept}`);
      }
      if (contract.assessment === 'exposure' && contract.assesses?.length) errors.push(`${mission.id}: exposure missions cannot claim assessment`);
      for (const concept of contract.assesses || []) {
        const modeledHere = contract.assessment === 'guided' && contract.teaches?.includes(concept);
        if (!taught.has(concept) && !modeledHere) errors.push(`${mission.id}: assesses untaught concept ${concept}`);
      }
      if (contract.assessment === 'independent') {
        for (const concept of contract.assesses || []) {
          if (contract.teaches?.includes(concept)) errors.push(`${mission.id}: independent assessment cannot introduce ${concept}`);
        }
      }
      for (const concept of contract.teaches || []) taught.add(concept);
    }
  }

  return errors;
}

function readManifest() {
  return JSON.parse(readFileSync(contractPath, 'utf8'));
}

if (require.main === module) {
  const errors = lintCurriculum(loadContent(), readManifest());
  if (errors.length) {
    console.error(`Curriculum validation failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    const content = loadContent();
    const count = content.reduce((sum, unit) => sum + unit.missions.length, 0);
    console.log(`Curriculum valid: ${count} missions have ordered teaching contracts.`);
  }
}

module.exports = { hasAlternatives, lintCurriculum, loadContent, readManifest };
