// Property rents are stored in USD; the site shows money in BDT.
// Reservation fees and earnings are already saved in BDT by the server,
// so show those with formatBdt() only. Never convert them again.
export const BDT_PER_USD = Number(import.meta.env.VITE_BDT_PER_USD) || 123.75;

// Convert a stored USD rent to BDT.
export const usdToBdt = (usd) =>
  Math.round(Number(usd || 0) * BDT_PER_USD * 100) / 100;

// Format a BDT amount, for example ৳18,562.50
export const formatBdt = (bdt) =>
  `৳${Number(bdt || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;