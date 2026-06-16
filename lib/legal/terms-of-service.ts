import { type LegalDocument } from "@/lib/legal/types";

const OPERATOR = "Lucas Massemin";
const CONTACT_EMAIL = "chief@vibe-cooking.fr";
const GOVERNING_LAW = "France";

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: "Last updated: 16 June 2026",
  intro: [
    {
      type: "paragraph",
      text: `These Terms of Service ("Terms") govern your use of Vibe Cooking (the "Service"), an AI-powered cooking assistant operated by ${OPERATOR}, an individual based in France. By using the Service — directly at app.vibe-cooking.fr or through a connected AI assistant such as ChatGPT or Claude — you agree to these Terms. If you do not agree, do not use the Service.`,
    },
  ],
  sections: [
    {
      heading: "1. Eligibility and accounts",
      blocks: [
        {
          type: "paragraph",
          text: "You must be at least 15 years old to use the Service. You access the Service through an account managed by our authentication provider. You are responsible for keeping access to your account secure and for all activity that occurs under it.",
        },
      ],
    },
    {
      heading: "2. The Service",
      blocks: [
        {
          type: "paragraph",
          text: "Vibe Cooking lets you create, store, and organise recipes, maintain a personal cooking profile, and chat with an AI assistant that can suggest, draft, and edit recipes and search the web on your behalf. Features may change, and we may limit usage (for example through daily rate limits) to keep the Service available to everyone.",
        },
      ],
    },
    {
      heading: "3. Your content",
      blocks: [
        {
          type: "paragraph",
          text: 'You retain ownership of the recipes, profile, and messages you create ("Your Content"). You grant us the limited right to store, process, and display Your Content for the sole purpose of operating and maintaining the Service for you, including sending the necessary context to our AI provider to generate responses. We do not use Your Content to train AI models. You are responsible for ensuring you have the right to submit Your Content and that it does not infringe anyone else\'s rights.',
        },
      ],
    },
    {
      heading: "4. Acceptable use",
      blocks: [
        {
          type: "paragraph",
          text: "You agree not to:",
        },
        {
          type: "list",
          items: [
            "Use the Service for any unlawful purpose or to generate harmful, abusive, or infringing content.",
            "Attempt to disrupt, overload, reverse-engineer, or gain unauthorised access to the Service or its underlying systems.",
            "Use the Service to build a competing product or to scrape or extract data at scale.",
            "Misuse the assistant to produce content unrelated to cooking in a way that abuses the underlying AI providers' usage policies.",
          ],
        },
      ],
    },
    {
      heading: "5. AI output, food safety, and allergies",
      blocks: [
        {
          type: "paragraph",
          text: "The Service uses AI to generate recipes, suggestions, and other content. AI output can be inaccurate, incomplete, or unsuitable for your circumstances. You must use your own judgement before relying on it.",
        },
        {
          type: "paragraph",
          text: "In particular, the Service does not provide medical, nutritional, or dietary advice. AI-generated recipes and ingredient lists may be wrong about allergens, dietary suitability, cooking temperatures, or food safety. You are solely responsible for verifying ingredients against your own allergies and dietary needs, for safe food handling and cooking, and for consulting a qualified professional where appropriate. Do not rely on the Service to determine whether a dish is safe for someone with a food allergy or medical condition.",
        },
      ],
    },
    {
      heading: "6. Third-party services",
      blocks: [
        {
          type: "paragraph",
          text: "The Service relies on third parties (including authentication, AI model, hosting, and database providers) and can be accessed through third-party AI assistants. Your use of those assistants is also subject to their own terms and policies. We are not responsible for third-party services we do not control.",
        },
      ],
    },
    {
      heading: "7. Availability and warranties",
      blocks: [
        {
          type: "paragraph",
          text: 'The Service is provided "as is" and "as available", without warranties of any kind, whether express or implied, to the fullest extent permitted by law. We do not warrant that the Service will be uninterrupted, error-free, or that AI output will be accurate or fit for a particular purpose. Nothing in this section affects the mandatory legal guarantees you have as a consumer under French law, including the legal guarantee of conformity (garantie légale de conformité) and the guarantee against hidden defects (garantie des vices cachés), which continue to apply.',
        },
      ],
    },
    {
      heading: "8. Limitation of liability",
      blocks: [
        {
          type: "paragraph",
          text: "To the fullest extent permitted by law, we will not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including any reliance on AI-generated content. Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law, such as liability for death or personal injury caused by negligence, for fraud, or your mandatory statutory rights as a consumer.",
        },
      ],
    },
    {
      heading: "9. Suspension and termination",
      blocks: [
        {
          type: "paragraph",
          text: "You may stop using the Service at any time and request deletion of your account. We may suspend or terminate access if you breach these Terms or use the Service in a way that risks harm to others or to the Service. You can request deletion of your data as described in our Privacy Policy.",
        },
      ],
    },
    {
      heading: "10. Changes to these Terms",
      blocks: [
        {
          type: "paragraph",
          text: "We may update these Terms from time to time. When we make material changes, we will update the date above and, where appropriate, notify you within the Service. Continued use after changes take effect means you accept the updated Terms.",
        },
      ],
    },
    {
      heading: "11. Governing law",
      blocks: [
        {
          type: "paragraph",
          text: `These Terms are governed by the laws of ${GOVERNING_LAW}, without prejudice to any mandatory consumer-protection rights you have in your country of residence.`,
        },
      ],
    },
    {
      heading: "12. Contact",
      blocks: [
        {
          type: "paragraph",
          text: `For any question about these Terms, contact us at ${CONTACT_EMAIL}.`,
        },
      ],
    },
  ],
};
