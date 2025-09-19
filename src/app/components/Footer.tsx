"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-4 text-center border-t bg-white">
      <p className="text-sm text-gray-500">
        © {year}{" "}
        <Link
          href="https://gusmfscoder.com.br"
          target="_blank"
          className="hover:underline"
        >
          gusmfscoder.com.br
        </Link>{" "}
        — Todos os direitos reservados.
      </p>
    </footer>
  );
}
