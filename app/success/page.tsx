"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";
  const name = searchParams.get("name") || "";
  const total = searchParams.get("total") || "";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-[550px] rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-5 text-3xl font-bold">
          Order Confirmed
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. We will contact you soon.
        </p>

        {orderId && (
          <p className="mt-4 font-semibold">
            Order ID: {orderId}
          </p>
        )}
        {name && (
          <p className="mt-2 text-gray-700">
            Customer: {name}
          </p>
        )}

        {total && (
          <p className="mt-2 text-xl font-bold text-orange-500">
            Total: {total}
          </p>
        )}

        <a
          href="/"
          className="mt-7 inline-block rounded-full bg-orange-500 px-7 py-3 font-semibold text-white"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}