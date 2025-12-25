"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

import type { PersonaId, QuizOption } from "./quizTypes";
import { PERSONAS, PHONE_IMAGE_URLS } from "./quizPersonas";
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

  useEffect(() => {
    if (step !== "result") return;
    const canvas = storyCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const safePad = 72;
    const ink = "#ffffff";

    const draw = async () => {
      const fontUi =
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'";
      const fontHeadline =
        "'Druk Wide', 'Monument Extended', 'Eurostile', 'Microgramma', 'Bank Gothic', 'Arial Black', system-ui, sans-serif";
      const fontTech =
        "'Space Mono', 'IBM Plex Mono', 'OCR B', 'OCR-B', 'DIN Condensed', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

      const seedFrom = (s: string) => {
        let h = 2166136261;
        for (let i = 0; i < s.length; i += 1) {
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return h >>> 0;
      };
      const serial = `FN-${seedFrom(topPersona.id).toString(16).slice(0, 8).toUpperCase()}`;

      const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
      };

      const pixelateRegion = (yStart: number, block: number) => {
        const h = H - yStart;
        if (h <= 0) return;
        const data = ctx.getImageData(0, yStart, W, h);
        const d = data.data;
        for (let y = 0; y < h; y += block) {
          for (let x = 0; x < W; x += block) {
            const sx = Math.min(W - 1, x + Math.floor(block / 2));
            const sy = Math.min(h - 1, y + Math.floor(block / 2));
            const i = (sy * W + sx) * 4;
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, yStart + y, block, block);
          }
        }
      };

      const gridTexture = (x: number, y: number, w: number, h: number, step: number, alpha: number, invert: boolean) => {
        ctx.save();
        roundedRect(x, y, w, h, 0);
        ctx.clip();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = invert ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.12)";
        for (let gx = Math.floor(x); gx < x + w; gx += step) ctx.fillRect(gx, y, 1, h);
        for (let gy = Math.floor(y); gy < y + h; gy += step) ctx.fillRect(x, gy, w, 1);
        ctx.restore();
      };

      const cornerMarks = (x: number, y: number, w: number, h: number, len: number, c: string) => {
        ctx.save();
        ctx.strokeStyle = c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + len);
        ctx.lineTo(x, y);
        ctx.lineTo(x + len, y);
        ctx.moveTo(x + w - len, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + len);
        ctx.moveTo(x, y + h - len);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + len, y + h);
        ctx.moveTo(x + w - len, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w, y + h - len);
        ctx.stroke();
        ctx.restore();
      };

      const panel = (x: number, y: number, w: number, h: number, title: string, variant: "normal" | "invert" | "grid") => {
        const invert = variant === "invert";

        roundedRect(x, y, w, h, 26);
        if (invert) {
          ctx.fillStyle = "#fff";
          ctx.fill();
        }

        if (variant === "grid") gridTexture(x + 2, y + 2, w - 4, h - 4, 22, 1, invert);

        if (invert) {
          gridTexture(x + 2, y + 64, w - 4, h - 92, 18, 0.9, true);

          ctx.save();
          ctx.strokeStyle = "rgba(0,0,0,0.45)";
          ctx.lineWidth = 2;
          const gx = x + w - 170;
          const gy = y + 26;
          ctx.beginPath();
          for (let i = 0; i <= 14; i += 1) {
            const px = gx + i * 10;
            const py = gy + 20 + Math.sin(i * 0.9) * 7;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x + w - 54, y + 44, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + w - 54 - 18, y + 44);
          ctx.lineTo(x + w - 54 + 18, y + 44);
          ctx.moveTo(x + w - 54, y + 44 - 18);
          ctx.lineTo(x + w - 54, y + 44 + 18);
          ctx.stroke();
          ctx.restore();
        }

        ctx.strokeStyle = invert ? "rgba(0,0,0,1)" : "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = invert ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
        ctx.font = `900 30px ${fontHeadline}`;
        ctx.fillText(title, x + 22, y + 46);

        ctx.strokeStyle = invert ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 18, y + 60);
        ctx.lineTo(x + w - 18, y + 60);
        ctx.stroke();

        ctx.fillStyle = invert ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.72)";
        ctx.font = `700 16px ${fontTech}`;
        ctx.fillText("MODULE", x + 22, y + h - 18);
      };

      const pill = (x: number, y: number, w: number, h: number, text: string, invert: boolean = false) => {
        roundedRect(x, y, w, h, h / 2);
        ctx.strokeStyle = invert ? "rgba(0,0,0,1)" : "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = invert ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
        const font = `800 20px ${fontUi}`;
        const lines = wrapText(text, w - 36, font);
        ctx.font = font;
        if (lines.length <= 1) {
          ctx.fillText(lines[0] ?? text, x + 18, y + 36);
          return;
        }
        ctx.fillText(lines[0], x + 18, y + 28);
        ctx.fillText(lines[1], x + 18, y + 48);
      };

      const wrapText = (text: string, maxW: number, font: string): string[] => {
        ctx.font = font;
        const out: string[] = [];
        const words = text.split(" ");
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > maxW) {
            if (line) out.push(line);
            line = w;
          } else {
            line = test;
          }
        }
        if (line) out.push(line);
        return out;
      };

      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      for (let x = 0; x < W; x += 54) ctx.fillRect(x, 0, 1, H);
      for (let y = 0; y < H; y += 54) ctx.fillRect(0, y, W, 1);
      ctx.restore();

      roundedRect(36, 36, W - 72, H - 72, 36);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      cornerMarks(36, 36, W - 72, H - 72, 26, "rgba(255,255,255,0.6)");

      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `800 18px ${fontTech}`;
      ctx.fillText("FUTURENET / DIGITAL PARENT QUIZ", safePad, 66);
      ctx.font = `700 16px ${fontTech}`;
      ctx.fillText(serial, W - safePad - ctx.measureText(serial).width, 66);

      const headerX = safePad;
      const headerY = 86;
      const headerW = W - safePad * 2;
      const headerH = 330;

      const phoneBoxW = 280;
      const phoneBoxH = 260;
      const phonePad = 24;
      const phoneX = headerX + headerW - phoneBoxW - phonePad;
      const phoneY = headerY + 52;
      const textMaxW = headerW - phoneBoxW - (phonePad * 3);

      const headerGrad = ctx.createLinearGradient(headerX, headerY, headerX, headerY + headerH);
      headerGrad.addColorStop(0, "rgba(0,0,0,0.78)");
      headerGrad.addColorStop(1, "rgba(0,0,0,0.56)");
      roundedRect(headerX, headerY, headerW, headerH, 34);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(headerX + Math.floor(headerW * 0.62), headerY, 1, headerH);

      gridTexture(headerX + 2, headerY + 2, Math.floor(headerW * 0.62) - 6, headerH - 4, 54, 0.55, false);

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      {
        let size = 90;
        while (size > 58) {
          ctx.font = `900 ${size}px ${fontHeadline}`;
          if (ctx.measureText(topPersona.phoneModel.toUpperCase()).width <= textMaxW + 40) break;
          size -= 2;
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.strokeText(topPersona.phoneModel.toUpperCase(), headerX + 22, headerY + 118);
      }
      ctx.restore();

      {
        const title = topPersona.phoneModel.toUpperCase();
        let size = 72;
        let lines: string[] = [title];
        while (size > 46) {
          const f = `900 ${size}px ${fontHeadline}`;
          lines = wrapText(title, textMaxW, f);
          if (lines.length <= 2) {
            ctx.font = f;
            break;
          }
          size -= 2;
        }

        ctx.fillStyle = ink;
        ctx.font = `900 ${size}px ${fontHeadline}`;
        if (lines.length <= 1) {
          ctx.fillText(lines[0] ?? title, headerX + 26, headerY + 106);
        } else {
          ctx.fillText(lines[0], headerX + 26, headerY + 88);
          ctx.fillText(lines[1], headerX + 26, headerY + 132);
        }
      }

      ctx.fillStyle = "rgba(255,255,255,0.82)";
      {
        let size = 46;
        while (size > 30) {
          ctx.font = `900 ${size}px ${fontHeadline}`;
          if (ctx.measureText(topPersona.characterName).width <= textMaxW) break;
          size -= 2;
        }
        ctx.fillText(topPersona.characterName, headerX + 26, headerY + 168);
      }

      const pillText = topPersona.tagline;
      const pillFont = `700 26px ${fontUi}`;
      ctx.font = pillFont;
      const pillW = Math.min(textMaxW, ctx.measureText(pillText).width + 60);
      const pillX = headerX + 26;
      const pillY = headerY + 198;
      const pillH = 54;
      const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX, pillY + pillH);
      pillGrad.addColorStop(0, "rgba(0,0,0,0.72)");
      pillGrad.addColorStop(1, "rgba(0,0,0,0.54)");
      roundedRect(pillX, pillY, pillW, pillH, 27);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,1)";
      {
        let size = 26;
        while (size > 18) {
          const f = `700 ${size}px ${fontUi}`;
          const lines = wrapText(pillText, pillW - 48, f);
          if (lines.length <= 2) {
            ctx.font = f;
            if (lines.length === 1) {
              ctx.fillText(lines[0], pillX + 24, pillY + 36);
            } else {
              ctx.fillText(lines[0], pillX + 24, pillY + 26);
              ctx.fillText(lines[1], pillX + 24, pillY + 46);
            }
            break;
          }
          size -= 2;
        }
      }

      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = `700 16px ${fontTech}`;
      ctx.fillText("PROFILE", pillX, pillY + 82);

      const imgUrl = PHONE_IMAGE_URLS[topPersona.id];
      const proxied = `/api/image-proxy?url=${encodeURIComponent(imgUrl)}`;
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = () => reject(new Error("Image load failed"));
        im.src = proxied;
      });

      const drawBwImage = (sx: number, sy: number, sw: number, sh: number) => {
        ctx.save();
        ctx.filter = "grayscale(1) contrast(1.1)";
        ctx.drawImage(img, 0, 0, img.width, img.height, sx, sy, sw, sh);
        ctx.restore();
      };

      const imgAR = img.width / img.height;
      const boxAR = phoneBoxW / phoneBoxH;
      let dw = phoneBoxW;
      let dh = phoneBoxH;
      if (imgAR > boxAR) {
        dw = Math.floor(phoneBoxH * imgAR);
        dh = phoneBoxH;
      } else {
        dw = phoneBoxW;
        dh = Math.floor(phoneBoxW / imgAR);
      }
      const scale = Math.min(phoneBoxW / dw, phoneBoxH / dh);
      dw = Math.floor(dw * scale);
      dh = Math.floor(dh * scale);
      const dx = phoneX + Math.floor((phoneBoxW - dw) / 2);
      const dy = phoneY + Math.floor((phoneBoxH - dh) / 2);

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      roundedRect(phoneX, phoneY, phoneBoxW, phoneBoxH, 28);
      ctx.clip();
      drawBwImage(dx, dy, dw, dh);
      ctx.restore();

      roundedRect(phoneX, phoneY, phoneBoxW, phoneBoxH, 28);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(phoneX + phoneBoxW - 28, phoneY + 28, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `700 14px ${fontTech}`;
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.fillText("ASSET", phoneX, phoneY - 12);

      const panelsY = 450;
      const panelH = 420;
      const colGap = 26;
      const colW = Math.floor((headerW - colGap) / 2);
      const leftX = headerX;
      const rightX = headerX + colW + colGap;

      panel(leftX, panelsY, colW, panelH, "Parenting Defaults", "grid");
      panel(rightX, panelsY, colW, panelH, "Watch-Outs", "invert");

      const strengths = topPersona.strengths.slice(0, 3);
      const watch = topPersona.watchOutFor.slice(0, 3);

      let py = panelsY + 84;
      for (const s of strengths) {
        pill(leftX + 20, py, colW - 40, 54, s);
        py += 70;
      }

      py = panelsY + 84;
      for (const s of watch.slice(0, 2)) {
        pill(rightX + 20, py, colW - 40, 54, s, true);
        py += 70;
      }

      const summaryX = headerX;
      const summaryY = 910;
      const summaryW = headerW;
      const summaryH = 240;
      const glass = ctx.createLinearGradient(summaryX, summaryY, summaryX, summaryY + summaryH);
      glass.addColorStop(0, "rgba(0,0,0,0.78)");
      glass.addColorStop(1, "rgba(0,0,0,0.56)");
      roundedRect(summaryX, summaryY, summaryW, summaryH, 34);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      gridTexture(summaryX + 2, summaryY + 62, summaryW - 4, summaryH - 64, 28, 0.55, false);

      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `900 30px ${fontHeadline}`;
      ctx.fillText("Summary", summaryX + 26, summaryY + 52);

      ctx.fillStyle = "rgba(255,255,255,1)";
      const summaryFont = `500 30px ${fontUi}`;
      const summaryLines = wrapText(`“${topPersona.summary}”`, summaryW - 52, summaryFont);
      ctx.font = summaryFont;
      let sy3 = summaryY + 98;
      for (const ln of summaryLines.slice(0, 4)) {
        ctx.fillText(ln, summaryX + 26, sy3);
        sy3 += 42;
      }

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      const wvx = summaryX + summaryW - 320;
      const wvy = summaryY + 58;
      ctx.beginPath();
      for (let i = 0; i <= 16; i += 1) {
        const px = wvx + i * 18;
        const py = wvy + 34 + Math.sin(i * 0.8) * 12;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      const rx = summaryX + 26;
      const ry = summaryY + summaryH - 26;
      ctx.beginPath();
      for (let i = 0; i <= 14; i += 1) {
        const x = rx + i * 32;
        const h = i % 2 === 0 ? 14 : 8;
        ctx.moveTo(x, ry);
        ctx.lineTo(x, ry - h);
      }
      ctx.stroke();
      ctx.restore();

      const questY = 1180;
      const questTitleY = questY + 52;
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      roundedRect(headerX, questY, headerW, 640, 34);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      gridTexture(headerX + 2, questY + 2, headerW - 4, 74, 18, 0.7, false);

      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `900 34px ${fontHeadline}`;
      ctx.fillText("Your Next Quest", headerX + 26, questTitleY);

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      const wx = headerX + headerW - 320;
      const wy = questY + 44;
      ctx.beginPath();
      for (let i = 0; i <= 18; i += 1) {
        const px = wx + i * 14;
        const py2 = wy + 24 + Math.cos(i * 0.7) * 10;
        if (i === 0) ctx.moveTo(px, py2);
        else ctx.lineTo(px, py2);
      }
      ctx.stroke();
      ctx.restore();

      const quests = topPersona.nextQuest.slice(0, 3);
      const btnH = 92;
      const btnGap = 22;
      let by = questY + 92;
      for (const q of quests) {
        const bx = headerX + 26;
        const bw = headerW - 52;
        roundedRect(bx, by, bw, btnH, 30);
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "rgba(255,255,255,1)";
        const qFont = `800 28px ${fontUi}`;
        const qLines = wrapText(q, bw - 56, qFont);
        ctx.font = qFont;
        if (qLines.length <= 1) {
          ctx.fillText(qLines[0] ?? q, bx + 28, by + 58);
        } else {
          ctx.fillText(qLines[0], bx + 28, by + 48);
          ctx.fillText(qLines[1], bx + 28, by + 78);
        }

        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.font = `700 14px ${fontTech}`;
        const idTag = `Q${String(quests.indexOf(q) + 1).padStart(2, "0")}`;
        ctx.fillText(idTag, bx + bw - 28 - ctx.measureText(idTag).width, by + 28);
        by += btnH + btnGap;
      }

      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `800 24px ${fontTech}`;
      ctx.fillText("FUTURENET", safePad, H - 86);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `600 22px ${fontTech}`;
      ctx.fillText("https://futurenet-demo.netlify.app/digital-parent-quiz", safePad, H - 54);

      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.translate(W - 58, H - 58);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `900 20px ${fontTech}`;
      ctx.fillText("FUTURENET", 0, 0);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      const sx = W - safePad - 154;
      const sy = H - 202;
      ctx.beginPath();
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = 18;
        const r2 = 64;
        ctx.moveTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1);
        ctx.lineTo(sx + Math.cos(a) * r2, sy + Math.sin(a) * r2);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (!isUnlocked) {
        pixelateRegion(440, 18);
      }
    };

    void draw();
  }, [step, topPersona, isUnlocked]);

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
    if (isSendingEmail) return;

    setEmailError(null);
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/send-quiz-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, answers }),
      });

      if (!res.ok) {
        let msg = "Failed to send email.";
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) msg = j.error;
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

      setIsUnlocked(true);
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setIsSendingEmail(false);
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
          <div className={styles.storyGateRegion}>
            <div className={`${styles.scene} ${styles.storyPreviewWrap}`} style={{ padding: 12 }}>
              <canvas ref={storyCanvasRef} className={styles.storyCanvas} />
            </div>

            {!isUnlocked ? (
              <div className={styles.resultGateOverlay} role="dialog" aria-modal="true">
                <div className={styles.resultGateWindow}>
                  <div className={styles.resultGateTitlebar}>
                    <div className={styles.resultGateTitle}>Email required</div>
                    <div className={styles.resultGateControls}>
                      <div className={styles.resultGateControl} aria-hidden="true" />
                      <div className={styles.resultGateControl} aria-hidden="true" />
                      <div className={styles.resultGateControl} aria-hidden="true" />
                    </div>
                  </div>

                  <div className={styles.resultGateBody}>
                    <div className={styles.resultGateCopy}>
                      Enter your email to reveal the rest of your result and get a full breakdown of all Digital Parent persona types.
                    </div>

                    <div className={styles.resultGateRow}>
                      <label className={styles.resultGateLabel} htmlFor="dpq-email">
                        Email
                      </label>
                      <input
                        id="dpq-email"
                        className={styles.resultGateInput}
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter") submitEmailGate();
                        }}
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@domain.com"
                        disabled={isSendingEmail}
                      />
                    </div>

                    {emailError ? (
                      <div className={styles.subtle} style={{ marginTop: 10 }}>
                        {emailError}
                      </div>
                    ) : null}

                    <div className={styles.resultGateButtons}>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={restart}
                        disabled={isSendingEmail}
                      >
                        Not now
                      </button>
                      <button type="button" className={styles.button} onClick={submitEmailGate} disabled={isSendingEmail}>
                        {isSendingEmail ? "Sending…" : "Reveal result"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
