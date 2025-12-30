import type { PersonaId, QuizPersona } from "./quizTypes";

export const PHONE_IMAGE_URLS: Record<PersonaId, string> = {
  "bb-bold":
    "https://www.cnet.com/a/img/resize/8aff5ecdbdc6fadd06ca979f04f2569f1ec7359a/hub/2008/08/21/6069b59f-f8fd-11e2-8c7c-d4ae52e62bcc/Blackberry_bold-Rogers.jpg?auto=webp&width=1200",
  "htc-desire": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F3%2F33%2FHtc-desire-2.jpg&f=1&nofb=1&ipt=8c50d12bd1aba56b25b121baca7efb211006b3b8f1f2ab6b2597d59fe41c0063",
  "palm-treo":
    "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/msnbc/Components/Photos/060515/060515_palm_vmed_9a.jpg",
  razr: "https://upload.wikimedia.org/wikipedia/commons/5/56/Motorola_Razr_V3_montage_closed_open.png",
  walkman: "https://static01.nyt.com/images/2007/10/24/technology/circuits/25phone.L.jpg?quality=75&auto=webp&disable=upscale",
  "nokia-3310": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%2Fid%2FOIP.xdUzCB07DvB5zNsI7WJHEwHaHa%3Fpid%3DApi&f=1&ipt=ce6fb3020d1e52e385b270a61c1c2eccc481091038451e6504472b080ed761a6",
  "nokia-e71": "https://media.wired.com/photos/59eac137cc302878a9fdc4d5/master/pass/nokia_e71_f.jpg",
  "bb-curve":
    "https://i5.walmartimages.com/seo/Used-BlackBerry-Curve-8520-GSM-Keyboard-Trackpad-Smartphone-Unlocked_d3fa4d2b-deab-46e0-a8b6-ccd010036f37_1.749bb9e6cbb51b3de6c85913e01b9b2c.jpeg",
};

export const PERSONAS: QuizPersona[] = [
  {
    id: "bb-bold",
    phoneModel: "BlackBerry Bold",
    characterName: "The Inbox Commander",
    tagline: "Control the channel, then grant autonomy.",
    summary:
      "You’re calm under pressure and you want safety systems that are transparent, enforceable, and fair—so trust can grow over time.",
    strengths: ["Clear family agreements", "Strong risk awareness", "Gradual autonomy with guardrails"],
    watchOutFor: ["Over-monitoring fatigue", "Turning every moment into a policy debate"],
    nextQuest: ["Set 2–3 non-negotiables", "Create a weekly ‘review + reset’ ritual", "Make controls visible and explainable"],
  },
  {
    id: "htc-desire",
    phoneModel: "HTC Desire",
    characterName: "The Tinkerer with Guardrails",
    tagline: "Graduated exposure, configured properly.",
    summary:
      "You’re practical and technical: you’ll allow tech, but only in staged tiers with strong defaults and a rollback plan.",
    strengths: ["Systems thinking", "Feature tiers & whitelists", "Incident playbooks"],
    watchOutFor: ["Setup complexity creep", "Assuming other caregivers will follow your system"],
    nextQuest: ["Define ‘Tier 0 / Tier 1 / Tier 2’ access", "Pre-build a ‘safe list’", "Write a one-page incident checklist"],
  },
  {
    id: "palm-treo",
    phoneModel: "Palm Treo",
    characterName: "The Routine Architect",
    tagline: "Less fiddling, more defaults that stick.",
    summary:
      "You want a low-effort way to do the right thing—quick setup, clear summaries, and routines that work on your busiest day.",
    strengths: ["Quick wins", "Habit-friendly routines", "Non-judgmental practicality"],
    watchOutFor: ["Decision fatigue", "Starting strong then dropping off"],
    nextQuest: ["Pick one routine (weekday) and one (weekend)", "Use timers + transition cues", "Review summaries weekly, not hourly"],
  },
  {
    id: "razr",
    phoneModel: "Motorola Razr",
    characterName: "The Cool‑But‑Careful Gatekeeper",
    tagline: "Let them enjoy it—then close the flip.",
    summary:
      "You’re aiming for balance: enough boundaries to stay safe, enough freedom to keep life joyful and guilt-free.",
    strengths: ["Balanced boundaries", "Family bonding", "Pragmatic flexibility"],
    watchOutFor: ["Inconsistent rules when tired", "Underestimating algorithm pull"],
    nextQuest: ["Create ‘together mode’ vs ‘solo mode’", "Choose 1–2 quality content lanes", "Make endings predictable"],
  },
  {
    id: "walkman",
    phoneModel: "Sony Ericsson Walkman",
    characterName: "The Vibe Curator",
    tagline: "Mood matters: inputs shape behavior.",
    summary:
      "You focus on emotional literacy, transitions, and low-stimulation cues—teaching kids to notice and manage their own attention.",
    strengths: ["Self-regulation coaching", "Low-stimulation habits", "Co-use and creation"],
    watchOutFor: ["Being too optimistic about self-stopping", "Not having a hard boundary for hard-to-stop content"],
    nextQuest: ["Use a ‘pause + name the feeling’ step", "Add a transition ritual", "Prefer creation over consumption"],
  },
  {
    id: "nokia-3310",
    phoneModel: "Nokia 3310",
    characterName: "The Unbreakable Boundary Setter",
    tagline: "Safety and communication—no rabbit holes.",
    summary:
      "You prefer purpose-first tech: minimal internet, reliable contact, and a clear upgrade path as your child matures.",
    strengths: ["Clarity and restraint", "Low-stimulation defaults", "Easy rules for caregivers"],
    watchOutFor: ["Over-restriction backlash", "Missing chances to build skill-based autonomy"],
    nextQuest: ["Define the ‘why’ behind restrictions", "Create upgrade milestones", "Offer compelling offline alternatives"],
  },
  {
    id: "nokia-e71",
    phoneModel: "Nokia E71",
    characterName: "The Practical Professional",
    tagline: "Intentional learning, low‑stimulation by default.",
    summary:
      "You’re values-first and research-driven: you want calmer tech, purposeful learning, and a community that aligns with your philosophy.",
    strengths: ["Long-term thinking", "Evidence-led choices", "Learning-first defaults"],
    watchOutFor: ["Over-optimizing", "Getting stuck in research mode"],
    nextQuest: ["Choose one core learning lane", "Time-box research", "Build a simple home ‘device constitution’"],
  },
  {
    id: "bb-curve",
    phoneModel: "BlackBerry Curve",
    characterName: "The Anxious Tab‑Closer",
    tagline: "I just want it to be safe without watching every second.",
    summary:
      "You’re protective and tired: loopholes and bypasses have made screen time feel like constant vigilance. You need a system that carries the load.",
    strengths: ["Deep protective care", "Consistency when supported", "Strong intuition for hard-to-stop content"],
    watchOutFor: ["Burnout", "Trust spirals when policing becomes constant"],
    nextQuest: ["Shift to browser-level safety", "Use short safe sessions", "Add honesty rituals + predictable transitions"],
  },
];
