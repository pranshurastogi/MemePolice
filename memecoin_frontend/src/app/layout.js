import { WalletProvider } from './context/WalletContext';
import Header from './components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <WalletProvider>
      <html lang="en">
        <body>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </WalletProvider>
  );
}
