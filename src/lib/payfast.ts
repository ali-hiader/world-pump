import crypto from "crypto";

export type PayfastConfig = {
  merchantId: string;
  merchantKey: string;
  passphrase?: string; // optional but recommended
  mode?: "sandbox" | "live";
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
};

export function getPayfastConfig(): PayfastConfig {
  const mode = (process.env.PAYFAST_MODE as "sandbox" | "live") || "sandbox";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const returnUrl = `${baseUrl}/success`;
  const cancelUrl = `${baseUrl}/checkout`;
  const notifyUrl = `${baseUrl}/api/payfast/notify`;
  const cfg: PayfastConfig = {
    merchantId: process.env.PAYFAST_MERCHANT_ID || "",
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
    passphrase: process.env.PAYFAST_PASSPHRASE || undefined,
    mode,
    returnUrl,
    cancelUrl,
    notifyUrl,
  };
  return cfg;
}

export function payfastProcessUrl(mode: PayfastConfig["mode"]) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

export function payfastValidateUrl(mode: PayfastConfig["mode"]) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/query/validate"
    : "https://sandbox.payfast.co.za/eng/query/validate";
}

export type PayfastFields = Record<string, string>;

export function buildPayfastFields(params: {
  orderNumber: string;
  orderId: number;
  amount: number; // in major units
  itemName: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
}): { fields: PayfastFields; processUrl: string } {
  const cfg = getPayfastConfig();
  if (!cfg.merchantId || !cfg.merchantKey) {
    throw new Error("Missing PAYFAST_MERCHANT_ID or PAYFAST_MERCHANT_KEY");
  }

  const fields: PayfastFields = {
    merchant_id: cfg.merchantId,
    merchant_key: cfg.merchantKey,
    return_url: cfg.returnUrl,
    cancel_url: cfg.cancelUrl,
    notify_url: cfg.notifyUrl,
    m_payment_id: params.orderNumber, // your reference
    amount: params.amount.toFixed(2),
    item_name: params.itemName,
  };

  if (params.customerEmail) fields["email_address"] = params.customerEmail;
  if (params.customerFirstName) fields["name_first"] = params.customerFirstName;
  if (params.customerLastName) fields["name_last"] = params.customerLastName;
  // Optional: include your internal IDs
  fields["custom_str1"] = String(params.orderId);

  // Generate signature
  fields["signature"] = generatePayfastSignature(fields, cfg.passphrase);

  return { fields, processUrl: payfastProcessUrl(cfg.mode) };
}

export function generatePayfastSignature(
  fields: PayfastFields,
  passphrase?: string
) {
  // PayFast signature: sort by key, URL-encode values, join with &
  const keys = Object.keys(fields).sort();
  const query = keys
    .map((k) => `${k}=${encodeURIComponent(fields[k]).replace(/%20/g, "+")}`)
    .join("&");
  const withPassphrase =
    passphrase && passphrase.length > 0
      ? `${query}&passphrase=${encodeURIComponent(passphrase).replace(
          /%20/g,
          "+"
        )}`
      : query;
  return crypto.createHash("md5").update(withPassphrase).digest("hex");
}
