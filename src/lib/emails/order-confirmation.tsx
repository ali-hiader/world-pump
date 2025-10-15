import React from "react";

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Row,
  Section,
  Text,
} from "@react-email/components";

export type EmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Address = {
  fullName: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
};

export function OrderConfirmationEmail(props: {
  orderNumber: string | number;
  orderId: number;
  amount: number; // in PKR
  items: EmailItem[];
  shipping?: Address | null;
  billing?: Address | null;
  brandName?: string;
  logoUrl?: string;
}) {
  const { orderNumber, orderId, amount, items, shipping, billing } = props;
  const brandName = props.brandName || process.env.NEXT_PUBLIC_SITE_NAME || "World Pumps";
  const logoUrl = props.logoUrl;
  const currency = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });

  const total = currency.format(amount);

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={{ marginBottom: 8 }}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} style={{ height: 28 }} />
            ) : (
              <Heading style={{ ...styles.heading, marginBottom: 0 }}>{brandName}</Heading>
            )}
          </Section>
          <Heading style={styles.heading}>Payment Confirmed</Heading>
          <Text style={styles.text}>Thank you for your order.</Text>
          <Section>
            <Row>
              <Column>
                <Text style={styles.muted}>Order Number</Text>
                <Text style={styles.value}>{String(orderNumber)}</Text>
              </Column>
              <Column>
                <Text style={styles.muted}>Order ID</Text>
                <Text style={styles.value}>{String(orderId)}</Text>
              </Column>
              <Column>
                <Text style={styles.muted}>Total</Text>
                <Text style={styles.value}>{total}</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={styles.hr} />
          {shipping && (
            <Section>
              <Heading as="h3" style={styles.subheading}>
                Shipping Address
              </Heading>
              <Text style={styles.text}>
                {shipping.fullName}
                <br />
                {shipping.addressLine1}
                {shipping.addressLine2 ? <><br />{shipping.addressLine2}</> : null}
                <br />
                {shipping.city}
                {shipping.state ? ", " + shipping.state : ""}
                {shipping.postalCode ? " " + shipping.postalCode : ""}
                <br />
                {shipping.country}
                {shipping.phone ? <><br />Phone: {shipping.phone}</> : null}
              </Text>
            </Section>
          )}
          {billing && (
            <Section>
              <Heading as="h3" style={styles.subheading}>
                Billing Address
              </Heading>
              <Text style={styles.text}>
                {billing.fullName}
                <br />
                {billing.addressLine1}
                {billing.addressLine2 ? <><br />{billing.addressLine2}</> : null}
                <br />
                {billing.city}
                {billing.state ? ", " + billing.state : ""}
                {billing.postalCode ? " " + billing.postalCode : ""}
                <br />
                {billing.country}
                {billing.phone ? <><br />Phone: {billing.phone}</> : null}
              </Text>
            </Section>
          )}
          <Hr style={styles.hr} />
          <Section>
            <Heading as="h3" style={styles.subheading}>
              Items
            </Heading>
            {items.map((it, idx) => (
              <Row key={idx} style={styles.itemRow}>
                <Column>
                  <Text style={styles.itemName}>{it.name}</Text>
                </Column>
                <Column>
                  <Text style={styles.muted}>Qty</Text>
                  <Text style={styles.value}>{it.quantity}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={styles.muted}>Subtotal</Text>
                  <Text style={styles.value}>
                    {currency.format(it.unitPrice * it.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.text}>We appreciate your business!</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: { backgroundColor: "#f7fafc", color: "#111827" },
  container: {
    backgroundColor: "#ffffff",
    padding: "24px",
    margin: "0 auto",
    maxWidth: "640px",
    borderRadius: "8px",
  },
  heading: { fontSize: 24, margin: 0, marginBottom: 8 },
  subheading: { fontSize: 18, margin: 0, marginBottom: 8 },
  text: { fontSize: 14, lineHeight: "20px", margin: 0 },
  muted: { fontSize: 12, color: "#6b7280", margin: 0 },
  value: { fontSize: 14, fontWeight: 600, margin: 0 },
  hr: { borderColor: "#e5e7eb", margin: "16px 0" },
  itemRow: { marginBottom: 8 },
  itemName: { fontSize: 14, margin: 0, fontWeight: 500 },
};

export default OrderConfirmationEmail;
