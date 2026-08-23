export function UnknownErrorScreen({ error }: { error?: Error | null }) {
  return <div className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center bg-background">
    <h1 className="text-title font-bold text-destructive">Oops, something broke!</h1>
    <p className="text-muted-foreground mt-4">{error?.message || "An unexpected error occurred."}</p>
  </div>;
}