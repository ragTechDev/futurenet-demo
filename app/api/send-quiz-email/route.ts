import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import * as React from "react";
import crypto from "crypto";

import DigitalParentQuizResultsEmail, {
  type DigitalParentQuizResultsPayload,
  type DigitalParentQuizResultsEmailProps,
} from "../../emails/DigitalParentQuizResultsEmail";

import { QUESTIONS } from "../../digital-parent-quiz/quizQuestions";
import { PERSONAS } from "../../digital-parent-quiz/quizPersonas";
import type { PersonaId, QuizPersona } from "../../digital-parent-quiz/quizTypes";

export const runtime = "nodejs";

type SendQuizEmailBody = {
  email: string;
  answers: (string | null)[];
  responses?: Array<{ questionId: string; optionId: string | null }>;
  quizVersion?: string | null;
  respondent?: {
    type?: "parent" | "expecting" | "considering" | "na" | null;
    researchOptIn?: boolean;
    birthYear?: number | null;
    gender?: "m" | "w" | "na" | null;
    kidsAges?: string[] | null;
  };
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function errorToMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}

function shouldExposeDetails() {
  // Netlify deploy previews often run with NODE_ENV=production, which hides details.
  // Expose details for deploy-preview/branch-deploy contexts to make SMTP debugging possible.
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.CONTEXT === "deploy-preview" ||
    process.env.CONTEXT === "branch-deploy"
  );
}

function safeDebugInfo(extra?: Record<string, unknown>) {
  return {
    nodeEnv: process.env.NODE_ENV ?? null,
    context: process.env.CONTEXT ?? null,
    hasEnv: {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
      PARTICIPANT_ID_SALT: !!process.env.PARTICIPANT_ID_SALT,
    },
    ...extra,
  };
}

function makeParticipantId(email: string) {
  const salt = process.env.PARTICIPANT_ID_SALT;
  if (salt) {
    return crypto.createHmac("sha256", salt).update(email).digest("hex").slice(0, 16);
  }
  return crypto.createHash("sha256").update(email).digest("hex").slice(0, 16);
}

function questionSetHashFromQuestions() {
  const canonical = QUESTIONS.map((q) => ({
    id: q.id,
    chapter: q.chapter,
    sceneId: q.sceneId,
    prompt: q.prompt,
    options: q.options.map((o) => ({
      id: o.id,
      label: o.label,
      points: o.points,
    })),
  }));

  return crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex").slice(0, 16);
}

export async function POST(req: Request) {
  let body: SendQuizEmailBody;
  try {
    body = (await req.json()) as SendQuizEmailBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const answersFromBody = Array.isArray(body.answers) ? body.answers : [];
  const respondent = body.respondent ?? null;
  const quizVersion = typeof body.quizVersion === "string" ? body.quizVersion : null;

  const answers = (() => {
    const responses = Array.isArray(body.responses) ? body.responses : null;
    if (!responses) return answersFromBody;

    const byQuestionId = new Map<string, string | null>();
    for (const r of responses) {
      if (!r || typeof r.questionId !== "string") continue;
      const opt = r.optionId;
      byQuestionId.set(r.questionId, typeof opt === "string" ? opt : null);
    }

    return QUESTIONS.map((q) => byQuestionId.get(q.id) ?? null);
  })();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (answers.length !== QUESTIONS.length || answers.some((a) => a === null || typeof a !== "string" || !a)) {
    return NextResponse.json({ error: "Incomplete answers" }, { status: 400 });
  }

  const scores: Record<PersonaId, number> = {
    "bb-bold": 0,
    "htc-desire": 0,
    "palm-treo": 0,
    razr: 0,
    walkman: 0,
    "nokia-3310": 0,
    "nokia-e71": 0,
    "bb-curve": 0,
  };

  const answerRows: DigitalParentQuizResultsPayload["answers"] = [];

  for (let i = 0; i < QUESTIONS.length; i += 1) {
    const q = QUESTIONS[i];
    const optionId = answers[i] as string;
    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) {
      return NextResponse.json({ error: `Invalid option for ${q.id}` }, { status: 400 });
    }

    for (const [pid, pts] of Object.entries(opt.points)) {
      const personaId = pid as PersonaId;
      scores[personaId] += pts ?? 0;
    }

    answerRows.push({
      questionId: q.id,
      optionId: opt.id,
      chapter: q.chapter,
      prompt: q.prompt,
      selectedLabel: opt.label,
    });
  }

  const topPersonaId = getTopPersonaId(scores);
  const topPersona = PERSONAS.find((p: QuizPersona) => p.id === topPersonaId);
  if (!topPersona) {
    return NextResponse.json({ error: "Top persona not found" }, { status: 500 });
  }

  const participantId = makeParticipantId(email);
  const questionSetHash = questionSetHashFromQuestions();

  const payload: DigitalParentQuizResultsPayload = {
    submittedAt: new Date().toISOString(),
    participantId,
    email,
    answers: answerRows,
    scores,
    topPersonaId,
    respondent,
    quizVersion,
    questionSetHash,
  };

  const allPersonas = PERSONAS.map((p: QuizPersona) => ({
    id: p.id,
    phoneModel: p.phoneModel,
    characterName: p.characterName,
    tagline: p.tagline,
    summary: p.summary,
  }));

  // Validate env before attempting SMTP.
  let smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    secure: boolean;
  };
  try {
    const host = requireEnv("SMTP_HOST");
    const port = Number(requireEnv("SMTP_PORT"));
    const user = requireEnv("SMTP_USER");
    const pass = requireEnv("SMTP_PASS");
    const from = requireEnv("EMAIL_FROM");
    smtp = {
      host,
      port,
      user,
      pass,
      from,
      secure: process.env.SMTP_SECURE === "1" || port === 465,
    };
  } catch (err) {
    const details = errorToMessage(err);
    console.error("[send-quiz-email] env validation failed:", err);
    console.log("Available env vars:", {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
    });
    return NextResponse.json(
      {
        error: "Email configuration missing",
        ...(shouldExposeDetails() ? { details } : null),
        debug: safeDebugInfo({ stage: "env" }),
      },
      { status: 500 }
    );
  }

  let html: string;
  let text: string;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : "https://ragtechdev.com/";
    const quizUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/digital-parent-quiz` : "https://ragtechdev.com/";

    const emailProps: DigitalParentQuizResultsEmailProps = {
      topPersona,
      allPersonas,
      payload,
      baseUrl,
      quizUrl,
      unsubscribeTo: smtp.from,
    };

    const emailComponent = React.createElement(DigitalParentQuizResultsEmail, emailProps);

    html = await render(emailComponent, { pretty: true });
    text = await render(emailComponent, { plainText: true });
  } catch (err) {
    const details = errorToMessage(err);
    console.error("[send-quiz-email] render failed:", err);
    return NextResponse.json(
      {
        error: "Email render failed",
        ...(shouldExposeDetails() ? { details } : null),
        debug: safeDebugInfo({ stage: "render" }),
      },
      { status: 500 }
    );
  }

  try {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    await transport.sendMail({
      from: `FutureNet <${smtp.from}>`,
      to: email,
      subject: `Your Digital Parent Quiz Results — ${topPersona.phoneModel}`,
      text,
      html,
      headers: {
        'X-Mailer': 'FutureNet Digital Parent Quiz',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'List-Unsubscribe': `<mailto:${smtp.from}>`,
        'Reply-To': `FutureNet <${smtp.from}>`,
      },
    });
  } catch (err) {
    const details = errorToMessage(err);
    console.error("[send-quiz-email] send failed:", err);
    const e = err as { name?: string; code?: string; message?: string };
    return NextResponse.json(
      {
        error: "Email send failed",
        ...(shouldExposeDetails() ? { details } : null),
        debug: safeDebugInfo({
          stage: "send",
          smtp: {
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
          },
          errorName: e?.name ?? null,
          errorCode: e?.code ?? null,
        }),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
