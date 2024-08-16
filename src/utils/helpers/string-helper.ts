export function adjustStringLength(inputString: string, length: number) {
  if (inputString.length > length) {
    return inputString.substring(0, length);
  }

  return inputString;
}

export const fromBase64 = (base64String: string): Uint8Array => {
  return Buffer.from(base64String, "base64");
};
