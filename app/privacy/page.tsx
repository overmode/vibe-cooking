import { type Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/lib/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy — Vibe Cooking",
};

export default function PrivacyPage() {
  return <LegalDocumentView document={privacyPolicy} />;
}
