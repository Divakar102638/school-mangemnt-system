import { InstitutionType } from '../types';

export const TYPE_PREFIX_MAP: Record<InstitutionType, string> = {
  'School': 'SCH',
  'Intermediate College': 'COL',
  'Degree College': 'DEG',
  'Engineering College': 'ENG',
  'Other': 'OTH'
};

const SEQUENCE_STORAGE_KEY = 'edunexa_id_sequences_v1';

interface SequenceStore {
  [prefix: string]: number;
}

export function getPrefixForType(type: InstitutionType): string {
  return TYPE_PREFIX_MAP[type] || 'INS';
}

/**
 * Loads the current sequence counters from localStorage.
 */
function loadSequences(): SequenceStore {
  try {
    const raw = localStorage.getItem(SEQUENCE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load ID sequences', err);
  }
  return {
    SCH: 1,
    COL: 1,
    ENG: 1,
    DEG: 1,
    OTH: 1
  };
}

/**
 * Saves sequence counters to localStorage.
 */
function saveSequences(seqs: SequenceStore) {
  try {
    localStorage.setItem(SEQUENCE_STORAGE_KEY, JSON.stringify(seqs));
  } catch (err) {
    console.error('Failed to save ID sequences', err);
  }
}

/**
 * Generates the next sequential ID for a given institution type.
 * Guarantees that deleted IDs are NEVER reused.
 * Example: SCH001 -> SCH002 -> SCH003. If SCH002 is deleted, the next is SCH004.
 */
export function generateNextInstitutionId(
  type: InstitutionType, 
  existingIds: string[]
): string {
  const prefix = getPrefixForType(type);
  const sequences = loadSequences();
  
  // Find highest number already used in existing IDs or in stored sequences
  let currentSeq = sequences[prefix] || 0;
  
  // Check if any existing ID has a higher number
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const numPart = parseInt(id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > currentSeq) {
        currentSeq = numPart;
      }
    }
  }
  
  // Generate next unused sequence
  let nextSeq = currentSeq + 1;
  let candidateId = `${prefix}${String(nextSeq).padStart(3, '0')}`;
  
  // Extra safeguard against collision
  while (existingIds.includes(candidateId)) {
    nextSeq++;
    candidateId = `${prefix}${String(nextSeq).padStart(3, '0')}`;
  }
  
  // Update persistent sequence high-water mark
  sequences[prefix] = nextSeq;
  saveSequences(sequences);
  
  return candidateId;
}

/**
 * Initializes the sequence store from a list of default/initial institutions.
 */
export function initIdSequencesFromData(institutions: { id: string }[]) {
  const sequences = loadSequences();
  for (const inst of institutions) {
    const match = inst.id.match(/^([A-Z]+)(\d+)$/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10);
      if (!isNaN(num) && (!sequences[prefix] || num > sequences[prefix])) {
        sequences[prefix] = num;
      }
    }
  }
  saveSequences(sequences);
}
