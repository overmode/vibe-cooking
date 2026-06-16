import { type LegalDocument } from "@/lib/legal/types";

const OPERATOR = "Lucas Massemin";
const CONTACT_EMAIL = "chief@vibe-cooking.fr";
const SUPERVISORY_AUTHORITY =
  "the French data protection authority (CNIL, www.cnil.fr)";
const HOSTING_PROVIDER =
  "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA";

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: 16 June 2026",
  intro: [
    {
      type: "paragraph",
      text: `This Privacy Policy explains how ${OPERATOR}, an individual based in France ("I", "we"), collects, uses, and protects your personal data when you use Vibe Cooking (the "Service"), an AI-powered cooking assistant available at app.vibe-cooking.fr and through connected AI assistants such as ChatGPT and Claude.`,
    },
    {
      type: "paragraph",
      text: "We are committed to data minimisation: we collect only what is needed to run the Service, we do not sell your data, and we do not use it for advertising. This policy is written to comply with the EU General Data Protection Regulation (GDPR) and the French Data Protection Act.",
    },
  ],
  sections: [
    {
      heading: "1. Who is responsible for your data",
      blocks: [
        {
          type: "paragraph",
          text: `The Service is operated by ${OPERATOR}, an individual based in France, who is the data controller for your personal data. For any question about this policy or your personal data, contact ${CONTACT_EMAIL}.`,
        },
        {
          type: "paragraph",
          text: `Given the personal, non-commercial scale of the Service, no Data Protection Officer has been appointed, and as a controller established in France we are not required to designate a representative under Article 27 GDPR. Publisher and hosting details appear in the "Publisher and hosting" section below.`,
        },
      ],
    },
    {
      heading: "2. What data we collect",
      blocks: [
        {
          type: "paragraph",
          text: "We collect the following categories of personal data:",
        },
        {
          type: "list",
          items: [
            "Account and identity data: when you sign in, our authentication provider (WorkOS) handles your credentials and shares with us a unique account identifier and your email address. We never see or store your password.",
            "Recipe content you create or import: recipe names, ingredients, instructions, servings, preparation time, and difficulty, including the full edit history of each recipe.",
            "Your cooking profile: the free-text profile you write (or that the assistant writes on your behalf) describing your tastes, equipment, diet, and constraints. This may include information you choose to share about allergies or dietary restrictions.",
            "Conversations: the messages you exchange with the assistant, including the assistant's replies and the results of any tools it runs (such as web searches) on your behalf.",
            "Usage and technical data: a per-day count of messages you send (used for rate limiting), plus standard server logs (such as timestamps and error information) generated when you use the Service.",
          ],
        },
        {
          type: "paragraph",
          text: "Please avoid entering sensitive personal data you do not want stored. If you record health-related details such as allergies in your profile, you do so on the basis of your explicit consent, given by choosing to enter that information, and you can remove it at any time.",
        },
      ],
    },
    {
      heading: "3. Why we use your data and our legal bases",
      blocks: [
        {
          type: "list",
          items: [
            "To provide the Service — store your recipes, profile, and conversations, and generate personalised cooking suggestions (legal basis: performance of our contract with you).",
            "To keep the Service secure and prevent abuse — including daily rate limiting (legal basis: our legitimate interest in protecting the Service).",
            "To process any allergy or health-related details you choose to add to your profile (legal basis: your explicit consent).",
            "To comply with legal obligations where applicable (legal basis: legal obligation).",
          ],
        },
        {
          type: "paragraph",
          text: "We do not use your data for advertising, profiling unrelated to the Service, or automated decisions producing legal effects about you.",
        },
      ],
    },
    {
      heading: "4. AI processing and the third parties we rely on",
      blocks: [
        {
          type: "paragraph",
          text: "To deliver the Service we share the minimum necessary data with carefully chosen processors who act on our instructions:",
        },
        {
          type: "list",
          items: [
            "WorkOS — authentication and account management. Receives your sign-in details and email.",
            "OpenAI — provides the AI model that powers the assistant and its web-search capability. The content needed to answer your request (your messages, relevant recipe and profile context) is sent to OpenAI to generate a response. We configure the API so that OpenAI does not retain this content and does not use it to train its models.",
            "Our hosting and database providers — store the Service's data on our behalf within secure infrastructure.",
          ],
        },
        {
          type: "paragraph",
          text: "When the assistant searches the web on your behalf, your search query is sent through OpenAI's web-search tool to the public internet, and the results it returns are saved as part of your conversation in our database. Avoid putting anything in a request that you would not want sent to a search engine.",
        },
        {
          type: "paragraph",
          text: "When you use Vibe Cooking through a connected AI assistant (for example as a ChatGPT app or a Claude connector), your use of that assistant is also governed by the privacy policy of its provider. Through the connection we only share the data needed to fulfil your request — the recipes, profile, and results returned by the tools you invoke.",
        },
      ],
    },
    {
      heading: "5. International transfers",
      blocks: [
        {
          type: "paragraph",
          text: "Some of our providers are located outside the European Economic Area, including in the United States. Where data is transferred outside the EEA, we rely on appropriate safeguards such as the European Commission's Standard Contractual Clauses to protect it.",
        },
      ],
    },
    {
      heading: "6. How long we keep your data",
      blocks: [
        {
          type: "paragraph",
          text: "We keep your account data, recipes (including their revision history), profile, and conversations for as long as your account is active. When you ask us to delete your account or specific content, we remove it from our active systems within a reasonable time, and it is purged from backups in the ordinary course as those backups are cycled, except where we must retain certain data to comply with a legal obligation. Rate-limiting counters are short-lived and are not used to identify you.",
        },
      ],
    },
    {
      heading: "7. Your rights",
      blocks: [
        {
          type: "paragraph",
          text: "Under the GDPR you have the right to:",
        },
        {
          type: "list",
          items: [
            "Access the personal data we hold about you and obtain a copy.",
            "Rectify inaccurate or incomplete data.",
            "Erase your data (the right to be forgotten).",
            "Restrict or object to certain processing.",
            "Receive your data in a portable, machine-readable format.",
            "Withdraw any consent you have given, at any time, without affecting prior processing.",
          ],
        },
        {
          type: "paragraph",
          text: `To exercise any of these rights, contact ${CONTACT_EMAIL}. We respond within one month, as required by the GDPR (extendable by two further months for complex requests, in which case we will let you know). We may first need to verify your identity so that we do not disclose your data to someone else. You also have the right to lodge a complaint with ${SUPERVISORY_AUTHORITY}.`,
        },
      ],
    },
    {
      heading: "8. Security",
      blocks: [
        {
          type: "paragraph",
          text: "We protect your data using encryption in transit, access controls, and reputable infrastructure providers. No method of transmission or storage is completely secure, but we take reasonable steps to protect your information and to notify you and the relevant authority of any breach where required.",
        },
      ],
    },
    {
      heading: "9. Cookies",
      blocks: [
        {
          type: "paragraph",
          text: "We use only strictly necessary cookies: a secure session cookie to keep you signed in, and a cookie that remembers your language preference. We do not use advertising or third-party tracking cookies.",
        },
      ],
    },
    {
      heading: "10. Children",
      blocks: [
        {
          type: "paragraph",
          text: "The Service is not directed to children under 15. We do not knowingly collect data from children under 15. If you believe a child has provided us with personal data, contact us and we will delete it.",
        },
      ],
    },
    {
      heading: "11. Changes to this policy",
      blocks: [
        {
          type: "paragraph",
          text: "We may update this policy from time to time. When we make material changes, we will update the date above and, where appropriate, notify you within the Service.",
        },
      ],
    },
    {
      heading: "12. Contact",
      blocks: [
        {
          type: "paragraph",
          text: `For any privacy question or request, contact ${CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      heading: "13. Publisher and hosting (mentions légales)",
      blocks: [
        {
          type: "paragraph",
          text: `Publisher: ${OPERATOR}, an individual publishing this Service in a non-professional capacity, reachable at ${CONTACT_EMAIL}.`,
        },
        {
          type: "paragraph",
          text: `Hosting provider: ${HOSTING_PROVIDER}.`,
        },
      ],
    },
  ],
};
