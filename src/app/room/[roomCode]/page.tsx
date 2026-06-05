import { GameRoom } from "@/components/game/GameRoom";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = await params;
  return <GameRoom roomCode={roomCode.toUpperCase()} />;
}
