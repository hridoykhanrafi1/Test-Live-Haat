"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestSupabasePage() {
  const [message, setMessage] = useState("Checking connection...");

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error(error);
        return;
      }

      setMessage(
        `Supabase connected successfully. Products found: ${data.length}`
      );

      console.log("Products:", data);
    };

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-white p-10">
      <div className="mx-auto max-w-[800px] rounded-2xl border p-6">
        <h1 className="text-2xl font-bold">
          Supabase Connection Test
        </h1>

        <p className="mt-4 text-gray-600">
          {message}
        </p>
      </div>
    </main>
  );
}