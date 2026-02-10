export function hash(input: string): number {
  let h = 0;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    h = (h << 5) - h + charCode;
    h &= h;
  }

  return Math.abs(h);
}
