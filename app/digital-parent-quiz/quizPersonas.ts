import type { QuizPersona } from "./quizTypes";

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
    watchOutFor: ["Being too optimistic about self-stopping", "Not having a hard boundary for sticky content"],
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
    strengths: ["Deep protective care", "Consistency when supported", "Strong intuition for ‘sticky’ content"],
    watchOutFor: ["Burnout", "Trust spirals when policing becomes constant"],
    nextQuest: ["Shift to browser-level safety", "Use short safe sessions", "Add honesty rituals + predictable transitions"],
  },
];
