import { decryptPDF as cryptDecrypt } from "cryptpdf";
import { PDFDocument } from "pdf-lib";
import { BinaryInput } from "../types";
import { toUint8Array, toArrayBuffer } from "../utils";

/**
 * Checks whether a PDF document is password-protected or encrypted.
 *
 * @param file - Source PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @returns Promise resolving to true if the PDF is encrypted, false otherwise.
 *
 * @example
 * ```typescript
 * import { isPDFEncrypted } from 'infyn/pdf';
 *
 * const isProtected = await isPDFEncrypted(uploadedFile);
 * ```
 */
export async function isPDFEncrypted(file: BinaryInput): Promise<boolean> {
  try {
    const buffer = await toArrayBuffer(file);
    await PDFDocument.load(buffer, { ignoreEncryption: false });
    return false;
  } catch (err: any) {
    const msg = String(err?.message || "").toLowerCase();
    const name = String(err?.name || "");
    if (name === "PasswordException" || msg.includes("encrypted") || msg.includes("password")) {
      return true;
    }
    return false;
  }
}

/**
 * Decrypts a password-protected PDF document and removes password restrictions.
 *
 * @param file - Encrypted PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @param password - Password to unlock the document.
 * @returns Promise resolving to the decrypted PDF as a Uint8Array.
 *
 * @example
 * ```typescript
 * import { decryptPDF } from 'infyn/pdf';
 *
 * const unlockedBytes = await decryptPDF(encryptedPdfFile, "myPassword");
 * ```
 */
export async function decryptPDF(
  file: BinaryInput,
  password: string
): Promise<Uint8Array> {
  const bytes = await toUint8Array(file);
  const isProtected = await isPDFEncrypted(bytes);
  if (!isProtected) {
    // If PDF is already unencrypted, return bytes without error
    return bytes;
  }

  if (!password) {
    throw new Error("Password is required to decrypt the PDF.");
  }

  const decryptedData = await cryptDecrypt(bytes, password);

  return decryptedData instanceof Uint8Array ? decryptedData : new Uint8Array(decryptedData);
}
