import { type LegalBlock, type LegalDocument } from "@/lib/legal/types";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <div className="h-full overflow-y-auto">
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {document.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {document.lastUpdated}
          </p>
        </header>

        <div className="space-y-4">
          {document.intro.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="leading-relaxed text-muted-foreground">{block.text}</p>;
}
