import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import * as React from "react";

import DigitalParentQuizResultsEmail, {
  type DigitalParentQuizResultsPayload,
} from "../../emails/DigitalParentQuizResultsEmail";

import { QUESTIONS } from "../../digital-parent-quiz/quizQuestions";
import { PERSONAS } from "../../digital-parent-quiz/quizPersonas";
import type { PersonaId } from "../../digital-parent-quiz/quizTypes";

export const runtime = "nodejs";

type SendQuizEmailBody = {
  email: string;
  answers: (string | null)[];
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

export async function POST(req: Request) {
  let body: SendQuizEmailBody;
  try {
    body = (await req.json()) as SendQuizEmailBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (answers.length !== QUESTIONS.length || answers.some((a) => typeof a !== "string" || !a)) {
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
  const topPersona = PERSONAS.find((p) => p.id === topPersonaId);
  if (!topPersona) {
    return NextResponse.json({ error: "Top persona not found" }, { status: 500 });
  }

  const payload: DigitalParentQuizResultsPayload = {
    submittedAt: new Date().toISOString(),
    email,
    answers: answerRows,
    scores,
    topPersonaId,
  };

  const allPersonas = PERSONAS.map((p) => ({
    id: p.id,
    phoneModel: p.phoneModel,
    characterName: p.characterName,
    tagline: p.tagline,
    summary: p.summary,
  }));

  let html: string;
  let text: string;
  try {
    const productUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/digital-parent-quiz`
      : "https://futurenet-demo.netlify.app/digital-parent-quiz";

    const emailComponent = React.createElement(DigitalParentQuizResultsEmail, {
      topPersona,
      allPersonas,
      payload,
      productUrl,
    });

    html = await render(emailComponent, { pretty: true });
    text = await render(emailComponent, { plainText: true });
  } catch (err) {
    const details = errorToMessage(err);
    console.error("[send-quiz-email] render failed:", err);
    return NextResponse.json(
      {
        error: "Email render failed",
        ...(process.env.NODE_ENV !== "production" ? { details } : null),
      },
      { status: 500 }
    );
  }

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
    return NextResponse.json(
      {
        error: "Email configuration missing",
        ...(process.env.NODE_ENV !== "production" ? { details } : null),
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
      from: smtp.from,
      to: email,
      subject: `Your Digital Parent Quiz Results — ${topPersona.phoneModel}`,
      text,
      html,
    });
  } catch (err) {
    const details = errorToMessage(err);
    console.error("[send-quiz-email] send failed:", err);
    return NextResponse.json(
      {
        error: "Email send failed",
        ...(process.env.NODE_ENV !== "production" ? { details } : null),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
