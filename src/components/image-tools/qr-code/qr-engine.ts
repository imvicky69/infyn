import {
  QRDataType,
  QRStyleConfig,
  QRWiFiData,
  QRVCardData,
  QREmailData,
  QRSmsData,
  QRUpiData,
  QRSocialData,
} from "./types";

/**
 * Transforms any image (URL, uploaded base64, or icon) into a sleek circular badge with a white disc and border.
 */
export async function prepareCircularLogo(logoSrc: string, size = 300): Promise<string> {
  if (typeof window === "undefined" || !logoSrc) return logoSrc;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(logoSrc);
          return;
        }

        const center = size / 2;
        const radius = size / 2 - 4;

        // 1. Draw circular white background disc
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // 2. Subtle clean border
        ctx.strokeStyle = "#EAEAE5";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // 3. Clip to circular inner area
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius - 4, 0, Math.PI * 2);
        ctx.clip();

        // 4. Draw image fitted in center with proportional padding
        const targetW = radius * 1.45;
        const targetH = radius * 1.45;
        const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);

        let drawW = targetW;
        let drawH = targetH;
        if (aspect > 1) {
          drawH = targetW / aspect;
        } else {
          drawW = targetH * aspect;
        }

        const drawX = center - drawW / 2;
        const drawY = center - drawH / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(logoSrc);
      }
    };
    img.onerror = () => resolve(logoSrc);
    img.src = logoSrc;
  });
}

/**
 * Encodes various data structures into standard QR code string payloads.

 */
export function formatQRData(
  type: QRDataType,
  payload: {
    url?: string;
    text?: string;
    wifi?: QRWiFiData;
    vcard?: QRVCardData;
    email?: QREmailData;
    phone?: string;
    sms?: QRSmsData;
    upi?: QRUpiData;
    social?: QRSocialData;
  }
): string {
  switch (type) {
    case "url": {
      const raw = payload.url?.trim() || "https://infyn.software";
      if (!/^https?:\/\//i.test(raw) && !/^mailto:/i.test(raw) && !/^tel:/i.test(raw)) {
        return `https://${raw}`;
      }
      return raw;
    }

    case "text":
      return payload.text?.trim() || "Hello from Infyn!";

    case "wifi": {
      const w = payload.wifi || {
        ssid: "MyNetwork",
        password: "MyPassword",
        encryption: "WPA",
        hidden: false,
      };
      const enc = w.encryption === "nopass" ? "nopass" : w.encryption;
      const h = w.hidden ? "true" : "false";
      return `WIFI:T:${enc};S:${w.ssid};P:${w.password};H:${h};;`;
    }

    case "vcard": {
      const v = payload.vcard || {
        firstName: "Alex",
        lastName: "Morgan",
        organization: "Infyn",
        title: "Creator",
        phone: "+1234567890",
        email: "alex@example.com",
        website: "https://infyn.software",
        address: "San Francisco, CA",
        note: "Built with Infyn QR Studio",
      };
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${v.lastName};${v.firstName}`,
        `FN:${v.firstName} ${v.lastName}`,
        v.organization ? `ORG:${v.organization}` : "",
        v.title ? `TITLE:${v.title}` : "",
        v.phone ? `TEL:${v.phone}` : "",
        v.email ? `EMAIL:${v.email}` : "",
        v.website ? `URL:${v.website}` : "",
        v.address ? `ADR:;;${v.address};;;;` : "",
        v.note ? `NOTE:${v.note}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "email": {
      const e = payload.email || { email: "hello@infyn.software", subject: "", body: "" };
      const query = new URLSearchParams();
      if (e.subject) query.set("subject", e.subject);
      if (e.body) query.set("body", e.body);
      const qs = query.toString();
      return `mailto:${e.email}${qs ? `?${qs}` : ""}`;
    }

    case "phone":
      return `tel:${payload.phone?.trim() || "+1234567890"}`;

    case "sms": {
      const s = payload.sms || { phone: "+1234567890", message: "" };
      return `smsto:${s.phone}:${s.message || ""}`;
    }

    case "upi": {
      const u = payload.upi || {
        upiId: "merchant@upi",
        name: "Store",
        amount: "",
        note: "Payment",
      };
      const params = new URLSearchParams();
      params.set("pa", u.upiId);
      if (u.name) params.set("pn", u.name);
      if (u.amount) params.set("am", u.amount);
      if (u.note) params.set("tn", u.note);
      params.set("cu", "INR");
      return `upi://pay?${params.toString()}`;
    }

    case "social": {
      const soc = payload.social || { platform: "instagram", handle: "infyn" };
      const handle = soc.handle.replace(/^@/, "").trim();
      switch (soc.platform) {
        case "instagram":
          return `https://instagram.com/${handle}`;
        case "twitter":
          return `https://twitter.com/${handle}`;
        case "youtube":
          return `https://youtube.com/@${handle}`;
        case "linkedin":
          return `https://linkedin.com/in/${handle}`;
        case "whatsapp":
          return `https://wa.me/${handle.replace(/[^0-9]/g, "")}`;
        case "github":
          return `https://github.com/${handle}`;
        case "tiktok":
          return `https://tiktok.com/@${handle}`;
        default:
          return `https://infyn.software`;
      }
    }

    default:
      return "https://infyn.software";
  }
}

/**
 * Builds styling options for qr-code-styling.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildQrCodeStylingOptions(data: string, style: QRStyleConfig, size = 512): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dotsOptions: any = {
    type: style.dotType,
  };

  if (style.gradient.enabled) {
    dotsOptions.gradient = {
      type: style.gradient.type,
      rotation: (style.gradient.rotation * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: style.gradient.color1 },
        { offset: 1, color: style.gradient.color2 },
      ],
    };
  } else {
    dotsOptions.color = style.dotColor;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cornersSquareOptions: any = {
    type: style.cornerSquareType,
    color: style.customEyeColors ? style.cornerSquareColor : style.dotColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cornersDotOptions: any = {
    type: style.cornerDotType,
    color: style.customEyeColors ? style.cornerDotColor : style.dotColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backgroundOptions: any = {
    color: style.transparentBackground ? "rgba(0,0,0,0)" : style.backgroundColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageOptions: any = {
    hideBackgroundDots: true,
    imageSize: style.logoSize,
    margin: style.logoMargin,
    crossOrigin: "anonymous",
  };

  const scaledMargin = Math.round((style.margin ?? 20) * (size / 480));

  return {
    width: size,
    height: size,
    type: "canvas",
    data,
    margin: scaledMargin,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: style.logoUrl ? "H" : style.errorCorrectionLevel,
    },

    image: style.logoUrl || undefined,
    imageOptions,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
  };
}


/**
 * Renders the framed template (e.g. Polaroid, Scan Me, Pill Badge) onto a high-res canvas.
 */
export async function renderFramedCanvas(
  rawQrCanvas: HTMLCanvasElement,
  style: QRStyleConfig,
  targetSize = 1024
): Promise<HTMLCanvasElement> {
  if (style.frameType === "none") {
    // Return scaled copy of raw QR
    const out = document.createElement("canvas");
    out.width = targetSize;
    out.height = targetSize;
    const ctx = out.getContext("2d")!;
    if (!style.transparentBackground) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    }
    ctx.drawImage(rawQrCanvas, 0, 0, targetSize, targetSize);
    return out;
  }

  const out = document.createElement("canvas");
  const ctx = out.getContext("2d")!;

  if (style.frameType === "scan-me-bottom") {
    // QR Code + Bottom "SCAN ME" banner bubble
    const padding = Math.round(targetSize * 0.06);
    const badgeHeight = Math.round(targetSize * 0.16);
    const canvasWidth = targetSize;
    const canvasHeight = targetSize + badgeHeight + padding;

    out.width = canvasWidth;
    out.height = canvasHeight;

    // Outer Background
    if (!style.transparentBackground) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw QR
    ctx.drawImage(rawQrCanvas, 0, 0, targetSize, targetSize);

    // Draw Bottom Badge Pill
    const badgeW = targetSize * 0.75;
    const badgeH = badgeHeight;
    const badgeX = (canvasWidth - badgeW) / 2;
    const badgeY = targetSize + padding / 2;
    const radius = badgeH / 2;

    ctx.fillStyle = style.frameColor || "#111111";
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, radius);
    ctx.fill();

    // Badge Text
    ctx.fillStyle = style.frameTextColor || "#FFFFFF";
    ctx.font = `bold ${Math.round(badgeH * 0.42)}px Plus Jakarta Sans, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(style.frameText || "SCAN ME", canvasWidth / 2, badgeY + badgeH / 2);

    return out;
  }

  if (style.frameType === "polaroid") {
    // Polaroid card frame
    const sideMargin = Math.round(targetSize * 0.08);
    const topMargin = Math.round(targetSize * 0.08);
    const bottomMargin = Math.round(targetSize * 0.28);

    const canvasWidth = targetSize + sideMargin * 2;
    const canvasHeight = targetSize + topMargin + bottomMargin;

    out.width = canvasWidth;
    out.height = canvasHeight;

    // Card background
    ctx.fillStyle = style.frameColor || "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(0, 0, canvasWidth, canvasHeight, 24);
    ctx.fill();

    // Subtle inner border
    ctx.strokeStyle = "#EAEAE5";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw QR inside inner card
    ctx.drawImage(rawQrCanvas, sideMargin, topMargin, targetSize, targetSize);

    // Caption text
    ctx.fillStyle = style.frameTextColor || "#111111";
    ctx.font = `bold ${Math.round(bottomMargin * 0.28)}px Plus Jakarta Sans, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      style.frameText || "Scan with your phone camera",
      canvasWidth / 2,
      topMargin + targetSize + bottomMargin / 2
    );

    return out;
  }

  if (style.frameType === "pill-badge") {
    // Top & bottom rounded card frame
    const margin = Math.round(targetSize * 0.06);
    const badgeH = Math.round(targetSize * 0.14);
    const canvasWidth = targetSize + margin * 2;
    const canvasHeight = targetSize + margin * 2 + badgeH;

    out.width = canvasWidth;
    out.height = canvasHeight;

    // Container pill card
    ctx.fillStyle = style.frameColor || "#111111";
    ctx.beginPath();
    ctx.roundRect(0, 0, canvasWidth, canvasHeight, 36);
    ctx.fill();

    // Inner white QR box
    const qrBoxX = margin;
    const qrBoxY = margin;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, targetSize, targetSize, 24);
    ctx.fill();

    ctx.drawImage(rawQrCanvas, qrBoxX, qrBoxY, targetSize, targetSize);

    // Text in bottom badge
    ctx.fillStyle = style.frameTextColor || "#FFFFFF";
    ctx.font = `bold ${Math.round(badgeH * 0.4)}px Plus Jakarta Sans, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      style.frameText || "POINT CAMERA TO SCAN",
      canvasWidth / 2,
      qrBoxY + targetSize + (badgeH + margin) / 2 - margin / 2
    );

    return out;
  }

  // Default fallback: draw raw
  out.width = targetSize;
  out.height = targetSize;
  ctx.drawImage(rawQrCanvas, 0, 0, targetSize, targetSize);
  return out;
}

/**
 * Downloads a canvas as a PNG file.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = "infyn-qrcode.png") {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Copies canvas image to clipboard.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png")
    );
    if (!blob || !navigator.clipboard || !window.ClipboardItem) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch (err) {
    console.error("Clipboard copy error:", err);
    return false;
  }
}
