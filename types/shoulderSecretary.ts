export type Tone =
  | "business"
  | "gentle"
  | "friendly"
  | "firm";

export interface ShoulderSecretaryResponse {
  analysis: {
    emotion: string;
    facts: string[];
    request: string;
  };
  rewritten: {
    subject: string;
    body: string;
  };
  warnings: string[];
}