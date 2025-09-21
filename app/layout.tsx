import type { Metadata } from "next";
import "./styles/global.css"
import "./index.css"

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
