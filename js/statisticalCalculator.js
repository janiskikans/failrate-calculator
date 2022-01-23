export const OBSERVED_FAIL_RATE = 0.07277; // Default 0.07

/**
 * @param {number} trialCount 
 * @param {number} rate 
 * @param {array<number>} confidence 
 * @returns {{ lowerBound: number, upperBound: number }}
 */
export function getQuickConfidenceBounds(trialCount, rate, confidence) {
  const mean = trialCount * rate;
  const deviation = Math.sqrt(mean * (1 - rate));

  const lowerConfidenceBound = Math.max(0, Math.round(mean - deviation * confidence[0]));
  const upperConfidenceBound = Math.min(trialCount, Math.round(mean + deviation * confidence[1]));


  return { lowerBound: lowerConfidenceBound, upperBound: upperConfidenceBound };
}