import { toScript } from "@/lib/jsonld";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(data) }} />;
}
