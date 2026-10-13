"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";

import { supabase } from "../../../lib/supabase";
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);


  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const [cartAnimate, setCartAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const count = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );

    setCartCount(count);
  }, []);

useEffect(() => {
  const loadProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Product load error:", error);
      setLoading(false);
      return;
    }

    setProduct({
      ...data,
      image: data.image_url,
      price: `৳ ${Number(data.price).toLocaleString()}`,
      oldPrice: data.old_price
        ? `৳ ${Number(data.old_price).toLocaleString()}`
        : "",
      shortDescription: data.short_description,
      features: data.features || [],
      specifications: data.specifications || [],
    });

    const { data: relatedData, error: relatedError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .neq("slug", slug)
      .limit(3);

    if (relatedError) {
      console.error("Related product load error:", relatedError);
    } else {
      const formattedRelated = (relatedData || []).map((item) => ({
        ...item,
        image: item.image_url,
        price: `৳ ${Number(item.price).toLocaleString()}`,
        oldPrice: item.old_price
          ? `৳ ${Number(item.old_price).toLocaleString()}`
          : "",
      }));

      setRelatedProducts(formattedRelated);
    }

    setLoading(false);
  };

  loadProduct();
}, [slug]);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find(
      (item: any) => item.name === product.name
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
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

if (loading) {
  return (
    <main className="min-h-screen bg-white p-10">
      <div className="mx-auto max-w-[1200px]">
        Loading product...
      </div>
    </main>
  );
}

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <span>📧 support@livehaatbd.com</span>
          <span>📞 Customer Support</span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white">
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

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="/" className="hover:text-orange-500">
              Home
            </a>

            <a href="/#products" className="hover:text-orange-500">
              Shop
            </a>

            <a href="#" className="hover:text-orange-500">
              Contact
            </a>

            <a
              href="/cart"
              className={`relative flex h-11 w-11 items-center justify-center text-2xl transition-all duration-300 ${
                cartAnimate ? "scale-125 rotate-6" : "scale-100"
              }`}
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </a>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <a
              href="/cart"
              className={`relative flex h-10 w-10 items-center justify-center text-xl transition-all duration-300 ${
                cartAnimate ? "scale-125 rotate-6" : "scale-100"
              }`}
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
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
              <a href="/#products">Shop</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Breadcrumb */}
        <div className="border-b bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-4 py-4 text-sm text-gray-500">
            <a href="/">Home</a>

            <span className="mx-2">/</span>

            <a href="/#products">Shop</a>

            <span className="mx-2">/</span>

            <span className="text-black">{product.name}</span>
          </div>
        </div>

        {/* Main Product */}
        <section className="px-4 py-10">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2">
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border bg-[#f7f7f7] p-6 md:min-h-[520px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[500px] w-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                In Stock
              </span>

              <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 text-sm">
                <span className="text-yellow-500">★★★★★</span>
                <span className="ml-2 text-gray-500">5.0</span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span className="text-3xl font-bold text-orange-500">
                  {product.price}
                </span>

                <span className="text-xl text-gray-400 line-through">
                  {product.oldPrice}
                </span>
              </div>

              <p className="mt-6 leading-7 text-gray-600">
                {product.shortDescription}
              </p>

              <div className="my-7 border-t" />

              <p className="mb-3 text-sm font-semibold">Quantity</p>

              <div className="inline-flex w-fit items-center overflow-hidden rounded-lg border">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="h-11 w-11 text-xl hover:bg-gray-100"
                >
                  −
                </button>

                <span className="flex h-11 min-w-[48px] items-center justify-center border-x font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-11 w-11 text-xl hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={addToCart}
                  className="rounded-xl border-2 border-black px-5 py-4 font-semibold transition hover:bg-black hover:text-white"
                >
                  Add to Cart
                </button>

                <a
                  href={`/checkout?product=${encodeURIComponent(
                    product.name
                  )}&price=${encodeURIComponent(
                    product.price
                  )}&quantity=${quantity}`}
                  className="rounded-xl bg-orange-500 px-5 py-4 text-center font-semibold text-white hover:bg-orange-600"
                >
                  Buy Now
                </a>
              </div>

              <div className="mt-8 rounded-xl border">
                <div className="border-b p-4">
                  🚚 <strong>Delivery Charge:</strong> Inside Dhaka ৳70 /
                  Outside Dhaka ৳120
                </div>

                <div className="border-b p-4">
                  💵 <strong>Cash on Delivery Available</strong>
                </div>

                <div className="p-4">
                  ✅ <strong>Quality Checked Before Delivery</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="border-t bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="text-2xl font-bold md:text-3xl">
              Product Description
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              {product.description}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="text-2xl font-bold md:text-3xl">
              Key Features
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
             {product.features.map((feature: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border bg-white p-4"
                >
                  <span className="text-green-600">✓</span>

                  <span className="text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="border-t bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="text-2xl font-bold md:text-3xl">
              Product Specifications
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border bg-white">
             {product.specifications.map(
  (item: { label: string; value: string }, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-[130px_1fr] border-b last:border-b-0 sm:grid-cols-[220px_1fr]"
                >
                  <div className="bg-gray-50 p-4 font-semibold">
                    {item.label}
                  </div>

                  <div className="p-4 text-gray-600">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Related Products */}
<section className="border-t bg-white px-4 py-12">
  <div className="mx-auto max-w-[1200px]">
    <div className="mb-7">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
        You May Also Like
      </p>

      <h2 className="mt-2 text-2xl font-bold md:text-3xl">
        Related Products
      </h2>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {relatedProducts.map((item) => (
          <div
            key={item.slug}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
          >
            <a href={`/product/${item.slug}`}>
              <div className="aspect-square overflow-hidden bg-[#f7f7f7]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain p-4 transition duration-300 hover:scale-105"
                />
              </div>
            </a>

            <div className="p-4">
              <a href={`/product/${item.slug}`}>
                <h3 className="min-h-[48px] text-base font-semibold leading-6 text-black transition hover:text-orange-500">
                  {item.name}
                </h3>
              </a>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg font-bold text-orange-500">
                  {item.price}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {item.oldPrice}
                </span>
              </div>

              <a
                href={`/product/${item.slug}`}
                className="mt-4 block rounded-lg border border-orange-500 bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-transparent hover:text-orange-500"
              >
                View Product
              </a>
            </div>
          </div>
        ))}
    </div>
  </div>
</section>
      </main>

      {/* Toast */}
      {cartMessage && (
        <div className="fixed bottom-5 left-4 right-4 z-50 rounded-xl bg-black px-5 py-4 text-center text-sm font-medium text-white shadow-xl sm:left-auto sm:right-5 sm:max-w-[400px]">
          ✓ {cartMessage}
        </div>
      )}
    </>
  );
}