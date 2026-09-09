/**
 * Infyn Sponsorship & UPI Configuration
 * 
 * Centralized location to update UPI payee credentials, preset amounts, 
 * and display information for the /sponsor page.
 */

export interface SponsorConfig {
  /** The destination UPI ID where contributions are sent */
  upiId: string;
  /** Display name of the receiver shown in UPI apps */
  payeeName: string;
  /** Default note/description attached to the transaction */
  transactionNote: string;
  /** Currency code (INR for UPI) */
  currency: string;
  /** Preset contribution amounts in INR */
  presetAmounts: number[];
  /** Default selected amount */
  defaultAmount: number;
  /** Canonical page URL */
  canonicalUrl: string;
  /** GitHub repository link */
  githubRepoUrl: string;
}

export const SPONSOR_CONFIG: SponsorConfig = {
  upiId: "raja-vikky@ptyes", // Change to your active UPI VPA (e.g., yourname@okaxis, username@upi)
  payeeName: "Vikky Raja",
  transactionNote: "Support Infyn Open Source",
  currency: "INR",
  presetAmounts: [50, 100, 250, 500],
  defaultAmount: 100,
  canonicalUrl: "https://infyn.software/sponsor",
  githubRepoUrl: "https://github.com/imvicky69/infyn",
};

/**
 * Builds a standard UPI payment URI (`upi://pay`) with provided parameters.
 */
export function buildUpiPaymentUri(amount?: number | string): string {
  const params = new URLSearchParams();
  params.set("pa", SPONSOR_CONFIG.upiId);
  params.set("pn", SPONSOR_CONFIG.payeeName);
  params.set("cu", SPONSOR_CONFIG.currency);
  params.set("tn", SPONSOR_CONFIG.transactionNote);

  if (amount !== undefined && amount !== null && amount !== "") {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (!isNaN(num) && num > 0) {
      params.set("am", num.toString());
    }
  }

  return `upi://pay?${params.toString()}`;
}
