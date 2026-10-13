"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import RichTextEditor from "../../../../components/RichTextEditor";

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [message, setMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [richContent, setRichContent] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    old_price: "",
    image_url: "",
    short_description: "",
    description: "",
    features: "",
    specifications: "",
    in_stock: true,
    is_active: true,
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setCheckingUser(false);
    };

    checkUser();
  }, [router]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((current) => ({
      ...current,
      name: value,
      slug: generatedSlug,
    }));
  };
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setImageUploading(true);
  setMessage("");

  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) {
    setMessage(uploadError.message);
    setImageUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  setForm((current) => ({
    ...current,
    image_url: data.publicUrl,
  }));

  setImageUploading(false);
};
const handleContentImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  blockId: number
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `content/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) {
    setMessage(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);


};
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    let parsedFeatures = [];
    let parsedSpecifications = [];

    try {
      parsedFeatures = form.features
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      parsedSpecifications = form.specifications
        .split("\n")
        .map((line) => {
          const [label, ...rest] = line.split(":");

          return {
            label: label?.trim(),
            value: rest.join(":").trim(),
          };
        })
        .filter(
          (item) => item.label && item.value
        );
    } catch {
      setMessage("Features or specifications format is invalid.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name: form.name,
          slug: form.slug,
          price: Number(form.price),
          old_price: form.old_price
            ? Number(form.old_price)
            : null,
          image_url: form.image_url,
          short_description:
            form.short_description,
          description: form.description,
          features: parsedFeatures,
          specifications: parsedSpecifications,
          in_stock: form.in_stock,
          is_active: form.is_active,
          updated_at: new Date().toISOString(),
          content: richContent,
        },
      ]);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  if (checkingUser) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <p>Checking admin access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Product Management
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Add New Product
            </h1>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
          >
            ← Back to Products
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleNameChange}
                placeholder="Example: Portable Blender"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Slug
              </label>

              <input
                type="text"
                name="slug"
                required
                value={form.slug}
                onChange={handleChange}
                placeholder="portable-blender"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Price
              </label>

              <input
                type="number"
                name="price"
                required
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="950"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Old Price
              </label>

              <input
                type="number"
                name="old_price"
                min="0"
                value={form.old_price}
                onChange={handleChange}
                placeholder="1250"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>
          </div>

<div className="mt-6">
  <label className="mb-2 block text-sm font-semibold">
    Product Image
  </label>

  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-orange-500 hover:bg-orange-50">
    <span className="text-3xl">🖼️</span>

    <span className="mt-3 font-semibold text-black">
      {imageUploading ? "Uploading image..." : "Choose Product Image"}
    </span>

    <span className="mt-1 text-xs text-gray-500">
      JPG, PNG or WEBP
    </span>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={imageUploading}
      className="hidden"
    />
  </label>

  {form.image_url && (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold">
        Image Preview
      </p>

      <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        <img
          src={form.image_url}
          alt="Product preview"
          className="h-full w-full object-contain"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          setForm((current) => ({
            ...current,
            image_url: "",
          }))
        }
        className="mt-4 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
      >
        Remove Image
      </button>
    </div>
  )}
</div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Short Description
            </label>

            <textarea
              name="short_description"
              required
              rows={3}
              value={form.short_description}
              onChange={handleChange}
              placeholder="Short product summary..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Full Description
            </label>

            <textarea
              name="description"
              required
              rows={6}
              value={form.description}
              onChange={handleChange}
              placeholder="Write full product details..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Features
            </label>

            <textarea
              name="features"
              rows={7}
              value={form.features}
              onChange={handleChange}
              placeholder={`One feature per line

Portable design
Easy to use
Fast operation
Easy to clean`}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Write one feature per line.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Specifications
            </label>

            <textarea
              name="specifications"
              rows={7}
              value={form.specifications}
              onChange={handleChange}
              placeholder={`Product Type: Portable Blender
Material: ABS Plastic
Usage: Juice & Smoothies
Design: Portable`}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Write each specification as:
              <strong> Label: Value</strong>
            </p>
          </div>
{/* Rich Content Builder */}
<div className="mt-8">
  <div className="mb-3">
    <h2 className="text-xl font-bold">
      Rich Product Content
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Write product details, format text, and add images directly inside the content.
    </p>
  </div>

  <RichTextEditor
    value={richContent}
    onChange={setRichContent}
  />
</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-semibold">
                  In Stock
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Product can currently be ordered.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    in_stock: e.target.checked,
                  }))
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-semibold">
                  Active
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Show this product on the website.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    is_active: e.target.checked,
                  }))
                }
                className="h-5 w-5"
              />
            </label>
          </div>

          {message && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <a
              href="/admin"
              className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}