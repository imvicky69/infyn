import React from "react";

export interface PresetCategory {
  id: string;
  label: string;
  iconName: "instagram" | "youtube" | "whatsapp" | "favicon" | "custom";
  presets: ResizePreset[];
}

export interface ResizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
  ratioLabel?: string;
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: "instagram",
    label: "Instagram",
    iconName: "instagram",
    presets: [
      {
        id: "ig-square",
        name: "Square Post",
        width: 1080,
        height: 1080,
        description: "1:1 Feed Post",
        ratioLabel: "1:1",
      },
      {
        id: "ig-portrait",
        name: "Portrait Post",
        width: 1080,
        height: 1350,
        description: "4:5 Portrait Feed",
        ratioLabel: "4:5",
      },
      {
        id: "ig-story",
        name: "Story / Reel",
        width: 1080,
        height: 1920,
        description: "9:16 Full Screen Story",
        ratioLabel: "9:16",
      },
      {
        id: "ig-landscape",
        name: "Landscape Post",
        width: 1080,
        height: 566,
        description: "1.91:1 Horizontal Post",
        ratioLabel: "1.91:1",
      },
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    iconName: "youtube",
    presets: [
      {
        id: "yt-thumb",
        name: "Video Thumbnail",
        width: 1280,
        height: 720,
        description: "16:9 Standard HD Thumbnail",
        ratioLabel: "16:9",
      },
      {
        id: "yt-banner",
        name: "Channel Banner",
        width: 2560,
        height: 1440,
        description: "16:9 TV & Desktop Header",
        ratioLabel: "16:9",
      },
      {
        id: "yt-avatar",
        name: "Channel Avatar",
        width: 800,
        height: 800,
        description: "1:1 Channel Profile Icon",
        ratioLabel: "1:1",
      },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    iconName: "whatsapp",
    presets: [
      {
        id: "wa-dp",
        name: "Profile Photo (DP)",
        width: 500,
        height: 500,
        description: "1:1 Profile Avatar",
        ratioLabel: "1:1",
      },
      {
        id: "wa-status",
        name: "Status / Story",
        width: 1080,
        height: 1920,
        description: "9:16 Full Screen Status",
        ratioLabel: "9:16",
      },
      {
        id: "wa-shared",
        name: "Shared Photo",
        width: 1280,
        height: 720,
        description: "16:9 Optimized Chat Image",
        ratioLabel: "16:9",
      },
    ],
  },
  {
    id: "favicon",
    label: "Favicon",
    iconName: "favicon",
    presets: [
      {
        id: "fav-32",
        name: "Favicon (32×32)",
        width: 32,
        height: 32,
        description: "Standard Browser Tab Icon",
        ratioLabel: "1:1",
      },
      {
        id: "fav-48",
        name: "Icon (48×48)",
        width: 48,
        height: 48,
        description: "Windows / Desktop Favicon",
        ratioLabel: "1:1",
      },
      {
        id: "fav-180",
        name: "Apple Touch Icon",
        width: 180,
        height: 180,
        description: "iOS Home Screen Shortcut",
        ratioLabel: "1:1",
      },
      {
        id: "fav-512",
        name: "Web App Manifest",
        width: 512,
        height: 512,
        description: "PWA Splash & High-Res Icon",
        ratioLabel: "1:1",
      },
    ],
  },
];
