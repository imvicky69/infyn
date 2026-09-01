export type QRDataType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "upi"
  | "social";

export type DotType =
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";

export type CornerSquareType = "dot" | "square" | "extra-rounded";
export type CornerDotType = "dot" | "square";

export type FrameType =
  | "none"
  | "scan-me-bottom"
  | "scan-me-top"
  | "polaroid"
  | "pill-badge"
  | "card-frame"
  | "phone-mockup";

export interface QRWiFiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface QRVCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  note: string;
}

export interface QREmailData {
  email: string;
  subject: string;
  body: string;
}

export interface QRSmsData {
  phone: string;
  message: string;
}

export interface QRUpiData {
  upiId: string;
  name: string;
  amount: string;
  note: string;
}

export interface QRSocialData {
  platform: "instagram" | "twitter" | "youtube" | "linkedin" | "whatsapp" | "github" | "tiktok";
  handle: string;
}

export interface QRGradientConfig {
  enabled: boolean;
  type: "linear" | "radial";
  rotation: number; // in degrees (0 - 360)
  color1: string;
  color2: string;
}

export interface QRStyleConfig {
  // Body styling
  dotType: DotType;
  dotColor: string;
  gradient: QRGradientConfig;

  // Background
  backgroundColor: string;
  transparentBackground: boolean;

  // Eye styling
  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;
  cornerDotType: CornerDotType;
  cornerDotColor: string;
  customEyeColors: boolean;

  // Logo / Icon
  logoUrl: string | null;
  logoSize: number; // 0.15 - 0.35
  logoMargin: number; // 0 - 15
  logoBackgroundCircle: boolean;

  // Frame & Banner
  frameType: FrameType;
  frameText: string;
  frameColor: string;
  frameTextColor: string;

  // Technical
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number; // 0 - 40
  size: number; // 512, 1024, 2048, 4000
}

export interface QRPresetTheme {
  id: string;
  name: string;
  desc: string;
  dotType: DotType;
  dotColor: string;
  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;
  cornerDotType: CornerDotType;
  cornerDotColor: string;
  backgroundColor: string;
  frameType: FrameType;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  gradient?: QRGradientConfig;
}
