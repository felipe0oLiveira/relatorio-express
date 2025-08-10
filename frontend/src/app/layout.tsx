import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoReport",
  description: "Plataforma de relatórios automatizados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
