
import type { Player } from "@/types/player";

export type Metric =
  | "goalsPer90"
  | "assistsPer90"
  | "progressivePassesPer90"
  | "successfulDribblesPer90"
  | "tacklesWonPer90";

export type Weights = Record<Metric, number>;

export const metricLabels: Record<Metric, string> = {
  goalsPer90: "Goals / 90",
  assistsPer90: "Assists / 90",
  progressivePassesPer90: "Progressive Passes / 90",
  successfulDribblesPer90: "Successful Dribbles / 90",
  tacklesWonPer90: "Tackles Won / 90",
};

export interface MetricBreakdown {
  metric: Metric;
  label: string;
  rawValue: number;
  normalizedScore: number;
  weight: number;
  contribution: number;
}

export interface ScoutedPlayer extends Player {
  fitScore: number;
  breakdown: MetricBreakdown[];
  strengths: MetricBreakdown[];
  weaknesses: MetricBreakdown[];
}

export function rankPlayers(
  players: Player[],
  weights: Weights
): ScoutedPlayer[] {
  const metrics = Object.keys(metricLabels) as Metric[];

  const totalWeight = metrics.reduce(
    (sum, metric) => sum + weights[metric],
    0
  );

  if (totalWeight <= 0) {
    throw new Error("Select at least one metric.");
  }

  const ranges = metrics.map((metric) => {
    const values = players.map((player) => player[metric]);

    return {
      metric,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });

  const ranked = players.map((player) => {
    const breakdown: MetricBreakdown[] = ranges.map(
      ({ metric, min, max }) => {
        const rawValue = player[metric];

        const normalizedScore =
          max === min
            ? 50
            : ((rawValue - min) / (max - min)) * 100;

        const weight = weights[metric];

        return {
          metric,
          label: metricLabels[metric],
          rawValue,
          normalizedScore,
          weight,
          contribution:
            (normalizedScore * weight) / totalWeight,
        };
      }
    );

    const fitScore = breakdown.reduce(
      (sum, item) => sum + item.contribution,
      0
    );

    const activeMetrics = breakdown.filter(
      (item) => item.weight > 0
    );

    const strengths = activeMetrics
      .filter((item) => item.normalizedScore >= 70)
      .sort(
        (a, b) =>
          b.normalizedScore - a.normalizedScore
      );

    const weaknesses = activeMetrics
      .filter((item) => item.normalizedScore <= 30)
      .sort(
        (a, b) =>
          a.normalizedScore - b.normalizedScore
      );

    return {
      ...player,
      fitScore,
      breakdown,
      strengths,
      weaknesses,
    };
  });

  return ranked.sort(
    (a, b) => b.fitScore - a.fitScore
  );
}
