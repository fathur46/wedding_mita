"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { weddingConfig, type GiftAccount } from "@/lib/content";

export default function GiftSection() {
  if (weddingConfig.giftAccounts.length === 0) return null;

  return (
    <section id="gift" className="w-full bg-black px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-nk-red">Bonus Features</p>
        <h2 className="mb-2 font-display text-3xl tracking-wide text-white">Send A Gift</h2>
        <p className="mb-6 max-w-sm text-sm text-nk-mist">{weddingConfig.giftNote}</p>

        <div className="flex flex-col gap-4">
          {weddingConfig.giftAccounts.map((account) => (
            <AccountCard key={account.owner} account={account} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AccountCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the number is still visible to copy by hand.
    }
  }

  return (
    <div className="rounded-lg bg-nk-panel p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-nk-red">{account.owner}</p>
      <p className="mb-3 font-display text-xl text-white">
        {account.bankName} <span className="font-body text-sm font-normal text-nk-mist">a.n. {account.accountHolder}</span>
      </p>
      <div className="flex items-center justify-between gap-3 rounded-md bg-black/40 px-3 py-2.5">
        <span className="font-mono text-sm tracking-wider text-white/90">{account.accountNumber}</span>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            copied ? "bg-nk-red text-white" : "bg-white/10 text-white/80 active:bg-white/20"
          }`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
