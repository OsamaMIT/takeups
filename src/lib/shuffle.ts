export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function sampleRoomCode(length = 6, alphabet: string): string {
  let code = "";
  const cryptoApi = globalThis.crypto;
  const bytes = new Uint8Array(length);
  if (cryptoApi?.getRandomValues) {
    cryptoApi.getRandomValues(bytes);
    for (const byte of bytes) code += alphabet[byte % alphabet.length];
    return code;
  }
  for (let index = 0; index < length; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
