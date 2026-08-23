import { AppShell } from "@/features/app-shell/components/AppShell";
import { AppProviders } from "./AppProviders";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
