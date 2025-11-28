import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, purchase_order_id, purchase_order_name, return_url, website_url, customer_info } = body;

    // Validate required fields
    if (!amount || !purchase_order_id || !purchase_order_name || !return_url || !website_url || !customer_info) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Make request to Khalti API
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        amount,
        purchase_order_id,
        purchase_order_name,
        return_url,
        website_url,
        customer_info,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data: { message?: string; error?: string } }, message?: string };
    console.error("Khalti initiation error:", axiosError.response?.data || axiosError.message || error);
    return NextResponse.json(
      { message: "Failed to initiate Khalti payment" }, 
      { status: 500 }
    );
  }
}
