"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCartItems, selectCartTotalPrice, selectCartRestaurantId } from "@/features/cart/selectors";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useCreateOrder } from "@/hooks/order/useOrder";
import { toaster } from "@/utils/toast/toast";
import { makeRequest } from "@/makeRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, CreditCard, Wallet, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";


const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const restaurantId = useSelector(selectCartRestaurantId);

  const createOrder = useCreateOrder();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Khalti">("COD");
  const [showKhaltiForm, setShowKhaltiForm] = useState(false);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Checking authentication...
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  // Redirect if no restaurant ID
  if (!restaurantId) {
    router.push("/cart");
    return null;
  }

  const handlePlaceOrder = () => {
    if (!deliveryAddress.trim()) {
      toaster({ message: "Please enter your delivery address", icon: "error" });
      return;
    }

    if (!contactPhone.trim()) {
      toaster({ message: "Please enter your contact phone number", icon: "error" });
      return;
    }

    // For Khalti payments, don't place order here - let KhaltiPaymentBox handle it
    if (paymentMethod === "Khalti") {
      toaster({ message: "Please complete the Khalti payment form above", icon: "warning" });
      return;
    }

    // Filter out items without foodItemId and validate
    const validItems = cartItems.filter((item: Cart.ICartItem) => {
      const foodItemId = typeof item.foodItemId === 'string' ? item.foodItemId : item?.foodItemId?._id;
      return foodItemId && foodItemId.trim() !== '';
    });

    if (validItems.length === 0) {
      toaster({ message: "No valid items found in cart. Please refresh and try again.", icon: "error" });
      return;
    }

    if (validItems.length !== cartItems.length) {
      toaster({ message: `Some items (${cartItems.length - validItems.length}) were removed due to invalid data.`, icon: "warning" });
    }

    const orderData = {
      restaurantId,
      items: validItems.map((item: Cart.ICartItem) => ({
        foodItemId: typeof item.foodItemId === 'string' ? item.foodItemId : item.foodItemId._id,
        quantity: item.quantity,
        notes: item.notes || "",
      })),
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod,
      contactPhone: contactPhone.trim(),
    };

    console.log("Sending order data:", orderData);

    createOrder.mutate(orderData, {
      onSuccess: () => {
        // Redirect to orders page or success page
        router.push("/orders");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">
                Complete your order
              </p>
            </div>
            <Link href="/cart">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Delivery Address *
                  </Label>
                  <textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address..."
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Contact Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method - Hide when Khalti form is shown */}
            {!showKhaltiForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as "COD" | "Khalti");
                          setShowKhaltiForm(false);
                        }}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-gray-600" />
                        <div>
                          <div className="font-medium">Cash on Delivery (COD)</div>
                          <div className="text-sm text-gray-500">Pay when you receive your order</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Khalti"
                        checked={paymentMethod === "Khalti"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as "COD" | "Khalti");
                          setShowKhaltiForm(false);
                        }}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                        <div>
                          <div className="font-medium">Khalti</div>
                          <div className="text-sm text-gray-500">Pay securely with Khalti</div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Proceed to Payment Button for Khalti */}
                  {paymentMethod === "Khalti" && !showKhaltiForm && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => setShowKhaltiForm(true)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Khalti Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Checkout Form - Show when Khalti is selected and user clicked proceed */}
            {paymentMethod === "Khalti" && showKhaltiForm && (
              <div className="space-y-4">
                {/* Show delivery info form first */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                      Complete Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="khalti-address" className="text-sm font-medium text-gray-700">
                        Delivery Address *
                      </Label>
                      <textarea
                        id="khalti-address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your complete delivery address..."
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="khalti-phone" className="text-sm font-medium text-gray-700">
                        Contact Phone *
                      </Label>
                      <Input
                        id="khalti-phone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="mt-1"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Only show Khalti form if delivery info is complete */}
                {deliveryAddress.trim() && contactPhone.trim() ? (
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        Your delivery information is complete. Click below to proceed with Khalti payment.
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        // First place the order
                        const validItems = cartItems.filter((item: Cart.ICartItem) => {
                          const foodItemId = typeof item.foodItemId === 'string' ? item.foodItemId : item?.foodItemId?._id;
                          return foodItemId && foodItemId.trim() !== '';
                        });

                        if (validItems.length === 0) {
                          toaster({ message: "No valid items found in cart. Please refresh and try again.", icon: "error" });
                          return;
                        }

                        const orderData = {
                          restaurantId,
                          items: validItems.map((item: Cart.ICartItem) => ({
                            foodItemId: typeof item.foodItemId === 'string' ? item.foodItemId : item.foodItemId._id,
                            quantity: item.quantity,
                            notes: item.notes || "",
                          })),
                          deliveryAddress: deliveryAddress.trim(),
                          paymentMethod: "Khalti" as const,
                          contactPhone: contactPhone.trim(),
                        };

                        console.log("Placing order before Khalti payment:", orderData);

                        try {
                          const result = await createOrder.mutateAsync(orderData);
                          if (result) {
                            // Order created successfully, now redirect to Khalti payment
                            const khaltiOrderId = `order-${Date.now()}`;
                            const response = await makeRequest({
                              url: "/khalti/initiate",
                              method: "POST",
                              data: {
                                amount: Math.round(totalPrice * 100),
                                purchase_order_id: khaltiOrderId,
                                purchase_order_name: `Food Order - ${khaltiOrderId}`,
                                return_url: `${window.location.origin}/success`,
                                website_url: window.location.origin,
                                customer_info: {
                                  name: "Customer",
                                  email: "customer@example.com",
                                  phone: contactPhone.trim()
                                }
                              }
                            });

                            if (response.data.payment_url) {
                              window.location.href = response.data.payment_url;
                            }
                          }
                        } catch {
                          toaster({ message: "Failed to create order. Please try again.", icon: "error" });
                        }
                      }}
                      disabled={createOrder.isPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold"
                      size="lg"
                    >
                      {createOrder.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Order...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Create Order & Pay with Khalti
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-orange-600 text-sm">
                      Please complete your delivery information above before proceeding with payment
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item: Cart.ICartItem) => (
                    <div key={typeof item.foodItemId === 'string' ? item.foodItemId : item?.foodItemId?._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isVeg && (
                          <div className="absolute top-0 left-0">
                            <div className="w-3 h-3 rounded border border-green-500 bg-green-100 flex items-center justify-center">
                              <Leaf className="w-1.5 h-1.5 text-green-600" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × Rs.{item.priceAtTime}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-400 italic">Note: {item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800">
                          Rs.{(item.priceAtTime * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>


                  <Button
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending || !deliveryAddress.trim() || !contactPhone.trim() || paymentMethod === "Khalti"}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 font-semibold"
                    size="lg"
                  >
                    {createOrder.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </>
                    ) : paymentMethod === "Khalti" ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Khalti Payment
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/cart">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 