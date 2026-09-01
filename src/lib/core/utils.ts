import { BinaryInput } from "./types";

/**
 * Normalizes any binary input (File, Blob, ArrayBuffer, Uint8Array) into an ArrayBuffer.
 */
export async function toArrayBuffer(input: BinaryInput): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) {
    return input;
  }
  if (input instanceof Uint8Array) {
    return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer;
  }
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    return await input.arrayBuffer();
  }
  throw new TypeError("Unsupported binary input format. Expected File, Blob, ArrayBuffer, or Uint8Array.");
}

/**
 * Normalizes any binary input into a Uint8Array.
 */
export async function toUint8Array(input: BinaryInput): Promise<Uint8Array> {
  if (input instanceof Uint8Array) {
    return input;
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    const buffer = await input.arrayBuffer();
    return new Uint8Array(buffer);
  }
  throw new TypeError("Unsupported binary input format. Expected File, Blob, ArrayBuffer, or Uint8Array.");
}

/**
 * Helper to wrap Uint8Array or ArrayBuffer in a Blob.
 */
export function toBlob(data: Uint8Array | ArrayBuffer, mimeType: string): Blob {
  return new Blob([data as any], { type: mimeType });
}

/**
 * Calculates saved bytes and percentage between original and new size.
 */
export function calculateSavings(
  originalSize: number,
  newSize: number
): { savedBytes: number; savedPercentage: number; isReduced: boolean } {
  const diff = originalSize - newSize;
  const percentage = originalSize > 0 ? Math.round((diff / originalSize) * 100) : 0;
  return {
    savedBytes: Math.max(0, diff),
    savedPercentage: Math.max(0, percentage),
    isReduced: diff > 0,
  };
}

