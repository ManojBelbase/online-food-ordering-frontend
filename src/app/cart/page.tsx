"use client";

import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotalPrice } from "@/features/cart/selectors";
import { useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/cart/useCart";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImagePreviewModal } from "@/components/ui/image-preview-modal";
import { useImagePreview } from "@/hooks/useImagePreview";

const CartPage = () => {
  const { isAuthenticated } = useAuthGuard();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const { selectedImage, openImageModal, closeImageModal } = useImagePreview();

  const getItemId = (item: Cart.ICartItem): string => {
    return typeof item.foodItemId === 'string' ? item.foodItemId : item?.foodItemId?._id;
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateCartItem.mutate({
        itemId,
        data: {
          quantity: newQuantity,
        },
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart.mutate(itemId);
  };

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/restaurant">
            <Button className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" style={{ cursor: 'pointer' }}>
              <ArrowLeft className="w-4 h-4 mr-2 cursor-pointer" />
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
              <p className="text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={clearCart.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  {/* <AlertDialogTitle>Clear Cart</AlertDialogTitle> */}
                  <AlertDialogDescription>
                    Are you sure you want to clear your entire cart? This will remove all {cartItems.length} items and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearCart.mutate()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Clear Cart
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Cart Items</h2>
                <div className="space-y-6">
                  {cartItems?.map((item: Cart.ICartItem) => (
                    <div key={typeof item.foodItemId === 'string' ? item.foodItemId : item?.foodItemId?._id} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      {/* Item Image */}
                      <div
                        className="w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => openImageModal(item.image || "/placeholder.svg")}
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isVeg && (
                          <div className="absolute top-2 left-2">
                            <div className="w-5 h-5 rounded border border-green-500 bg-green-100 flex items-center justify-center">
                              <Leaf className="w-2 h-2 text-green-600" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-800 truncate text-lg">{item.name}</h3>
                          <span className="text-xl font-bold text-orange-600">
                            Rs.{item.priceAtTime}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(getItemId(item), item.quantity - 1)}
                            disabled={item.quantity <= 1 || updateCartItem.isPending}
                            className="w-10 h-10 p-0 rounded-full cursor-pointer hover:bg-orange-50 hover:border-orange-300"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold min-w-[3rem] text-center text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(getItemId(item), item.quantity + 1)}
                            disabled={item.quantity >= 10 || updateCartItem.isPending}
                            className="w-10 h-10 p-0 rounded-full cursor-pointer hover:bg-orange-50 hover:border-orange-300"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Item Total and Actions */}
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-700">
                            Total: Rs.{(item.priceAtTime * item.quantity).toFixed(2)}
                          </span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={removeFromCart.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove &quot;{item.name}&quot; from your cart? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveItem(getItemId(item))}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Remove Item
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>Rs.{totalPrice.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>Rs.{totalPrice.toFixed(2)}</span>
                </div>

              </div>

              <Link href="/checkout">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 font-semibold text-lg rounded-xl cursor-pointer"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-4 text-center">
                <Link href="/restaurant">
                  <Button variant="outline" className="w-full cursor-pointer hover:bg-gray-50">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={closeImageModal}
        alt="Food preview"
      />
    </div>
  );
};

export default CartPage; 