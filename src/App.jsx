import React, { useMemo, useState } from "react";

const candidates = [
  { id: 1, city: "Sultan Kudarat", name: "Jenrose Javier" },
  { id: 2, city: "La Union", name: "Bea Millan-Windorski" },
  { id: 3, city: "Cebu City", name: "Apriel Smith" },
  { id: 4, city: "Tarlac", name: "Marian Arellano" },
  { id: 5, city: "Taguig City", name: "Ysabella Ysmael" },
  { id: 6, city: "Cebu Province", name: "Nicole Borromeo" },
  { id: 7, city: "Pampanga", name: "Allyson Hetland" }
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
  currentCandidateScore[key] = value;
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
  console.assert(candidates.length === 7, "Expected 7 official finalists.");
  console.assert(TITLE_ORDER.length === 7, "Expected 7 titles.");
  console.assert(clampScore(120) === 100, "Scores above 100 should clamp to 100.");
  console.assert(clampScore(-5) === 0, "Scores below 0 should clamp to 0.");
  console.assert(clampScore(88) === 88, "Valid score should remain unchanged.");
  console.assert(getScore({ qa: 95 }, "qa") === 95, "Q&A score should be read correctly.");
  console.assert(hasScore({ qa: 0 }, "qa") === true, "Zero should count as a completed Q&A score.");
  console.assert(setScoreValue({}, 1, "qa", 91)[1].qa === 91, "Score setter should store Q&A score.");
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
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(
    "Official Top 7 is ready. Enter Q&A scores, then submit to reveal the final titleholders."
  );

  const finalRanking = useMemo(function () {
    return candidates
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
        return a.id - b.id;
      });
  }, [scores]);

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
    setFinalSubmitted(false);
    setVerificationMessage("Q&A scores were updated. Submit again to reveal the titleholders.");

    setScores(function (current) {
      return setScoreValue(current, candidateId, key, cleanValue);
    });
  }

  function clearScores() {
    setScores({});
    setFinalSubmitted(false);
    setIsVerifying(false);
    setVerificationMessage("Official Top 7 is ready. Enter Q&A scores, then submit to reveal the final titleholders.");
  }

  function verifyWithDelay(message, callback) {
    setIsVerifying(true);
    setVerificationMessage(message);
    window.setTimeout(function () {
      setIsVerifying(false);
      callback();
    }, 700);
  }

  function handleSubmitFinal() {
    var incomplete = candidates.filter(function (candidate) {
      return !hasScore(scores[candidate.id], "qa");
    });

    if (incomplete.length > 0) {
      setVerificationMessage(
        "Final verification failed: " + incomplete.length + " Top 7 candidate" + (incomplete.length === 1 ? "" : "s") + " still need Q&A scores."
      );
      return;
    }

    verifyWithDelay("Verifying Q&A scores for the official Top 7...", function () {
      setFinalSubmitted(true);
      setVerificationMessage("Final scores verified. Official titleholders are now revealed.");
    });
  }

  const qaCompleted = candidates.filter(function (candidate) {
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
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.045em]">Miss Universe Philippines 2026 Q&A Scoring System</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href="#results" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950">Results</a>
            <a href="#scorecards" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">Scorecards</a>
            <button
              onClick={handleSubmitFinal}
              disabled={isVerifying}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : finalSubmitted ? "Titles Revealed" : "Submit Q&A Scores"}
            </button>
            <button onClick={clearScores} className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Clear</button>
          </div>
        </nav>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 shadow-sm">
              Official Top 7 → Q&A → Titleholders
            </div>
            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.075em] md:text-7xl lg:text-8xl">
              Miss Universe Philippines 2026 Q&A Scoring System
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
              Enter Q&A scores for the official Top 7. The final titleholders are ranked automatically based on Q&A score.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <StatCard label="Official Top 7" value="Ready" />
            <StatCard label="Q&A Ready" value={qaCompleted + "/7"} />
            <StatCard label="Highest Final" value={highestFinal} />
            <button
              onClick={handleSubmitFinal}
              disabled={isVerifying}
              className="rounded-[24px] bg-neutral-950 px-5 py-4 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="block text-[11px] uppercase tracking-[0.18em] text-white/45">Final Action</span>
              <span className="mt-2 block text-2xl tracking-[-0.04em]">{isVerifying ? "Verifying..." : finalSubmitted ? "Titles Revealed" : "Submit Q&A"}</span>
            </button>
          </div>
        </section>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-10">
        <section id="results" className="mb-8 overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Final Ranking</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Automatic Results</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-neutral-500">
                Results stay hidden until all Q&A scores are submitted and verified.
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
                <button onClick={handleSubmitFinal} disabled={isVerifying} className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {finalSubmitted ? "Titles Revealed" : "Submit Q&A Scores"}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Finalists</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 7 Titleholders</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by Q&A scores only</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                {!finalSubmitted && (
                  <div className="rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center lg:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Awaiting Q&A Verification</p>
                    <h4 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Titleholders are hidden</h4>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">Enter Q&A scores for all seven finalists, then submit to reveal the final titleholders.</p>
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

        <section id="scorecards" className="overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Score Entry</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Q&A Scorecards</h2>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search finalist or province"
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white md:max-w-sm"
              />
            </div>
          </div>

          <div className="grid gap-px bg-neutral-100 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map(function (candidate) {
              var score = scores[candidate.id] || {};
              var currentTitle = finalSubmitted
                ? titleholders.find(function (item) {
                    return item.id === candidate.id;
                  })
                : null;

              return (
                <article key={candidate.id} className="bg-white p-5">
                  <div className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:shadow-[0_18px_60px_rgba(0,0,0,0.07)] ${currentTitle ? "border-neutral-950" : "border-neutral-200"}`}>
                    <div className="grid grid-cols-[108px_1fr]">
                      <div className="h-full min-h-[150px] overflow-hidden bg-neutral-100"><CandidatePhoto candidate={candidate} className="h-full w-full" /></div>

                      <div className="flex flex-col justify-between p-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">#{candidate.id}</p>
                            <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-right text-white">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Status</p>
                              <p className="text-sm font-semibold">Top 7</p>
                            </div>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold leading-6 tracking-[-0.04em]">{displayName(candidate)}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500">{candidate.city}</p>
                        </div>

                        {currentTitle && <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-950 px-3 py-2 text-xs font-semibold leading-4 text-white">{currentTitle.title}</div>}
                      </div>
                    </div>

                    <div className="border-t border-neutral-100 bg-neutral-50/70 p-4">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Q&A</span>
                        <input type="number" min="0" max="100" value={score.qa || score.qa === 0 ? score.qa : ""} onChange={(event) => updateScore(candidate.id, "qa", event.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950" />
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
