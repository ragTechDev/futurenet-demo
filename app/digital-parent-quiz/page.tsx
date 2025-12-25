"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

import type { PersonaId, QuizOption } from "./quizTypes";
import { PERSONAS } from "./quizPersonas";
import { QUESTIONS } from "./quizQuestions";

function SceneSvg({ sceneId }: { sceneId: string }) {
  const [loaded, setLoaded] = useState<{ sceneId: string; markup: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/digital-parent-quiz/scenes/${encodeURIComponent(sceneId)}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error("Missing scene svg");
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setLoaded({ sceneId, markup: text });
      })
      .catch(() => {
        if (!cancelled) setLoaded(null);
      });

    return () => {
      cancelled = true;
    };
  }, [sceneId]);

  const markup = loaded?.sceneId === sceneId ? loaded.markup : null;

  if (!markup) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sceneSvg}>
        <path d="M26 124h188" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return <div className={styles.sceneSvg} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function getTopPersonaId(scores: Record<PersonaId, number>): PersonaId {
  const order: PersonaId[] = [
    "bb-curve",
    "bb-bold",
    "htc-desire",
    "palm-treo",
    "razr",
    "walkman",
    "nokia-3310",
    "nokia-e71",
  ];
  let best: PersonaId = order[0];
  for (const id of order) {
    if (scores[id] > scores[best]) best = id;
  }
  return best;
}

export default function DigitalParentQuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array.from({ length: QUESTIONS.length }, () => null));

  const currentQuestion = QUESTIONS[questionIndex] ?? null;
  const totalQuestions = QUESTIONS.length;

  const scores = useMemo(() => {
    const acc: Record<PersonaId, number> = {
      "bb-bold": 0,
      "htc-desire": 0,
      "palm-treo": 0,
      razr: 0,
      walkman: 0,
      "nokia-3310": 0,
      "nokia-e71": 0,
      "bb-curve": 0,
    };

    for (let i = 0; i < answers.length; i += 1) {
      const optionId = answers[i];
      if (!optionId) continue;
      const q = QUESTIONS[i];
      const opt = q.options.find((o) => o.id === optionId);
      if (!opt) continue;
      for (const [id, delta] of Object.entries(opt.points) as [PersonaId, number][]) {
        acc[id] += delta ?? 0;
      }
    }

    return acc;
  }, [answers]);

  const topPersona = useMemo(() => {
    const topId = getTopPersonaId(scores);
    return PERSONAS.find((p) => p.id === topId) ?? PERSONAS[0];
  }, [scores]);

  function startQuiz() {
    setStep("quiz");
    setQuestionIndex(0);
    setAnswers(Array.from({ length: QUESTIONS.length }, () => null));
  }

  function choose(option: QuizOption) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = option.id;
      return next;
    });
  }

  function goNext() {
    const selected = answers[questionIndex];
    if (!selected) return;
    if (questionIndex >= totalQuestions - 1) {
      setStep("result");
      return;
    }
    setQuestionIndex((i) => i + 1);
  }

  function restart() {
    setStep("intro");
    setQuestionIndex(0);
    setAnswers(Array.from({ length: QUESTIONS.length }, () => null));
  }

  const optionButtonStyle: CSSProperties = { borderWidth: 2 };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Digital Parent Quiz</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/" className={`${styles.button} ${styles.buttonSecondary}`}>
              Back to FutureNet
            </Link>
          </div>
        </div>

        {step === "intro" ? (
          <>
            <p className={styles.subcopy}>
              A short day-in-the-life quiz. Pick one of two options each time, and we’ll reveal your <span style={{ fontWeight: 650 }}>2000s
              phone persona</span>.
            </p>

            <div className={`${styles.card} ${styles.sceneEnter}`}>
              <div className={styles.kicker}>Prologue</div>
              <div className={styles.sceneRow}>
                <div className={styles.scene}>
                  <div className={styles.sceneFloat}>
                    <SceneSvg sceneId="morning" />
                  </div>
                </div>
                <div>
                  <div className={styles.textReveal}>
                    It’s a normal school morning—until it isn’t.
                    {"\n"}
                    You have 12 choices to reveal how you navigate control, trust, and digital life at home.
                    <span className={styles.caret} aria-hidden="true" />
                  </div>

                  <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button type="button" onClick={startQuiz} className={styles.button}>
                      Start the journey
                    </button>
                    <div className={styles.subtle} style={{ alignSelf: "center" }}>
                      12 questions. Two choices each.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {step === "quiz" && currentQuestion ? (
          <div key={currentQuestion.id} className={`${styles.card} ${styles.sceneEnter}`}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div className={styles.kicker}>{currentQuestion.chapter}</div>
              <div className={styles.subtle}>
                {questionIndex + 1}/{totalQuestions}
              </div>
            </div>

            <div className={styles.progressBar} aria-hidden="true">
              <div className={styles.progressFill} style={{ "--p": (questionIndex + 1) / totalQuestions } as CSSProperties} />
            </div>

            <div className={styles.sceneRow}>
              <div className={styles.scene}>
                <div className={styles.sceneFloat}>
                  <SceneSvg sceneId={currentQuestion.sceneId} />
                </div>
              </div>
              <div>
                <div className={styles.textReveal} style={{ fontSize: 20, lineHeight: 1.55 }}>
                  {currentQuestion.prompt}
                  <span className={styles.caret} aria-hidden="true" />
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => choose(opt)}
                      className={`${styles.button} ${styles.optionButton} ${answers[questionIndex] === opt.id ? styles.optionSelected : ""}`}
                      style={optionButtonStyle}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (questionIndex === 0) {
                        restart();
                        return;
                      }
                      setQuestionIndex((i) => Math.max(0, i - 1));
                    }}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    {questionIndex === 0 ? "Exit" : "Back"}
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!answers[questionIndex]}
                    className={`${styles.button} ${!answers[questionIndex] ? styles.buttonDisabled : ""}`}
                  >
                    Next
                  </button>

                  <div className={styles.subtle}>Tap an option to select it, then press Done.</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === "result" ? (
          <div className={`${styles.card} ${styles.sceneEnter}`}>
            <div className={styles.kicker}>Your Parenting OS</div>
            <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.2 }}>
              {topPersona.phoneModel}: <span style={{ fontWeight: 700 }}>{topPersona.characterName}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 18, opacity: 0.9 }}>{topPersona.tagline}</div>

            <p style={{ margin: "14px 0 0", lineHeight: 1.7, opacity: 0.92 }}>{topPersona.summary}</p>

            <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
              <div>
                <div style={{ fontSize: 13, letterSpacing: 0.2, opacity: 0.85 }}>Strengths</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {topPersona.strengths.map((s) => (
                    <div key={s} style={{ opacity: 0.95 }}>
                      - {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, letterSpacing: 0.2, opacity: 0.85 }}>Watch out for</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {topPersona.watchOutFor.map((s) => (
                    <div key={s} style={{ opacity: 0.95 }}>
                      - {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, letterSpacing: 0.2, opacity: 0.85 }}>Next quest (small, realistic steps)</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {topPersona.nextQuest.map((s) => (
                    <div key={s} style={{ opacity: 0.95 }}>
                      - {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={startQuiz} className={styles.button}>
                Retake journey
              </button>
              <button type="button" onClick={restart} className={`${styles.button} ${styles.buttonSecondary}`}>
                Back to prologue
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
