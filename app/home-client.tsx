"use client";

import { useEffect, useState } from "react";

const menu = {
  Espresso: [
    "Espresso",
    "Americano",
    "Latte",
    "Soda",
    "Diesel (Espresso only)",
  ],
  "Pour Over": [
    "Thera Style (Ruin w/Oat Milk)",
    "Ryan Style (Pure as intended)",
  ],
  Matcha: ["Latte", "Soda", "Diesel (Tea Only)"],
};

type Category = keyof typeof menu;
type Temp = "Hot" | "Iced";

export default function HomeClient({ images }: { images: string[] }) {
  const [step, setStep] = useState<"home" | "category" | "drink">("home");

  const [category, setCategory] = useState<Category | null>(null);
  const [drink, setDrink] = useState<string | null>(null);
  const [temp, setTemp] = useState<Temp | null>(null);

  const [order, setOrder] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [readyIn, setReadyIn] = useState("");

  const readyOptions = [
    "ASAP",
    "10 min",
    "15 min",
    "20 min",
    "30 min",
    "45 min",
    "60 min",
  ];

  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    if (!images.length) return;
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, [images]);

  function resetSelection() {
    setDrink(null);
    setTemp(null);
  }

  function isDisabled(option: string) {
    if (!temp) return true;

    if (option === "Soda" && temp === "Hot") return true;
    if (option === "Diesel (Tea Only)" && category !== "Matcha") return true;

    return false;
  }

  function addToOrder() {
    if (!category || !drink || !temp) {
      alert("Select Hot/Iced and a drink");
      return;
    }

    const item = `${temp} ${drink} (${category})`;

    setOrder((prev) => [...prev, item]);

    resetSelection();
    setStep("category");
  }

  function removeItem(index: number) {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitOrder() {
    if (!order.length) {
      alert("Add at least one drink.");
      return;
    }

    if (!readyIn) {
      alert("Please select when you'd like the order ready.");
      return;
    }

    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order,
        notes,
        readyIn,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order sent ☕");

      setOrder([]);
      setNotes("");
      setReadyIn("");

      setStep("home");
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-8 text-sm">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-medium tracking-tight">
          Side Two Café
        </h1>

        <p className="text-zinc-500 mt-1 text-xs">
          Get a special little drink
        </p>
      </div>

      {/* HOME */}
      {step === "home" && (
        <>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-40 h-60 overflow-hidden rounded-2xl bg-zinc-100">
              {randomImage && (
                <img
                  src={randomImage}
                  className="w-full h-full object-cover"
                  alt="Coffee"
                />
              )}
            </div>
          </div>

          <button
            onClick={() => setStep("category")}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl"
          >
            ☕ Start Order
          </button>
        </>
      )}

      {/* CATEGORY */}
      {step === "category" && (
        <div className="flex-1 flex flex-col gap-3 mt-6">
          {Object.keys(menu).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat as Category);
                setStep("drink");
              }}
              className="w-full py-4 border rounded-2xl"
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setStep("home")}
            className="text-xs text-zinc-500 mt-4"
          >
            ← Back
          </button>
        </div>
      )}

      {/* DRINK */}
      {step === "drink" && category && (
        <div className="flex-1 flex flex-col gap-4 mt-6">
          {/* HOT / ICED */}
          <div className="flex gap-2">
            <button
              onClick={() => setTemp("Hot")}
              className={`flex-1 py-3 border rounded-2xl transition ${
                temp === "Hot"
                  ? "bg-red-100 border-red-300 text-red-700"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              Hot
            </button>

            <button
              onClick={() => setTemp("Iced")}
              className={`flex-1 py-3 border rounded-2xl transition ${
                temp === "Iced"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }`}
            >
              Iced
            </button>
          </div>

          {/* DRINK OPTIONS */}
          <div className="flex flex-col gap-2">
            {menu[category].map((item) => (
              <button
                key={item}
                disabled={!temp || isDisabled(item)}
                onClick={() => setDrink(item)}
                className={`w-full py-3 border rounded-2xl transition ${
                  drink === item
                    ? "bg-orange-500 text-white"
                    : ""
                } ${!temp || isDisabled(item) ? "opacity-30" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* ADD */}
          <button
            onClick={addToOrder}
            className="w-full mt-auto py-4 bg-green-500 text-white rounded-2xl"
          >
            Add to Order
          </button>

          <button
            onClick={() => setStep("category")}
            className="text-xs text-zinc-500"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ORDER SUMMARY */}
      {order.length > 0 && (
        <div className="mt-6 text-xs text-zinc-500">
          <p className="mb-2">Your Order:</p>

          {order.map((o, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-1"
            >
              <span>{o}</span>

              <button
                onClick={() => removeItem(i)}
                className="text-red-400 text-xs"
              >
                remove
              </button>
            </div>
          ))}

          {/* READY IN */}
          <div className="mt-5">
            <p className="mb-2 text-xs text-zinc-500">
              When should it be ready?
            </p>

            <div className="flex flex-wrap gap-2">
              {readyOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setReadyIn(option)}
                  className={`px-3 py-2 rounded-full border text-xs transition ${
                    readyIn === option
                      ? option === "ASAP"
                        ? "bg-orange-100 border-orange-300 text-orange-700"
                        : "bg-zinc-100 border-zinc-300 text-zinc-900"
                      : option === "ASAP"
                      ? "bg-orange-50 border-orange-100 text-orange-600"
                      : "bg-white border-zinc-200 text-zinc-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <div className="mt-4">
            <p className="mb-1 text-xs text-zinc-500">
              Notes (optional)
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra shot, less ice, oat milk..."
              className="w-full border rounded-2xl p-3 text-xs outline-none"
              rows={3}
            />
          </div>

          <button
            onClick={submitOrder}
            className="w-full mt-4 py-4 bg-black text-white rounded-2xl"
          >
            Send Order ☕
          </button>
        </div>
      )}
    </main>
  );
}