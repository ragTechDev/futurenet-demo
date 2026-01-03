"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

import countries from "../data/countries.json";

import DigitalParentQuizResultsCanvas from "./DigitalParentQuizResultsCanvas";

import EmailGateOverlay from "./EmailGateOverlay";

import type { PersonaId, QuizOption } from "./quizTypes";
import { PERSONAS } from "./quizPersonas";
import { QUESTIONS, QUIZ_VERSION } from "./quizQuestions";

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
  const storyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [email, setEmail] = useState(() => {
    try {
      if (typeof window === "undefined") return "";
      return window.localStorage.getItem("dpq_email") ?? "";
    } catch {
      return "";
    }
  });
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      if (typeof window === "undefined") return false;
      return window.localStorage.getItem("dpq_email_unlocked") === "1";
    } catch {
      return false;
    }
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [respondentType, setRespondentType] = useState<"parent" | "expecting" | "considering" | "na" | null>(null);
  const [researchOptIn, setResearchOptIn] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [ethnicities, setEthnicities] = useState<string[]>([]);
  const [gender, setGender] = useState<"m" | "w" | "na" | null>(null);
  const [kidsAgeBands, setKidsAgeBands] = useState<string[]>([]);
  const [isSharingStory, setIsSharingStory] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const nationalityOptions = useMemo(() => {
    const normalized = (countries as Array<{ alpha2: string; name: string }>).map((c) => ({
      value: c.alpha2,
      label: c.name,
    }));

    normalized.sort((a, b) => a.label.localeCompare(b.label));
    return [{ value: "na", label: "Prefer not to say" }, ...normalized];
  }, []);

  const kidsAgeOptions = useMemo(
    () =>
      [
        { value: "na", label: "Prefer not to say" },
        { value: "0-2", label: "0-2" },
        { value: "3-5", label: "3-5" },
        { value: "6-9", label: "6-9" },
        { value: "10-12", label: "10-12" },
        { value: "13-17", label: "13-17" },
        { value: "18+", label: "18+" },
      ] as const,
    []
  );

  const ethnicityOptions = useMemo(
    () =>
      [
        { value: "na", label: "Prefer not to say" },
        { value: "chinese", label: "Chinese" },
        { value: "malay", label: "Malay" },
        { value: "indian", label: "Indian" },
        { value: "white", label: "White" },
        { value: "black", label: "Black" },
        { value: "hispanic_latino", label: "Hispanic / Latino" },
        { value: "arab", label: "Arab" },
        { value: "indigenous", label: "Indigenous" },
        { value: "other", label: "Other" },
      ] as const,
    []
  );

  const quizUrl = useMemo(() => {
    try {
      if (typeof window === "undefined") return "https://ragtechdev.com";
      return `${window.location.origin}/digital-parent-quiz`;
    } catch {
      return "https://ragtechdev.com";
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get("share");
      if (!shareParam) return;

      const decoded = shareParam ? decodeURIComponent(shareParam) : "";
      const text = decoded || `Take FutureNet's Digital Parent Quiz: ${quizUrl}`;

      const cleanup = () => {
        try {
          params.delete("share");
          const qs = params.toString();
          const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash ?? ""}`;
          window.history.replaceState({}, "", nextUrl);
        } catch {
          // ignore
        }
      };

      const run = async () => {
        try {
          if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            await navigator.share({ text, url: quizUrl });
            cleanup();
            return;
          }

          const fallback = `${text}\n${quizUrl}`;
          if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            await navigator.clipboard.writeText(fallback);
            setShareError("Link copied to clipboard.");
          } else {
            setShareError("Sharing is not supported on this device. Please copy the URL from the address bar.");
          }
          cleanup();
        } catch {
          setShareError("Sharing failed. You can copy the URL from the address bar.");
          cleanup();
        }
      };

      void run();
    } catch {
      // ignore
    }
  }, [quizUrl]);

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

  async function submitEmailGate() {
    const e = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!ok) {
      setEmailError("Please enter a valid email.");
      return;
    }
    if (!respondentType) {
      setEmailError('Please select an option for "I am:"');
      return;
    }
    if (researchOptIn && birthYear.trim()) {
      const y = Number(birthYear.trim());
      const now = new Date().getFullYear();
      if (!Number.isFinite(y) || !Number.isInteger(y) || y < 1900 || y > now) {
        setEmailError("Please enter a valid birth year.");
        return;
      }
    }
    if (isSendingEmail) return;

    setEmailError(null);
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/send-quiz-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          answers,
          responses: QUESTIONS.map((q, i) => ({ questionId: q.id, optionId: answers[i] })),
          quizVersion: QUIZ_VERSION,
          respondent: {
            type: respondentType,
            researchOptIn,
            birthYear: researchOptIn && birthYear.trim() ? Number(birthYear.trim()) : null,
            nationality: researchOptIn && nationalities.length ? nationalities : null,
            ethnicity: researchOptIn && ethnicities.length ? ethnicities : null,
            gender: researchOptIn ? gender : null,
            kidsAges: respondentType === "parent" && researchOptIn && kidsAgeBands.length ? kidsAgeBands : null,
          },
        }),
      });

      if (!res.ok) {
        let msg = "Failed to send email.";
        try {
          const j = (await res.json()) as { error?: string; details?: string };
          if (j?.error) msg = j.error;
          if (j?.details) msg = `${msg} (${j.details})`;
        } catch {
          // ignore
        }
        setEmailError(msg);
        return;
      }

      try {
        window.localStorage.setItem("dpq_email_unlocked", "1");
        window.localStorage.setItem("dpq_email", e);
      } catch {
        // ignore
      }

      setEmailSent(true);
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function getStoryPngFile(): Promise<File | null> {
    const canvas = storyCanvasRef.current;
    if (!canvas) return null;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png");
    });
    if (!blob) return null;

    return new File([blob], "digital-parent-quiz-story.png", { type: "image/png" });
  }

  async function downloadStoryImage() {
    const canvas = storyCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "digital-parent-quiz-story.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function shareStoryToInstagram() {
    if (isSharingStory) return;
    setShareError(null);
    setIsSharingStory(true);
    try {
      if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
        await downloadStoryImage();
        return;
      }

      const file = await getStoryPngFile();
      if (!file) {
        setShareError("Could not generate the story image. Please try again.");
        return;
      }

      const data: ShareData = {
        title: "My Digital Parent Quiz result",
        text: `I took FutureNet's Digital Parent Quiz—check yours here:\n${quizUrl}`,
        url: quizUrl,
        files: [file],
      };

      const canShareFiles = typeof navigator.canShare === "function" ? navigator.canShare({ files: [file] }) : true;
      if (!canShareFiles) {
        await downloadStoryImage();
        return;
      }

      await navigator.share(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg && !/abort/i.test(msg) && !/cancel/i.test(msg)) {
        setShareError("Sharing failed. You can download the image instead.");
      }
    } finally {
      setIsSharingStory(false);
    }
  }

  function openInbox() {
    const e = email.trim().toLowerCase();
    const domain = e.includes("@") ? e.split("@").pop() ?? "" : "";
    const isGmail = domain === "gmail.com" || domain === "googlemail.com";
    const isOutlook =
      domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com" || domain === "msn.com";
    const isYahoo = domain === "yahoo.com" || domain === "yahoo.com.sg" || domain === "ymail.com";
    const isIcloud = domain === "icloud.com" || domain === "me.com" || domain === "mac.com";

    let url: string | null = null;
    if (isGmail) url = "https://mail.google.com/mail/u/0/#inbox";
    else if (isOutlook) url = "https://outlook.live.com/mail/0/inbox";
    else if (isYahoo) url = "https://mail.yahoo.com/d/folders/1";
    else if (isIcloud) url = "https://www.icloud.com/mail";

    try {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else window.location.href = "mailto:";
    } catch {
      // ignore
    }
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
              A short day-in-the-life quiz that contributes to crucial research on digital parenting. Pick one of two options each time, and we&apos;ll reveal your <span style={{ fontWeight: 650 }}>2000s
              phone persona</span> based on your digital parenting style.
            </p>
            
            <div className={styles.subcopy} style={{ marginTop: 16, padding: 16, backgroundColor: "rgba(0, 0, 0, 0.05)", borderRadius: 8 }}>
              <strong>About FutureNet:</strong> We&apos;re a group of technologists who are also parents, working to give our kids a chance to grow up with the same freedom, creativity, and authentic connections we experienced. Every response helps us understand how parenting styles have evolved with technology.
            </div>

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
          <div className={styles.storyGateRegion}>
            {isUnlocked ? (
              <div style={{ marginBottom: 12 }}>
                <div className={styles.subtle} style={{ marginBottom: 10 }}>
                  Check your email for a <strong>full breakdown</strong> of your results, plus an overview of the other personas. 
                  <br/>
                  <i>If you don&apos;t see it, it could be in Spam - help us by marking it as &apos;Not Spam&apos; so we can reach out to you in the future for further research!</i>
                </div>
                <div className={styles.subtle} style={{ marginBottom: 10 }}>
                  Help our research by sharing this on your social media — together, we can shape a safer and healthier digital landscape for our next generation!
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button type="button" className={styles.button} onClick={shareStoryToInstagram} disabled={isSharingStory}>
                    {isSharingStory ? "Preparing…" : "💌 Share Your Results!"}
                  </button>
                  <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={downloadStoryImage}>
                    ⬇️ Download Your Results
                  </button>
                  <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={openInbox}>
                    📧 Check email for full breakdown
                  </button>
                  {shareError ? <div className={styles.subtle}>{shareError}</div> : null}
                </div>
              </div>
            ) : null}

            <div className={`${styles.scene} ${styles.storyPreviewWrap}`} style={{ padding: 12 }}>
              <DigitalParentQuizResultsCanvas
                canvasRef={storyCanvasRef}
                className={styles.storyCanvas}
                active={step === "result"}
                topPersona={topPersona}
                isUnlocked={isUnlocked}
                quizUrl={quizUrl}
              />
            </div>

            {!isUnlocked ? (
              <div className={styles.subtle} style={{ marginTop: 12 }}>
                Enter your email to unlock your full result.
              </div>
            ) : null}

            {!isUnlocked ? (
              <EmailGateOverlay
                emailSent={emailSent}
                isSendingEmail={isSendingEmail}
                emailError={emailError}
                email={email}
                setEmail={setEmail}
                respondentType={respondentType}
                setRespondentType={setRespondentType}
                researchOptIn={researchOptIn}
                setResearchOptIn={setResearchOptIn}
                birthYear={birthYear}
                setBirthYear={setBirthYear}
                nationalityOptions={nationalityOptions}
                nationalities={nationalities}
                setNationalities={setNationalities}
                ethnicityOptions={ethnicityOptions}
                ethnicities={ethnicities}
                setEthnicities={setEthnicities}
                gender={gender}
                setGender={setGender}
                kidsAgeOptions={kidsAgeOptions}
                kidsAgeBands={kidsAgeBands}
                setKidsAgeBands={setKidsAgeBands}
                optionButtonClassName={styles.optionButton}
                optionButtonSelectedClassName={styles.optionSelected}
                buttonClassName={styles.button}
                buttonSecondaryClassName={styles.buttonSecondary}
                optionButtonStyle={optionButtonStyle}
                onSubmit={submitEmailGate}
                onRestart={restart}
                onCloseAfterSent={() => {
                  try {
                    window.localStorage.setItem("dpq_email_unlocked", "1");
                    window.localStorage.setItem("dpq_email", email.trim());
                  } catch {
                    // ignore
                  }
                  setIsUnlocked(true);
                  setEmailSent(false);
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
