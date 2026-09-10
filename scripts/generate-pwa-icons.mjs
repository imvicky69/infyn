import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcLogo = path.join(rootDir, "public", "logo.png");
const publicDir = path.join(rootDir, "public");

async function generateIcons() {
  console.log("Generating PWA icons from:", srcLogo);

  // 1. Standard Icons (any purpose) - 192x192 and 512x512
  await sharp(srcLogo)
    .resize(192, 192, { fit: "contain" })
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));
  console.log("✓ Generated icon-192.png (192x192)");

  await sharp(srcLogo)
    .resize(512, 512, { fit: "contain" })
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));
  console.log("✓ Generated icon-512.png (512x512)");

  // 2. Apple Touch Icon (180x180) - Solid white background so iOS doesn't fill transparent parts with black
  const appleInner = await sharp(srcLogo)
    .resize(150, 150, { fit: "contain" })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: appleInner, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ Generated apple-touch-icon.png (180x180)");

  // 3. Maskable Icons (192x192 & 512x512)
  // Maskable safe zone is the central 80% circle (diameter 80% of dimension).
  // Putting inner logo at ~75% dimension ensures zero cropping regardless of squircle/circle mask.
  const maskable192Inner = await sharp(srcLogo)
    .resize(144, 144, { fit: "contain" })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: maskable192Inner, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-maskable-192.png"));
  console.log("✓ Generated icon-maskable-192.png (192x192)");

  const maskable512Inner = await sharp(srcLogo)
    .resize(384, 384, { fit: "contain" })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: maskable512Inner, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-maskable-512.png"));
  console.log("✓ Generated icon-maskable-512.png (512x512)");

  // 4. Favicons (32x32 & 16x16)
  await sharp(srcLogo)
    .resize(32, 32, { fit: "contain" })
    .png()
    .toFile(path.join(publicDir, "favicon-32x32.png"));
  console.log("✓ Generated favicon-32x32.png");

  await sharp(srcLogo)
    .resize(16, 16, { fit: "contain" })
    .png()
    .toFile(path.join(publicDir, "favicon-16x16.png"));
  console.log("✓ Generated favicon-16x16.png");

  console.log("All PWA icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
