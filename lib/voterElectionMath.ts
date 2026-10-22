import { Voter, CanvassingMap, Locality } from './types';

export interface ElectionMetrics {
  totalRegistered: number;
  lateEliminated: number;
  finalLivingVoters: number;
  favored: number;
  unfavored: number;
  decidedVoters: number;
  undecidedVoters: number;
  winningPercentage: number;
  targetToWin: number;
  leadMargin: number;
  doubleVoterCount: number;
}

export interface AreaElectionBreakdown {
  localityId: string;
  localityName: string;
  totalVoters: number;
  livingVoters: number;
  favored: number;
  unfavored: number;
  undecided: number;
  targetToWin: number;
  leadMargin: number;
  winningPercentage: number;
}

/**
 * Computes election war room metrics based on official formula specs
 */
export function calculateElectionMetrics(
  voters: Voter[],
  canvassing: CanvassingMap
): ElectionMetrics {
  const totalRegistered = voters.length;
  let lateEliminated = 0;
  let favored = 0;
  let unfavored = 0;
  let doubleVoterCount = 0;

  for (const v of voters) {
    const tag = canvassing[v.id];
    if (tag) {
      if (tag.isLate) {
        lateEliminated += 1;
        // A late voter does not count towards living decided/undecided
        continue;
      }
      if (tag.isDouble) {
        doubleVoterCount += 1;
      }
      if (tag.status === 'FAVOR') {
        favored += 1;
      } else if (tag.status === 'UNFAVOR') {
        unfavored += 1;
      }
    }
  }

  const finalLivingVoters = totalRegistered - lateEliminated;
  const decidedVoters = favored + unfavored;
  const undecidedVoters = Math.max(0, finalLivingVoters - decidedVoters);
  
  // Winning % = (Favored / Decided) * 100% (default 50.0% if 0 decided)
  const winningPercentage =
    decidedVoters > 0
      ? Number(((favored / decidedVoters) * 100).toFixed(1))
      : 50.0;

  // Target to Win = Math.floor(Final Living Voters / 2) + 1
  const targetToWin = Math.floor(finalLivingVoters / 2) + 1;

  // Lead Margin = Favored - Unfavored (+Lead or -Deficit)
  const leadMargin = favored - unfavored;

  return {
    totalRegistered,
    lateEliminated,
    finalLivingVoters,
    favored,
    unfavored,
    decidedVoters,
    undecidedVoters,
    winningPercentage,
    targetToWin,
    leadMargin,
    doubleVoterCount,
  };
}

/**
 * Computes area-wise campaign breakdown for the 4 canonical localities
 */
export function calculateAreaBreakdown(
  localities: Locality[],
  voters: Voter[],
  canvassing: CanvassingMap
): AreaElectionBreakdown[] {
  return localities.map((loc) => {
    const areaVoters = voters.filter((v) => v.locality_id === loc.id);
    const metrics = calculateElectionMetrics(areaVoters, canvassing);

    return {
      localityId: loc.id,
      localityName: loc.display_name,
      totalVoters: metrics.totalRegistered,
      livingVoters: metrics.finalLivingVoters,
      favored: metrics.favored,
      unfavored: metrics.unfavored,
      undecided: metrics.undecidedVoters,
      targetToWin: metrics.targetToWin,
      leadMargin: metrics.leadMargin,
      winningPercentage: metrics.winningPercentage,
    };
  });
}
