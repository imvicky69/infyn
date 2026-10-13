export interface AdsterraUnitConfig {
  id: string;
  key: string;
  width?: number;
  height?: number;
  name: string;
}

export const ADSTERRA_CONFIG = {
  websiteId: "6120567",
  domain: "infyn.software",
  units: {
    banner300x250: {
      id: "31714043",
      name: "300x250_1",
      key: process.env.NEXT_PUBLIC_ADSTERRA_300X250_KEY || "31714043",
      width: 300,
      height: 250,
    },
    banner728x90: {
      id: "31714044",
      name: "728x90_1",
      key: process.env.NEXT_PUBLIC_ADSTERRA_728X90_KEY || "31714044",
      width: 728,
      height: 90,
    },
    banner320x50: {
      id: "31714045",
      name: "320x50_1",
      key: process.env.NEXT_PUBLIC_ADSTERRA_320X50_KEY || "31714045",
      width: 320,
      height: 50,
    },
    nativeBanner: {
      id: "31714042",
      name: "NativeBanner_1",
      key: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY || "31714042",
    },
  },
};
