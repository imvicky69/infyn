# ∞ Infyn

**Fast, 100% free, and private in-browser utilities — zero server uploads.**

Infyn is a modern, open-source web utility suite offering essential image and PDF tools that execute entirely in the user's browser. No subscriptions, no credit cards, no tracking ads, and your files never touch a remote server.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-blue.svg)](CONTRIBUTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## ⚡ Core Philosophy

- **🔒 100% Client-Side Privacy (Zero Cloud Uploads):** All image manipulation, AI segmentation, encryption/decryption, and PDF rendering run locally on your device via WebAssembly (WASM), Web Workers, and HTML5 Canvas.
- **🚫 100% Free & Ad-Free:** No paywalls, no watermark additions on exports, no subscriptions, and no intrusive ads.
- **📦 Batch-First:** Designed to handle multiple files in bulk with instant 1-click ZIP downloads.
- **🚀 Zero Friction:** No login or signup required. Just open and use.

---

## 🛠️ Tools & Capabilities

### 📄 PDF Suite
- **[PDF Merger](/src/app/pdf/merger):** Combine multiple PDFs into a single document with visual drag-and-drop reordering.
- **[PDF Splitter & Page Extractor](/src/app/pdf/splitter):** Visual page grid to extract specific pages into a new PDF or split into individual PDFs (ZIP download).
- **[PDF Password Protector](/src/app/pdf/protector):** Secure confidential PDFs with standard AES-256 password encryption in browser.
- **[PDF Unlocker](/src/app/pdf/unlocker):** Remove passwords and access restrictions from encrypted PDF documents safely.
- **[PDF to Image](/src/app/pdf/pdf-to-image):** Render and export all or selected pages into high-resolution JPG/PNG images.
- **[Image to PDF](/src/app/image/img-to-pdf):** Convert and combine images into clean, formatted PDF documents with custom margins and page sizes.

### 🖼️ Image Suite
- **[AI Background Remover](/src/app/image/bg-remover):** Automated transparent cutout generation using in-browser machine learning models.
- **[Batch Image Compressor](/src/app/image/compressor):** Reduce image file sizes drastically with custom percentage and target size controls.
- **[Image Resizer & Crop](/src/app/image/resizer):** Resize dimensions, change aspect ratios, and fit photos with blurred canvas padding.
- **[Universal Image Converter](/src/app/image/converter):** Batch convert between JPG, PNG, WEBP, AVIF, and HEIC.
- **[HEIC to JPG Converter](/src/app/image/heic-to-jpg):** Seamlessly decode Apple iPhone `.heic`/`.heif` photos into universally compatible JPEGs via WASM.
- **[EXIF & Metadata Remover](/src/app/image/exif-remover):** Strip GPS locations, camera serials, and device metadata from photos before sharing.

---

## 🏗️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **PDF Engine:** `pdf-lib`, `pdfjs-dist`, `cryptpdf`
- **Compression & Archiving:** `jszip`
- **Icons:** `lucide-react`

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18.18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/imvicky69/infyn.git
   cd infyn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing & Submitting Features

Contributions from the open-source community are always welcome! Whether you are resolving issues, adding new client-side tools, or enhancing documentation:

1. Check existing issues or open a [Feature Request / Bug Report](https://github.com/imvicky69/infyn/issues).
2. Review our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).
3. Create a feature branch, commit your changes, and open a Pull Request.

---

## 🛡️ Security & Privacy

Infyn processes all user data locally on the client machine. If you discover a security flaw or potential data leakage, please review our [Security Policy](SECURITY.md) for reporting guidelines.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
