import Image from "next/image";
import { TokenDashboard } from "@/components/TokenDashboard";
import { TippingModule } from "@/components/TippingModule";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16">
        <Image
          src="/definition.png"
          alt="Giga - Of or referring to one billion"
          width={600}
          height={300}
          priority
          className="w-full max-w-xl md:max-w-2xl"
        />
      </div>

      {/* Token Dashboard */}
      <TokenDashboard />

      {/* Tipping Module */}
      <div className="mt-16 w-full">
        <TippingModule />
      </div>
    </main>
  );
}
