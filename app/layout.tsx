import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";

const kindleLike = Literata({ subsets: ["latin"], weight: ["400", "600"] });

const metadataBaseUrl = (() => {
  const raw = (process.env.SITE_URL ?? process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
})();

export const metadata: Metadata = {
  title: "FutureNet",
  description:
    "A technologist-led research initiative into the digital landscape for children, adolescents, and their parents.",
  metadataBase: metadataBaseUrl,
  openGraph: {
    title: "FutureNet",
    description:
      "A technologist-led research initiative into the digital landscape for children, adolescents, and their parents.",
    images: [
      {
        url: "/doodles/png/tree.png",
        width: 512,
        height: 512,
        alt: "FutureNet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureNet",
    description:
      "A technologist-led research initiative into the digital landscape for children, adolescents, and their parents.",
    images: ["/doodles/png/tree.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kindleLike.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
