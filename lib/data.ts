import votersData from '@/data/official_ward08_voters.json';
import householdsData from '@/data/official_ward08_households.json';
import localitiesData from '@/data/official_ward08_localities.json';
import aliasesData from '@/data/official_ward08_search_aliases.json';
import { Voter, Household, Locality, SearchAliasesData } from './types';

export const voters: Voter[] = votersData as Voter[];
export const households: Household[] = householdsData as Household[];
export const localities: Locality[] = localitiesData as Locality[];
export const searchAliases: SearchAliasesData = aliasesData as SearchAliasesData;

export function getVoters(): Voter[] {
  return voters;
}

export function getVoterById(id: string): Voter | undefined {
  // Support numeric serial search or id string (e.g. "w8_voter_1" or "1")
  return voters.find(v => v.id === id || String(v.ward_serial_number) === id || v.epic_number.toUpperCase() === id.toUpperCase());
}

export function getHouseholds(): Household[] {
  return households;
}

export function getHouseholdById(houseId: string): Household | undefined {
  return households.find(h => h.house_id === houseId || h.house_number === houseId);
}

export function getLocalities(): Locality[] {
  return localities;
}

export function getLocalityById(localityId: string): Locality | undefined {
  return localities.find(l => l.id === localityId);
}

export function getSearchAliases(): SearchAliasesData {
  return searchAliases;
}
