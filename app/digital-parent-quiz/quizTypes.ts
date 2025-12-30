export type PersonaId =
  | "bb-bold"
  | "htc-desire"
  | "palm-treo"
  | "razr"
  | "walkman"
  | "nokia-3310"
  | "nokia-e71"
  | "bb-curve";

export type QuizPersona = {
  id: PersonaId;
  phoneModel: string;
  characterName: string;
  tagline: string;
  summary: string;
  strengths: string[];
  watchOutFor: string[];
  nextQuest: string[];
};

export type QuizOption = {
  id: string;
  label: string;
  points: Partial<Record<PersonaId, number>>;
};

export type QuizQuestion = {
  id: string;
  chapter: string;
  prompt: string;
  sceneId: string;
  options: QuizOption[];
};
