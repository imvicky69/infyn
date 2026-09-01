import { encryptPDF as cryptEncrypt } from "cryptpdf";
import { BinaryInput } from "../types";
import { toUint8Array } from "../utils";

/**
 * Encrypts and password-protects a PDF document in-browser using standard AES-256 encryption.
 *
 * @param file - Source PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @param password - Password to secure the document.
 * @returns Promise resolving to the encrypted PDF as a Uint8Array.
 *
 * @example
 * ```typescript
 * import { encryptPDF } from 'infyn/pdf';
 *
 * const protectedPdfBytes = await encryptPDF(myPdfFile, "mySecretPassword123");
 * ```
 */
export async function encryptPDF(
  file: BinaryInput,
  password: string
): Promise<Uint8Array> {
  if (!password) {
    throw new Error("A password must be provided to encrypt the PDF.");
  }

  const bytes = await toUint8Array(file);
  const encryptedData = await cryptEncrypt(bytes, password);

  return encryptedData instanceof Uint8Array ? encryptedData : new Uint8Array(encryptedData);
}
