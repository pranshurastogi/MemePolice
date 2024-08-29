import Header from "./components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="container mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
