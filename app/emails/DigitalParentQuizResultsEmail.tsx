import * as React from "react";
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { PersonaId } from "../digital-parent-quiz/quizTypes";

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

export default function DigitalParentQuizResultsEmail(props: DigitalParentQuizResultsEmailProps) {
  const { topPersona, allPersonas, payload, productUrl } = props;

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
