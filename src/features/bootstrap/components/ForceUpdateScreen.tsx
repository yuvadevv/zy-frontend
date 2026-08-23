export function ForceUpdateScreen() {
  return <div className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-title font-bold">Update Required</h1>
    <p className="text-muted-foreground mt-4">A new mandatory update is available for BLINTZY.</p>
  </div>;
}