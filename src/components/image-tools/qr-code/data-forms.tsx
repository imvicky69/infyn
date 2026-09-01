"use client";

import React, { useState } from "react";
import {
  QRDataType,
  QRWiFiData,
  QRVCardData,
  QREmailData,
  QRSmsData,
  QRUpiData,
  QRSocialData,
} from "./types";
import {
  Link as LinkIcon,
  Wifi,
  Contact,
  Mail,
  Phone,
  MessageSquare,
  IndianRupee,
  Share2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";

interface DataFormsProps {
  type: QRDataType;
  onTypeChange: (type: QRDataType) => void;
  url: string;
  onUrlChange: (url: string) => void;
  text: string;
  onTextChange: (text: string) => void;
  wifi: QRWiFiData;
  onWifiChange: (wifi: QRWiFiData) => void;
  vcard: QRVCardData;
  onVcardChange: (vcard: QRVCardData) => void;
  email: QREmailData;
  onEmailChange: (email: QREmailData) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  sms: QRSmsData;
  onSmsChange: (sms: QRSmsData) => void;
  upi: QRUpiData;
  onUpiChange: (upi: QRUpiData) => void;
  social: QRSocialData;
  onSocialChange: (social: QRSocialData) => void;
}

const DATA_TABS: { id: QRDataType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "Website URL", icon: LinkIcon },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vcard", label: "vCard Contact", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "upi", label: "UPI Pay", icon: IndianRupee },
  { id: "social", label: "Social", icon: Share2 },
  { id: "text", label: "Plain Text", icon: FileText },
];

export function DataForms({
  type,
  onTypeChange,
  url,
  onUrlChange,
  text,
  onTextChange,
  wifi,
  onWifiChange,
  vcard,
  onVcardChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  sms,
  onSmsChange,
  upi,
  onUpiChange,
  social,
  onSocialChange,
}: DataFormsProps) {
  const [showWifiPass, setShowWifiPass] = useState(false);

  // Clean URL string for the input (without https:// prefix)
  const displayUrl = url.replace(/^https?:\/\//i, "");

  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-[#F5F4EE] max-w-full">
        {DATA_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = type === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTypeChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#111111] text-white shadow-2xs"
                  : "bg-white text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="pt-1">
        {/* URL Form with Auto https:// */}
        {type === "url" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">Target Website URL</label>
            <div className="flex items-center rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-2xs focus-within:border-[#111111] transition-all">
              <span className="px-3.5 py-3 bg-[#FBFBFA] border-r border-[#EAEAE5] text-xs font-bold text-[#6E6D68] select-none shrink-0">
                https://
              </span>
              <input
                type="text"
                placeholder="yourdomain.com"
                value={displayUrl}
                onChange={(e) => {
                  const cleaned = e.target.value.trim().replace(/^https?:\/\//i, "");
                  onUrlChange(cleaned ? `https://${cleaned}` : "");
                }}
                className="w-full px-3.5 py-3 bg-transparent text-sm text-[#111111] placeholder-[#9E9D98] focus:outline-none font-medium"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#9E9D98]">
              Scanning opens this web page instantly. No redirects or middleman servers.
            </p>
          </div>
        )}

        {/* Wi-Fi Form */}
        {type === "wifi" && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Network Name (SSID)</label>
              <input
                type="text"
                placeholder="e.g. Office_Guest"
                value={wifi.ssid}
                onChange={(e) => onWifiChange({ ...wifi, ssid: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showWifiPass ? "text" : "password"}
                  placeholder="Network password"
                  value={wifi.password}
                  onChange={(e) => onWifiChange({ ...wifi, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPass(!showWifiPass)}
                  className="absolute right-3 top-2.5 text-[#9E9D98] hover:text-[#111111]"
                >
                  {showWifiPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#111111] mb-1">Security</label>
                <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
                  {[
                    { id: "WPA", label: "WPA / WPA2" },
                    { id: "WEP", label: "WEP" },
                    { id: "nopass", label: "Open (None)" },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => onWifiChange({ ...wifi, encryption: sec.id as any })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        wifi.encryption === sec.id
                          ? "bg-white text-[#111111] shadow-2xs"
                          : "text-[#6E6D68]"
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] cursor-pointer pt-3">
                <input
                  type="checkbox"
                  checked={wifi.hidden}
                  onChange={(e) => onWifiChange({ ...wifi, hidden: e.target.checked })}
                  className="rounded text-[#111111] focus:ring-0 accent-[#111111]"
                />
                <span>Hidden Network</span>
              </label>
            </div>
          </div>
        )}

        {/* vCard Form */}
        {type === "vcard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">First Name</label>
              <input
                type="text"
                placeholder="Alex"
                value={vcard.firstName}
                onChange={(e) => onVcardChange({ ...vcard, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Morgan"
                value={vcard.lastName}
                onChange={(e) => onVcardChange({ ...vcard, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Company</label>
              <input
                type="text"
                placeholder="Company / Brand"
                value={vcard.organization}
                onChange={(e) => onVcardChange({ ...vcard, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Job Title</label>
              <input
                type="text"
                placeholder="Founder / Designer"
                value={vcard.title}
                onChange={(e) => onVcardChange({ ...vcard, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={vcard.phone}
                onChange={(e) => onVcardChange({ ...vcard, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Email</label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={vcard.email}
                onChange={(e) => onVcardChange({ ...vcard, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#111111] mb-1">Website</label>
              <input
                type="url"
                placeholder="https://mywebsite.com"
                value={vcard.website}
                onChange={(e) => onVcardChange({ ...vcard, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        )}

        {/* Email Form */}
        {type === "email" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Recipient Email</label>
              <input
                type="email"
                placeholder="support@domain.com"
                value={email.email}
                onChange={(e) => onEmailChange({ ...email, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Subject</label>
              <input
                type="text"
                placeholder="Inquiry / Feedback"
                value={email.subject}
                onChange={(e) => onEmailChange({ ...email, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Message Body</label>
              <textarea
                rows={3}
                placeholder="Pre-filled email message…"
                value={email.body}
                onChange={(e) => onEmailChange({ ...email, body: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {type === "phone" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#EAEAE5] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111] font-medium"
            />
            <p className="text-[11px] text-[#9E9D98]">
              Scanning prompts the user&apos;s phone to directly dial this number.
            </p>
          </div>
        )}

        {/* SMS Form */}
        {type === "sms" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 555 123 4567"
                value={sms.phone}
                onChange={(e) => onSmsChange({ ...sms, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Pre-filled SMS Text</label>
              <textarea
                rows={2}
                placeholder="Interested in your service!"
                value={sms.message}
                onChange={(e) => onSmsChange({ ...sms, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {type === "upi" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Virtual Payment Address (UPI ID)</label>
              <input
                type="text"
                placeholder="storename@okhdfcbank"
                value={upi.upiId}
                onChange={(e) => onUpiChange({ ...upi, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111111] mb-1">Payee Name</label>
                <input
                  type="text"
                  placeholder="Business / Name"
                  value={upi.name}
                  onChange={(e) => onUpiChange({ ...upi, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#111111] mb-1">Amount (Optional)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={upi.amount}
                  onChange={(e) => onUpiChange({ ...upi, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Profiles Form */}
        {type === "social" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Platform</label>
              <select
                value={social.platform}
                onChange={(e) => onSocialChange({ ...social, platform: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              >
                <option value="instagram">Instagram (@handle)</option>
                <option value="whatsapp">WhatsApp (Phone Number with country code)</option>
                <option value="twitter">Twitter / X (@handle)</option>
                <option value="youtube">YouTube (@channel)</option>
                <option value="linkedin">LinkedIn (profile slug)</option>
                <option value="github">GitHub (username)</option>
                <option value="tiktok">TikTok (@handle)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                {social.platform === "whatsapp" ? "Phone with Country Code" : "Username / Handle"}
              </label>
              <input
                type="text"
                placeholder={social.platform === "whatsapp" ? "15551234567" : "@myusername"}
                value={social.handle}
                onChange={(e) => onSocialChange({ ...social, handle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        )}

        {/* Plain Text Form */}
        {type === "text" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">Plain Text / Note</label>
            <textarea
              rows={4}
              placeholder="Type any message, address, crypto wallet, or instructions…"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#EAEAE5] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
