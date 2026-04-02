import "./globals.css";

export const metadata = {
  title: "International French Academy",
  description: "Professional French Language Academy in Kigali, Rwanda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}