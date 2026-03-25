const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function encode(id: bigint): string {
  if (id === 0n) return '0';
  let result = '';
  while (id > 0n) {
    result = CHARS[Number(id % 62n)] + result;
    id /= 62n;
  }
  return result;
}

function decode(short: string): bigint {
  return [...short].reduce(
    (acc, char) => acc * 62n + BigInt(CHARS.indexOf(char)),
    0n,
  );
}

export { encode, decode };
