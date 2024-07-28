import CryptoJS from "crypto-js";

export function sha256ToHex(input: string): string {
  // Generate sha256 hash
  const hash = CryptoJS.SHA256(input);

  // Convert hash to hexadecimal string
  return hash.toString(CryptoJS.enc.Hex);
}
