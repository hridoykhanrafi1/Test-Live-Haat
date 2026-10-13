"use client";

import { useEffect, useState } from "react";

type CartItem = {
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const updateQuantity = (
    index: number,
    change: number
  ) => {
    const updatedCart = [...cart];

    updatedCart[index].quantity += change;

    if (updatedCart[index].quantity < 1) {
      updatedCart[index].quantity = 1;
    }

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter(
      (_, i) => i !== index
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const getNumericPrice = (price: string) => {
    return Number(
      price.replace(/[^\d.]/g, "")
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      getNumericPrice(item.price) *
      item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center">
            <p>Your cart is empty.</p>

            <a
              href="/"
              className="mt-4 inline-block rounded-full bg-orange-500 px-6 py-3 text-white"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-orange-500">
                      {item.price}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(index, -1)
                        }
                        className="h-8 w-8 rounded-full border"
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(index, 1)
                        }
                        className="h-8 w-8 rounded-full border"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(index)
                    }
                    className="self-start text-sm font-medium text-red-500 sm:self-auto"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ৳ {total.toLocaleString()}
                </span>
              </div>

              <a
                href="/checkout?from=cart"
                className="mt-6 block w-full rounded-full bg-orange-500 px-6 py-4 text-center font-semibold text-white"
              >
                Proceed to Checkout
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}