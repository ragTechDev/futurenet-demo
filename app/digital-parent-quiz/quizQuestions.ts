import type { QuizQuestion } from "./quizTypes";

export const QUIZ_VERSION = "dpq-2025-12-29";

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    chapter: "1/12: Morning prep",
    sceneId: "backpack",
    prompt:
      "You’re packing your child’s bag for school. You only have time to charge one device: an AirTag in your child’s wallet (battery low), or a spare phone (weak battery, can call/message but won’t reliably support geolocation). What do you charge?",
    options: [
      {
        id: "q1a",
        label: "Charge the AirTag so you have reliable location if something unexpected happens.",
        points: { "bb-bold": 2, "htc-desire": 1, "bb-curve": 2 },
      },
      {
        id: "q1b",
        label: "Charge the spare phone so your child can call/message if needed.",
        points: { razr: 2, walkman: 1, "palm-treo": 1 },
      },
    ],
  },
  {
    id: "q2",
    chapter: "2/12: Commute pressure",
    sceneId: "commute",
    prompt:
      "On the commute to school, your child is unsettled. You notice other commuters looking over. In the moment, what do you lean toward?",
    options: [
      {
        id: "q2a",
        label: "Give your child your phone to calm them down—just for the duration of the ride.",
        points: { "palm-treo": 2, razr: 1, "bb-curve": 1 },
      },
      {
        id: "q2b",
        label: "Try to calm your child without a phone; if it doesn’t work, you can ignore the commuters—it’s only normal.",
        points: { walkman: 2, "nokia-3310": 1, "bb-bold": 1 },
      },
    ],
  },
  {
    id: "q3",
    chapter: "3/12: School milestone",
    sceneId: "schoolGate",
    prompt:
      "When you arrive at school, the teacher mentions you’ll need to decide your child’s next school soon. Two options stand out—what do you choose?",
    options: [
      {
        id: "q3a",
        label: "A device-free school focused on attention and offline learning.",
        points: { "nokia-3310": 2, "bb-curve": 1, "nokia-e71": 1 },
      },
      {
        id: "q3b",
        label: "A school that emphasizes digital tools to thrive in a digital-first world.",
        points: { "htc-desire": 2, "bb-bold": 1, razr: 1 },
      },
    ],
  },
  {
    id: "q4",
    chapter: "4/12: Phone policy",
    sceneId: "policyNotice",
    prompt:
      "The school also informs you a new policy starts next week: students can only bring either an approved kid phone with essential features, or a typical smartphone with proof of parental controls. Which do you choose?",
    options: [
      {
        id: "q4a",
        label: "The approved kid phone with essential features only.",
        points: { "nokia-3310": 2, "bb-curve": 2, "palm-treo": 1 },
      },
      {
        id: "q4b",
        label: "A typical smartphone, with parental controls enabled.",
        points: { "htc-desire": 2, "bb-bold": 1, razr: 1 },
      },
    ],
  },
  {
    id: "q5",
    chapter: "5/12: Parent group news",
    sceneId: "groupChat",
    prompt:
      "During school, your phone blows up: the parents group is posting about some kids watching mature streamers. What do you do first?",
    options: [
      {
        id: "q5a",
        label: "Start checking your child’s device watch history (or accounts) to see what’s actually been viewed.",
        points: { "bb-curve": 2, "bb-bold": 1, razr: 1 },
      },
      {
        id: "q5b",
        label: "Plan a calm conversation at home so you can broach it thoughtfully.",
        points: { walkman: 2, "bb-bold": 1, "nokia-e71": 1 },
      },
    ],
  },
  {
    id: "q6",
    chapter: "6/12: Online safety conversations",
    sceneId: "safetyTalk",
    prompt:
      "That evening, the streamers topic comes up naturally. Your child asks, \"Why can’t I watch what everyone watches?\" What do you find yourself doing first?",
    options: [
      {
        id: "q6a",
        label: "Settle in for a real talk: explain your reasoning, ask what they’ve seen, and treat it as an ongoing conversation.",
        points: { walkman: 2, "bb-bold": 2, "nokia-e71": 1 },
      },
      {
        id: "q6b",
        label: "Keep it brief for now: you want to handle it, but you’re not sure what to say (or what you don’t know yet).",
        points: { "palm-treo": 2, "bb-curve": 1, "nokia-3310": 1 },
      },
    ],
  },
  {
    id: "q7",
    chapter: "7/12: Biggest concern",
    sceneId: "whiteboard",
    prompt:
      "The school rolls out a compulsory digital safety course for parents. You only have time to attend one session. Which course do you choose?",
    options: [
      {
        id: "q7a",
        label: "Content + attention safety (age-appropriate content, ads, algorithms, watch history, attention spirals).",
        points: { "bb-curve": 2, "nokia-3310": 1, walkman: 1 },
      },
      {
        id: "q7b",
        label: "Social + communication safety (messaging, group chats, peer pressure, scams, trust and conflict repair).",
        points: { "bb-bold": 2, razr: 1, walkman: 1 },
      },
    ],
  },
  {
    id: "q8",
    chapter: "8/12: Your controls experience",
    sceneId: "settings",
    prompt:
      "You realize you should set up parental controls on your child’s personal learning device issued by the school. You feel…",
    options: [
      {
        id: "q8a",
        label: "Confident—I’ve used some controls before and can figure it out (or tune it) when needed.",
        points: { "htc-desire": 2, "bb-bold": 1, "bb-curve": 1 },
      },
      {
        id: "q8b",
        label: "Unconfident—I’m not sure where to start, or it feels confusing/hard to keep up with.",
        points: { "palm-treo": 2, razr: 1, "nokia-3310": 1 },
      },
    ],
  },
  {
    id: "q9",
    chapter: "9/12: YouTube ads",
    sceneId: "youtubeAds",
    prompt:
      "While your child is watching YouTube, you notice the ads don’t feel great for attention and mood. A pop-up offers: pay to disable ads. What do you choose?",
    options: [
      {
        id: "q9a",
        label: "Pay to disable ads (reduce friction and improve the environment quickly).",
        points: { "palm-treo": 2, razr: 1, "bb-bold": 1 },
      },
      {
        id: "q9b",
        label: "Don’t pay; adjust the setup/routine (shorter sessions, different sources, co-watching, alternatives).",
        points: { "htc-desire": 1, "nokia-3310": 1, walkman: 1, "bb-curve": 1 },
      },
    ],
  },
  {
    id: "q10",
    chapter: "10/12: Friends’ game request",
    sceneId: "friendsGame",
    prompt:
      "Your child wants to play a game their friends have been playing. You’ve heard it can be violent, but you also don’t want your child to feel left out. What do you do?",
    options: [
      {
        id: "q10a",
        label: "Allow it with structure (preview it, set limits, and keep it as age-appropriate as you can).",
        points: { razr: 2, "htc-desire": 1, "bb-bold": 1 },
      },
      {
        id: "q10b",
        label: "Pause access for now and offer another way to support belonging (alternative game, co-op, meet-up).",
        points: { "nokia-3310": 1, walkman: 1, "bb-curve": 1 },
      },
    ],
  },
  {
    id: "q11",
    chapter: "11/12: Last-minute meeting",
    sceneId: "workMeeting",
    prompt:
      "You have to attend a last-minute work meeting. Your child is having a bad day and wants screen time. What do you do?",
    options: [
      {
        id: "q11a",
        label: "Cancel/reschedule the meeting if you can, and focus on helping your child settle first.",
        points: { walkman: 2, "nokia-e71": 1, "bb-bold": 1 },
      },
      {
        id: "q11b",
        label: "Take the meeting and offer bounded screen time (timer / calm lane) to get through the moment.",
        points: { "palm-treo": 2, "bb-curve": 1, razr: 1 },
      },
    ],
  },
  {
    id: "q12",
    chapter: "12/12: Your direction",
    sceneId: "futurePlan",
    prompt:
      "Looking ahead 3–6 months, what approach feels most supportive for your family right now?",
    options: [
      {
        id: "q12a",
        label: "More structure by default (clear boundaries, simpler choices, fewer negotiations).",
        points: { "bb-bold": 2, "bb-curve": 2, "nokia-3310": 1 },
      },
      {
        id: "q12b",
        label: "More autonomy with coaching (shared agreements, skill-building, gradual responsibility).",
        points: { walkman: 2, razr: 1, "htc-desire": 1 },
      },
    ],
  },
];
