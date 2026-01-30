export interface Perk {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  effectType: 'multiplier' | 'auto';
  effectValue: number;
}

export const PERKS: Perk[] = [
  // Multiplier perks (increase pushups per click)
  {
    id: 'protein_powder',
    name: 'Protein Powder',
    description: 'Basic gains supplement',
    baseCost: 50,
    effectType: 'multiplier',
    effectValue: 1,
  },
  {
    id: 'creatine',
    name: 'Creatine',
    description: 'Muscle energy booster',
    baseCost: 200,
    effectType: 'multiplier',
    effectValue: 2,
  },
  {
    id: 'gym_membership',
    name: 'Gym Membership',
    description: 'Access to real equipment',
    baseCost: 1000,
    effectType: 'multiplier',
    effectValue: 5,
  },
  {
    id: 'personal_trainer',
    name: 'Personal Trainer',
    description: 'Expert guidance',
    baseCost: 5000,
    effectType: 'multiplier',
    effectValue: 10,
  },
  // Auto-clicker perks (passive pushups per second)
  {
    id: 'pre_workout',
    name: 'Pre-Workout',
    description: 'Energy for automatic reps',
    baseCost: 100,
    effectType: 'auto',
    effectValue: 1,
  },
  {
    id: 'amino_acids',
    name: 'Amino Acids',
    description: 'Continuous muscle fuel',
    baseCost: 500,
    effectType: 'auto',
    effectValue: 3,
  },
  {
    id: 'testosterone_boost',
    name: 'Testosterone Boost',
    description: 'Natural hormone optimization',
    baseCost: 2500,
    effectType: 'auto',
    effectValue: 8,
  },
  {
    id: 'steroids',
    name: 'Steroids',
    description: 'Maximum overdrive mode',
    baseCost: 10000,
    effectType: 'auto',
    effectValue: 20,
  },
];

export const PERKS_BY_ID = Object.fromEntries(PERKS.map((p) => [p.id, p]));

// Cost scaling: cost = baseCost * (1.5 ^ currentLevel)
export function calculatePerkCost(perk: Perk, currentLevel: number): number {
  return Math.floor(perk.baseCost * Math.pow(1.5, currentLevel));
}

// Calculate total multiplier bonus from owned perks
export function calculateMultiplierBonus(perks: Record<string, number>): number {
  let bonus = 0;
  for (const [perkId, level] of Object.entries(perks)) {
    const perk = PERKS_BY_ID[perkId];
    if (perk && perk.effectType === 'multiplier') {
      bonus += perk.effectValue * level;
    }
  }
  return bonus;
}

// Calculate pushups per second from auto perks
export function calculatePushupsPerSecond(perks: Record<string, number>): number {
  let pps = 0;
  for (const [perkId, level] of Object.entries(perks)) {
    const perk = PERKS_BY_ID[perkId];
    if (perk && perk.effectType === 'auto') {
      pps += perk.effectValue * level;
    }
  }
  return pps;
}

// Get pushups per click (base 1 + multiplier bonus)
export function getPushupsPerClick(perks: Record<string, number>): number {
  return 1 + calculateMultiplierBonus(perks);
}
