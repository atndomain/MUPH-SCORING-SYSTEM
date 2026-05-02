import React, { useMemo, useState } from "react";

const candidates = [
  { id: 1, city: "Baguio City", name: "Roxie Baeyens" },
  { id: 2, city: "Camiguin", name: "Erica Cadayday" },
  { id: 3, city: "Cebu City", name: "Apriel Smith" },
  { id: 4, city: "Cebu Province", name: "Nicole Borromeo" },
  { id: 5, city: "Iloilo City", name: "Zestah Espinosa" },
  { id: 6, city: "La Union", name: "Bea Millan-Windorski" },
  { id: 7, city: "Manila", name: "Justine Felizarta" },
  { id: 8, city: "Muntinlupa", name: "Adela-Mae Marshall" },
  { id: 9, city: "Negros Occidental", name: "Alexandra Colmenares" },
  { id: 10, city: "Pampanga", name: "Allyson Hetland" },
  { id: 11, city: "Quezon Province", name: "Patricia Ella Evangelista" },
  { id: 12, city: "Sultan Kudarat", name: "Jenrose Javier" },
  { id: 13, city: "Tacloban City", name: "Jacqueline Gulrajani" },
  { id: 14, city: "Taguig City", name: "Ysabella Ysmael" },
  { id: 15, city: "Tarlac", name: "Marian Arellano" }
];

const TITLE_ORDER = [
  "Miss Universe Philippines 2026",
  "Miss Supranational Philippines 2026",
  "Miss Cosmo Philippines 2026",
  "Miss Charm Philippines 2026",
  "Miss Eco International Philippines 2026",
  "Miss Universe Philippines 1st Runner Up",
  "Miss Universe Philippines 2nd Runner Up"
];

function clampScore(value) {
  if (value === "") return "";
  var number = Number(value);
  if (Number.isNaN(number)) return "";
  return Math.max(0, Math.min(100, number));
}

function hasScore(score, key) {
  if (!score) return false;
  return score[key] !== "" && score[key] !== undefined;
}

function getScore(score, key) {
  if (!score || score[key] === "" || score[key] === undefined) return 0;
  return Number(score[key]);
}

function setScoreValue(current, candidateId, key, value) {
  var next = Object.assign({}, current);
  var currentCandidateScore = Object.assign({}, next[candidateId] || {});

  if (key === "evening") {
    currentCandidateScore.evening = value;
  }

  if (key === "qa") {
    currentCandidateScore.qa = value;
  }

  next[candidateId] = currentCandidateScore;
  return next;
}

function getInitials(name, city) {
  var source = name === "Candidate" ? city : name;
  return source
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(function (word) {
      return word.charAt(0);
    })
    .join("")
    .toUpperCase();
}

function displayName(candidate) {
  return candidate.name === "Candidate" ? candidate.city : candidate.name;
}

function runTests() {
  console.assert(candidates.length === 15, "Expected 15 official semifinalists.");
  console.assert(TITLE_ORDER.length === 7, "Expected 7 titles.");
  console.assert(clampScore(120) === 100, "Scores above 100 should clamp to 100.");
  console.assert(clampScore(-5) === 0, "Scores below 0 should clamp to 0.");
  console.assert(clampScore(88) === 88, "Valid score should remain unchanged.");
  console.assert(getScore({ evening: 88 }, "evening") === 88, "Evening gown score should be read correctly.");
  console.assert(getScore({ qa: 95 }, "qa") === 95, "Q&A score should be read correctly.");
  console.assert(hasScore({ evening: 0 }, "evening") === true, "Zero should count as a completed score.");
  console.assert(setScoreValue({}, 1, "evening", 91)[1].evening === 91, "Score setter should store evening score.");
}

runTests();

function CandidatePhoto(props) {
  var candidate = props.candidate;
  var className = props.className || "";

  return (
    <div className={`grid place-items-center bg-neutral-100 text-neutral-950 ${className}`}>
      <div className="grid h-14 w-14 place-items-center rounded-full border border-neutral-200 bg-white text-lg font-semibold shadow-sm">
        {getInitials(candidate.name, candidate.city)}
      </div>
    </div>
  );
}

function StatCard(props) {
  return (
    <div className="rounded-[24px] border border-neutral-200/70 bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{props.label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-neutral-950">{props.value}</p>
    </div>
  );
}

export default function PageantScoringSystem() {
  const [query, setQuery] = useState("");
  const [scores, setScores] = useState({});
  const [top7Submitted, setTop7Submitted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(
    "Official Top 15 is listed alphabetically by province/city. Evening gown scoring is unlocked for all semifinalists."
  );

  const top15 = useMemo(function () {
    return candidates.map(function (candidate, index) {
      return Object.assign({}, candidate, {
        score: scores[candidate.id] || {},
        placement: index + 1
      });
    });
  }, [scores]);

  const top15Ids = useMemo(function () {
    return new Set(top15.map(function (candidate) {
      return candidate.id;
    }));
  }, [top15]);

  const eveningRanking = useMemo(function () {
    return top15
      .map(function (candidate) {
        var score = scores[candidate.id] || {};
        return Object.assign({}, candidate, {
          score: score,
          eveningTotal: getScore(score, "evening"),
          eveningComplete: hasScore(score, "evening") ? 1 : 0
        });
      })
      .sort(function (a, b) {
        if (b.eveningComplete !== a.eveningComplete) return b.eveningComplete - a.eveningComplete;
        if (b.eveningTotal !== a.eveningTotal) return b.eveningTotal - a.eveningTotal;
        return a.placement - b.placement;
      });
  }, [scores, top15]);

  const top7 = useMemo(function () {
    if (!top7Submitted) return [];
    return eveningRanking.slice(0, 7).map(function (candidate, index) {
      return Object.assign({}, candidate, { placement: index + 1 });
    });
  }, [top7Submitted, eveningRanking]);

  const top7Ids = useMemo(function () {
    return new Set(top7.map(function (candidate) {
      return candidate.id;
    }));
  }, [top7]);

  const finalRanking = useMemo(function () {
    return top7
      .map(function (candidate) {
        var score = scores[candidate.id] || {};
        return Object.assign({}, candidate, {
          score: score,
          finalTotal: getScore(score, "qa"),
          qaComplete: hasScore(score, "qa") ? 1 : 0
        });
      })
      .sort(function (a, b) {
        if (b.qaComplete !== a.qaComplete) return b.qaComplete - a.qaComplete;
        if (b.finalTotal !== a.finalTotal) return b.finalTotal - a.finalTotal;
        if (b.eveningTotal !== a.eveningTotal) return b.eveningTotal - a.eveningTotal;
        return a.placement - b.placement;
      });
  }, [scores, top7]);

  const titleholders = useMemo(function () {
    if (!finalSubmitted) return [];
    return finalRanking.slice(0, 7).map(function (candidate, index) {
      return Object.assign({}, candidate, {
        title: TITLE_ORDER[index],
        placement: index + 1
      });
    });
  }, [finalSubmitted, finalRanking]);

  const filteredCandidates = useMemo(function () {
    var clean = query.trim().toLowerCase();
    if (!clean) return candidates;

    return candidates.filter(function (candidate) {
      return candidate.name.toLowerCase().includes(clean) || candidate.city.toLowerCase().includes(clean);
    });
  }, [query]);

  function updateScore(candidateId, key, value) {
    var cleanValue = clampScore(value);

    if (key === "evening") {
      setTop7Submitted(false);
      setFinalSubmitted(false);
      setVerificationMessage("Evening gown scores were updated. Submit again to reveal the Top 7.");
    }

    if (key === "qa") {
      setFinalSubmitted(false);
      setVerificationMessage("Q&A scores were updated. Submit final scores again to reveal the titleholders.");
    }

    setScores(function (current) {
      return setScoreValue(current, candidateId, key, cleanValue);
    });
  }

  function clearScores() {
    setScores({});
    setTop7Submitted(false);
    setFinalSubmitted(false);
    setIsVerifying(false);
    setVerificationMessage("Official Top 15 is listed alphabetically by province/city. Evening gown scoring is unlocked for all semifinalists.");
  }

  function verifyWithDelay(message, callback) {
    setIsVerifying(true);
    setVerificationMessage(message);
    window.setTimeout(function () {
      setIsVerifying(false);
      callback();
    }, 700);
  }

  function handleSubmitTop7() {
    var incomplete = top15.filter(function (candidate) {
      return !hasScore(scores[candidate.id], "evening");
    });

    if (incomplete.length > 0) {
      setVerificationMessage(
        "Top 7 verification failed: " + incomplete.length + " Top 15 candidate" + (incomplete.length === 1 ? "" : "s") + " still need evening gown scores."
      );
      return;
    }

    verifyWithDelay("Verifying evening gown scores for the Top 15...", function () {
      setTop7Submitted(true);
      setFinalSubmitted(false);
      setVerificationMessage("Top 7 revealed. Now score Q&A for the Top 7 only, then reveal the titleholders.");
    });
  }

  function handleSubmitFinal() {
    if (!top7Submitted) {
      setVerificationMessage("Reveal the Top 7 first before scoring Q&A.");
      return;
    }

    var incomplete = top7.filter(function (candidate) {
      return !hasScore(scores[candidate.id], "qa");
    });

    if (incomplete.length > 0) {
      setVerificationMessage(
        "Final verification failed: " + incomplete.length + " Top 7 candidate" + (incomplete.length === 1 ? "" : "s") + " still need Q&A scores."
      );
      return;
    }

    verifyWithDelay("Verifying Q&A scores for the Top 7...", function () {
      setFinalSubmitted(true);
      setVerificationMessage("Final scores verified. Official titleholders are now revealed.");
    });
  }

  const eveningCompleted = top15.filter(function (candidate) {
    return hasScore(scores[candidate.id], "evening");
  }).length;

  const qaCompleted = top7.filter(function (candidate) {
    return hasScore(scores[candidate.id], "qa");
  }).length;

  const highestFinal = finalSubmitted && titleholders[0] ? titleholders[0].finalTotal.toFixed(2) : "—";

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-950 [font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Helvetica_Neue',Arial,sans-serif]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-220px] top-24 h-[520px] w-[520px] rounded-full bg-neutral-200/70 blur-3xl" />
        <div className="absolute bottom-[-260px] left-[-140px] h-[560px] w-[560px] rounded-full bg-white blur-3xl" />
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
            <a href="#results" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950">Results</a>
            <a href="#scorecards" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">Scorecards</a>
            <button
              onClick={top7Submitted ? handleSubmitFinal : handleSubmitTop7}
              disabled={isVerifying}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : top7Submitted ? "Submit Top 7 Q&A" : "Submit Top 15 Gown"}
            </button>
            <button onClick={clearScores} className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Clear</button>
          </div>
        </nav>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 shadow-sm">
              Official Top 15 → Evening Gown → Top 7 → Q&A
            </div>
            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.075em] md:text-7xl lg:text-8xl">
              Miss Universe Philippines 2026 Scoring System
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
              The official Top 15 is listed alphabetically by province/city. Score evening gown for the Top 15 to reveal the Top 7. Finally, score Q&A for the Top 7 to reveal the titleholders.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <StatCard label="Official Top 15" value="Revealed" />
            <StatCard label="Gown Ready" value={eveningCompleted + "/15"} />
            <StatCard label="Q&A Ready" value={top7Submitted ? qaCompleted + "/7" : "—"} />
            <StatCard label="Highest Final" value={highestFinal} />
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
                Only the official Top 15 is shown. Evening gown determines the Top 7, and Q&A determines the final titles.
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
                  <button onClick={handleSubmitTop7} disabled={isVerifying} className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-60">
                    {top7Submitted ? "Top 7 Revealed" : "Submit Top 15 Gown"}
                  </button>
                  <button onClick={handleSubmitFinal} disabled={isVerifying || !top7Submitted} className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
                    {finalSubmitted ? "Titles Revealed" : "Submit Top 7 Q&A"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Stage 1</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Official Top 15 Semifinalists</h3>
                </div>
                <p className="text-sm text-neutral-500">Official list for evening gown scoring</p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
                <div className="hidden grid-cols-[88px_1.4fr_1fr_140px] gap-px bg-neutral-200 text-sm font-semibold text-neutral-500 md:grid">
                  <div className="bg-neutral-50 px-4 py-3">Rank</div>
                  <div className="bg-neutral-50 px-4 py-3">Candidate</div>
                  <div className="bg-neutral-50 px-4 py-3">City / Province</div>
                  <div className="bg-neutral-50 px-4 py-3 text-right">Status</div>
                </div>

                <div className="divide-y divide-neutral-100">
                  {top15.map(function (candidate) {
                    return (
                      <div key={candidate.id} className="grid gap-3 px-4 py-4 md:grid-cols-[88px_1.4fr_1fr_140px] md:items-center md:gap-0">
                        <div className="text-sm font-semibold text-neutral-900">#{candidate.placement}</div>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-100"><CandidatePhoto candidate={candidate} className="h-full w-full" /></div>
                          <div className="min-w-0"><p className="truncate text-sm font-semibold text-neutral-950">{displayName(candidate)}</p><p className="text-xs text-neutral-400 md:hidden">{candidate.city}</p></div>
                        </div>
                        <div className="hidden text-sm text-neutral-500 md:block">{candidate.city}</div>
                        <div className="text-left text-sm font-semibold text-neutral-500 md:text-right">Scored</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Stage 2</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 7 Finalists</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by Top 15 evening gown scores</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {!top7Submitted && (
                  <div className="rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center xl:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Awaiting Evening Gown</p>
                    <h4 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Top 7 finalists are hidden</h4>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">Enter evening gown scores for the Top 15, then submit to reveal the Top 7.</p>
                  </div>
                )}
                {top7Submitted && top7.map(function (candidate) {
                  return (
                    <div key={candidate.id} className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[20px] bg-neutral-100"><CandidatePhoto candidate={candidate} className="h-full w-full" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">Rank #{candidate.placement}</div>
                          <p className="truncate text-sm font-semibold text-neutral-950">{displayName(candidate)}</p>
                          <p className="mt-1 truncate text-xs text-neutral-400">{candidate.city}</p>
                          <p className="mt-3 text-lg font-semibold tracking-[-0.04em] text-neutral-950">{candidate.eveningTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Stage 3</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 7 Titleholders</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by Top 7 Q&A scores</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                {!finalSubmitted && (
                  <div className="rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center lg:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Awaiting Final Q&A</p>
                    <h4 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Titleholders are hidden</h4>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">Reveal the Top 7 first, enter Q&A scores for those finalists, then submit final scores to reveal the titleholders.</p>
                  </div>
                )}

                {finalSubmitted && titleholders[0] && (
                  <div className="overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-950 text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:col-span-2 lg:row-span-2">
                    <div className="grid gap-0 md:grid-cols-[0.85fr_1fr] lg:h-full">
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-900 md:aspect-auto"><CandidatePhoto candidate={titleholders[0]} className="h-full w-full" /></div>
                      <div className="flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Overall Winner</p>
                          <h3 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-5xl">{titleholders[0].title}</h3>
                          <div className="mt-6 h-px w-full bg-white/10" />
                          <p className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{displayName(titleholders[0])}</p>
                          <p className="mt-1 text-base text-white/55">{titleholders[0].city}</p>
                        </div>
                        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
                          <p className="text-sm text-white/50">Q&A Score</p>
                          <p className="mt-1 text-6xl font-semibold tracking-[-0.07em]">{titleholders[0].finalTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {finalSubmitted && titleholders.slice(1).map(function (candidate) {
                  return (
                    <div key={candidate.id} className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[20px] bg-neutral-100"><CandidatePhoto candidate={candidate} className="h-full w-full" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">Rank #{candidate.placement}</div>
                          <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-[-0.025em] text-neutral-950">{candidate.title}</h3>
                          <p className="mt-2 truncate text-sm font-medium text-neutral-700">{displayName(candidate)}</p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="truncate text-xs text-neutral-400">{candidate.city}</p>
                            <p className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">{candidate.finalTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-[26px] border border-neutral-200/70 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Top 15</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Official Semifinalists</h3>
            <p className="mt-2 text-sm text-neutral-500">The official Top 15 is shown alphabetically by province/city. Evening gown scoring is already unlocked.</p>
          </div>
          <div className="rounded-[26px] border border-neutral-200/70 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Top 7 Formula</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Top 15 Evening Gown</h3>
            <p className="mt-2 text-sm text-neutral-500">Evening gown score determines the Top 7.</p>
          </div>
          <div className="rounded-[26px] border border-neutral-950 bg-neutral-950 p-5 text-white shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Final Formula</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">Top 7 Q&A</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">Q&A score determines the final title order.</p>
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
            {filteredCandidates.map(function (candidate) {
              var score = scores[candidate.id] || {};
              var isTop15 = top15Ids.has(candidate.id);
              var isTop7 = top7Ids.has(candidate.id);
              var currentTitle = finalSubmitted
                ? titleholders.find(function (item) {
                    return item.id === candidate.id;
                  })
                : null;

              return (
                <article key={candidate.id} className="bg-white p-5">
                  <div className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:shadow-[0_18px_60px_rgba(0,0,0,0.07)] ${isTop7 ? "border-neutral-950" : isTop15 ? "border-neutral-400" : "border-neutral-200"}`}>
                    <div className="grid grid-cols-[108px_1fr]">
                      <div className="h-full min-h-[150px] overflow-hidden bg-neutral-100"><CandidatePhoto candidate={candidate} className="h-full w-full" /></div>

                      <div className="flex flex-col justify-between p-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">#{candidate.id}</p>
                            <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-right text-white">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Status</p>
                              <p className="text-sm font-semibold">Top 15</p>
                            </div>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold leading-6 tracking-[-0.04em]">{displayName(candidate)}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500">{candidate.city}</p>
                        </div>

                        {isTop15 && <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold leading-4 text-neutral-600">Official Top 15</div>}
                        {isTop7 && <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-950 px-3 py-2 text-xs font-semibold leading-4 text-white">Top 7 Finalist</div>}
                        {currentTitle && <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-950 px-3 py-2 text-xs font-semibold leading-4 text-white">{currentTitle.title}</div>}
                      </div>
                    </div>

                    <div className="grid gap-3 border-t border-neutral-100 bg-neutral-50/70 p-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Evening Gown</span>
                        <input type="number" min="0" max="100" value={score.evening || score.evening === 0 ? score.evening : ""} onChange={(event) => updateScore(candidate.id, "evening", event.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950" />
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Q&A</span>
                        <input type="number" min="0" max="100" value={score.qa || score.qa === 0 ? score.qa : ""} onChange={(event) => updateScore(candidate.id, "qa", event.target.value)} placeholder={top7Submitted && isTop7 ? "0" : "Locked"} disabled={!top7Submitted || !isTop7} className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300" />
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
