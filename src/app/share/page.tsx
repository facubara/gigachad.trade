import { Metadata } from "next";
import { redirect } from "next/navigation";

interface SharePageProps {
  searchParams: Promise<{
    type?: string;
    multiplier?: string;
    progress?: string;
    address?: string;
    holdings?: string;
    targetValue?: string;
    currentMultiplier?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type || "general";

  // Build OG image URL
  const ogParams = new URLSearchParams();
  ogParams.set("type", type);
  if (params.multiplier) ogParams.set("multiplier", params.multiplier);
  if (params.progress) ogParams.set("progress", params.progress);
  if (params.address) ogParams.set("address", params.address);
  if (params.holdings) ogParams.set("holdings", params.holdings);
  if (params.targetValue) ogParams.set("targetValue", params.targetValue);
  if (params.currentMultiplier) ogParams.set("currentMultiplier", params.currentMultiplier);

  const ogImageUrl = `/api/og?${ogParams.toString()}`;

  // Generate title and description based on type
  let title = "GIGACHAD | The Path to $1B";
  let description = "Calculate your potential $GIGA gains";

  if (type === "general" && params.multiplier) {
    title = `$GIGA is ${params.multiplier}x to $1B`;
    description = `${params.progress || "0"}% progress to $1B market cap. Calculate your potential gains at gigachad.trade`;
  } else if (type === "portfolio") {
    if (params.targetValue) {
      title = `$${params.targetValue} at $1B Market Cap`;
      description = "Check your potential $GIGA gains at gigachad.trade";
    } else if (params.holdings) {
      title = `Holding ${params.holdings} $GIGA`;
      description = "Calculate your potential gains at gigachad.trade";
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      siteName: "GIGACHAD",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  // Redirect to appropriate page based on type
  if (params.type === "portfolio") {
    redirect("/calculator");
  }
  redirect("/");
}
