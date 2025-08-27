import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "../components/SolanaWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meme Radar - Solana Memecoin Tracker",
  description: "Track hot Solana memecoins with real-time volume and price data. Find the next trending memecoin before it explodes!",
  keywords: "solana, memecoin, crypto, trading, volume, dex screener, trending",
  authors: [{ name: "Meme Radar" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
