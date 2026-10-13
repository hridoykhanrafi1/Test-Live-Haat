"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


type CartItem = {
    name: string;
    price: string;
    image: string;
    quantity: number;
};

function CheckoutContent() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const fromCart = searchParams.get("from") === "cart";
    const singleProduct = searchParams.get("product") || "";
    const singlePrice = searchParams.get("price") || "";
    const singleQuantity = Number(searchParams.get("quantity")) || 1;

    const [cart, setCart] = useState<CartItem[]>([]);
    const [quantity, setQuantity] = useState(singleQuantity);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (fromCart) {
            const savedCart = JSON.parse(
                localStorage.getItem("cart") || "[]"
            );

            setCart(savedCart);
        }
    }, [fromCart]);

    const getNumericPrice = (price: string) => {
        return Number(price.replace(/[^\d.]/g, "")) || 0;
    };


    const singleTotal =
        getNumericPrice(singlePrice) * quantity;

    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            getNumericPrice(item.price) * item.quantity,
        0
    );
    const [district, setDistrict] = useState("");

    const deliveryCharge =
        district === "Dhaka" ? 70 : district ? 120 : 0;

    const productTotal = fromCart ? cartTotal : singleTotal;

    const grandTotal = productTotal + deliveryCharge;

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        let productData = "";
        let priceData = "";
        let quantityData = "";
        let totalData = "";

        if (fromCart) {
            productData = cart
                .map((item) => item.name)
                .join(" | ");

            priceData = cart
                .map((item) => item.price)
                .join(" | ");

            quantityData = cart
                .map((item) => String(item.quantity))
                .join(" | ");

            totalData = `৳ ${cartTotal.toLocaleString()}`;
        } else {
            productData = singleProduct;
            priceData = singlePrice;
            quantityData = String(quantity);
            totalData = `৳ ${singleTotal.toLocaleString()}`;
        }
        const orderId = `LH-${Date.now()}`;
        const data = {
            district: formData.get("district"),
            name: formData.get("name"),
            phone: formData.get("phone"),
            address: formData.get("address"),
            product: productData,
            price: priceData,
            quantity: quantityData,
            totalPrice: totalData,
            deliveryArea:
                district === "Dhaka"
                    ? "Inside Dhaka"
                    : "Outside Dhaka",

            deliveryCharge: `৳ ${deliveryCharge}`,

            grandTotal: `৳ ${grandTotal.toLocaleString()}`,

            status: "Pending",
            orderId: orderId,



        };

        setLoading(true);
        setMessage("");

        try {
            await fetch(
                "https://script.google.com/macros/s/AKfycbyoEy9TTrPn-lAh9oh4Kb1wCwFl4HtyI7gqDPIDjcupPvQqoJjmahpjL3B8u8X0Hl5Kxg/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify(data),
                }
            );

            form.reset();

            if (fromCart) {
                localStorage.removeItem("cart");
            }

            router.push(
                `/success?orderId=${orderId}&name=${encodeURIComponent(
                    String(formData.get("name"))
                )}&total=${encodeURIComponent(`৳ ${grandTotal.toLocaleString()}`)}`
            );

            if (fromCart) {
                localStorage.removeItem("cart");
                setCart([]);
            } else {
                setQuantity(1);
            }
        } catch (error) {
            console.error(error);

            setMessage(
                "Something went wrong. Please try again."
            );
        }

        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-[650px] rounded-2xl bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">
                    Cash on Delivery
                </h1>

                {fromCart ? (
                    <div className="mt-5 space-y-3">
                        {cart.length === 0 ? (
                            <div className="rounded-xl bg-gray-100 p-5 text-center">
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
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 rounded-xl bg-gray-100 p-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />

                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {item.name}
                                            </p>

                                            <p className="text-sm text-orange-500">
                                                {item.price}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            ৳{" "}
                                            {(
                                                getNumericPrice(item.price) *
                                                item.quantity
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))}

                                <div className="flex justify-between border-t pt-4 text-lg font-bold">
                                    <span>Total</span>

                                    <span className="text-orange-500">
                                        ৳ {cartTotal.toLocaleString()}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="mt-5 rounded-xl bg-gray-100 p-4">
                        <p className="font-semibold">
                            {singleProduct}
                        </p>

                        <p className="mt-1 text-orange-500">
                            {singlePrice}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-medium">
                                Quantity
                            </span>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((q) =>
                                            Math.max(1, q - 1)
                                        )
                                    }
                                    className="h-9 w-9 rounded-full border"
                                >
                                    -
                                </button>

                                <span className="font-semibold">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((q) => q + 1)
                                    }
                                    className="h-9 w-9 rounded-full border"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between border-t pt-4">
                            <span className="font-semibold">
                                Total
                            </span>

                            <span className="font-bold text-orange-500">
                                ৳ {singleTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {(!fromCart || cart.length > 0) && (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="01XXXXXXXXX"
                            required
                            pattern="01[3-9][0-9]{8}"
                            maxLength={11}
                            title="Enter a valid Bangladesh phone number"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        />

                        <textarea
                            name="address"
                            placeholder="Full Address"
                            required
                            className="min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3"
                        />

                        <select
                            name="district"
                            required
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        >
                            <option value="">Select District</option>

                            <option value="Dhaka">Dhaka</option>
                            <option value="Faridpur">Faridpur</option>
                            <option value="Gazipur">Gazipur</option>
                            <option value="Gopalganj">Gopalganj</option>
                            <option value="Kishoreganj">Kishoreganj</option>
                            <option value="Madaripur">Madaripur</option>
                            <option value="Manikganj">Manikganj</option>
                            <option value="Munshiganj">Munshiganj</option>
                            <option value="Narayanganj">Narayanganj</option>
                            <option value="Narsingdi">Narsingdi</option>
                            <option value="Rajbari">Rajbari</option>
                            <option value="Shariatpur">Shariatpur</option>
                            <option value="Tangail">Tangail</option>

                            <option value="Chattogram">Chattogram</option>
                            <option value="Bandarban">Bandarban</option>
                            <option value="Brahmanbaria">Brahmanbaria</option>
                            <option value="Chandpur">Chandpur</option>
                            <option value="Cumilla">Cumilla</option>
                            <option value="Cox's Bazar">Cox&apos;s Bazar</option>
                            <option value="Feni">Feni</option>
                            <option value="Khagrachhari">Khagrachhari</option>
                            <option value="Lakshmipur">Lakshmipur</option>
                            <option value="Noakhali">Noakhali</option>
                            <option value="Rangamati">Rangamati</option>

                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Bogura">Bogura</option>
                            <option value="Joypurhat">Joypurhat</option>
                            <option value="Naogaon">Naogaon</option>
                            <option value="Natore">Natore</option>
                            <option value="Chapainawabganj">Chapainawabganj</option>
                            <option value="Pabna">Pabna</option>
                            <option value="Sirajganj">Sirajganj</option>

                            <option value="Khulna">Khulna</option>
                            <option value="Bagerhat">Bagerhat</option>
                            <option value="Chuadanga">Chuadanga</option>
                            <option value="Jashore">Jashore</option>
                            <option value="Jhenaidah">Jhenaidah</option>
                            <option value="Kushtia">Kushtia</option>
                            <option value="Magura">Magura</option>
                            <option value="Meherpur">Meherpur</option>
                            <option value="Narail">Narail</option>
                            <option value="Satkhira">Satkhira</option>

                            <option value="Barishal">Barishal</option>
                            <option value="Barguna">Barguna</option>
                            <option value="Bhola">Bhola</option>
                            <option value="Jhalokati">Jhalokati</option>
                            <option value="Patuakhali">Patuakhali</option>
                            <option value="Pirojpur">Pirojpur</option>

                            <option value="Sylhet">Sylhet</option>
                            <option value="Habiganj">Habiganj</option>
                            <option value="Moulvibazar">Moulvibazar</option>
                            <option value="Sunamganj">Sunamganj</option>

                            <option value="Rangpur">Rangpur</option>
                            <option value="Dinajpur">Dinajpur</option>
                            <option value="Gaibandha">Gaibandha</option>
                            <option value="Kurigram">Kurigram</option>
                            <option value="Lalmonirhat">Lalmonirhat</option>
                            <option value="Nilphamari">Nilphamari</option>
                            <option value="Panchagarh">Panchagarh</option>
                            <option value="Thakurgaon">Thakurgaon</option>

                            <option value="Mymensingh">Mymensingh</option>
                            <option value="Jamalpur">Jamalpur</option>
                            <option value="Netrokona">Netrokona</option>
                            <option value="Sherpur">Sherpur</option>
                        </select>


                        <div className="rounded-xl bg-gray-100 p-4">
                            <div className="flex justify-between">
                                <span>Product Total</span>
                                <span>৳ {productTotal.toLocaleString()}</span>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <span>Delivery Charge</span>
                                <span>৳ {deliveryCharge}</span>
                            </div>

                            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                                <span>Grand Total</span>
                                <span className="text-orange-500">
                                    ৳ {grandTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-orange-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
                        >
                            {loading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>

                        {message && (
                            <p className="text-center text-sm font-medium text-green-600">
                                {message}
                            </p>
                        )}
                    </form>
                )}
            </div>
        </main>
    );
}
export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}