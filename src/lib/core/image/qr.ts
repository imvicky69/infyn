import QRCode from "qrcode";

export interface GenerateQRCodeOptions {
  /**
   * Output width/height in pixels. Defaults to 512.
   */
  width?: number;
  /**
   * Margin / quiet zone in pixels. Defaults to 4.
   */
  margin?: number;
  /**
   * Error correction level ('L' | 'M' | 'Q' | 'H'). Defaults to 'M'.
   */
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  /**
   * Dark module color hex string. Defaults to '#111111'.
   */
  colorDark?: string;
  /**
   * Light background color hex string. Defaults to '#FFFFFF' or transparent.
   */
  colorLight?: string;
  /**
   * Output format ('png' | 'svg' | 'dataUri'). Defaults to 'png'.
   */
  format?: "png" | "svg" | "dataUri";
}

/**
 * Generates a QR code in-memory without any remote servers.
 *
 * @param text - URL, string, or payload to encode in the QR code.
 * @param options - Customization options for dimensions, error correction, and colors.
 * @returns Promise resolving to a Uint8Array (for PNG), SVG string, or Data URL.
 *
 * @example
 * ```typescript
 * import { generateQRCode } from 'infyn/image';
 *
 * const pngBytes = await generateQRCode('https://infyn.software', { width: 1024 });
 * const blob = new Blob([pngBytes], { type: 'image/png' });
 * ```
 */
export async function generateQRCode(
  text: string,
  options?: GenerateQRCodeOptions
): Promise<Uint8Array | string> {
  if (!text || text.trim() === "") {
    throw new Error("Text or URL payload must be provided to generate QR code.");
  }

  const width = options?.width ?? 512;
  const margin = options?.margin ?? 4;
  const errorCorrectionLevel = options?.errorCorrectionLevel ?? "M";
  const colorDark = options?.colorDark ?? "#111111";
  const colorLight = options?.colorLight ?? "#FFFFFF";
  const format = options?.format ?? "png";

  const qrOptions: QRCode.QRCodeToStringOptions & QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel,
    margin,
    width,
    color: {
      dark: colorDark,
      light: colorLight,
    },
  };

  if (format === "svg") {
    return await QRCode.toString(text, { ...qrOptions, type: "svg" });
  }

  if (format === "dataUri") {
    return await QRCode.toDataURL(text, qrOptions);
  }

  // Default PNG buffer / Uint8Array
  const dataUri = await QRCode.toDataURL(text, qrOptions);
  const base64Data = dataUri.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
