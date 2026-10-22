export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type RelationType = 'FATHER' | 'HUSBAND' | 'MOTHER' | 'OTHER';
export type SentimentStatus = 'FAVOR' | 'UNFAVOR' | 'UNDECIDED';

export interface Voter {
  id: string;
  ward_serial_number: number;
  epic_number: string;
  voter_name_original: string;
  voter_name_english: string;
  relation_type: RelationType;
  relation_name_original: string;
  relation_name_english: string;
  age: number;
  gender: Gender;
  house_number_original: string;
  house_number_normalized: string;
  locality_id: string;
  locality_name: string;
  locality_source_name: string;
  section_number: string;
  source_pdf_page: number;
}

export interface VoterSummary {
  id: string;
  ward_serial_number: number;
  voter_name_original: string;
  voter_name_english: string;
  relation_type: RelationType;
  relation_name_original: string;
  relation_name_english: string;
  age: number;
  gender: Gender;
  epic_number: string;
  section_number: string;
  source_pdf_page: number;
}

export interface Household {
  house_number: string;
  house_id: string;
  locality_id: string;
  locality_name: string;
  voter_count: number;
  male_count: number;
  female_count: number;
  voters: VoterSummary[];
}

export interface Locality {
  id: string;
  name_en: string;
  name_te: string;
  display_name: string;
  total_voters: number;
  male_voters: number;
  female_voters: number;
  other_voters: number;
  households_count: number;
  sections: string[];
}

export interface CanvassingTag {
  status: SentimentStatus; // 'FAVOR' | 'UNFAVOR' | 'UNDECIDED'
  isLate: boolean;         // true if marked Late / Deceased
  isDouble: boolean;       // true if marked Double Voter
  notes?: string;
  updatedAt?: string;
}

export type CanvassingMap = Record<string, CanvassingTag>;

export interface WardMetadata {
  municipality_en: string;
  municipality_te: string;
  ward_number: number;
  district_en: string;
  district_te: string;
  assembly_constituency: string;
  total_voters: number;
  male_voters: number;
  female_voters: number;
  other_voters: number;
  total_households: number;
  qualifying_date: string;
  publication_date: string;
}

export interface DuplicateCluster {
  name_original: string;
  name_english: string;
  voter_count: number;
  doors: string[];
  voters: {
    id: string;
    ward_serial_number: number;
    epic_number: string;
    age: number;
    gender: Gender;
    house_number: string;
    relation_type: RelationType;
    relation_name: string;
    locality_name: string;
    source_pdf_page: number;
  }[];
}

export interface SameDoorDuplicate {
  house_number: string;
  voter1: VoterSummary;
  voter2: VoterSummary;
  reason: string;
}

export interface SearchAliasesData {
  ward_metadata: WardMetadata;
  phonetic_substitutions: Record<string, string[] | string>;
  same_door_duplicates_count: number;
  same_door_duplicates: SameDoorDuplicate[];
  cross_door_clusters_count: number;
  cross_door_clusters: DuplicateCluster[];
}
