"use client";

import { useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
};

const ITEMS: Item[] = [
  { id: "gold-flake-kings", name: "Gold Flake Kings" },
  { id: "wills-navy-cut", name: "Wills Navy Cut" },
  { id: "classic-mild", name: "Classic Mild" },
  { id: "four-square", name: "Four Square" },
  { id: "manikchand-bidi", name: "Manikchand Bidi" },
  { id: "rajnigandha-silver", name: "Rajnigandha (Silver)" },
  { id: "meetha-supari", name: "Meetha Supari" },
  { id: "vimal-gutka", name: "Vimal Gutka" },
  { id: "double-apple-hookah", name: "Double Apple Hookah" },
  { id: "grape-mint-hookah", name: "Grape Mint Hookah" },
  { id: "ready-meetha-paan", name: "Ready Meetha Paan" },
  { id: "plain-supari", name: "Plain Supari" },
];

type Quantities = Record<string, number>;

const buildInitialQuantities = () =>
  ITEMS.reduce<Quantities>((accumulator, item) => {
    accumulator[item.id] = 0;
    return accumulator;
  }, {});

export default function HomePage() {
  const [quantities, setQuantities] = useState<Quantities>(
    buildInitialQuantities,
  );
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const selectedItems = useMemo(() => {
    return ITEMS.filter((item) => quantities[item.id] > 0).map((item) => ({
      ...item,
      quantity: quantities[item.id],
    }));
  }, [quantities]);

  const receiptText = useMemo(() => {
    if (selectedItems.length === 0) {
      return "🧾 Pan Dabba Receipt\nNo items selected";
    }

    const lines = selectedItems.map(
      (item) => `• ${item.name} x ${item.quantity}`,
    );
    return ["🧾 Pan Dabba Receipt", ...lines].join("\n");
  }, [selectedItems]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((previous) => {
      const next = { ...previous };
      const nextValue = Math.max(0, (next[id] ?? 0) + delta);
      next[id] = nextValue;
      return next;
    });
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(receiptText);
    const shareUrl = `https://wa.me/?text=${encoded}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      setCopyFeedback("Copy not supported on this device.");
      return;
    }
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopyFeedback("Receipt copied. Ready to paste!");
      window.setTimeout(() => setCopyFeedback(null), 2500);
    } catch (error) {
      console.error("Copy failed", error);
      setCopyFeedback("Unable to copy. Please try again.");
      window.setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  return (
    <main>
      <header>
        <h1>Pan Dabba Quick Receipt</h1>
        <p className="subtitle">Tap to add. Share instantly. No typing needed.</p>
      </header>

      <section className="item-grid" aria-label="Available items">
        {ITEMS.map((item) => {
          const quantity = quantities[item.id];
          const isActive = quantity > 0;
          return (
            <article
              key={item.id}
              className={`item-card${isActive ? " active" : ""}`}
            >
              <div className="item-name">{item.name}</div>
              <div className="quantity-control">
                <button
                  type="button"
                  aria-label={`Remove one ${item.name}`}
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  –
                </button>
                <div className="quantity-display">{quantity}</div>
                <button
                  type="button"
                  aria-label={`Add one ${item.name}`}
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="receipt-box" aria-live="polite">
        <h2 className="receipt-title">🧾 Pan Dabba Receipt</h2>
        {selectedItems.length === 0 ? (
          <p className="empty-state">
            No items added yet. Tap + to start building your receipt.
          </p>
        ) : (
          <ul className="receipt-list">
            {selectedItems.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="actions">
        <button
          type="button"
          className="primary-action"
          onClick={handleWhatsAppShare}
        >
          📲 Send via WhatsApp
        </button>
        <button type="button" className="secondary-action" onClick={handleCopy}>
          📋 Copy Receipt
        </button>
      </div>

      {copyFeedback && <p className="helper-text">{copyFeedback}</p>}
    </main>
  );
}
