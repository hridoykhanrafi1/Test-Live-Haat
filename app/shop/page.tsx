"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ShopPage() {
    const [cartCount, setCartCount] = useState(0);
    const [cartMessage, setCartMessage] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
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

        setCartMessage(`${product.name} added to cart`);

        setTimeout(() => {
            setCartMessage("");
        }, 2000);
    };

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );

        if (sort === "low-high") {
            result = [...result].sort(
                (a, b) =>
                    Number(a.price.replace(/[^\d.]/g, "")) -
                    Number(b.price.replace(/[^\d.]/g, ""))
            );
        }

        if (sort === "high-low") {
            result = [...result].sort(
                (a, b) =>
                    Number(b.price.replace(/[^\d.]/g, "")) -
                    Number(a.price.replace(/[^\d.]/g, ""))
            );
        }

        return result;
}, [products, search, sort]);
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

                    <nav className="flex items-center gap-5 text-sm font-medium">
                        <a href="/">Home</a>

                        <a
                            href="/shop"
                            className="text-orange-500"
                        >
                            Shop
                        </a>

                        <a href="#">
                            Contact
                        </a>

                        <a
                            href="/cart"
                            className="relative flex h-11 w-11 items-center justify-center text-2xl"
                        >
                            🛒

                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </a>
                    </nav>
                </div>
            </header>

            {/* Shop Hero */}
            <section className="bg-orange-50 px-4 py-12">
                <div className="mx-auto max-w-[1200px] text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                        LiveHaat Shop
                    </p>

                    <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                        Explore Our Products
                    </h1>

                    <p className="mx-auto mt-4 max-w-[650px] leading-7 text-gray-600">
                        Discover useful, affordable and trending products for your
                        everyday needs.
                    </p>
                </div>
            </section>

            {/* Shop Content */}
            <section className="px-4 py-12">
                <div className="mx-auto max-w-[1200px]">
                    {/* Search + Sort */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 sm:max-w-[420px]"
                        />

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                        >
                            <option value="default">
                                Sort By
                            </option>

                            <option value="low-high">
                                Price: Low to High
                            </option>

                            <option value="high-low">
                                Price: High to Low
                            </option>
                        </select>
                    </div>

                    {/* Product Count */}
                    <div className="mt-7 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {filteredProducts.length} product
                            {filteredProducts.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.slug}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="aspect-square overflow-hidden bg-[#f7f7f7]">
                                        <a href={`/product/${product.slug}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-contain p-3 transition duration-300 hover:scale-105"
                                            />
                                        </a>
                                    </div>

                                    <div className="p-4">
                                        <a href={`/product/${product.slug}`}>
                                            <h2 className="min-h-[48px] text-base font-semibold leading-6 hover:text-orange-500">
                                                {product.name}
                                            </h2>
                                        </a>

                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-lg font-bold text-orange-500">
                                                {product.price}
                                            </span>

                                            <span className="text-sm text-gray-400 line-through">
                                                {product.oldPrice}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                className="rounded-lg border border-orange-500 bg-orange-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-orange-500"
                                            >
                                                Add to Cart
                                            </button>

                                            <a
                                                href={`/checkout?product=${encodeURIComponent(
                                                    product.name
                                                )}&price=${encodeURIComponent(product.price)}`}
                                                className="rounded-lg border border-orange-500 bg-transparent px-3 py-3 text-center text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
                                            >
                                                Buy Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-10 rounded-2xl bg-gray-50 p-10 text-center">
                            <h2 className="text-xl font-bold">
                                No products found
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Try searching with a different product name.
                            </p>
                        </div>
                    )}
                </div>
            </section>
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
            <footer className="bg-[#111111] px-4 pt-12 text-white">
                <div className="mx-auto max-w-[1200px]">
                    <div className="grid gap-8 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Image
                                src="/logo haat.webp"
                                alt="LiveHaat Logo"
                                width={140}
                                height={44}
                                className="h-auto w-[140px]"
                            />

                            <p className="mt-4 text-sm leading-7 text-gray-400">
                                Useful and affordable products with easy ordering and
                                nationwide delivery.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold">
                                Quick Links
                            </h3>

                            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                                <a href="/">Home</a>
                                <a href="/shop">Shop</a>
                                <a href="/cart">Cart</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold">
                                Support
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-gray-400">
                                <p>01871848309</p>
                                <p>livehaat@gmail.com</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold">
                                Shopping
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-gray-400">
                                <p>✓ Cash on Delivery</p>
                                <p>✓ Fast Delivery</p>
                                <p>✓ Quality Checked</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 text-center text-xs text-gray-500">
© 2026 LiveHaat. All rights reserved.                    </div>
                </div>
            </footer>

            {/* Toast */}
            {cartMessage && (
                <div className="fixed bottom-5 left-4 right-4 z-50 rounded-xl bg-black px-5 py-4 text-center text-sm font-medium text-white shadow-xl sm:left-auto sm:right-5 sm:max-w-[420px]">
                    ✓ {cartMessage}
                </div>
            )}
        </main>
    );
}