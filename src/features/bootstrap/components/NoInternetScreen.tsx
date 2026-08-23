export function NoInternetScreen() {
  return <div className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-title font-bold">You are Offline</h1>
    <p className="text-muted-foreground mt-4">Please check your internet connection and try again.</p>
  </div>;
}