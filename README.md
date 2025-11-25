# FutureNet — Web UI Demo
*A minimal-distraction kid-friendly mobile interface prototype for a safer digital future.*

FutureNet is a web-based prototype of a mobile launcher UI designed for children in primary school.  
The purpose of this demo is to **visualize the UI/UX direction**, validate interaction concepts, and present ideas to collaborators, parents, educators, and potential partners **before building hardware or Android apps**.

This project is part of the larger vision to build a **digital village (kampung)** for children — a safe environment that promotes responsible technological growth.

---

## 🌱 Project Vision
FutureNet imagines a world where children use technology safely, free from the commercial pressures and distractions of the modern internet.  
Inspired by **Japan’s keitai phones for kids**, FutureNet explores:

- A **minimal-distraction interface**
- **Whitelisted communication** with trusted contacts
- A **private network separate from the public internet**
- Tools for learning, independence, and digital wellbeing
- Community-driven development

FutureNet’s UI intends to later on branch into two age-appropriate variants, but first focusing on the 5-8 year old age group as a base:

| UI Track | Age Group | Purpose |
|----------|-----------|----------|
| **LittleLink** | 5–8 years | Simple, bright, focused experience |
| **LaterLink** | 9–12 years | More mature, safe transition toward independence |

This repo contains the **Web UI Demo** for these prototypes.

---

## 🎯 Goals of the Web Demo
- Explore layout, interaction patterns, colour systems, icon scale
- Validate design assumptions across age groups
- Support usability input from parents and educators
- Prototype concepts quickly and affordably in a sharable format
- Provide a visual basis for pitching and recruiting contributors

> ⚠ This demo is UI-only — no real messaging, networking, or OS features are implemented yet.

---

## 📱 Core App Concepts (Example placeholders)
- Messaging with parental controls
- Location sharing / tracking
- SOS button
- Safe browser (content filtering, whitelist)
- Note taking & homework reminders
- Maps / navigation
- Access to MOE learning tools
- Lightweight supervised payment
- Responsible AI tool for research

---

## 👦👧 User Profiles & Usability Notes
### Ages 5–8 (LittleLink)
- Bright colours  
- Large icons  
- Simple navigation  
- Low distraction environment  

### Ages 9–12 (LaterLink)
- Mimics simplified adult smartphone UX responsibly  
- Social creativity, messaging, and productivity  
- Safe gateway to internet-connected tools  

> *Most children start forming digital habits very early; FutureNet aims to establish healthy foundations from day one.*

---

## 🛠 Tech Stack
| Component | Technology |
|------------|------------|
| Framework | React or Next.js |
| Styling | TailwindCSS |
| Deployment | Vercel / Netlify |
| State | Minimal / local only (demo focus) |

**Future plan:** Android launcher in **Kotlin + Jetpack Compose** once UX stabilizes.

---

## 📁 Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
