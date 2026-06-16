export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  // Preformatted, e.g. "Last updated: 16 June 2026" — kept in the content layer
  // so the renderer stays free of literal copy.
  lastUpdated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
}
