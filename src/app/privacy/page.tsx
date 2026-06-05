import Link from "next/link";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10 text-takeups-text md:px-8">
      <BackgroundFX />
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-takeups-blue">Back to Takeups</Link>
        <Card className="mt-6 p-6">
          <h1 className="font-heading text-4xl font-semibold">Privacy</h1>
          <p className="mt-5 leading-7 text-takeups-muted">
            Takeups does not require accounts and does not include a database. Room state is held
            by PartyKit room storage for gameplay and refresh recovery. Your browser stores a local
            session ID, display name, and sound preference so reconnection works.
          </p>
        </Card>
      </div>
    </main>
  );
}
