import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { pidx } = await req.json();

  if (!pidx) {
    return NextResponse.json({ message: "Missing pidx" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
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
    console.error("Verification error:", axiosError.response?.data || axiosError.message);
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 });
  }
}
