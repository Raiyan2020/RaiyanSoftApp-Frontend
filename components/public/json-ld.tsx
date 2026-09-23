type JsonLdProps = {
  id: string;
  data: Record<string, unknown>;
};

// Plain <script> from a Server Component, per the Next.js JSON-LD guide;
// `<` is escaped so data can't close the tag early.
export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
