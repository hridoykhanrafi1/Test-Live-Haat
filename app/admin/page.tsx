"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  old_price: number | null;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
};

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">
              LiveHaat Admin
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {userEmail}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Product Management
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Products
              </h2>
            </div>

            <a
              href="/admin/products/new"
              className="rounded-xl bg-orange-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
            >
              + Add Product
            </a>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-left text-sm">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-[260px] items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            /product/{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      ৳ {Number(product.price).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {product.in_stock ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {product.is_active ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="rounded-lg border px-3 py-2 text-sm font-medium"
                        >
                          View
                        </a>

                        <a
                          href={`/admin/products/${product.id}`}
                          className="rounded-lg border border-orange-500 px-3 py-2 text-sm font-medium text-orange-500"
                        >
                          Edit
                        </a>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                No products found.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}