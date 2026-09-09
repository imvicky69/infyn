/**
 * Infyn — Client-Side Vectorizer Core Engine
 * Dual-Engine: Potrace (Monochrome / Logo) + ImageTracer.js (Multi-Color)
 * 100% In-Browser · Zero Cloud Uploads
 */

import {
  traceImageData,
  calculateAutoThreshold,
  getSVG,
  type PotraceOptions,
} from "@cadit-app/potrace-ts";
import ImageTracer, { type ImageTracerOptions } from "imagetracerjs";

export type VectorizerEngine = "potrace" | "imagetracer";
export type VectorizerMode = "auto" | "potrace" | "imagetracer";

export interface PotraceSettings {
  threshold: number; // -1 for Otsu Auto, or 0-255
  invert: boolean;
  turdsize: number; // Speckle suppression (0-100, default: 2)
  optcurve: boolean; // Curve optimization (default: true)
  alphamax: number; // Corner threshold (default: 1)
  opttolerance: number; // Curve tolerance (default: 0.2)
  fillColor: string; // CSS color string, default "#111111"
}

export interface ColorSettings {
  numberOfColors: number; // 2 to 64 (default: 16)
  preset: "default" | "posterized1" | "posterized2" | "detailed" | "smoothed" | "curvy";
  blurRadius: number; // 0 to 5 (default: 0)
  pathOmit: number; // Suppress small paths (default: 8)
  ltres: number; // Line threshold
  qtres: number; // Quadratic spline threshold
}

export interface VectorizeOptions {
  mode?: VectorizerMode;
  potraceSettings?: Partial<PotraceSettings>;
  colorSettings?: Partial<ColorSettings>;
}

export interface ImageComplexity {
  isMonochrome: boolean;
  detectedMode: VectorizerEngine;
  saturationAvg: number;
  distinctColors: number;
  hasAlpha: boolean;
  reason: string;
}

export interface VectorizeResult {
  svgString: string;
  modeUsed: VectorizerEngine;
  pathCount: number;
  timeMs: number;
  width: number;
  height: number;
  svgBytes: number;
  originalBytes: number;
}

export const DEFAULT_POTRACE_SETTINGS: PotraceSettings = {
  threshold: -1, // Otsu auto
  invert: false,
  turdsize: 2,
  optcurve: true,
  alphamax: 1,
  opttolerance: 0.2,
  fillColor: "#111111",
};

export const DEFAULT_COLOR_SETTINGS: ColorSettings = {
  numberOfColors: 16,
  preset: "detailed",
  blurRadius: 0,
  pathOmit: 8,
  ltres: 1,
  qtres: 1,
};

/**
 * Fast pixel analysis to determine if the image is monochrome/logo or colored
 */
export function detectImageComplexity(imageData: ImageData): ImageComplexity {
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  // Sample ~5,000 pixels across the image
  const step = Math.max(1, Math.floor(totalPixels / 5000));
  let chromaticPixelCount = 0;
  let opaquePixelCount = 0;
  let totalSaturation = 0;
  let hasAlpha = false;
  const colorBuckets = new Set<string>();

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Transparent pixel
    if (a < 20) {
      hasAlpha = true;
      continue;
    }

    if (a < 250) {
      hasAlpha = true;
    }

    // Ignore white / near-white background pixels so background canvas doesn't dilute content
    const isNearWhite = r > 245 && g > 245 && b > 245;
    if (isNearWhite) {
      continue;
    }

    opaquePixelCount++;

    // Saturation = max(r,g,b) - min(r,g,b)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const delta = maxVal - minVal;

    // Delta > 20 indicates chromatic color (e.g. orange, blue, green, red, purple)
    if (delta > 20) {
      chromaticPixelCount++;
      totalSaturation += delta;
      // Quantize to 4-bit color buckets
      const bucket = `${r >> 4},${g >> 4},${b >> 4}`;
      colorBuckets.add(bucket);
    }
  }

  // Ratio of artwork content pixels that have distinct color
  const chromaticRatio = opaquePixelCount > 0 ? chromaticPixelCount / opaquePixelCount : 0;
  const avgChromaticSat = chromaticPixelCount > 0 ? totalSaturation / chromaticPixelCount : 0;

  // An image is monochrome if chromatic content pixels are under 1.5% and fewer than 2 color tones
  const isMonochrome = chromaticRatio < 0.015 && colorBuckets.size <= 1;
  const detectedMode: VectorizerEngine = isMonochrome ? "potrace" : "imagetracer";

  const reason = isMonochrome
    ? `Monochrome/grayscale detected (${(chromaticRatio * 100).toFixed(2)}% color variance)`
    : `Color graphic detected (${colorBuckets.size} color tones, ${(chromaticRatio * 100).toFixed(1)}% color coverage)`;

  return {
    isMonochrome,
    detectedMode,
    saturationAvg: avgChromaticSat,
    distinctColors: colorBuckets.size,
    hasAlpha,
    reason,
  };
}

/**
 * Trace monochrome/logo using Potrace
 */
export function traceMonochrome(
  imageData: ImageData,
  settings: Partial<PotraceSettings> = {}
): string {
  const mergedSettings: PotraceSettings = {
    ...DEFAULT_POTRACE_SETTINGS,
    ...settings,
  };

  const { width, height } = imageData;

  // Calculate threshold: Otsu if -1, else manual
  let threshold = mergedSettings.threshold;
  if (threshold === -1) {
    threshold = calculateAutoThreshold(imageData);
  }

  const potraceOptions: Partial<PotraceOptions> = {
    turdsize: mergedSettings.turdsize,
    optcurve: mergedSettings.optcurve,
    alphamax: mergedSettings.alphamax,
    opttolerance: mergedSettings.opttolerance,
  };

  // When invert is true, trace white pixels; else dark pixels
  // In @cadit-app/potrace-ts, traceImageData uses threshold
  // We handle invert by inverting pixel luminance if needed
  let effectiveImageData = imageData;
  if (mergedSettings.invert) {
    const invertedData = new Uint8ClampedArray(imageData.data.length);
    for (let i = 0; i < imageData.data.length; i += 4) {
      invertedData[i] = 255 - imageData.data[i];
      invertedData[i + 1] = 255 - imageData.data[i + 1];
      invertedData[i + 2] = 255 - imageData.data[i + 2];
      invertedData[i + 3] = imageData.data[i + 3];
    }
    effectiveImageData = new ImageData(invertedData, width, height);
  }

  const paths = traceImageData(effectiveImageData, potraceOptions, threshold);
  const rawSvg = getSVG(paths, 1);

  // Post-process SVG: ensure clean viewBox, responsive sizing, and custom fill
  return sanitizeAndStylePotraceSvg(rawSvg, width, height, mergedSettings.fillColor);
}

/**
 * Trace multi-color graphics using ImageTracer.js
 */
export function traceColor(
  imageData: ImageData,
  settings: Partial<ColorSettings> = {}
): string {
  const mergedSettings: ColorSettings = {
    ...DEFAULT_COLOR_SETTINGS,
    ...settings,
  };

  const tracerOptions: ImageTracerOptions = {
    numberofcolors: mergedSettings.numberOfColors,
    pathomit: mergedSettings.pathOmit,
    blurradius: mergedSettings.blurRadius,
    ltres: mergedSettings.ltres,
    qtres: mergedSettings.qtres,
    viewbox: true,
    desc: false,
    linefilter: true,
  };

  const rawSvg = ImageTracer.imagedataToSVG(imageData, tracerOptions);
  return sanitizeImageTracerSvg(rawSvg, imageData.width, imageData.height);
}

/**
 * Main dispatcher: vectorize an image with auto-selection or explicit engine
 */
export async function vectorizeImage(
  imageData: ImageData,
  options: VectorizeOptions = {},
  originalFileSize = 0
): Promise<VectorizeResult> {
  const startTime = performance.now();
  const complexity = detectImageComplexity(imageData);

  const selectedMode: VectorizerEngine =
    options.mode === "auto" || !options.mode
      ? complexity.detectedMode
      : options.mode;

  let svgString = "";
  if (selectedMode === "potrace") {
    svgString = traceMonochrome(imageData, options.potraceSettings);
  } else {
    svgString = traceColor(imageData, options.colorSettings);
  }

  const endTime = performance.now();
  const timeMs = Math.round(endTime - startTime);

  // Count number of <path> elements
  const pathMatches = svgString.match(/<path/g);
  const pathCount = pathMatches ? pathMatches.length : 0;
  const svgBytes = new TextEncoder().encode(svgString).length;

  return {
    svgString,
    modeUsed: selectedMode,
    pathCount,
    timeMs,
    width: imageData.width,
    height: imageData.height,
    svgBytes,
    originalBytes: originalFileSize || svgBytes,
  };
}

/**
 * Loads a File into standard ImageData and returns dimensions
 */
export async function fileToImageData(
  file: File,
  maxDimension = 2048
): Promise<{ imageData: ImageData; width: number; height: number; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      // Downscale if exceeds maxDimension to avoid main thread freeze
      if (w > maxDimension || h > maxDimension) {
        const ratio = Math.min(maxDimension / w, maxDimension / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to create canvas 2D context"));
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      resolve({
        imageData,
        width: w,
        height: h,
        previewUrl: objectUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image file: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Sanitizes Potrace SVG output: applies proper viewBox, responsive scale, and custom fill
 */
function sanitizeAndStylePotraceSvg(
  svg: string,
  width: number,
  height: number,
  fillColor = "#111111"
): string {
  // Replace the opening <svg ...> tag with well-formed viewBox matching original image dimensions
  let result = svg.replace(
    /<svg[^>]*>/i,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet">`
  );

  // Apply custom fill color if not standard black
  if (fillColor && fillColor.toLowerCase() !== "#000000" && fillColor.toLowerCase() !== "black") {
    result = result.replace(/fill="[^"]*"/gi, `fill="${fillColor}"`);
  }

  return result;
}

/**
 * Sanitizes ImageTracer SVG output: ensures viewBox and responsive sizing
 */
function sanitizeImageTracerSvg(svg: string, width: number, height: number): string {
  let result = svg;
  if (!result.includes("viewBox")) {
    result = result.replace(
      /<svg([^>]*)>/i,
      `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" $1>`
    );
  } else {
    // Ensure width and height match
    result = result.replace(
      /<svg([^>]*)>/i,
      `<svg width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" $1>`
    );
  }
  return result;
}
