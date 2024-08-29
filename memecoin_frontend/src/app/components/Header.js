"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="font-bold text-xl">MemePolice</div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/memepolice">Meme Police</Link>
        {/* Add more links as needed */}
      </nav>
    </header>
  );
}
