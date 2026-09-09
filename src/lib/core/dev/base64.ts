/**
 * Base64 & Data URI Utility Engine
 * 
 * 100% Client-side conversion between files, raw base64, and production-ready
 * CSS, HTML, and TypeScript/JavaScript snippets.
 */

export interface EncodedAsset {
  id: string;
  name: string;
  originalSize: number;
  base64Size: number;
  overheadPercentage: number;
  mimeType: string;
  dataUri: string;
  rawBase64: string;
  previewUrl: string;
  isSvg: boolean;
  isFont: boolean;
  isImage: boolean;
  isAudio: boolean;
  isPdf: boolean;
  optimizedSvgDataUri?: string;
  snippets: AssetSnippets;
}

export interface AssetSnippets {
  dataUri: string;
  rawBase64: string;
  cssBackground: string;
  htmlImg?: string;
  cssFontFace?: string;
  svgUtf8?: string;
  jsExport: string;
  markdown: string;
}

/**
 * Encodes a File into Base64 and prepares all developer code snippets.
 */
export async function processFileToBase64(file: File): Promise<EncodedAsset> {
  const mimeType = file.type || guessMimeType(file.name);
  const dataUri = await readFileAsDataURL(file);
  const rawBase64 = dataUri.split(",")[1] || "";
  const base64Size = rawBase64.length;
  const overheadPercentage =
    file.size > 0 ? Math.round(((base64Size - file.size) / file.size) * 100) : 33;

  const isSvg = mimeType.includes("svg") || file.name.toLowerCase().endsWith(".svg");
  const isFont =
    mimeType.includes("font") ||
    /\.(woff2?|ttf|otf|eot)$/i.test(file.name);
  const isImage =
    mimeType.startsWith("image/") && !isSvg;
  const isAudio = mimeType.startsWith("audio/");
  const isPdf = mimeType.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");

  let optimizedSvgDataUri: string | undefined;
  if (isSvg) {
    try {
      const text = await readFileAsText(file);
      optimizedSvgDataUri = svgToUtf8DataUri(text);
    } catch {
      // Fallback to standard base64 if text reading fails
    }
  }

  const snippets = generateSnippets({
    name: file.name,
    mimeType,
    dataUri,
    rawBase64,
    isSvg,
    isFont,
    optimizedSvgDataUri,
  });

  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    originalSize: file.size,
    base64Size,
    overheadPercentage,
    mimeType,
    dataUri,
    rawBase64,
    previewUrl: dataUri,
    isSvg,
    isFont,
    isImage,
    isAudio,
    isPdf,
    optimizedSvgDataUri,
    snippets,
  };
}

/**
 * Generates ready-to-paste snippets in various languages and frameworks.
 */
export function generateSnippets({
  name,
  mimeType,
  dataUri,
  rawBase64,
  isSvg,
  isFont,
  optimizedSvgDataUri,
}: {
  name: string;
  mimeType: string;
  dataUri: string;
  rawBase64: string;
  isSvg: boolean;
  isFont: boolean;
  optimizedSvgDataUri?: string;
}): AssetSnippets {
  const cleanVarName = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^(\d)/, "_$1");

  const isImage = mimeType.startsWith("image/") && !isSvg;

  // CSS background-image
  const cssBackground = `background-image: url("${dataUri}");`;

  // HTML img tag
  const htmlImg = `<img src="${dataUri}" alt="${name}" />`;

  // CSS @font-face (for fonts)
  let cssFontFace: string | undefined;
  if (isFont) {
    const fontFormat = getFontFormat(name);
    const fontName = name.replace(/\.[^/.]+$/, "");
    cssFontFace = `@font-face {\n  font-family: '${fontName}';\n  src: url('${dataUri}') format('${fontFormat}');\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}`;
  }

  // JS/TS export
  const jsExport = `export const ${cleanVarName}DataUri = "${dataUri}";`;

  // Markdown image
  const markdown = `![${name}](${dataUri})`;

  return {
    dataUri,
    rawBase64,
    cssBackground,
    htmlImg: isImage || isSvg ? htmlImg : undefined,
    cssFontFace,
    svgUtf8: optimizedSvgDataUri,
    jsExport,
    markdown,
  };
}

/**
 * Decodes a raw Base64 string or Data URI back into a downloadable Blob.
 */
export function decodeBase64ToBlob(input: string): {
  blob: Blob;
  mimeType: string;
  size: number;
  previewUrl: string;
} {
  const trimmed = input.trim();
  let mimeType = "application/octet-stream";
  let base64Data = trimmed;

  if (trimmed.startsWith("data:")) {
    const parts = trimmed.split(",");
    const match = parts[0].match(/data:(.*?);base64/);
    if (match && match[1]) {
      mimeType = match[1];
    }
    base64Data = parts[1] || "";
  }

  // Sanitize base64 string from whitespace or line breaks
  base64Data = base64Data.replace(/\s/g, "");

  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  const previewUrl = URL.createObjectURL(blob);

  return {
    blob,
    mimeType,
    size: bytes.byteLength,
    previewUrl,
  };
}

/**
 * Encodes SVG XML text into an optimized URL-encoded UTF-8 Data URI for CSS.
 * Typically 20-30% smaller than base64 encoding for SVG assets.
 */
export function svgToUtf8DataUri(svgContent: string): string {
  const cleaned = svgContent
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/> </g, "><")
    .trim();

  const encoded = encodeURIComponent(cleaned)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/")
    .replace(/%22/g, "'");

  return `data:image/svg+xml,${encoded}`;
}

/**
 * Guesses the MIME type from a file name extension when file.type is blank.
 */
export function guessMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    svg: "image/svg+xml",
    gif: "image/gif",
    avif: "image/avif",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    json: "application/json",
    txt: "text/plain",
  };
  return map[ext] || "application/octet-stream";
}

function getFontFormat(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "woff2":
      return "woff2";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    default:
      return "woff2";
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
