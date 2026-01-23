import { GigaClicker } from "@/components/GigaClicker";

export default function ClickerPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-6 flex items-center justify-center">
          <h1 className="text-[11px] font-medium tracking-[0.2em] uppercase">
            Giga Clicker
          </h1>
        </div>
      </div>

      {/* Clicker */}
      <div className="flex-1 flex items-center justify-center py-16">
        <GigaClicker />
      </div>
    </main>
  );
}
