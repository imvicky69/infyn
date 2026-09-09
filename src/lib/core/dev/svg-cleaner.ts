import { optimize } from "svgo/browser";
import type { Config, PluginConfig } from "svgo";

export type SvgCleanerPreset = "recommended" | "aggressive" | "safe" | "custom";

export interface SvgCleanerOptions {
  preset: SvgCleanerPreset;
  precision: number;
  multipass: boolean;
  outputFormat: "minified" | "pretty";
  // Granular settings (active in custom or overridden)
  removeMetadata: boolean;
  removeComments: boolean;
  removeEditorData: boolean;
  cleanupIds: boolean;
  removeUnusedDefs: boolean;
  convertColors: boolean;
  removeTitleDesc: boolean;
  collapseGroups: boolean;
  cleanupNumericValues: boolean;
}

export interface SvgCleanResult {
  cleanedSvg: string;
  originalBytes: number;
  cleanedBytes: number;
  savedBytes: number;
  percentSaved: number;
  timeMs: number;
  reactSnippet: string;
  dataUri: string;
  removedElementsSummary: string[];
}

export const DEFAULT_CLEANER_OPTIONS: SvgCleanerOptions = {
  preset: "recommended",
  precision: 2,
  multipass: true,
  outputFormat: "minified",
  removeMetadata: true,
  removeComments: true,
  removeEditorData: true,
  cleanupIds: true,
  removeUnusedDefs: true,
  convertColors: true,
  removeTitleDesc: false,
  collapseGroups: true,
  cleanupNumericValues: true,
};

export const PRESET_OPTIONS: Record<Exclude<SvgCleanerPreset, "custom">, Partial<SvgCleanerOptions>> = {
  recommended: {
    precision: 2,
    multipass: true,
    removeMetadata: true,
    removeComments: true,
    removeEditorData: true,
    cleanupIds: true,
    removeUnusedDefs: true,
    convertColors: true,
    removeTitleDesc: false,
    collapseGroups: true,
    cleanupNumericValues: true,
  },
  aggressive: {
    precision: 1,
    multipass: true,
    removeMetadata: true,
    removeComments: true,
    removeEditorData: true,
    cleanupIds: true,
    removeUnusedDefs: true,
    convertColors: true,
    removeTitleDesc: true,
    collapseGroups: true,
    cleanupNumericValues: true,
  },
  safe: {
    precision: 3,
    multipass: false,
    removeMetadata: true,
    removeComments: true,
    removeEditorData: true,
    cleanupIds: false,
    removeUnusedDefs: false,
    convertColors: false,
    removeTitleDesc: false,
    collapseGroups: false,
    cleanupNumericValues: false,
  },
};

/**
 * Strips potentially malicious scripts and handlers from SVG
 */
export function sanitizeSvgSecurity(svg: string): string {
  let clean = svg;
  // Remove <script> elements
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove on* event handlers (e.g. onload, onclick)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Remove javascript: pseudo protocol in href/xlink:href
  clean = clean.replace(/(xlink:href|href)\s*=\s*["']\s*javascript:[^"']*["']/gi, "");
  return clean;
}

/**
 * Builds the SVGO plugin configuration based on user settings
 */
function buildSvgoPlugins(options: SvgCleanerOptions): PluginConfig[] {
  const overrides: Record<string, boolean | object> = {
    removeComments: options.removeComments,
    removeMetadata: options.removeMetadata,
    removeEditorsNSData: options.removeEditorData,
    cleanupIds: options.cleanupIds,
    removeUselessDefs: options.removeUnusedDefs,
    convertColors: options.convertColors,
    removeTitle: options.removeTitleDesc,
    removeDesc: options.removeTitleDesc,
    collapseGroups: options.collapseGroups,
    cleanupNumericValues: options.cleanupNumericValues
      ? { floatPrecision: options.precision }
      : false,
    convertPathData: {
      floatPrecision: options.precision,
    },
    convertTransform: {
      floatPrecision: options.precision,
    },
  };

  return [
    {
      name: "preset-default",
      params: {
        overrides,
      },
    },
  ];
}

/**
 * Converts optimized SVG string to a React/JSX component
 */
export function svgToReactComponent(svg: string, componentName = "Icon"): string {
  // Convert standard SVG hyphenated attributes to React camelCase
  const attributeReplacements: Array<[RegExp, string]> = [
    [/accent-height=/gi, "accentHeight="],
    [/alignment-baseline=/gi, "alignmentBaseline="],
    [/arabic-form=/gi, "arabicForm="],
    [/baseline-shift=/gi, "baselineShift="],
    [/cap-height=/gi, "capHeight="],
    [/clip-path=/gi, "clipPath="],
    [/clip-rule=/gi, "clipRule="],
    [/color-interpolation=/gi, "colorInterpolation="],
    [/color-interpolation-filters=/gi, "colorInterpolationFilters="],
    [/color-profile=/gi, "colorProfile="],
    [/color-rendering=/gi, "colorRendering="],
    [/dominant-baseline=/gi, "dominantBaseline="],
    [/enable-background=/gi, "enableBackground="],
    [/fill-opacity=/gi, "fillOpacity="],
    [/fill-rule=/gi, "fillRule="],
    [/flood-color=/gi, "floodColor="],
    [/flood-opacity=/gi, "floodOpacity="],
    [/font-family=/gi, "fontFamily="],
    [/font-size=/gi, "fontSize="],
    [/font-size-adjust=/gi, "fontSizeAdjust="],
    [/font-stretch=/gi, "fontStretch="],
    [/font-style=/gi, "fontStyle="],
    [/font-variant=/gi, "fontVariant="],
    [/font-weight=/gi, "fontWeight="],
    [/glyph-name=/gi, "glyphName="],
    [/glyph-orientation-horizontal=/gi, "glyphOrientationHorizontal="],
    [/glyph-orientation-vertical=/gi, "glyphOrientationVertical="],
    [/horiz-adv-x=/gi, "horizAdvX="],
    [/horiz-origin-x=/gi, "horizOriginX="],
    [/image-rendering=/gi, "imageRendering="],
    [/letter-spacing=/gi, "letterSpacing="],
    [/lighting-color=/gi, "lightingColor="],
    [/marker-end=/gi, "markerEnd="],
    [/marker-mid=/gi, "markerMid="],
    [/marker-start=/gi, "markerStart="],
    [/overline-position=/gi, "overlinePosition="],
    [/overline-thickness=/gi, "overlineThickness="],
    [/paint-order=/gi, "paintOrder="],
    [/panose-1=/gi, "panose1="],
    [/pointer-events=/gi, "pointerEvents="],
    [/rendering-intent=/gi, "renderingIntent="],
    [/shape-rendering=/gi, "shapeRendering="],
    [/stop-color=/gi, "stopColor="],
    [/stop-opacity=/gi, "stopOpacity="],
    [/strikethrough-position=/gi, "strikethroughPosition="],
    [/strikethrough-thickness=/gi, "strikethroughThickness="],
    [/stroke-dasharray=/gi, "strokeDasharray="],
    [/stroke-dashoffset=/gi, "strokeDashoffset="],
    [/stroke-linecap=/gi, "strokeLinecap="],
    [/stroke-linejoin=/gi, "strokeLinejoin="],
    [/stroke-miterlimit=/gi, "strokeMiterlimit="],
    [/stroke-opacity=/gi, "strokeOpacity="],
    [/stroke-width=/gi, "strokeWidth="],
    [/text-anchor=/gi, "textAnchor="],
    [/text-decoration=/gi, "textDecoration="],
    [/text-rendering=/gi, "textRendering="],
    [/underline-position=/gi, "underlinePosition="],
    [/underline-thickness=/gi, "underlineThickness="],
    [/unicode-bidi=/gi, "unicodeBidi="],
    [/unicode-range=/gi, "unicodeRange="],
    [/units-per-em=/gi, "unitsPerEm="],
    [/v-alphabetic=/gi, "vAlphabetic="],
    [/v-hanging=/gi, "vHanging="],
    [/v-ideographic=/gi, "vIdeographic="],
    [/v-mathematical=/gi, "vMathematical="],
    [/vector-effect=/gi, "vectorEffect="],
    [/vert-adv-y=/gi, "vertAdvY="],
    [/vert-origin-x=/gi, "vertOriginX="],
    [/vert-origin-y=/gi, "vertOriginY="],
    [/word-spacing=/gi, "wordSpacing="],
    [/writing-mode=/gi, "writingMode="],
    [/xlink:href=/gi, "xlinkHref="],
    [/xmlns:xlink=/gi, "xmlnsXlink="],
    [/class=/gi, "className="],
  ];

  let jsxSvg = svg;
  for (const [pattern, replacement] of attributeReplacements) {
    jsxSvg = jsxSvg.replace(pattern, replacement);
  }

  // Add {...props} spreading to root <svg>
  jsxSvg = jsxSvg.replace(/<svg\b([^>]*)>/i, "<svg $1 {...props}>");

  return `import React from "react";

export function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${jsxSvg}
  );
}

export default ${componentName};`;
}

/**
 * Creates a CSS data URI from SVG string
 */
export function svgToCssDataUri(svg: string): string {
  // Minify whitespace inside SVG
  const singleLine = svg
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();

  // URL-encode special characters
  const encoded = encodeURIComponent(singleLine)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/")
    .replace(/%22/g, "'");

  return `url("data:image/svg+xml,${encoded}")`;
}

/**
 * Core SVG cleaning and optimization function
 */
export function cleanSvg(
  rawSvg: string,
  userOptions: Partial<SvgCleanerOptions> = {}
): SvgCleanResult {
  const startTime = performance.now();

  const options: SvgCleanerOptions = {
    ...DEFAULT_CLEANER_OPTIONS,
    ...(userOptions.preset && userOptions.preset !== "custom"
      ? PRESET_OPTIONS[userOptions.preset]
      : {}),
    ...userOptions,
  };

  const safeInput = sanitizeSvgSecurity(rawSvg);
  const originalBytes = new TextEncoder().encode(safeInput).length;

  // Track what was removed
  const removedElementsSummary: string[] = [];
  if (/<metadata[\s>]/i.test(safeInput) && options.removeMetadata) {
    removedElementsSummary.push("XML metadata");
  }
  if (/<!--[\s\S]*?-->/.test(safeInput) && options.removeComments) {
    removedElementsSummary.push("Comments");
  }
  if (/xmlns:(sketch|inkscape|sodipodi|illustrator|adobe|i)[\s=]/i.test(safeInput) && options.removeEditorData) {
    removedElementsSummary.push("Editor namespaces (Figma/Sketch/Illustrator)");
  }
  if (/<(title|desc)[\s>]/i.test(safeInput) && options.removeTitleDesc) {
    removedElementsSummary.push("<title> and <desc> tags");
  }
  if (/<defs[\s>]/i.test(safeInput) && options.removeUnusedDefs) {
    removedElementsSummary.push("Unused <defs>");
  }

  const svgoConfig: Config = {
    multipass: options.multipass,
    js2svg: {
      indent: options.outputFormat === "pretty" ? 2 : 0,
      pretty: options.outputFormat === "pretty",
    },
    plugins: buildSvgoPlugins(options),
  };

  const svgoResult = optimize(safeInput, svgoConfig);
  let cleanedSvg = svgoResult.data;

  // Final sanity check
  cleanedSvg = sanitizeSvgSecurity(cleanedSvg);

  const cleanedBytes = new TextEncoder().encode(cleanedSvg).length;
  const savedBytes = Math.max(0, originalBytes - cleanedBytes);
  const percentSaved = originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0;
  const endTime = performance.now();
  const timeMs = Math.round(endTime - startTime);

  const reactSnippet = svgToReactComponent(cleanedSvg, "OptimizedIcon");
  const dataUri = svgToCssDataUri(cleanedSvg);

  return {
    cleanedSvg,
    originalBytes,
    cleanedBytes,
    savedBytes,
    percentSaved,
    timeMs,
    reactSnippet,
    dataUri,
    removedElementsSummary,
  };
}
