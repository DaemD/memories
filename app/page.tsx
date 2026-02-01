import { Timeline } from '@/components/Timeline';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">Memory Journal</h1>
          {/* Placeholder for Add button or User menu */}
          <button className="text-sm font-medium hover:text-zinc-600 transition-colors">
            + Add Memory
          </button>
        </div>
      </header>

      <Timeline />
    </main>
  );
}
