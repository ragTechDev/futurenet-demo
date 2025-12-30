"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

import type { PersonaId, QuizOption } from "./quizTypes";
import { PERSONAS, PHONE_IMAGE_URLS } from "./quizPersonas";
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
  const [gender, setGender] = useState<"m" | "w" | "na" | null>(null);
  const [kidsAgeBands, setKidsAgeBands] = useState<string[]>([]);
  const [isSharingStory, setIsSharingStory] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const quizUrl = useMemo(() => {
    try {
      if (typeof window === "undefined") return "https://ragtechdev.com";
      return `${window.location.origin}/digital-parent-quiz`;
    } catch {
      return "https://ragtechdev.com";
    }
  }, []);

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

      // Y2K Cyberpunk gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#000000");
      bgGrad.addColorStop(0.3, "#001122");
      bgGrad.addColorStop(0.7, "#000011");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Cyberpunk grid overlay
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // Add cyberpunk decorative elements
      const drawSmiley = (x: number, y: number, size: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#00ff41";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        // Eyes
        ctx.fillStyle = "#00ff41";
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(x, y + size * 0.1, size * 0.5, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      };

      const drawStar = (x: number, y: number, size: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ff0080";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          const innerAngle = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
          const ipx = x + Math.cos(innerAngle) * size * 0.4;
          const ipy = y + Math.sin(innerAngle) * size * 0.4;
          ctx.lineTo(ipx, ipy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const drawSun = (x: number, y: number, size: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffff00";
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 2;
        // Center circle
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Rays
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(angle) * size * 0.6, y + Math.sin(angle) * size * 0.6);
          ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
          ctx.stroke();
        }
        ctx.restore();
      };

      // Place decorative elements
      drawSmiley(150, 200, 25, 0.3);
      drawStar(W - 120, 180, 20, 0.4);
      drawSun(200, H - 200, 30, 0.25);
      drawSmiley(W - 180, H - 300, 20, 0.2);
      drawStar(120, H - 400, 15, 0.3);

      // Sharp-edged main border (flat design)
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, W - 72, H - 72);

      // Cyberpunk corner accents
      const cornerSize = 40;
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 3;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(36, 36 + cornerSize);
      ctx.lineTo(36, 36);
      ctx.lineTo(36 + cornerSize, 36);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(W - 36 - cornerSize, 36);
      ctx.lineTo(W - 36, 36);
      ctx.lineTo(W - 36, 36 + cornerSize);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(36, H - 36 - cornerSize);
      ctx.lineTo(36, H - 36);
      ctx.lineTo(36 + cornerSize, H - 36);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(W - 36 - cornerSize, H - 36);
      ctx.lineTo(W - 36, H - 36);
      ctx.lineTo(W - 36, H - 36 - cornerSize);
      ctx.stroke();

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

      // Flat cyberpunk header box
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(headerX, headerY, headerW, headerH);
      
      // Sharp white border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(headerX, headerY, headerW, headerH);
      
      // Holographic accent line
      ctx.strokeStyle = "#ff0080";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headerX, headerY + 30);
      ctx.lineTo(headerX + headerW, headerY + 30);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(headerX + Math.floor(headerW * 0.62), headerY, 1, headerH);

      // Cyberpunk scan lines
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 1;
      for (let y = headerY + 10; y < headerY + headerH - 10; y += 8) {
        ctx.beginPath();
        ctx.moveTo(headerX + 10, y);
        ctx.lineTo(headerX + Math.floor(headerW * 0.62) - 10, y);
        ctx.stroke();
      }
      ctx.restore();

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
      // Flat cyberpunk pill
      ctx.fillStyle = "#000000";
      ctx.fillRect(pillX, pillY, pillW, pillH);
      
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(pillX, pillY, pillW, pillH);
      
      // Holographic accent
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 2;
      ctx.strokeRect(pillX + 3, pillY + 3, pillW - 6, pillH - 6);
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

      // Flat phone image container
      ctx.save();
      ctx.fillStyle = "#000000";
      ctx.fillRect(phoneX, phoneY, phoneBoxW, phoneBoxH);
      
      // Clip for image
      ctx.beginPath();
      ctx.rect(phoneX + 6, phoneY + 6, phoneBoxW - 12, phoneBoxH - 12);
      ctx.clip();
      drawBwImage(dx, dy, dw, dh);
      ctx.restore();

      // Sharp border with cyberpunk accent
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(phoneX, phoneY, phoneBoxW, phoneBoxH);
      
      ctx.strokeStyle = "#ff0080";
      ctx.lineWidth = 2;
      ctx.strokeRect(phoneX + 4, phoneY + 4, phoneBoxW - 8, phoneBoxH - 8);

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
      const ctaBoxX = headerX;
      const ctaBoxY = 890;
      const ctaBoxW = headerW;
      const ctaBoxH = 90;

      // CTA box
      ctx.save();
      ctx.globalAlpha = 1;
      roundedRect(ctaBoxX, ctaBoxY, ctaBoxW, ctaBoxH, 28);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 3;
      ctx.stroke();
      const cyberPurple = "#B026FF";
      const cyberPurpleSoft = "rgba(176,38,255,0.55)";

      ctx.strokeStyle = cyberPurple;
      ctx.lineWidth = 2;
      roundedRect(ctaBoxX + 6, ctaBoxY + 6, ctaBoxW - 12, ctaBoxH - 12, 22);
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = cyberPurple;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = cyberPurpleSoft;
      ctx.lineWidth = 3;
      roundedRect(ctaBoxX + 10, ctaBoxY + 10, ctaBoxW - 20, ctaBoxH - 20, 18);
      ctx.stroke();
      ctx.restore();

      // corner brackets
      ctx.strokeStyle = cyberPurple;
      ctx.lineWidth = 4;
      const bx1 = ctaBoxX + 14;
      const by1 = ctaBoxY + 14;
      const bx2 = ctaBoxX + ctaBoxW - 14;
      const by2 = ctaBoxY + ctaBoxH - 14;
      const bl = 18;
      ctx.beginPath();
      ctx.moveTo(bx1, by1 + bl);
      ctx.lineTo(bx1, by1);
      ctx.lineTo(bx1 + bl, by1);
      ctx.moveTo(bx2 - bl, by1);
      ctx.lineTo(bx2, by1);
      ctx.lineTo(bx2, by1 + bl);
      ctx.moveTo(bx1, by2 - bl);
      ctx.lineTo(bx1, by2);
      ctx.lineTo(bx1 + bl, by2);
      ctx.moveTo(bx2 - bl, by2);
      ctx.lineTo(bx2, by2);
      ctx.lineTo(bx2, by2 - bl);
      ctx.stroke();

      // top shine line
      const shine = ctx.createLinearGradient(ctaBoxX, ctaBoxY, ctaBoxX + ctaBoxW, ctaBoxY);
      shine.addColorStop(0, "rgba(176,38,255,0)");
      shine.addColorStop(0.15, "rgba(176,38,255,0.55)");
      shine.addColorStop(0.5, "rgba(0,0,0,0.0)");
      shine.addColorStop(0.85, "rgba(176,38,255,0.55)");
      shine.addColorStop(1, "rgba(176,38,255,0)");
      ctx.strokeStyle = shine;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ctaBoxX + 22, ctaBoxY + 12);
      ctx.lineTo(ctaBoxX + ctaBoxW - 22, ctaBoxY + 12);
      ctx.stroke();

      // badge
      ctx.fillStyle = cyberPurple;
      roundedRect(ctaBoxX + ctaBoxW - 118, ctaBoxY + 14, 96, 28, 14);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `900 14px ${fontTech}`;
      ctx.fillText("TAKE QUIZ", ctaBoxX + ctaBoxW - 106, ctaBoxY + 34);

      gridTexture(ctaBoxX + 2, ctaBoxY + 2, ctaBoxW - 4, ctaBoxH - 4, 22, 0.06, false);

      const ctaTextX = ctaBoxX + 22;
      const ctaTextY = ctaBoxY + 32;
      const ctaTextMaxW = ctaBoxW - 44;

      const ctaPrefix = "Follow our research on ";
      const ctaHandle = "@ragtechdev";
      const ctaSuffix = " and take the quiz now at:";

      ctx.fillStyle = "rgba(0,0,0,0.88)";
      ctx.font = `900 22px ${fontHeadline}`;
      const prefixW = ctx.measureText(ctaPrefix).width;
      ctx.fillText(ctaPrefix, ctaTextX, ctaTextY);

      const handleX = ctaTextX + Math.min(prefixW, ctaTextMaxW);
      ctx.fillStyle = cyberPurple;
      ctx.font = `900 24px ${fontHeadline}`;
      ctx.fillText(ctaHandle, handleX, ctaTextY);
      const handleW = ctx.measureText(ctaHandle).width;

      // underline @ragtechdev to make it pop
      ctx.strokeStyle = cyberPurpleSoft;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(handleX, ctaTextY + 6);
      ctx.lineTo(handleX + Math.min(handleW, ctaTextMaxW), ctaTextY + 6);
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,0,0.88)";
      ctx.font = `900 22px ${fontHeadline}`;
      const suffixX = handleX + handleW;
      ctx.fillText(ctaSuffix, suffixX, ctaTextY);

      const ctaUrlY = ctaBoxY + 60;
      const ctaUrlFont = `900 24px ${fontTech}`;
      ctx.font = ctaUrlFont;
      const ctaUrlLines = wrapText(quizUrl, ctaTextMaxW, ctaUrlFont);
      const ctaUrlText = ctaUrlLines[0] ?? quizUrl;
      ctx.fillStyle = cyberPurple;
      ctx.fillText(ctaUrlText, ctaTextX, ctaUrlY);

      // underline the URL to make it feel like a link
      const urlW = ctx.measureText(ctaUrlText).width;
      ctx.strokeStyle = cyberPurpleSoft;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ctaTextX, ctaUrlY + 6);
      ctx.lineTo(ctaTextX + Math.min(urlW, ctaTextMaxW), ctaUrlY + 6);
      ctx.stroke();

      ctx.restore();

      const summaryY = ctaBoxY + ctaBoxH + 20;
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

      const questY = summaryY + summaryH + 30;
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

      // Call-to-action section
      const ctaY = H - 220;
      const ctaH = 120;
      
      // CTA background box
      ctx.fillStyle = "rgba(0,0,0,0.9)";
      ctx.fillRect(safePad, ctaY, headerW, ctaH);
      
      // Sharp border with cyberpunk accent
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(safePad, ctaY, headerW, ctaH);
      
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 2;
      ctx.strokeRect(safePad + 4, ctaY + 4, headerW - 8, ctaH - 8);
      
      // CTA text
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 28px ${fontHeadline}`;
      ctx.fillText("HELP US RESEARCH DIGITAL PARENTING", safePad + 20, ctaY + 38);
      
      ctx.fillStyle = "#00ff41";
      ctx.font = `700 20px ${fontUi}`;
      ctx.fillText("Share this quiz with other parents to expand our research", safePad + 20, ctaY + 68);
      
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = `600 16px ${fontTech}`;
      ctx.fillText("Every response helps us understand how parenting evolves with technology", safePad + 20, ctaY + 92);

      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `800 24px ${fontTech}`;
      ctx.fillText("FUTURENET", safePad, H - 75);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.font = `600 22px ${fontTech}`;
      ctx.fillText(quizUrl, safePad, H - 54);

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
  }, [step, topPersona, isUnlocked, quizUrl]);

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

      // Some browsers require canShare() for file sharing.
      const canShareFiles = typeof navigator.canShare === "function" ? navigator.canShare({ files: [file] }) : true;
      if (!canShareFiles) {
        await downloadStoryImage();
        return;
      }

      await navigator.share(data);
    } catch (err) {
      // User cancel is common; avoid scary messaging.
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
              <canvas ref={storyCanvasRef} className={styles.storyCanvas} />
            </div>

            {!isUnlocked ? (
              <div className={styles.resultGateOverlay} role="dialog" aria-modal="true">
                <div className={styles.resultGateWindow}>
                  <div className={styles.resultGateTitlebar}>
                    <div className={styles.resultGateTitle}>{emailSent ? "Email sent" : "Email required"}</div>
                    <div className={styles.resultGateControls}>
                      <div className={styles.resultGateControl} aria-hidden="true" />
                      <div className={styles.resultGateControl} aria-hidden="true" />
                      <div className={styles.resultGateControl} aria-hidden="true" />
                    </div>
                  </div>

                  <div className={styles.resultGateBody}>
                    {emailSent ? (
                      <>
                        <div className={styles.resultGateCopy}>
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                            <svg
                              width="72"
                              height="72"
                              viewBox="0 0 120 120"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <g>
                                <animateTransform
                                  attributeName="transform"
                                  type="translate"
                                  values="0 0; 0 -4; 0 0"
                                  dur="1.8s"
                                  repeatCount="indefinite"
                                />
                                <path
                                  d="M24 42H96V86C96 91.5228 91.5228 96 86 96H34C28.4772 96 24 91.5228 24 86V42Z"
                                  stroke="rgba(0,0,0,0.8)"
                                  strokeWidth="4"
                                  fill="rgba(176,38,255,0.10)"
                                />
                                <path
                                  d="M24 46L60 70L96 46"
                                  stroke="rgba(0,0,0,0.8)"
                                  strokeWidth="4"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M26 88L50 70"
                                  stroke="rgba(176,38,255,0.55)"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M94 88L70 70"
                                  stroke="rgba(176,38,255,0.55)"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M86 30C92 30 96 34 96 40"
                                  stroke="rgba(176,38,255,0.85)"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M18 62C12 62 8 58 8 52"
                                  stroke="rgba(176,38,255,0.85)"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                              </g>
                            </svg>
                          </div>

                          <div style={{ marginBottom: 10 }}>
                            Thanks again for helping our research!
                          </div>

                          <div style={{ marginBottom: 10 }}>
                            We&apos;ve sent a <strong>full breakdown</strong> of your results to your email, together with an <strong>overview of the other personas</strong>.
                          </div>

                          <div style={{ marginBottom: 8 }}>
                            If you don&apos;t see it:
                          </div>

                          <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                            <li>Check your <strong>Spam</strong> (or Promotions) folder.</li>
                            <li>
                              If it&apos;s there, please mark it as <strong>Not spam</strong> so future research reach-outs arrive.
                            </li>
                          </ul>

                          <div>
                            You can close this popup now to view your shareable result here in your browser.
                          </div>
                        </div>

                        <div className={styles.resultGateButtons}>
                          <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                              try {
                                window.localStorage.setItem("dpq_email_unlocked", "1");
                                window.localStorage.setItem("dpq_email", email.trim());
                              } catch {
                                // ignore
                              }
                              setIsUnlocked(true);
                              setEmailSent(false);
                            }}
                            disabled={isSendingEmail}
                          >
                            Close
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.resultGateCopy}>
                          Thank you for taking the quiz and helping us in our research! Enter your email to reveal the rest of your result and get a full breakdown of all Digital Parent persona types.
                        </div>

                    <div className={styles.resultGateRow}>
                      <div className={styles.resultGateLabel}>
                        I am:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.optionButton} ${respondentType === "parent" ? styles.optionSelected : ""}`}
                          onClick={() => setRespondentType("parent")}
                          disabled={isSendingEmail}
                          style={optionButtonStyle}
                        >
                          A parent
                        </button>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.optionButton} ${respondentType === "expecting" ? styles.optionSelected : ""}`}
                          onClick={() => {
                            setRespondentType("expecting");
                            setKidsAgeBands([]);
                          }}
                          disabled={isSendingEmail}
                          style={optionButtonStyle}
                        >
                          Expecting parent
                        </button>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.optionButton} ${respondentType === "considering" ? styles.optionSelected : ""}`}
                          onClick={() => {
                            setRespondentType("considering");
                            setKidsAgeBands([]);
                          }}
                          disabled={isSendingEmail}
                          style={optionButtonStyle}
                        >
                          Considering children
                        </button>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.optionButton} ${respondentType === "na" ? styles.optionSelected : ""}`}
                          onClick={() => {
                            setRespondentType("na");
                            setKidsAgeBands([]);
                          }}
                          disabled={isSendingEmail}
                          style={optionButtonStyle}
                        >
                          Not applicable
                        </button>
                      </div>
                    </div>

                    <div className={styles.resultGateRow}>
                      <label className={styles.resultGateLabel} htmlFor="dpq-research-optin">
                        Optional
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
                        <input
                          id="dpq-research-optin"
                          type="checkbox"
                          checked={researchOptIn}
                          onChange={(ev) => setResearchOptIn(ev.target.checked)}
                          disabled={isSendingEmail}
                        />
                        Help further our research with optional questions
                      </label>
                    </div>

                    {researchOptIn ? (
                      <>
                        <div className={styles.resultGateRow}>
                          <label className={styles.resultGateLabel} htmlFor="dpq-birth-year">
                            Birth year
                          </label>
                          <input
                            id="dpq-birth-year"
                            className={styles.resultGateInput}
                            value={birthYear}
                            onChange={(ev) => setBirthYear(ev.target.value)}
                            inputMode="numeric"
                            placeholder="e.g. 1990"
                            disabled={isSendingEmail}
                          />
                        </div>

                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", margin: "10px 0" }} />

                        <div className={styles.resultGateRow}>
                          <div className={styles.resultGateLabel}>Gender</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            <button
                              type="button"
                              className={`${styles.button} ${styles.optionButton} ${gender === "m" ? styles.optionSelected : ""}`}
                              onClick={() => setGender("m")}
                              disabled={isSendingEmail}
                              style={optionButtonStyle}
                            >
                              Man
                            </button>
                            <button
                              type="button"
                              className={`${styles.button} ${styles.optionButton} ${gender === "w" ? styles.optionSelected : ""}`}
                              onClick={() => setGender("w")}
                              disabled={isSendingEmail}
                              style={optionButtonStyle}
                            >
                              Woman
                            </button>
                            <button
                              type="button"
                              className={`${styles.button} ${styles.optionButton} ${gender === "na" ? styles.optionSelected : ""}`}
                              onClick={() => setGender("na")}
                              disabled={isSendingEmail}
                              style={optionButtonStyle}
                            >
                              Prefer not to say
                            </button>
                          </div>
                        </div>

                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", margin: "10px 0" }} />

                        {respondentType === "parent" ? (
                          <div className={styles.resultGateRow}>
                            <div className={styles.resultGateLabel}>
                              Kid age(s)
                              <div className={styles.subtle} style={{ marginTop: 6 }}>
                                Select all that apply (you can choose more than one)
                              </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["0-2", "3-5", "6-9", "10-12", "13-17", "18+"].map((band) => {
                                const selected = kidsAgeBands.includes(band);
                                return (
                                  <button
                                    key={band}
                                    type="button"
                                    className={`${styles.button} ${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
                                    onClick={() => {
                                      setKidsAgeBands((prev) =>
                                        prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band]
                                      );
                                    }}
                                    disabled={isSendingEmail}
                                    style={optionButtonStyle}
                                  >
                                    {band}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}

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
                      </>
                    )}
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
