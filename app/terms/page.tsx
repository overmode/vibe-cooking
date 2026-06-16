import { type Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { termsOfService } from "@/lib/legal/terms-of-service";

export const metadata: Metadata = {
  title: "Terms of Service — Vibe Cooking",
};

export default function TermsPage() {
  return <LegalDocumentView document={termsOfService} />;
}
