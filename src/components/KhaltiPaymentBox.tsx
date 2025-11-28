"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { toaster } from "@/utils/toast/toast";
import { makeRequest } from "@/makeRequest";

interface CheckoutFormProps {
  amount: number;
  orderId: string;
  onCancel?: () => void;
  onSuccess?: (paymentData: { paymentUrl: string; orderId: string; amount: number; status: string }) => void;
}

export default function CheckoutForm({ amount, orderId, onCancel, onSuccess }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    contactPhone: ""
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.name.trim() && formData.email.trim() && 
                      formData.phone.trim() && formData.deliveryAddress.trim() && 
                      formData.contactPhone.trim();

  const handleNextStep = async () => {
    if (isStep1Valid) {
      // Go directly to Khalti payment since user already selected Khalti
      await handleKhaltiPayment();
    } else {
      toaster({ message: "Please fill in all required fields", icon: "error" });
    }
  };

  const handleKhaltiPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await makeRequest({
        url: "/khalti/initiate",
        method: "POST",
        data: {
          amount: Math.round(amount * 100),
          purchase_order_id: orderId,
          purchase_order_name: `Food Order - ${orderId}`,
          return_url: `${window.location.origin}/success`,
          website_url: window.location.origin,
          customer_info: { 
            name: formData.name.trim(), 
            email: formData.email.trim(), 
            phone: formData.phone.trim() 
          }
        }
      });

      if (response.data.payment_url) {
        // If onSuccess callback is provided, call it with payment data
        if (onSuccess) {
          onSuccess({
            paymentUrl: response.data.payment_url,
            orderId: orderId,
            amount: amount,
            status: 'initiated'
          });
        } else {
          // Fallback to redirect for backward compatibility
          window.location.href = response.data.payment_url;
        }
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(errorMessage);
      toaster({ message: "Payment initiation failed", icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps - Simplified to single step */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-blue-600 border-blue-600 text-white">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-gray-100 border-gray-300 text-gray-500">
            2
          </div>
        </div>
      </div>

      {/* Single Step: Customer Details + Khalti Payment */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information & Khalti Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                Contact Phone *
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Contact phone for delivery"
                value={formData.contactPhone}
                onChange={(e) => updateFormData("contactPhone", e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryAddress" className="text-sm font-medium text-gray-700">
              Delivery Address *
            </Label>
            <textarea
              id="deliveryAddress"
              placeholder="Enter your complete delivery address..."
              value={formData.deliveryAddress}
              onChange={(e) => updateFormData("deliveryAddress", e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              disabled={!isStep1Valid || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Khalti Payment...
                </>
              ) : (
                <>
                  Pay with Khalti
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    