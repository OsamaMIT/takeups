import Link from "next/link";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-10 text-takeups-text md:px-8">
      <BackgroundFX />
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-takeups-blue">Back to Takeups</Link>
        <Card className="mt-6 p-6">
          <h1 className="font-heading text-4xl font-semibold">About Takeups</h1>
          <p className="mt-5 leading-7 text-takeups-muted">
            Takeups is a private-room multiplayer debate party game. The server assigns stands,
            keeps authors hidden during voting, validates eligibility, and calculates scores. The
            point is not to reveal what anyone believes. The point is to defend the assigned brief.
          </p>
        </Card>
      </div>
    </main>
  );
}
