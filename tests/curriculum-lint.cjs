const assert = require('node:assert/strict');
const { lintCurriculum, loadContent, readManifest } = require('../scripts/validate-curriculum.cjs');

const clone = value => JSON.parse(JSON.stringify(value));
const content = loadContent();
const manifest = readManifest();
const missionCount = content.reduce((sum, unit) => sum + unit.missions.length, 0);

assert.equal(Object.keys(manifest.missions).length, missionCount, 'Every mission needs exactly one teaching contract');
assert.deepEqual(lintCurriculum(content, manifest), [], 'The authored curriculum must pass teaching-order validation');

const missingContract = clone(manifest);
delete missingContract.missions['P02-M03'];
assert(lintCurriculum(content, missingContract).some(error => error.includes('P02-M03: missing teaching contract')));

const untaughtRequirement = clone(manifest);
untaughtRequirement.missions['P02-M03'].requires.push('language.never-taught');
assert(lintCurriculum(content, untaughtRequirement).some(error => error.includes('requires untaught concept language.never-taught')));

const prematureAssessment = clone(manifest);
prematureAssessment.missions['P02-M03'].assesses.push('language.never-taught');
assert(lintCurriculum(content, prematureAssessment).some(error => error.includes('assesses untaught concept language.never-taught')));

const missingCategory = clone(manifest);
delete missingCategory.missions['F01-M03'].distractors.category;
assert(lintCurriculum(content, missingCategory).some(error => error.includes('same-category distractors need an explicit category')));

const longInstructionContent = clone(content);
longInstructionContent[0].missions[0].instructionHe = 'א'.repeat(31);
assert(lintCurriculum(longInstructionContent, manifest).some(error => error.includes('F00-M01: instruction exceeds 30 visible characters')));

const fakeIndependentIntroduction = clone(manifest);
fakeIndependentIntroduction.missions['P02-M03'].teaches.push('language.new-during-test');
fakeIndependentIntroduction.missions['P02-M03'].assesses.push('language.new-during-test');
assert(lintCurriculum(content, fakeIndependentIntroduction).some(error => error.includes('independent assessment cannot introduce language.new-during-test')));

console.log(`Passed: ${missionCount} teaching contracts plus negative curriculum-lint fixtures.`);
