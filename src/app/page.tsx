
"use client";

import { useState } from "react";
import { players } from "@/data/players";
import { rankPlayers } from "@/lib/scouting";
import type { Metric, Weights } from "@/lib/scouting";

const metricOptions: { key: Metric; label: string }[] = [
  {
    key: "goalsPer90",
    label: "Goals / 90",
  },
  {
    key: "assistsPer90",
    label: "Assists / 90",
  },
  {
    key: "progressivePassesPer90",
    label: "Progressive Passes / 90",
  },
  {
    key: "successfulDribblesPer90",
    label: "Successful Dribbles / 90",
  },
  {
    key: "tacklesWonPer90",
    label: "Tackles Won / 90",
  },
];

export default function Home() {
  const [weights, setWeights] = useState<Weights>({
    goalsPer90: 0,
    assistsPer90: 20,
    progressivePassesPer90: 40,
    successfulDribblesPer90: 30,
    tacklesWonPer90: 10,
  });

  const totalWeight = Object.values(weights).reduce(
    (sum, weight) => sum + weight,
    0
  );

  const rankedPlayers =
    totalWeight > 0 ? rankPlayers(players, weights) : [];

  function updateWeight(metric: Metric, value: number) {
    setWeights((previous) => ({
      ...previous,
      [metric]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header>
          <h1 className="text-5xl font-bold tracking-wider">
            PHASE 90
          </h1>

          <p className="mt-3 text-emerald-400">
            Football Intelligence & Scouting
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Discover players through your own criteria.
          </p>
        </header>

        {/* SCOUTING PROFILE */}
        <section className="mt-12 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-2 text-2xl font-semibold">
            Build Your Scouting Profile
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            Adjust the importance of each player metric.
          </p>

          <div className="space-y-5">
            {metricOptions.map(({ key, label }) => (
              <div key={key}>
                <div className="mb-2 flex justify-between">
                  <label htmlFor={key}>
                    {label}
                  </label>

                  <span className="text-emerald-400">
                    {weights[key]}
                  </span>
                </div>

                <input
                  id={key}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weights[key]}
                  onChange={(event) =>
                    updateWeight(
                      key,
                      Number(event.target.value)
                    )
                  }
                  className="w-full accent-emerald-500"
                />
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Total weight: {totalWeight}
          </p>
        </section>

        {/* PLAYER RANKINGS */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">
            Player Rankings
          </h2>

          {totalWeight === 0 ? (
            <p className="text-amber-400">
              Select at least one metric to rank players.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rankedPlayers.map((player, index) => (
                <article
                  key={player.id}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                >
                  {/* PLAYER HEADER */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">
                        Rank #{index + 1}
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {player.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {player.club} · {player.position}
                        {" · "}Age {player.age}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">
                        {player.fitScore.toFixed(1)}
                      </p>

                      <p className="text-xs text-slate-400">
                        Fit Score / 100
                      </p>
                    </div>
                  </div>

                  {/* SCOUTING REPORT */}
                  <div className="mt-6 border-t border-slate-700 pt-5">
                    <h4 className="mb-4 font-semibold">
                      Scouting Report
                    </h4>

                    {/* METRIC BREAKDOWN */}
                    <div className="space-y-4">
                      {player.breakdown
                        .filter((item) => item.weight > 0)
                        .map((item) => (
                          <div key={item.metric}>
                            <div className="mb-1 flex justify-between gap-3 text-sm">
                              <span className="text-slate-300">
                                {item.label}
                              </span>

                              <span className="text-emerald-400">
                                {item.normalizedScore.toFixed(0)}
                                /100
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{
                                  width: `${item.normalizedScore}%`,
                                }}
                              />
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              Raw value: {item.rawValue}
                              {" · "}
                              Contribution:{" "}
                              {item.contribution.toFixed(1)} points
                            </p>
                          </div>
                        ))}
                    </div>

                    {/* STRENGTHS AND WEAKNESSES */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                      {/* STRENGTHS */}
                      <div className="rounded-lg bg-emerald-950 p-4">
                        <h5 className="mb-2 font-semibold text-emerald-400">
                          Strengths
                        </h5>

                        {player.strengths.length > 0 ? (
                          player.strengths.map((item) => (
                            <p
                              key={item.metric}
                              className="mb-1 text-sm text-emerald-100"
                            >
                              {item.label}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            No standout metrics.
                          </p>
                        )}
                      </div>

                      {/* WEAKNESSES */}
                      <div className="rounded-lg bg-amber-950 p-4">
                        <h5 className="mb-2 font-semibold text-amber-400">
                          Areas to Improve
                        </h5>

                        {player.weaknesses.length > 0 ? (
                          player.weaknesses.map((item) => (
                            <p
                              key={item.metric}
                              className="mb-1 text-sm text-amber-100"
                            >
                              {item.label}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            No major weaknesses detected.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          PHASE 90 — Football Intelligence & Scouting
        </footer>
      </div>
    </main>
  );
}
