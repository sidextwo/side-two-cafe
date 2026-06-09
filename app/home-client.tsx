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
  const [customerName, setCustomerName] = useState("");
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
    if (!category || !drink || !temp) return;

    const item = `${temp} ${drink} (${category})`;
    setOrder((prev) => [...prev, item]);

    resetSelection();
    setStep("category");
  }

  function removeItem(index: number) {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitOrder() {
    if (!customerName.trim() || !order.length || !readyIn) return;

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        order,
        notes,
        readyIn,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setOrder([]);
      setCustomerName("");
      setNotes("");
      setReadyIn("");
      setCategory(null);
      setDrink(null);
      setTemp(null);
      setStep("home");
    }
  }

  return (
  <main className="min-h-dvh bg-white flex justify-center px-3 py-4 text-[11px]">

    {/* APP SHELL */}
    <div className="w-full max-w-[290px] flex flex-col gap-4 pb-12">

      {/* HEADER */}
      <div className="text-center leading-tight">
       <h1 className="text-2xl font-medium tracking-tight">
  Side Two Café
</h1>
        <p className="text-zinc-500 text-[10px] mt-1">
          Get a special little drink
        </p>
      </div>

      {/* HOME */}
      {step === "home" && (
        <>
          <div className="flex flex-col items-center gap-4">

            <div className="w-40 h-60 overflow-hidden rounded-lg bg-zinc-100">
              {randomImage && (
                <img
                  src={randomImage}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* NAME (NARROWER + CENTERED) */}
            <div className="w-[70%]">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full border rounded-lg p-2 text-[11px] text-center"
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
  <button
    onClick={() => {
      if (!customerName.trim()) return;
      setStep("category");
    }}
    className="w-[70%] py-2.5 bg-orange-500 text-white rounded-lg"
  >
    Start
  </button>
</div>
        </>
      )}

      {/* CATEGORY */}
      {step === "category" && (
        <div className="flex flex-col items-center gap-3">

          {/* CATEGORY CARDS */}
          <div className="w-[70%] flex flex-col gap-2">
            {Object.keys(menu).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat as Category);
                  setStep("drink");
                }}
                className="py-2 border rounded-lg"
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep("home")}
            className="text-[10px] text-zinc-500 mt-2"
          >
            ← Back
          </button>
        </div>
      )}

      {/* DRINK */}
      {step === "drink" && category && (
        <div className="flex flex-col items-center gap-4">

          {/* HOT / ICED */}
          <div className="flex gap-2 w-[70%]">
            <button
              onClick={() => setTemp("Hot")}
              className={`flex-1 py-2 border rounded-lg ${
                temp === "Hot"
                  ? "bg-red-100 border-red-300"
                  : "bg-red-50"
              }`}
            >
              Hot
            </button>

            <button
              onClick={() => setTemp("Iced")}
              className={`flex-1 py-2 border rounded-lg ${
                temp === "Iced"
                  ? "bg-blue-100 border-blue-300"
                  : "bg-blue-50"
              }`}
            >
              Iced
            </button>
          </div>

          {/* DRINKS (NARROW + MORE SPACING) */}
          <div className="w-[70%] flex flex-col gap-2">
            {menu[category].map((item) => (
              <button
                key={item}
                disabled={!temp || isDisabled(item)}
                onClick={() => setDrink(item)}
                className={`py-2 border rounded-lg ${
                  drink === item ? "bg-orange-500 text-white" : ""
                } ${!temp || isDisabled(item) ? "opacity-30" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={addToOrder}
            className="w-[70%] self-center py-2.5 bg-green-500 text-white rounded-lg mt-2"
          >
            Add
          </button>

          <button
            onClick={() => setStep("category")}
            className="text-[10px] text-zinc-500"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ORDER */}
      {order.length > 0 && (
        <div className="flex flex-col gap-4 text-[10px] text-zinc-600">

          {/* ORDER LIST */}
          <div className="w-[70%] self-center flex flex-col gap-1.5">
            <p className="mb-1">Your Order</p>

            {order.map((o, i) => (
              <div key={i} className="flex justify-between">
                <span>{o}</span>
                <button onClick={() => removeItem(i)}>x</button>
              </div>
            ))}
          </div>

          {/* READY */}
          <div className="w-[70%] self-center flex flex-col gap-2">
            <p>Ready</p>

            <div className="flex flex-wrap gap-1.5">
              {readyOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setReadyIn(option)}
                  className={`px-2 py-1 border rounded-full ${
                    readyIn === option ? "bg-zinc-200" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            className="w-[70%] self-center border rounded-lg p-2 text-[11px]"
            rows={2}
          />

          <button
            onClick={submitOrder}
            className="w-[70%] self-center py-2.5 bg-black text-white rounded-lg mt-2"
          >
            Send
          </button>
        </div>
      )}

    </div>
  </main>
);
}