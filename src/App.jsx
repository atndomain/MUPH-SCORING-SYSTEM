import React, { useMemo, useState } from "react";

const candidates = [
  { city: "Albay", name: "Alexandra Krishna Oriño" },
  { city: "Muntinlupa", name: "Adela-Mae Marshall" },
  { city: "Sultan Kudarat", name: "Jenrose Javier" },
  { city: "Sarangani", name: "Nicole Cruz" },
  { city: "Rizal", name: "Alicia Buendia" },
  { city: "Quezon Province", name: "Patricia Ella Evangelista" },
  { city: "Ilocos Norte", name: "Cherieze Cacayorin" },
  { city: "Pangasinan", name: "Donna Rein Nuguid" },
  { city: "Cavite", name: "Jencel Caña" },
  { city: "Negros Occidental", name: "Alexandra Colmenares" },
  { city: "Mountain Province", name: "Lyneree Montero-Yodong" },
  { city: "Tandag City", name: "Chrystel Mae Correos" },
  { city: "Camiguin", name: "Erica Cadayday" },
  { city: "San Jose, Negros Oriental", name: "Jayka Munsayac" },
  { city: "Manila", name: "Justine Felizarta" },
  { city: "Cebu Province", name: "Nicole Borromeo" },
  { city: "Pampanga", name: "Allyson Hetland" },
  { city: "Taguig City", name: "Ysabella Ysmael" },
  { city: "La Union", name: "Bea Millan-Windorski" },
  { city: "Laguna", name: "Ysabel Prats" },
  { city: "Tarlac", name: "Marian Arellano" },
  { city: "Cebu City", name: "Apriel Smith" },
  { city: "Baguio City", name: "Roxie Baeyens" },
  { city: "Iloilo City", name: "Zestah Espinosa" },
  { city: "Tacloban City", name: "Jacqueline Gulrajani" },
  { city: "Iligan City", name: "Trexy Paris Roxas" },
  { city: "Cotabato Province", name: "Clarissa Westram" },
  { city: "Luisiana, Laguna", name: "Ashley Subijano Montenegro" },
  { city: "Samar Island", name: "Catherine Wardle" },
  { city: "Sto. Tomas, La Union", name: "Rachel-Hanna Gozum" },
].map((candidate, index) => ({ ...candidate, id: index + 1 }));
].map((candidate, index) => ({ ...candidate, id: index + 1 }));

const preliminaryCriteria = [
  { key: "swimsuit", label: "Swimsuit", weight: 50 },
  { key: "evening", label: "Evening Gown", weight: 50 },
];

const titleOrder = [
  "Miss Universe Philippines 2026",
  "Miss Supranational Philippines 2026",
  "Miss Cosmo Philippines 2026",
  "Miss Charm Philippines 2026",
  "Miss Eco International Philippines 2026",
  "Miss Universe Philippines 1st Runner Up",
  "Miss Universe Philippines 2nd Runner Up",
];

function clampScore(value) {
  if (value === "") return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return Math.max(0, Math.min(100, number));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getPreliminaryTotal(score = {}) {
  const swimsuit = Number(score.swimsuit || 0) * 0.5;
  const evening = Number(score.evening || 0) * 0.5;
  return Number((swimsuit + evening).toFixed(2));
}

function getFinalTotal(score = {}) {
  return Number(Number(score.qa || 0).toFixed(2));
}

function getPreliminaryCompletion(score = {}) {
  return preliminaryCriteria.filter((item) => score[item.key] !== "" && score[item.key] !== undefined).length;
}

function getFinalCompletion(score = {}) {
  return score.qa !== "" && score.qa !== undefined ? 1 : 0;
}

function CandidatePhoto({ candidate, className = "" }) {
  const [broken, setBroken] = useState(false);

  if (!candidate.image || broken) {
    return (
      <div className={`grid place-items-center bg-neutral-100 text-neutral-950 ${className}`}>
        <div className="grid h-14 w-14 place-items-center rounded-full border border-neutral-200 bg-white text-lg font-semibold shadow-sm">
          {getInitials(candidate.name)}
        </div>
      </div>
    );
  }

  return (
    <img
      src={candidate.image}
      alt={`${candidate.name} representing ${candidate.city}`}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-neutral-200/70 bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-neutral-950">{value}</p>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [scores, setScores] = useState({});
  const [top15Submitted, setTop15Submitted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(
    "Top 15 is hidden first. Submit swimsuit and evening gown scores to verify the semifinalists."
  );

  const preliminaryRanking = useMemo(() => {
    return candidates
      .map((candidate) => {
        const score = scores[candidate.id] || {};
        return {
          ...candidate,
          score,
          preliminaryTotal: getPreliminaryTotal(score),
          preliminaryCompleted: getPreliminaryCompletion(score),
        };
      })
      .sort((a, b) => {
        if (b.preliminaryTotal !== a.preliminaryTotal) return b.preliminaryTotal - a.preliminaryTotal;
        if (b.preliminaryCompleted !== a.preliminaryCompleted) return b.preliminaryCompleted - a.preliminaryCompleted;
        return a.id - b.id;
      });
  }, [scores]);

  const top15 = top15Submitted
    ? preliminaryRanking.slice(0, 15).map((candidate, index) => ({ ...candidate, placement: index + 1 }))
    : [];

  const top15Ids = useMemo(() => new Set(top15.map((candidate) => candidate.id)), [top15]);

  const finalRanking = useMemo(() => {
    return top15
      .map((candidate) => {
        const score = scores[candidate.id] || {};
        return {
          ...candidate,
          score,
          finalTotal: getFinalTotal(score),
          finalCompleted: getFinalCompletion(score),
        };
      })
      .sort((a, b) => {
        if (b.finalTotal !== a.finalTotal) return b.finalTotal - a.finalTotal;
        if (b.preliminaryTotal !== a.preliminaryTotal) return b.preliminaryTotal - a.preliminaryTotal;
        return a.placement - b.placement;
      });
  }, [scores, top15]);

  const top7 = finalSubmitted
    ? finalRanking.slice(0, 7).map((candidate, index) => ({
        ...candidate,
        title: titleOrder[index],
        placement: index + 1,
      }))
    : [];

  const filteredCandidates = candidates.filter((candidate) => {
    const clean = query.trim().toLowerCase();
    if (!clean) return true;
    return candidate.name.toLowerCase().includes(clean) || candidate.city.toLowerCase().includes(clean);
  });

  const updateScore = (candidateId, key, value) => {
    const cleanValue = clampScore(value);

    if (key === "swimsuit" || key === "evening") {
      setTop15Submitted(false);
      setFinalSubmitted(false);
      setVerificationMessage("Preliminary scores were updated. Submit again to verify the Top 15.");
    }

    if (key === "qa") {
      setFinalSubmitted(false);
      setVerificationMessage("Q&A scores were updated. Submit final scores again to reveal the Top 7 titleholders.");
    }

    setScores((current) => ({
      ...current,
      [candidateId]: {
        ...(current[candidateId] || {}),
        [key]: cleanValue,
      },
    }));
  };

  const clearScores = () => {
    setScores({});
    setTop15Submitted(false);
    setFinalSubmitted(false);
    setIsVerifying(false);
    setVerificationMessage("Top 15 is hidden first. Submit swimsuit and evening gown scores to verify the semifinalists.");
  };

  const handleSubmitTop15 = () => {
    const incompleteCandidates = candidates.filter(
      (candidate) => getPreliminaryCompletion(scores[candidate.id]) < preliminaryCriteria.length
    );

    if (incompleteCandidates.length > 0) {
      setTop15Submitted(false);
      setFinalSubmitted(false);
      setVerificationMessage(
        `Top 15 verification failed: ${incompleteCandidates.length} candidate${incompleteCandidates.length === 1 ? "" : "s"} still need swimsuit and evening gown scores.`
      );
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("Verifying swimsuit and evening gown scores for the Top 15...");

    window.setTimeout(() => {
      setIsVerifying(false);
      setTop15Submitted(true);
      setFinalSubmitted(false);
      setVerificationMessage("Top 15 verified. You can now enter Q&A scores for the Top 15 only, then submit final scores for the Top 7.");
    }, 1200);
  };

  const handleSubmitFinal = () => {
    if (!top15Submitted) {
      setVerificationMessage("Submit and verify the Top 15 first before entering Q&A scores.");
      return;
    }

    const incompleteFinalists = top15.filter((candidate) => getFinalCompletion(scores[candidate.id]) < 1);

    if (incompleteFinalists.length > 0) {
      setFinalSubmitted(false);
      setVerificationMessage(
        `Final verification failed: ${incompleteFinalists.length} Top 15 candidate${incompleteFinalists.length === 1 ? "" : "s"} still need Q&A scores.`
      );
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("Verifying Q&A scores for the Top 15 and calculating the Top 7...");

    window.setTimeout(() => {
      setIsVerifying(false);
      setFinalSubmitted(true);
      setVerificationMessage("Final scores verified. Official Top 7 titleholders are now revealed.");
    }, 1200);
  };

  const preliminaryCompletedCandidates = candidates.filter(
    (candidate) => getPreliminaryCompletion(scores[candidate.id]) === preliminaryCriteria.length
  ).length;
  const qaCompletedCandidates = top15.filter((candidate) => getFinalCompletion(scores[candidate.id]) === 1).length;
  const highestScore = finalSubmitted ? top7[0]?.finalTotal?.toFixed(2) || "0.00" : "—";

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-220px] top-24 h-[520px] w-[520px] rounded-full bg-neutral-200/70 blur-3xl" />
      </div>

      <header className="relative mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-10">
        <div className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Website created by Tina Rasha
        </div>

        <nav className="flex flex-col gap-4 rounded-[28px] border border-neutral-200/70 bg-white/80 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.045)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">One Judge Panel</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.045em]">Miss Universe Philippines 2026 Scoring System</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href="#results" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950">
              Results
            </a>
            <a href="#scorecards" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
              Scorecards
            </a>
            <button
              onClick={top15Submitted ? handleSubmitFinal : handleSubmitTop15}
              disabled={isVerifying}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : top15Submitted ? "Submit Final Scores" : "Submit Top 15 Scores"}
            </button>
            <button onClick={clearScores} className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
              Clear
            </button>
          </div>
        </nav>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 shadow-sm">
              Top 15: Swimsuit 50% · Evening Gown 50% | Top 7: Q&A 100%
            </div>
            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.075em] md:text-7xl lg:text-8xl">
              Miss Universe Philippines 2026 Scoring System
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
              First, score all candidates in swimsuit and evening gown to reveal the Top 15. Then enter Q&A scores only for the Top 15 to reveal the Top 7 titleholders.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <StatCard label="Candidates" value="31" />
            <StatCard label="Top 15 Ready" value={preliminaryCompletedCandidates} />
            <StatCard label="Q&A Ready" value={top15Submitted ? `${qaCompletedCandidates}/15` : "—"} />
            <StatCard label="Highest Final" value={highestScore} />
            <button
              onClick={top15Submitted ? handleSubmitFinal : handleSubmitTop15}
              disabled={isVerifying}
              className="col-span-2 rounded-[24px] bg-neutral-950 px-5 py-4 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-4 lg:col-span-2"
            >
              <span className="block text-[11px] uppercase tracking-[0.18em] text-white/45">Current Stage</span>
              <span className="mt-2 block text-2xl tracking-[-0.04em]">
                {isVerifying ? "Verifying Scores..." : top15Submitted ? "Submit Final Q&A" : "Submit Top 15"}
              </span>
            </button>
          </div>
        </section>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-10">
        <section id="results" className="mb-8 overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Live Ranking</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Automatic Results</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-neutral-500">
                Top 15 is based only on swimsuit and evening gown. Top 7 is based on Q&A scores from the Top 15.
              </p>
            </div>
          </div>

          <div className="px-5 py-6 md:px-7">
            <div className={`mb-6 rounded-[26px] border px-5 py-4 ${finalSubmitted ? "border-green-100 bg-green-50 text-green-700" : verificationMessage.includes("failed") ? "border-red-100 bg-red-50 text-red-700" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Verification Status</p>
                  <p className="mt-1 text-sm font-semibold">{verificationMessage}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleSubmitTop15} disabled={isVerifying} className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-60">
                    {top15Submitted ? "Top 15 Verified" : "Submit Top 15 Scores"}
                  </button>
                  <button onClick={handleSubmitFinal} disabled={isVerifying || !top15Submitted} className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
                    {finalSubmitted ? "Final Verified" : "Submit Final Q&A"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Semifinalists</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 15</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by swimsuit + evening gown only</p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
                <div className="hidden grid-cols-[88px_1.4fr_1fr_140px] gap-px bg-neutral-200 text-sm font-semibold text-neutral-500 md:grid">
                  <div className="bg-neutral-50 px-4 py-3">Rank</div>
                  <div className="bg-neutral-50 px-4 py-3">Candidate</div>
                  <div className="bg-neutral-50 px-4 py-3">City / Province</div>
                  <div className="bg-neutral-50 px-4 py-3 text-right">Prelim Score</div>
                </div>

                <div className="divide-y divide-neutral-100">
                  {top15Submitted
                    ? top15.map((candidate) => (
                        <div key={candidate.id} className="grid gap-3 px-4 py-4 md:grid-cols-[88px_1.4fr_1fr_140px] md:items-center md:gap-0">
                          <div className="text-sm font-semibold text-neutral-900">#{candidate.placement}</div>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-100">
                              <CandidatePhoto candidate={candidate} className="h-full w-full" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-neutral-950">{candidate.name}</p>
                              <p className="text-xs text-neutral-400 md:hidden">{candidate.city}</p>
                            </div>
                          </div>
                          <div className="hidden text-sm text-neutral-500 md:block">{candidate.city}</div>
                          <div className="text-left text-lg font-semibold tracking-[-0.03em] text-neutral-950 md:text-right">{candidate.preliminaryTotal.toFixed(2)}</div>
                        </div>
                      ))
                    : Array.from({ length: 15 }).map((_, index) => (
                        <div key={index} className="grid gap-3 px-4 py-4 md:grid-cols-[88px_1.4fr_1fr_140px] md:items-center md:gap-0">
                          <div className="text-sm font-semibold text-neutral-300">#{index + 1}</div>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-neutral-100" />
                            <div className="h-4 w-40 rounded-full bg-neutral-100" />
                          </div>
                          <div className="hidden h-4 w-32 rounded-full bg-neutral-100 md:block" />
                          <div className="h-4 w-16 rounded-full bg-neutral-100 md:ml-auto" />
                        </div>
                      ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Finalists</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 7 Titleholders</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by Q&A scores from the Top 15</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                {!finalSubmitted && (
                  <div className="rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center lg:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Awaiting Final Verification</p>
                    <h4 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Top 7 titleholders are hidden</h4>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                      Reveal the Top 15 first, enter Q&A scores for those semifinalists, then submit final scores to reveal the titleholders.
                    </p>
                  </div>
                )}

                {finalSubmitted && top7[0] && (
                  <div className="overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-950 text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:col-span-2 lg:row-span-2">
                    <div className="grid gap-0 md:grid-cols-[0.85fr_1fr] lg:h-full">
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-900 md:aspect-auto">
                        <CandidatePhoto candidate={top7[0]} className="h-full w-full" />
                      </div>
                      <div className="flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Overall Winner</p>
                          <h3 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-5xl">{top7[0].title}</h3>
                          <div className="mt-6 h-px w-full bg-white/10" />
                          <p className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{top7[0].name}</p>
                          <p className="mt-1 text-base text-white/55">{top7[0].city}</p>
                        </div>
                        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
                          <p className="text-sm text-white/50">Q&A Score</p>
                          <p className="mt-1 text-6xl font-semibold tracking-[-0.07em]">{top7[0].finalTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {finalSubmitted && top7.slice(1).map((candidate) => (
                  <div key={candidate.id} className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[20px] bg-neutral-100">
                        <CandidatePhoto candidate={candidate} className="h-full w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">Rank #{candidate.placement}</div>
                        <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-[-0.025em] text-neutral-950">{candidate.title}</h3>
                        <p className="mt-2 truncate text-sm font-medium text-neutral-700">{candidate.name}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="truncate text-xs text-neutral-400">{candidate.city}</p>
                          <p className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">{candidate.finalTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="scorecards" className="overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Score Entry</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Judge Scorecards</h2>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search candidate or province"
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white md:max-w-sm"
              />
            </div>
          </div>

          <div className="grid gap-px bg-neutral-100 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => {
              const score = scores[candidate.id] || {};
              const preliminaryTotal = getPreliminaryTotal(score);
              const rank = preliminaryRanking.findIndex((item) => item.id === candidate.id) + 1;
              const isTop15 = top15Ids.has(candidate.id);
              const currentTitle = finalSubmitted ? top7.find((item) => item.id === candidate.id)?.title : undefined;

              return (
                <article key={candidate.id} className="bg-white p-5">
                  <div className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:shadow-[0_18px_60px_rgba(0,0,0,0.07)] ${isTop15 ? "border-neutral-950" : "border-neutral-200"}`}>
                    <div className="grid grid-cols-[108px_1fr]">
                      <div className="h-full min-h-[150px] overflow-hidden bg-neutral-100">
                        <CandidatePhoto candidate={candidate} className="h-full w-full" />
                      </div>

                      <div className="flex flex-col justify-between p-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">#{candidate.id} · Prelim Rank {rank}</p>
                            <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-right text-white">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Prelim</p>
                              <p className="text-xl font-semibold tracking-[-0.05em]">{preliminaryTotal.toFixed(2)}</p>
                            </div>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold leading-6 tracking-[-0.04em]">{candidate.name}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500">{candidate.city}</p>
                        </div>

                        {isTop15 && (
                          <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold leading-4 text-neutral-600">
                            Top 15 Semifinalist
                          </div>
                        )}
                        {currentTitle && (
                          <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-950 px-3 py-2 text-xs font-semibold leading-4 text-white">
                            {currentTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 border-t border-neutral-100 bg-neutral-50/70 p-4 sm:grid-cols-3">
                      {preliminaryCriteria.map((item) => (
                        <label key={item.key} className="block">
                          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{item.label}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={score[item.key] ?? ""}
                            onChange={(event) => updateScore(candidate.id, item.key, event.target.value)}
                            placeholder="0"
                            className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950"
                          />
                        </label>
                      ))}

                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Q&A</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score.qa ?? ""}
                          onChange={(event) => updateScore(candidate.id, "qa", event.target.value)}
                          placeholder={top15Submitted ? "0" : "Locked"}
                          disabled={!top15Submitted || !isTop15}
                          className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
                        />
                      </label>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
