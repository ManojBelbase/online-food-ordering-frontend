    "use client";

import { makeRequest } from "@/makeRequest";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CheckCircle, CreditCard, Receipt, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface KhaltiPaymentResponse {
  status: string;
  purchase_order_name: string;
  total_amount: number;
  transaction_id: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<KhaltiPaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyKhaltiPayment = useCallback(async () => {
    const pidx = searchParams.get("pidx");
    const response = await makeRequest({
      url: "/khalti/verify",
      method: "POST",
      data: {
        pidx
      }
    })
    setPaymentData(response.data);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    verifyKhaltiPayment();
  }, [verifyKhaltiPayment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Verifying Payment...
          </div>
          <div className="text-gray-500">
            Please wait while we confirm your transaction
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
            </p>
            <Link href="/">
              <Button className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = paymentData.status.toLowerCase() === 'completed' || paymentData.status.toLowerCase() === 'success';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <CreditCard className="w-10 h-10 text-yellow-600" />
            )}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isSuccess ? 'text-green-800' : 'text-yellow-800'
          }`}>
            Payment {isSuccess ? 'Successful!' : paymentData.status}
          </h1>
          <p className="text-gray-600 text-lg">
            {isSuccess 
              ? 'Your order has been confirmed and payment processed successfully'
              : 'Your payment is being processed'
            }
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Receipt className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Order Name</span>
                </div>
                <span className="font-semibold text-gray-900">{paymentData.purchase_order_name}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Amount Paid</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  NPR {(paymentData.total_amount / 100).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Transaction ID</span>
                </div>
                <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {paymentData.transaction_id}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Status</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isSuccess 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentData.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Receipt className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-1">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
