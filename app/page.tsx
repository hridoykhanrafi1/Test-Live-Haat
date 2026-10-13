"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const count = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );

    setCartCount(count);
  }, []);
  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Product load error:", error);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        image: product.image_url,
        price: `৳ ${Number(product.price).toLocaleString()}`,
        oldPrice: product.old_price
          ? `৳ ${Number(product.old_price).toLocaleString()}`
          : "",
      }));

      setProducts(formattedProducts);
    };

    loadProducts();
  }, []);
  useEffect(() => {
    if (products.length <= 1) return;

    const slider = setInterval(() => {
      setHeroSlide((current) =>
        current === products.length - 1 ? 0 : current + 1
      );
    }, 3500);

    return () => clearInterval(slider);
  }, []);

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find(
      (item: any) => item.name === product.name
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const count = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );

    setCartCount(count);

    setCartAnimate(true);

    setTimeout(() => {
      setCartAnimate(false);
    }, 400);

    setCartMessage(`${product.name} added to cart`);

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2 text-sm">
          <p>livehaat@gmail.com</p>

          <a href="tel:01871848309">
            01871848309
          </a>
        </div>
      </div>

      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
          <a href="/">
            <Image
              src="/logo haat.webp"
              alt="LiveHaat Logo"
              width={140}
              height={44}
              priority
              className="h-auto w-[140px]"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/">Home</a>

            <a href="/shop">Shop</a>

            <a href="#">
              Contact
            </a>

            <a
              href="/cart"
              className={`relative flex h-11 w-11 items-center justify-center text-2xl text-black transition-all duration-300 hover:scale-105 ${cartAnimate ? "scale-125 rotate-6" : "scale-100"
                }`}
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </a>
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="/cart"
              className={`relative flex h-10 w-10 items-center justify-center text-xl text-black transition-all duration-300 ${cartAnimate ? "scale-125 rotate-6" : "scale-100"
                }`}
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-xl"
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <a href="/">Home</a>
              <a href="/shop">Shop</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10 md:py-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-2">
          {/* Hero Left */}
          <div className="text-center md:text-left">
            <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
              Best Deals • Trusted Products
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-black sm:text-5xl md:text-6xl">
              Smart Products
              <span className="block text-orange-500">
                For Everyday Life
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[520px] text-base leading-7 text-gray-600 md:mx-0 md:text-lg">
              Discover useful, affordable and trending products for your home,
              lifestyle and everyday needs.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#products"
                className="rounded-xl bg-orange-500 px-7 py-4 text-center font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
              >
                Shop Now
              </a>

              <a
                href="#products"
                className="rounded-xl border border-orange-500 bg-transparent px-7 py-4 text-center font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
              >
                View Products
              </a>
            </div>

            {/* Trust Boxes */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center md:max-w-[500px]">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-lg font-bold text-black">
                  100%
                </p>

                <p className="text-xs text-gray-500">
                  Quality Check
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-lg font-bold text-black">
                  COD
                </p>

                <p className="text-xs text-gray-500">
                  Cash on Delivery
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-lg font-bold text-black">
                  Fast
                </p>

                <p className="text-xs text-gray-500">
                  Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Hero Right */}
          {/* Hero Product Slider */}
          {/* Hero Product Slider */}
          <div className="relative flex items-center justify-center">
            {products.length > 0 ? (
              <>
                <div className="absolute h-[320px] w-[320px] rounded-full bg-orange-200 opacity-50 blur-3xl sm:h-[420px] sm:w-[420px]" />

                <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

                  <a
                    href={`/product/${products[heroSlide].slug}`}
                    className="group block"
                  >
                    <div className="relative flex h-[340px] items-center justify-center overflow-hidden bg-gradient-to-br from-white to-orange-50 p-8 sm:h-[420px]">
                      <img
                        src={products[heroSlide].image}
                        alt={products[heroSlide].name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md">
                        Featured Product
                      </div>

                      <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-2 text-xs font-semibold text-white">
                        SALE
                      </div>
                    </div>
                  </a>

                  <div className="p-5 sm:p-6">
                    <a href={`/product/${products[heroSlide].slug}`}>
                      <h3 className="text-lg font-bold text-black transition hover:text-orange-500 sm:text-xl">
                        {products[heroSlide].name}
                      </h3>
                    </a>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-2xl font-bold text-orange-500">
                        {products[heroSlide].price}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        {products[heroSlide].oldPrice}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <a
                        href={`/product/${products[heroSlide].slug}`}
                        className="rounded-lg border border-orange-500 bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-orange-500"
                      >
                        View Product
                      </a>

                      <div className="flex items-center gap-2">
                        {products.map((item, index) => (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => setHeroSlide(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${heroSlide === index
                                ? "w-7 bg-orange-500"
                                : "w-2.5 bg-gray-300 hover:bg-gray-400"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setHeroSlide((current) =>
                        current === 0 ? products.length - 1 : current - 1
                      )
                    }
                    className="absolute left-3 top-[42%] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-lg"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setHeroSlide((current) =>
                        current === products.length - 1 ? 0 : current + 1
                      )
                    }
                    className="absolute right-3 top-[42%] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-lg"
                  >
                    ›
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-[420px] w-full max-w-[520px] items-center justify-center rounded-3xl border bg-white text-gray-500 shadow-xl">
                Loading products...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="bg-white px-4 py-14"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              New Arrivals
            </p>

            <h2 className="mt-2 text-3xl font-bold text-black md:text-4xl">
              Top Selling Products
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-[#f7f7f7]">
                  <a href={`/product/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-3 transition duration-300 hover:scale-105"
                    />
                  </a>
                </div>

                {/* Product Content */}
                <div className="p-4">
                  <a href={`/product/${product.slug}`}>
                    <h3 className="min-h-[48px] text-base font-semibold leading-6 text-black transition hover:text-orange-500">
                      {product.name}
                    </h3>
                  </a>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-lg font-bold text-orange-500">
                      {product.price}
                    </p>

                    <p className="text-sm text-gray-400 line-through">
                      {product.oldPrice}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-lg border border-gray-300 px-3 py-3 text-sm font-semibold text-black transition hover:border-black hover:bg-gray-50"
                    >
                      Add to Cart
                    </button>

                    <a
                      href={`/checkout?product=${encodeURIComponent(
                        product.name
                      )}&price=${encodeURIComponent(product.price)}`}
                      className="rounded-lg bg-orange-500 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Why Choose LiveHaat
            </p>

            <h2 className="mt-2 text-3xl font-bold text-black md:text-4xl">
              Shopping Made Simple
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-gray-600 md:text-base">
              We focus on useful products, easy ordering and a smooth shopping
              experience from checkout to delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                ✅
              </div>

              <h3 className="mt-4 text-lg font-bold text-black">
                Quality Checked
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Products are checked before delivery for a better shopping
                experience.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🚚
              </div>

              <h3 className="mt-4 text-lg font-bold text-black">
                Fast Delivery
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Reliable delivery service across Dhaka and other districts in
                Bangladesh.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                💵
              </div>

              <h3 className="mt-4 text-lg font-bold text-black">
                Cash on Delivery
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Order easily and pay when your product arrives at your doorstep.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                💬
              </div>

              <h3 className="mt-4 text-lg font-bold text-black">
                Customer Support
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Need help with an order? Our support team is ready to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Customer Reviews */}
      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Customer Reviews
            </p>

            <h2 className="mt-2 text-3xl font-bold text-black md:text-4xl">
              What Our Customers Say
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-gray-600 md:text-base">
              Real feedback from customers who have ordered products from LiveHaat.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-yellow-500">
                  ★★★★★
                </div>

                <span className="text-4xl font-bold text-orange-100">
                  “
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                Product quality was really good and the delivery was also fast.
                Ordering process was very easy.
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-bold text-black">
                  Rahim Ahmed
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Dhaka
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-yellow-500">
                  ★★★★★
                </div>

                <span className="text-4xl font-bold text-orange-100">
                  “
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                I received the product exactly as shown. Very satisfied with the
                service and cash on delivery system.
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-bold text-black">
                  Nusrat Jahan
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Chattogram
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-yellow-500">
                  ★★★★★
                </div>

                <span className="text-4xl font-bold text-orange-100">
                  “
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                Nice experience overall. The product was useful and the support
                team responded quickly.
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-bold text-black">
                  Tanvir Hasan
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Rajshahi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden rounded-3xl bg-black px-6 py-10 text-center text-white md:px-10 md:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Shop With Confidence
            </p>

            <h2 className="mx-auto mt-3 max-w-[750px] text-3xl font-bold leading-tight md:text-5xl">
              Find The Right Product For Your Everyday Needs
            </h2>

            <p className="mx-auto mt-5 max-w-[650px] text-sm leading-7 text-gray-300 md:text-base">
              Explore useful products, enjoy cash on delivery and get your order
              delivered anywhere in Bangladesh.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#products"
                className="rounded-xl bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
              >
                Shop Now
              </a>

              <a
                href="tel:01871848309"
                className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Call Us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-300">
              <span>✓ Cash on Delivery</span>
              <span>✓ Fast Delivery</span>
              <span>✓ Quality Checked</span>
              <span>✓ Customer Support</span>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#111111] px-4 pt-14 text-white">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>
              <a href="/" className="inline-block">
                <Image
                  src="/logo haat.webp"
                  alt="LiveHaat Logo"
                  width={140}
                  height={44}
                  className="h-auto w-[140px]"
                />
              </a>

              <p className="mt-5 max-w-[280px] text-sm leading-7 text-gray-400">
                LiveHaat brings useful, affordable and trending products for
                everyday life with easy ordering and nationwide delivery.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold">
                Quick Links
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
                <a
                  href="/"
                  className="transition hover:text-orange-400"
                >
                  Home
                </a>

                <a
                  href="#products"
                  className="transition hover:text-orange-400"
                >
                  Shop
                </a>

                <a
                  href="/cart"
                  className="transition hover:text-orange-400"
                >
                  Cart
                </a>

                <a
                  href="#"
                  className="transition hover:text-orange-400"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-lg font-bold">
                Customer Support
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
                <a
                  href="tel:01871848309"
                  className="transition hover:text-orange-400"
                >
                  📞 01871848309
                </a>

                <a
                  href="mailto:livehaat@gmail.com"
                  className="transition hover:text-orange-400"
                >
                  ✉️ livehaat@gmail.com
                </a>

                <p>
                  🚚 Delivery Across Bangladesh
                </p>

                <p>
                  💵 Cash on Delivery
                </p>
              </div>
            </div>

            {/* Important Info */}
            <div>
              <h3 className="text-lg font-bold">
                Shopping With Us
              </h3>

              <div className="mt-5 space-y-3 text-sm leading-6 text-gray-400">
                <p>
                  ✓ Quality Checked Products
                </p>

                <p>
                  ✓ Fast Order Processing
                </p>

                <p>
                  ✓ Cash on Delivery
                </p>

                <p>
                  ✓ Customer Support
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col gap-3 py-6 text-center text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} LiveHaat. All rights reserved.
            </p>

            <p>
              Made for a simple and reliable shopping experience.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Toast */}
      {cartMessage && (
        <div className="fixed bottom-5 left-4 right-4 z-50 rounded-xl bg-black px-5 py-4 text-center text-sm font-medium text-white shadow-xl sm:left-auto sm:right-5">
          ✓ {cartMessage}
        </div>
      )}
    </main>
  );
}