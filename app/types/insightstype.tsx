export type Section =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: { text: string }[] | string[] };

export interface GPTInsightResponse {
  sections: Section[];
}