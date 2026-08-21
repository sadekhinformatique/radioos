import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} - Radio en direct | RadioOS`,
    description: `Écoutez ${slug} en direct sur RadioOS. Streaming, podcasts, dédicaces et plus.`,
    openGraph: {
      title: `${slug} - Radio en direct`,
      description: `Écoutez ${slug} en direct sur RadioOS`,
      type: "website",
      siteName: "RadioOS",
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug} - Radio en direct`,
      description: `Écoutez ${slug} en direct sur RadioOS`,
    },
    manifest: "/manifest.json",
    themeColor: "#2563EB",
  };
}
