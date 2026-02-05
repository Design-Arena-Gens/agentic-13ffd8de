import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pan Dabba Quick Receipt",
  description:
    "Tap-only stock and receipt maker for pan shop owners. Select items, adjust quantity, share via WhatsApp instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
