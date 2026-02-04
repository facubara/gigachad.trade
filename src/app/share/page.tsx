import { Metadata } from "next";
import { ShareRedirect } from "./ShareRedirect";

interface SharePageProps {
  searchParams: Promise<{
    type?: string;
    multiplier?: string;
    progress?: string;
    address?: string;
    holdings?: string;
    targetValue?: string;
    targetMarketCap?: string;
    currentMultiplier?: string;
    // Holdings type params
    currentValue?: string;
    avgEntry?: string;
    buyCount?: string;
    priceChange?: string;
  }>;
}

function formatMarketCapDisplay(mcapStr: string | undefined): string {
  if (!mcapStr) return "$1B";
  const mcap = parseFloat(mcapStr);
  if (isNaN(mcap)) return "$1B";
  if (mcap >= 1_000_000_000_000) {
    return `$${(mcap / 1_000_000_000_000).toFixed(mcap % 1_000_000_000_000 === 0 ? 0 : 1)}T`;
  }
  if (mcap >= 1_000_000_000) {
    return `$${(mcap / 1_000_000_000).toFixed(mcap % 1_000_000_000 === 0 ? 0 : 1)}B`;
  }
  if (mcap >= 1_000_000) {
    return `$${(mcap / 1_000_000).toFixed(mcap % 1_000_000 === 0 ? 0 : 0)}M`;
  }
  return `$${mcap.toLocaleString()}`;
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type || "general";
  const mcapDisplay = formatMarketCapDisplay(params.targetMarketCap);

  // Build OG image URL
  const ogParams = new URLSearchParams();
  ogParams.set("type", type);
  if (params.multiplier) ogParams.set("multiplier", params.multiplier);
  if (params.progress) ogParams.set("progress", params.progress);
  if (params.address) ogParams.set("address", params.address);
  if (params.holdings) ogParams.set("holdings", params.holdings);
  if (params.targetValue) ogParams.set("targetValue", params.targetValue);
  if (params.targetMarketCap) ogParams.set("targetMarketCap", params.targetMarketCap);
  if (params.currentMultiplier) ogParams.set("currentMultiplier", params.currentMultiplier);
  if (params.currentValue) ogParams.set("currentValue", params.currentValue);
  if (params.avgEntry) ogParams.set("avgEntry", params.avgEntry);
  if (params.buyCount) ogParams.set("buyCount", params.buyCount);
  if (params.priceChange) ogParams.set("priceChange", params.priceChange);

  const ogImageUrl = `/api/og?${ogParams.toString()}`;

  // Generate title and description based on type
  let title = `GIGACHAD | The Path to ${mcapDisplay}`;
  let description = "Calculate your potential $GIGA gains";

  if (type === "general" && params.multiplier) {
    title = `$GIGA is ${params.multiplier}x to ${mcapDisplay}`;
    description = `${params.progress || "0"}% progress to ${mcapDisplay} market cap. Calculate your potential gains at gigachad.trade`;
  } else if (type === "portfolio") {
    if (params.targetValue) {
      title = `$${params.targetValue} at ${mcapDisplay} Market Cap`;
      description = "Check your potential $GIGA gains at gigachad.trade";
    } else if (params.holdings) {
      title = `Holding ${params.holdings} $GIGA`;
      description = "Calculate your potential gains at gigachad.trade";
    }
  } else if (type === "holdings" && params.holdings) {
    const valueText = params.currentValue ? ` ($${params.currentValue})` : "";
    title = `Holding ${params.holdings} $GIGA${valueText}`;
    const changeText = params.priceChange ? `${parseFloat(params.priceChange) >= 0 ? "+" : ""}${params.priceChange}% from entry. ` : "";
    description = `${changeText}Check your $GIGA holdings at gigachad.trade`;
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
  const redirectTo = params.type === "portfolio" || params.type === "holdings"
    ? "/calculator"
    : "/";

  // Render the page (so crawlers see the meta tags), then redirect via client JS
  return <ShareRedirect to={redirectTo} />;
}
