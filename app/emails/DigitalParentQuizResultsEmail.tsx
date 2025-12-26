import * as React from "react";
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export type PersonaId =
  | "bb-bold"
  | "htc-desire"
  | "palm-treo"
  | "razr"
  | "walkman"
  | "nokia-3310"
  | "nokia-e71"
  | "bb-curve";

export type DigitalParentQuizResultsPayload = {
  submittedAt: string;
  email: string;
  answers: Array<{
    questionId: string;
    optionId: string;
    chapter: string;
    prompt: string;
    selectedLabel: string;
  }>;
  scores: Record<PersonaId, number>;
  topPersonaId: PersonaId;
};

export type DigitalParentQuizResultsEmailProps = {
  topPersona: {
    id: PersonaId;
    phoneModel: string;
    characterName: string;
    tagline: string;
    summary: string;
    strengths: string[];
    watchOutFor: string[];
    nextQuest: string[];
  };
  allPersonas: Array<{
    id: PersonaId;
    phoneModel: string;
    characterName: string;
    tagline: string;
    summary: string;
  }>;
  payload: DigitalParentQuizResultsPayload;
  productUrl: string;
};

const base = {
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  color: "#141414",
};

const mono = {
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

// Default props for email preview
const defaultProps: DigitalParentQuizResultsEmailProps = {
  topPersona: {
    id: "bb-bold",
    phoneModel: "BlackBerry Bold 9900",
    characterName: "The Executive",
    tagline: "Always connected, always in control",
    summary: "You're the type who needs to stay on top of everything. Your phone is your command center, and you use it to manage both work and family with military precision.",
    strengths: [
      "Excellent at multitasking",
      "Great organizational skills",
      "Strong communication abilities",
      "Natural leadership qualities",
      "Efficient time management",
      "Problem-solving mindset"
    ],
    watchOutFor: [
      "Work-life balance can suffer",
      "May overwhelm family with structure",
      "Could miss spontaneous moments",
      "Tendency to over-schedule",
      "Risk of burnout",
      "May prioritize efficiency over connection"
    ],
    nextQuest: [
      "Schedule regular device-free family time",
      "Practice being present in conversations",
      "Let kids lead some activities",
      "Create space for unstructured play",
      "Model healthy tech boundaries",
      "Focus on quality over quantity time"
    ]
  },
  allPersonas: [
    {
      id: "bb-bold",
      phoneModel: "BlackBerry Bold 9900",
      characterName: "The Executive",
      tagline: "Always connected, always in control",
      summary: "You're the type who needs to stay on top of everything. Your phone is your command center."
    },
    {
      id: "nokia-3310",
      phoneModel: "Nokia 3310",
      characterName: "The Minimalist",
      tagline: "Less is more, focus on what matters",
      summary: "You believe in keeping things simple and focusing on real-world connections."
    },
    {
      id: "razr",
      phoneModel: "Motorola RAZR",
      characterName: "The Trendsetter",
      tagline: "Style meets function",
      summary: "You like to stay current with trends while maintaining a sense of sophistication."
    }
  ],
  payload: {
    submittedAt: "2025-12-26T14:00:00Z",
    email: "parent@example.com",
    answers: [
      {
        questionId: "q1",
        optionId: "o1",
        chapter: "Morning Routine",
        prompt: "How do you start your day?",
        selectedLabel: "Check emails and messages immediately"
      }
    ],
    scores: {
      "bb-bold": 85,
      "nokia-3310": 45,
      "razr": 60,
      "htc-desire": 30,
      "palm-treo": 25,
      "walkman": 20,
      "nokia-e71": 70,
      "bb-curve": 55
    },
    topPersonaId: "bb-bold"
  },
  productUrl: "https://futurenet-demo.netlify.app/digital-parent-quiz"
};

export default function DigitalParentQuizResultsEmail(props?: DigitalParentQuizResultsEmailProps) {
  const actualProps = props || defaultProps;
  const topPersona = actualProps?.topPersona || defaultProps.topPersona;
  const allPersonas = actualProps?.allPersonas || defaultProps.allPersonas;
  const payload = actualProps?.payload || defaultProps.payload;
  const productUrl = actualProps?.productUrl || defaultProps.productUrl;

  // Safety check
  if (!topPersona) {
    return (
      <Html>
        <Head />
        <Preview>Email Preview Error</Preview>
        <Body>
          <Text>Error: Unable to load email data</Text>
        </Body>
      </Html>
    );
  }

  return (
    <Html>
      <Head />
      <Preview>Your Digital Parent Quiz results + full persona breakdown</Preview>
      <Body style={{ ...base, backgroundColor: "#f7f7f2", padding: "24px 12px" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #141414", padding: "18px" }}>
          <Heading style={{ margin: "0 0 6px" }}>Your Digital Parent Quiz Results</Heading>
          <Text style={{ margin: "0 0 12px" }}>
            Top match: <strong>{topPersona.phoneModel}</strong> — {topPersona.characterName}
          </Text>

          <Section>
            <Text style={{ margin: "0 0 6px" }}>
              <strong>{topPersona.tagline}</strong>
            </Text>
            <Text style={{ margin: "0 0 12px", lineHeight: "1.55" }}>{topPersona.summary}</Text>

            <Text style={{ margin: "0 0 6px" }}>
              <strong>Strengths</strong>
            </Text>
            {topPersona.strengths.slice(0, 6).map((s) => (
              <Text key={s} style={{ margin: "0 0 4px" }}>
                - {s}
              </Text>
            ))}

            <Text style={{ margin: "12px 0 6px" }}>
              <strong>Watch-outs</strong>
            </Text>
            {topPersona.watchOutFor.slice(0, 6).map((s) => (
              <Text key={s} style={{ margin: "0 0 4px" }}>
                - {s}
              </Text>
            ))}

            <Text style={{ margin: "12px 0 6px" }}>
              <strong>Next quest</strong>
            </Text>
            {topPersona.nextQuest.slice(0, 6).map((s) => (
              <Text key={s} style={{ margin: "0 0 4px" }}>
                - {s}
              </Text>
            ))}
          </Section>

          <Hr style={{ borderColor: "#141414", margin: "16px 0" }} />

          <Section>
            <Heading as="h2" style={{ margin: "0 0 8px", fontSize: "18px" }}>
              Full Digital Parent Persona Index
            </Heading>
            {allPersonas.map((p) => (
              <Section key={p.id} style={{ marginBottom: "10px" }}>
                <Text style={{ margin: "0 0 2px" }}>
                  <strong>{p.phoneModel}</strong> — {p.characterName}
                </Text>
                <Text style={{ margin: "0 0 2px" }}>{p.tagline}</Text>
                <Text style={{ margin: "0", lineHeight: "1.55" }}>{p.summary}</Text>
              </Section>
            ))}
          </Section>

          <Hr style={{ borderColor: "#141414", margin: "16px 0" }} />

          <Section>
            <Heading as="h2" style={{ margin: "0 0 8px", fontSize: "18px" }}>
              JSON Payload (for consolidation)
            </Heading>
            <Text style={{ ...mono, fontSize: "12px", whiteSpace: "pre-wrap", backgroundColor: "#f7f7f2", border: "1px solid #141414", padding: "10px" }}>
              {JSON.stringify(payload, null, 2)}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#141414", margin: "16px 0" }} />

          <Text style={{ margin: "0", fontSize: "13px" }}>
            View the quiz again: {productUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
