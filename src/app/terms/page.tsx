import Link from "next/link";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-10 text-takeups-text md:px-8">
      <BackgroundFX />
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-takeups-blue">Back to Takeups</Link>
        <Card className="mt-6 p-6">
          <h1 className="font-heading text-4xl font-semibold">Terms</h1>
          <p className="mt-5 leading-7 text-takeups-muted">
            Use Takeups for private social play. Do not submit personal attacks, targeted harassment,
            illegal content, or content that would make the room unsafe. Hosts can remove players
            from the lobby before a round starts.
          </p>
        </Card>
      </div>
    </main>
  );
}
