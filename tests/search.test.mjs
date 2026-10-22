import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const votersPath = path.resolve('data/official_ward08_voters.json');
const voters = JSON.parse(fs.readFileSync(votersPath, 'utf8'));

test('Search by Exact EPIC Number (e.g. RRV1832922)', () => {
  const match = voters.find(v => v.epic_number === 'RRV1832922');
  assert.ok(match, 'Voter with EPIC RRV1832922 must exist');
  assert.equal(match.ward_serial_number, 1);
  assert.equal(match.voter_name_original, 'శ్రీరాములు దేవరకొండ');
});

test('Search by Telugu Unicode Name (e.g. శ్రీరాములు)', () => {
  const results = voters.filter(v => v.voter_name_original.includes('శ్రీరాములు'));
  assert.ok(results.length > 0, 'Telugu unicode search must return matches');
  assert.ok(results.some(v => v.ward_serial_number === 1));
});

test('Search by English Transliteration (e.g. Sreeramulu / Devarakonda)', () => {
  const results = voters.filter(v => v.voter_name_english.toLowerCase().includes('devarakonda'));
  assert.ok(results.length >= 4, 'English transliteration search must match family members');
});

test('Search by Door Number (e.g. 1-1124-4)', () => {
  const results = voters.filter(v => v.house_number_normalized === '1-1124-4');
  assert.equal(results.length, 15, 'Top house 1-1124-4 must have 15 voters');
});

test('Search by Ward Serial Number (e.g. 2013)', () => {
  const lastVoter = voters.find(v => v.ward_serial_number === 2013);
  assert.ok(lastVoter, 'Voter #2013 must exist');
  assert.equal(lastVoter.voter_name_original, 'రాము');
  assert.equal(lastVoter.source_pdf_page, 78);
});
