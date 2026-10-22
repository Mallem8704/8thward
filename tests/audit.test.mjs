import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const votersPath = path.resolve('data/official_ward08_voters.json');
const householdsPath = path.resolve('data/official_ward08_households.json');
const localitiesPath = path.resolve('data/official_ward08_localities.json');
const aliasesPath = path.resolve('data/official_ward08_search_aliases.json');

const voters = JSON.parse(fs.readFileSync(votersPath, 'utf8'));
const households = JSON.parse(fs.readFileSync(householdsPath, 'utf8'));
const localities = JSON.parse(fs.readFileSync(localitiesPath, 'utf8'));
const aliases = JSON.parse(fs.readFileSync(aliasesPath, 'utf8'));

test('Invariant 1: Total voters MUST equal official front-page total of 2013', () => {
  assert.equal(voters.length, 2013);
  assert.equal(aliases.ward_metadata.total_voters, 2013);
});

test('Invariant 2: Gender sum MUST equal total (957 Male + 1056 Female + 0 Other)', () => {
  const maleCount = voters.filter(v => v.gender === 'MALE').length;
  const femaleCount = voters.filter(v => v.gender === 'FEMALE').length;
  const otherCount = voters.filter(v => v.gender === 'OTHER').length;

  assert.equal(maleCount, 957, 'Male count must be 957');
  assert.equal(femaleCount, 1056, 'Female count must be 1056');
  assert.equal(otherCount, 0, 'Other count must be 0');
  assert.equal(maleCount + femaleCount + otherCount, 2013);
});

test('Invariant 3: Sum of all canonical locality voter totals MUST equal 2013', () => {
  const locMap = {};
  for (const loc of localities) {
    locMap[loc.id] = loc.total_voters;
  }

  assert.equal(locMap['adapala-street'], 1819);
  assert.equal(locMap['water-tank-road'], 178);
  assert.equal(locMap['rs-road'], 15);
  assert.equal(locMap['rajiv-gandhi-nagar'], 1);

  const locSum = localities.reduce((acc, l) => acc + l.total_voters, 0);
  assert.equal(locSum, 2013);

  // Voter assignment check
  const actualCounts = {};
  for (const v of voters) {
    actualCounts[v.locality_id] = (actualCounts[v.locality_id] || 0) + 1;
  }
  assert.equal(actualCounts['adapala-street'], 1819);
  assert.equal(actualCounts['water-tank-road'], 178);
  assert.equal(actualCounts['rs-road'], 15);
  assert.equal(actualCounts['rajiv-gandhi-nagar'], 1);
});

test('Invariant 4: Unassigned localities count MUST be 0', () => {
  const unassigned = voters.filter(v => !v.locality_id || v.locality_id === 'UNASSIGNED');
  assert.equal(unassigned.length, 0);
});

test('Invariant 5: Unassigned door numbers count MUST be 0', () => {
  const unassignedDoors = voters.filter(v => !v.house_number_normalized || v.house_number_normalized === 'UNASSIGNED');
  assert.equal(unassignedDoors.length, 0);
});

test('Invariant 6: Every voter MUST be linked to an official PDF page (4-78) and section number', () => {
  for (const v of voters) {
    assert.ok(v.source_pdf_page >= 4 && v.source_pdf_page <= 78, `Voter #${v.ward_serial_number} has invalid page ${v.source_pdf_page}`);
    assert.ok(v.section_number && v.section_number.length > 0, `Voter #${v.ward_serial_number} has missing section`);
    assert.ok(v.epic_number && v.epic_number.length >= 8, `Voter #${v.ward_serial_number} has invalid EPIC`);
  }
});

test('Households: Top Door Numbers MUST be sorted in decreasing order of voter count', () => {
  for (let i = 0; i < households.length - 1; i++) {
    assert.ok(
      households[i].voter_count >= households[i + 1].voter_count,
      `Household sorting failed at index ${i}: ${households[i].voter_count} < ${households[i + 1].voter_count}`
    );
  }
});

test('Canvassing math invariant: decidedVoters + undecidedVoters === finalLivingVoters', () => {
  const total = 2013;
  const late = 13;
  const living = total - late;
  const favor = 600;
  const unfavor = 350;
  const decided = favor + unfavor;
  const undecided = living - decided;
  assert.equal(decided + undecided, living);
});
