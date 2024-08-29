// src/app/layout.js
"use client"; // This ensures the layout is treated as a client component

import Header from "./components/Header";
import { WalletProvider } from "./context/WalletContext";
import "./globals.css"; // Import your global styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Header />
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
