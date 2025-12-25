import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";

const kindleLike = Literata({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "FutureNet",
  description:
    "A technologist-led research initiative into the digital landscape for children, adolescents, and their parents.",
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
