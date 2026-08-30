# Infyn — Agent Guidelines & Tool Development Standard

Welcome to **Infyn**. This document defines the engineering standards, design system rules, architectural patterns, and step-by-step procedures for building and scaling tools across the Infyn platform.

---

## 🏛️ 1. Core Philosophy & Non-Negotiable Rules

Every tool built on Infyn **must** adhere to these four core pillars:

1. **100% Client-Side Execution (Zero Cloud Uploads)**:
   - **All processing runs locally in the user's browser** via WebAssembly (WASM), Web Workers, WebGPU, Canvas API, or client libraries.
   - User files **must never be uploaded** to remote servers, external APIs, or storage buckets.
2. **100% Free & Ad-Free**:
   - No subscriptions, no paywalls, no credit cards, and **no watermarks** on exported assets.
   - No intrusive banner ads, popups, or tracking cookies.
3. **Batch-First Capability**:
   - Tools that accept files should support **batch uploads** (e.g., 50+ files at once) and offer **1-Click "Download All (ZIP)"** export using `jszip`.
4. **Performance & Main-Thread Protection**:
   - Heavy compute (AI model inference, heavy image decodes) **must** run inside a **Web Worker** (`worker.ts`) or asynchronous chunked streams to keep the UI smooth and responsive (60fps).

---

## 🎨 2. Design System & Aesthetic Standards

Infyn uses a curated, minimal **Cream & Ink** aesthetic:

| Element | Color / Token | Usage |
|---|---|---|
| **Background** | `#FBFBFA` | Default page background |
| **Cards & Panels** | `#FFFFFF` | Elevated surfaces, tool cards, drawers |
| **Borders** | `#EAEAE5` | Clean borders (`border-[#EAEAE5]`), subtle dividers |
| **Hover Border** | `#BEBDB9` / `#C8C8C0` | Hover interactive borders |
| **Primary Ink** | `#111111` | Primary text, primary CTA buttons, dark cards |
| **Secondary Text** | `#6E6D68` | Subtitles, descriptions, metadata |
| **Tertiary Text** | `#9E9D98` | Badges, timestamps, small hints |
| **Muted Background** | `#F5F4EE` / `#F8F8F6` | Pill badges, secondary action buttons, preview areas |

### Visual Components & Styling:
- **Rounded Corners**: Use `rounded-2xl` (16px) for cards and `rounded-3xl` (24px) for major sections and hero upload containers.
- **Micro-Animations**: Use `style={{ animation: "fade-in-up 0.3s ease-out" }}` for transitions between stages (`idle` $\rightarrow$ `busy` $\rightarrow$ `done`).
- **Tool Icons**: Do not use raw plain line icons. Use **dual-tone gradient rounded icon boxes** with subtle pastel tints (e.g., emerald, indigo, blue, amber) and clean 2px stroke SVG geometry.
- **Typography**: Uses `Plus_Jakarta_Sans` via Next.js Google Fonts with proper heading hierarchies (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`).

---

## 🧩 3. Shared Reusable Component Architecture

Before building custom UI, **always utilize existing shared components** in `src/components/image-tools/`:

### 1. `DropZone` (`src/components/image-tools/dropzone.tsx`)
Universal drag-and-drop file uploader supporting single or multi-file uploads:
```tsx
import { DropZone } from "@/components/image-tools/dropzone";

<DropZone
  multiple={true}
  accept="image/*"
  onFilesSelected={(files) => processFiles(files)}
  title="Drop your files here"
  subtitle="or click to browse from device"
  formatsText="JPG · PNG · WEBP · HEIC · AVIF"
/>
```

### 2. `ProgressBar` (`src/components/image-tools/progress-bar.tsx`)
Shimmering progress bar for multi-step AI loads or batch progress:
```tsx
import { ProgressBar } from "@/components/image-tools/progress-bar";

<ProgressBar value={progress.value} text={progress.text} />
```

### 3. `PrivacyBadges` (`src/components/image-tools/privacy-badges.tsx`)
Signature privacy badges displayed at the bottom of tool pages:
```tsx
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";

<PrivacyBadges
  badges={[
    "100% In-browser",
    "100% Ad-Free",
    "Zero cloud uploads",
    "Free & unlimited",
  ]}
/>
```

### 4. `CheckerBoard` (`src/components/image-tools/checkerboard.tsx`)
Transparency grid container for transparent cutouts and PNG previews.

### 5. `utils.ts` (`src/components/image-tools/utils.ts`)
- `formatBytes(bytes: number)`: Formats sizes to `KB` / `MB` / `GB`.
- `calculateSavings(orig, new)`: Calculates saved bytes and percentage.
- `convertHeicToJpeg(file)`: Decodes `.HEIC`/`.HEIF` via multi-strategy WASM (`libheif-js` + `heic2any`).

---

## 🛠️ 4. Step-by-Step Blueprint for Creating a New Tool

When building a new tool (e.g., `/image/my-tool`, `/pdf/my-tool`, `/dev/my-tool`):

### Step 1: Create the Dedicated Route Directory
```
src/app/<category>/<tool-name>/
├── layout.tsx     <-- SEO Metadata + JSON-LD WebApplication Schema
├── page.tsx       <-- "use client" UI & Stage Management
└── worker.ts      <-- (Optional) Web Worker for heavy tasks
```

### Step 2: Implement `layout.tsx` (SEO & Structured Data)
Every tool **must** export rich `Metadata` and a JSON-LD schema for Google indexing:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free [Tool Name] — [Primary Benefit] (No Uploads)",
  description: "100% Free & Ad-Free [Tool Name] running locally in your browser. [Key features]. Zero server uploads.",
  keywords: ["free [tool]", "ad free [tool]", "[tool] online no upload", "client side [tool]"],
  alternates: { canonical: "https://infyn.app/<category>/<tool-name>" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn [Tool Name]",
  url: "https://infyn.app/<category>/<tool-name>",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
```

### Step 3: Implement `page.tsx` (State Flow)
Follow the standard 4-stage flow:
1. **`idle`**: Clean upload screen with `<DropZone />` and value badges.
2. **`busy`**: Animated processing state with `<ProgressBar />` or spinner.
3. **`done`**:
   - Clean result display with Before/After comparison.
   - 1-Click **"Download As-Is"** primary button.
   - **"Edit More / Custom Options"** expandable toggle (keep advanced options collapsed by default to prevent UI clutter).
   - Batch summary bar with **"Download All (ZIP)"** if multi-file.
4. **`error`**: Clear error card with a friendly message and a **"Try Again"** button.

### Step 4: Register the Tool Across the Platform
Always update:
1. **`src/app/page.tsx`**: Add the tool to the `TOOLS` catalog with its icon, category, badge, and features.
2. **Category Hub (`src/app/<category>/page.tsx`)**: Add the tool to the category showcase grid.
3. **Global SEO (`src/app/layout.tsx`)**: Add relevant search keywords to the root metadata.

### Step 5: Verification
Run a production build before committing:
```bash
npm run build
```
Verify that:
- TypeScript passes with zero errors.
- Next.js statically renders all routes (`○  (Static)`).
- Mobile layout is responsive.

---

## 🔒 5. Performance & Safety Checklist

- [ ] **No Server Uploads**: Does all logic execute in the browser via WASM/Canvas/JS?
- [ ] **Memory Management**: Are all `URL.createObjectURL` references properly revoked with `URL.revokeObjectURL` upon reset or removal?
- [ ] **Size Guard**: Does the compressor/converter prevent unintended file size expansion?
- [ ] **Zero Mixed Styles**: Use either `background` or `backgroundColor`, never mix them on the same dynamic element in React.
- [ ] **No Artificial Limits**: Are batch uploads and file sizes unlimited?
- [ ] **100% Ad-Free**: Is the interface free of tracking and banner clutter?

---

*Keep this document updated as new tools, categories (PDF, Developer Utilities), and shared engines are added.*
