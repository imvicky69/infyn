/**
 * In-Browser Universal EXIF & Metadata Extraction and Stripping Engine
 * 100% Client-Side • Supports JPEG, PNG, WebP, HEIC, HEIF, TIFF, AVIF
 * Multi-Strategy WASM Decoders for Chrome, Edge, Safari, Firefox
 */

import { convertHeicToJpeg } from "@/components/image-tools/utils";

export interface ExifGpsData {
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
  mapsUrl?: string;
}

export interface ExifCameraData {
  make?: string;
  model?: string;
  software?: string;
  lensModel?: string;
}

export interface ExifExposureData {
  focalLength?: string;
  aperture?: string;
  iso?: number;
  exposureTime?: string;
  flash?: string;
}

export interface ExifTimeData {
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  dateTime?: string;
}

export interface ExifMetadataResult {
  hasMetadata: boolean;
  gps: ExifGpsData;
  camera: ExifCameraData;
  exposure: ExifExposureData;
  time: ExifTimeData;
  otherTagsCount: number;
  rawTags: Record<string, string | number>;
}

export interface CleanedImageResult {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  cleanedBlob: Blob;
  cleanedUrl: string;
  cleanedSize: number;
  outputFileName: string;
  width: number;
  height: number;
  metadata: ExifMetadataResult;
  isGpsRemoved: boolean;
  savedBytes: number;
}

// ─── Binary EXIF Parsing Helpers ──────────────────────────────────────────────

class BinaryReader {
  private view: DataView;
  private isLittleEndian: boolean = false;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  setEndian(little: boolean) {
    this.isLittleEndian = little;
  }

  getUint8(offset: number): number {
    if (offset >= this.view.byteLength) return 0;
    return this.view.getUint8(offset);
  }

  getUint16(offset: number): number {
    if (offset + 1 >= this.view.byteLength) return 0;
    return this.view.getUint16(offset, this.isLittleEndian);
  }

  getUint32(offset: number): number {
    if (offset + 3 >= this.view.byteLength) return 0;
    return this.view.getUint32(offset, this.isLittleEndian);
  }

  getString(offset: number, length: number): string {
    let str = "";
    const max = Math.min(offset + length, this.view.byteLength);
    for (let i = offset; i < max; i++) {
      const c = this.view.getUint8(i);
      if (c === 0) break; // null terminator
      str += String.fromCharCode(c);
    }
    return str.trim();
  }

  getRational(offset: number): number {
    const num = this.getUint32(offset);
    const den = this.getUint32(offset + 4);
    if (den === 0) return 0;
    return num / den;
  }
}

/**
 * Universal TIFF Header Finder (Handles JPEG APP1, HEIC/HEIF ISO-BMFF Exif items, WebP EXIF chunk, TIFF files)
 */
export function parseUniversalExif(buffer: ArrayBuffer): ExifMetadataResult {
  const result: ExifMetadataResult = {
    hasMetadata: false,
    gps: { hasGps: false },
    camera: {},
    exposure: {},
    time: {},
    otherTagsCount: 0,
    rawTags: {},
  };

  const bytes = new Uint8Array(buffer);
  const reader = new BinaryReader(buffer);
  const len = Math.min(bytes.length, 500000); // Scan first 500KB for metadata markers

  let tiffOffset: number | null = null;
  let isLittle = false;

  // Search for "Exif\0\0" pattern or direct TIFF header (II*\0 or MM\0*)
  for (let i = 0; i < len - 8; i++) {
    // "Exif\0\0" signature
    if (
      bytes[i] === 0x45 &&
      bytes[i + 1] === 0x78 &&
      bytes[i + 2] === 0x69 &&
      bytes[i + 3] === 0x66 &&
      bytes[i + 4] === 0x00 &&
      bytes[i + 5] === 0x00
    ) {
      const candidateTiff = i + 6;
      if (
        bytes[candidateTiff] === 0x49 &&
        bytes[candidateTiff + 1] === 0x49 &&
        bytes[candidateTiff + 2] === 0x2a &&
        bytes[candidateTiff + 3] === 0x00
      ) {
        tiffOffset = candidateTiff;
        isLittle = true;
        break;
      } else if (
        bytes[candidateTiff] === 0x4d &&
        bytes[candidateTiff + 1] === 0x4d &&
        bytes[candidateTiff + 2] === 0x00 &&
        bytes[candidateTiff + 3] === 0x2a
      ) {
        tiffOffset = candidateTiff;
        isLittle = false;
        break;
      }
    }

    // Direct TIFF header (TIFF, HEIF payload)
    if (
      bytes[i] === 0x49 &&
      bytes[i + 1] === 0x49 &&
      bytes[i + 2] === 0x2a &&
      bytes[i + 3] === 0x00
    ) {
      // Validate first IFD offset
      const firstIfd = (bytes[i + 7] << 24) | (bytes[i + 6] << 16) | (bytes[i + 5] << 8) | bytes[i + 4];
      if (firstIfd >= 8 && firstIfd < 100000) {
        tiffOffset = i;
        isLittle = true;
        break;
      }
    } else if (
      bytes[i] === 0x4d &&
      bytes[i + 1] === 0x4d &&
      bytes[i + 2] === 0x00 &&
      bytes[i + 3] === 0x2a
    ) {
      const firstIfd = (bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7];
      if (firstIfd >= 8 && firstIfd < 100000) {
        tiffOffset = i;
        isLittle = false;
        break;
      }
    }
  }

  if (tiffOffset !== null) {
    result.hasMetadata = true;
    reader.setEndian(isLittle);
    const firstIfdOffset = reader.getUint32(tiffOffset + 4);
    if (firstIfdOffset >= 8) {
      parseIfd(reader, tiffOffset, tiffOffset + firstIfdOffset, result);
    }
  }

  return result;
}

function parseIfd(
  reader: BinaryReader,
  tiffOffset: number,
  ifdOffset: number,
  result: ExifMetadataResult
) {
  const entriesCount = reader.getUint16(ifdOffset);
  if (entriesCount <= 0 || entriesCount > 500) return;

  let exifSubIfdOffset: number | null = null;
  let gpsSubIfdOffset: number | null = null;

  for (let i = 0; i < entriesCount; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    const tag = reader.getUint16(entryOffset);
    const type = reader.getUint16(entryOffset + 2);
    const count = reader.getUint32(entryOffset + 4);
    const valueOffset =
      count * getTypeSize(type) > 4
        ? tiffOffset + reader.getUint32(entryOffset + 8)
        : entryOffset + 8;

    switch (tag) {
      case 0x010f: // Make
        result.camera.make = reader.getString(valueOffset, count);
        result.rawTags["Camera Make"] = result.camera.make;
        break;
      case 0x0110: // Model
        result.camera.model = reader.getString(valueOffset, count);
        result.rawTags["Camera Model"] = result.camera.model;
        break;
      case 0x0131: // Software
        result.camera.software = reader.getString(valueOffset, count);
        result.rawTags["Software"] = result.camera.software;
        break;
      case 0x0132: // DateTime
        result.time.dateTime = reader.getString(valueOffset, count);
        result.rawTags["Date/Time"] = result.time.dateTime;
        break;
      case 0x8769: // Exif SubIFD Pointer
        exifSubIfdOffset = tiffOffset + reader.getUint32(entryOffset + 8);
        break;
      case 0x8825: // GPS SubIFD Pointer
        gpsSubIfdOffset = tiffOffset + reader.getUint32(entryOffset + 8);
        break;
      default:
        result.otherTagsCount++;
    }
  }

  // Parse Exif SubIFD (Exposure, Lens, Timestamps)
  if (exifSubIfdOffset) {
    parseExifSubIfd(reader, tiffOffset, exifSubIfdOffset, result);
  }

  // Parse GPS SubIFD (Location coordinates)
  if (gpsSubIfdOffset) {
    parseGpsSubIfd(reader, tiffOffset, gpsSubIfdOffset, result);
  }
}

function parseExifSubIfd(
  reader: BinaryReader,
  tiffOffset: number,
  subIfdOffset: number,
  result: ExifMetadataResult
) {
  const entriesCount = reader.getUint16(subIfdOffset);
  if (entriesCount <= 0 || entriesCount > 500) return;

  for (let i = 0; i < entriesCount; i++) {
    const entryOffset = subIfdOffset + 2 + i * 12;
    const tag = reader.getUint16(entryOffset);
    const type = reader.getUint16(entryOffset + 2);
    const count = reader.getUint32(entryOffset + 4);
    const valueOffset =
      count * getTypeSize(type) > 4
        ? tiffOffset + reader.getUint32(entryOffset + 8)
        : entryOffset + 8;

    switch (tag) {
      case 0x9003: // DateTimeOriginal
        result.time.dateTimeOriginal = reader.getString(valueOffset, count);
        result.rawTags["Capture Time"] = result.time.dateTimeOriginal;
        break;
      case 0x829a: // ExposureTime
        const exp = reader.getRational(valueOffset);
        if (exp > 0 && exp < 1) {
          result.exposure.exposureTime = `1/${Math.round(1 / exp)}s`;
        } else if (exp >= 1) {
          result.exposure.exposureTime = `${exp.toFixed(1)}s`;
        }
        result.rawTags["Exposure Time"] = result.exposure.exposureTime || "";
        break;
      case 0x829d: // FNumber
        const fnum = reader.getRational(valueOffset);
        if (fnum > 0) result.exposure.aperture = `f/${fnum.toFixed(1)}`;
        result.rawTags["Aperture"] = result.exposure.aperture || "";
        break;
      case 0x8827: // ISO
        result.exposure.iso = reader.getUint16(valueOffset);
        result.rawTags["ISO"] = result.exposure.iso;
        break;
      case 0x920a: // FocalLength
        const focal = reader.getRational(valueOffset);
        if (focal > 0) result.exposure.focalLength = `${Math.round(focal)}mm`;
        result.rawTags["Focal Length"] = result.exposure.focalLength || "";
        break;
      case 0xa434: // LensModel
        result.camera.lensModel = reader.getString(valueOffset, count);
        result.rawTags["Lens Model"] = result.camera.lensModel;
        break;
      default:
        result.otherTagsCount++;
    }
  }
}

function parseGpsSubIfd(
  reader: BinaryReader,
  tiffOffset: number,
  gpsOffset: number,
  result: ExifMetadataResult
) {
  const entriesCount = reader.getUint16(gpsOffset);
  if (entriesCount <= 0 || entriesCount > 200) return;

  let latRef = "N";
  let lonRef = "E";
  let latDeg = 0,
    latMin = 0,
    latSec = 0;
  let lonDeg = 0,
    lonMin = 0,
    lonSec = 0;
  let hasLat = false;
  let hasLon = false;

  for (let i = 0; i < entriesCount; i++) {
    const entryOffset = gpsOffset + 2 + i * 12;
    const tag = reader.getUint16(entryOffset);
    const type = reader.getUint16(entryOffset + 2);
    const count = reader.getUint32(entryOffset + 4);
    const valueOffset =
      count * getTypeSize(type) > 4
        ? tiffOffset + reader.getUint32(entryOffset + 8)
        : entryOffset + 8;

    switch (tag) {
      case 0x0001: // GPSLatitudeRef
        latRef = reader.getString(valueOffset, 2) || "N";
        break;
      case 0x0002: // GPSLatitude
        latDeg = reader.getRational(valueOffset);
        latMin = reader.getRational(valueOffset + 8);
        latSec = reader.getRational(valueOffset + 16);
        hasLat = true;
        break;
      case 0x0003: // GPSLongitudeRef
        lonRef = reader.getString(valueOffset, 2) || "E";
        break;
      case 0x0004: // GPSLongitude
        lonDeg = reader.getRational(valueOffset);
        lonMin = reader.getRational(valueOffset + 8);
        lonSec = reader.getRational(valueOffset + 16);
        hasLon = true;
        break;
      case 0x0006: // GPSAltitude
        const alt = reader.getRational(valueOffset);
        if (alt > 0) result.gps.altitude = Math.round(alt);
        break;
    }
  }

  if (hasLat && hasLon) {
    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latRef === "S") lat = -lat;

    let lon = lonDeg + lonMin / 60 + lonSec / 3600;
    if (lonRef === "W") lon = -lon;

    result.gps.hasGps = true;
    result.gps.latitude = Number(lat.toFixed(6));
    result.gps.longitude = Number(lon.toFixed(6));
    result.gps.latitudeRef = latRef;
    result.gps.longitudeRef = lonRef;
    result.gps.mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    result.rawTags["GPS Coordinates"] = `${result.gps.latitude}, ${result.gps.longitude}`;
  }
}

function getTypeSize(type: number): number {
  switch (type) {
    case 1:
    case 2:
    case 7:
      return 1; // BYTE, ASCII, UNDEFINED
    case 3:
      return 2; // SHORT
    case 4:
    case 9:
      return 4; // LONG, SLONG
    case 5:
    case 10:
      return 8; // RATIONAL, SRATIONAL
    default:
      return 1;
  }
}

// ─── Lossless Binary JPEG Metadata Stripper ──────────────────────────────────

export function stripJpegMetadataLossless(buffer: ArrayBuffer): Blob {
  const data = new Uint8Array(buffer);
  if (data[0] !== 0xff || data[1] !== 0xd8) {
    return new Blob([buffer], { type: "image/jpeg" });
  }

  const chunks: Uint8Array[] = [];
  chunks.push(new Uint8Array([0xff, 0xd8])); // SOI marker

  let offset = 2;
  const length = data.length;

  while (offset < length) {
    if (data[offset] !== 0xff) {
      chunks.push(data.slice(offset));
      break;
    }

    const marker = data[offset + 1];

    if (marker === 0xda) {
      chunks.push(data.slice(offset));
      break;
    }

    if (marker === 0xd9) {
      chunks.push(new Uint8Array([0xff, 0xd9]));
      break;
    }

    if (marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      chunks.push(data.slice(offset, offset + 2));
      offset += 2;
      continue;
    }

    const segmentLength = (data[offset + 2] << 8) | data[offset + 3];
    const totalSegmentLength = 2 + segmentLength;

    const isMetadataMarker =
      marker === 0xe1 ||
      marker === 0xe2 ||
      marker === 0xed ||
      marker === 0xee ||
      marker === 0xfe;

    if (!isMetadataMarker) {
      chunks.push(data.slice(offset, offset + totalSegmentLength));
    }

    offset += totalSegmentLength;
  }

  return new Blob(chunks as BlobPart[], { type: "image/jpeg" });
}

// ─── Universal Canvas Re-rasterization Fallback ───────────────────────────────

export async function stripMetadataViaCanvas(
  file: File,
  targetType: string = "image/jpeg"
): Promise<{ blob: Blob; width: number; height: number }> {
  let workingFile = file;

  // If file is HEIC or HEIF, decode it via WASM first!
  const isHeif =
    /\.hei[cf]$/i.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.type === "image/heic-sequence" ||
    file.type === "image/heif-sequence";

  if (isHeif) {
    try {
      workingFile = await convertHeicToJpeg(file);
    } catch (err) {
      console.warn("WASM HEIF conversion failed, trying direct canvas decode", err);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(workingFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context initialization failed"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const mime =
        workingFile.type === "image/png"
          ? "image/png"
          : workingFile.type === "image/webp"
          ? "image/webp"
          : targetType;

      const quality = mime === "image/jpeg" || mime === "image/webp" ? 0.95 : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width: img.naturalWidth, height: img.naturalHeight });
          } else {
            reject(new Error("Canvas blob conversion failed"));
          }
        },
        mime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image into canvas"));
    };

    img.src = url;
  });
}

// ─── Main Single Image Metadata Inspector & Stripper ─────────────────────────

export async function processFileMetadata(file: File): Promise<CleanedImageResult> {
  const buffer = await file.arrayBuffer();
  
  // Extract metadata across JPEG, HEIC, HEIF, TIFF, WebP
  const metadata = parseUniversalExif(buffer);

  const isHeif =
    /\.hei[cf]$/i.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.type === "image/heic-sequence" ||
    file.type === "image/heif-sequence";

  const isJpeg = (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) && !isHeif;

  let cleanedBlob: Blob;
  let width = 0;
  let height = 0;

  if (isJpeg) {
    cleanedBlob = stripJpegMetadataLossless(buffer);
    const dims = await new Promise<{ width: number; height: number }>((res) => {
      const img = new Image();
      const u = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(u);
        res({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(u);
        res({ width: 0, height: 0 });
      };
      img.src = u;
    });
    width = dims.width;
    height = dims.height;
  } else {
    // For HEIC, HEIF, PNG, WebP, AVIF, TIFF
    const canvasRes = await stripMetadataViaCanvas(file);
    cleanedBlob = canvasRes.blob;
    width = canvasRes.width;
    height = canvasRes.height;
  }

  const cleanedUrl = URL.createObjectURL(cleanedBlob);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const ext =
    file.type === "image/png"
      ? ".png"
      : file.type === "image/webp"
      ? ".webp"
      : isHeif
      ? ".jpg"
      : ".jpg";

  const outputFileName = `${baseName}-cleaned${ext}`;

  return {
    id: `exif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    cleanedBlob,
    cleanedUrl,
    cleanedSize: cleanedBlob.size,
    outputFileName,
    width,
    height,
    metadata,
    isGpsRemoved: metadata.gps.hasGps,
    savedBytes: Math.max(0, file.size - cleanedBlob.size),
  };
}
