import React from "react";

type MethodKey =
  | "mada" | "visa" | "mastercard" | "amex" | "apple-pay" | "stc-pay" | "sadad"
  | "tamara" | "tabby";

const ALL_METHODS: Record<MethodKey, { src: string; alt: string }> = {
  "mada":       { src: "/brand/pay/mada.svg",        alt: "مدى" },
  "visa":       { src: "/brand/pay/visa.svg",        alt: "Visa" },
  "mastercard": { src: "/brand/pay/mastercard.svg",  alt: "Mastercard" },
  "amex":       { src: "/brand/pay/amex.svg",        alt: "American Express" },
  "apple-pay":  { src: "/brand/pay/apple-pay.svg",   alt: "Apple Pay" },
  "stc-pay":    { src: "/brand/pay/stc-pay.svg",     alt: "STC Pay" },
  "sadad":      { src: "/brand/pay/sadad.svg",       alt: "سداد" },
  // اختياري (BNPL):
  "tamara":     { src: "/brand/pay/tamara.svg",      alt: "تمارا" },
  "tabby":      { src: "/brand/pay/tabby.svg",       alt: "تابي" },
};

interface Props {
  /** اذكر فقط الوسائل المفعّلة فعليًا بحسابك لدى مزوّد الدفع */
  methods?: MethodKey[];
  className?: string;
  title?: string;
}

export default function AcceptedPayments({
  methods = ["mada","visa","mastercard","amex","apple-pay","stc-pay","sadad"],
  className = "",
  title = "وسائل الدفع المقبولة"
}: Props) {
  const items = methods.map(k => ALL_METHODS[k]).filter(Boolean);
  if (!items.length) return null;

  return (
    <section aria-label={title} className={`w-full ${className}`} dir="rtl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-3 text-sm opacity-80 font-almarai text-gray-600">
          {title}
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {items.map(it => (
            <li key={it.src} className="h-8 md:h-9 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img
                src={it.src}
                alt={`وسيلة دفع: ${it.alt}`}
                className="h-full w-auto filter drop-shadow-sm hover:drop-shadow-md transition-all duration-300"
                loading="lazy"
                decoding="async"
                height={36}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}