export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 w-full pb-[calc(72px+env(safe-area-inset-bottom))]">
      {children}
    </main>
  );
}
