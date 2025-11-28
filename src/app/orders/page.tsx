"use client";

import { useUserOrders, useUserOrderCounts } from "@/hooks/order/useOrder";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Package, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, RefreshCw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { ImagePreviewModal } from "@/components/ui/image-preview-modal";

interface TabItem {
  key: 'all' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  label: string;
  count: number;
}

interface OrdersResponse {
  data: Order.IOrder[];
  pagination?: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"; 
    case "accepted":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "preparing":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "ready":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const OrdersPage = () => {
  const { isAuthenticated } = useAuthGuard();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'>('all');
  
  // Convert tab to API status parameter
  const getStatusFilter = (tab: string) => {
    switch (tab) {
      case 'pending':
        return 'pending';
      case 'accepted':
        return 'accepted';
      case 'preparing':
        return 'preparing';
      case 'ready':
        return 'ready';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return undefined; // 'all' means no status filter
    }
  };

  // Get current tab data
  const { data: ordersResponse, isLoading, error, refetch } = useUserOrders({
    status: getStatusFilter(activeTab)
  });
  
  // Get order counts from backend
  const { data: orderCountsResponse } = useUserOrderCounts();
  
  const orders = useMemo(() => {
    if (!ordersResponse?.data || !Array.isArray(ordersResponse.data)) {
      return [];
    }
    return ordersResponse.data;
  }, [ordersResponse]);
  
  const pagination = useMemo(() => {
    if (!ordersResponse) return undefined;
    return (ordersResponse as OrdersResponse)?.pagination;
  }, [ordersResponse]);
  
  // Get counts for each tab from backend
  const getTabCount = (tab: string) => {
    if (!orderCountsResponse?.data) return 0;
    
    switch (tab) {
      case 'all':
        return orderCountsResponse.data.total;
      case 'pending':
        return orderCountsResponse.data.byStatus.pending || 0;
      case 'accepted':
        return orderCountsResponse.data.byStatus.accepted || 0;
      case 'preparing':
        return orderCountsResponse.data.byStatus.preparing || 0;
      case 'ready':
        return orderCountsResponse.data.byStatus.ready || 0;
      case 'completed':
        return orderCountsResponse.data.byStatus.completed || 0;
      case 'cancelled':
        return orderCountsResponse.data.byStatus.cancelled || 0;
      default:
        return 0;
    }
  };
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Smart auto-refresh: only refresh if there are active orders
  useEffect(() => {
    if (!Array.isArray(orders) || orders.length === 0) return;
    
    // Get active statuses dynamically from the API response
    const activeStatuses = orderCountsResponse?.data?.byStatus ? 
      Object.keys(orderCountsResponse.data.byStatus).filter(status => 
        status !== 'cancelled' && orderCountsResponse.data.byStatus[status as keyof typeof orderCountsResponse.data.byStatus] > 0
      ) : ['pending', 'accepted', 'preparing', 'ready'];
    
    const hasActiveOrders = orders.some(order => 
      order && order.orderStatus && activeStatuses.includes(order.orderStatus)
    );
    
    // Only auto-refresh if there are active orders
    if (hasActiveOrders) {
      const interval = setInterval(() => {
        if (!isLoading) {
          refetch();
        }
      }, 120000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [refetch, isLoading, orders, orderCountsResponse]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Checking authentication...
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading your orders.
          </p>
          <Button onClick={handleRefresh} className="cursor-pointer">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has any orders at all (not just filtered results)
  const hasAnyOrders = (orderCountsResponse?.data?.total || 0) > 0;

  if (!hasAnyOrders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-7xl mx-auto p-8">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders yet. Start by browsing restaurants and adding items to your cart.
          </p>
          <Link href="/restaurant">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track your orders and view order history</p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {([
              { key: 'all' as const, label: 'All Orders', count: getTabCount('all') },
              { key: 'pending' as const, label: 'Pending', count: getTabCount('pending') },
              { key: 'accepted' as const, label: 'Accepted', count: getTabCount('accepted') },
              { key: 'preparing' as const, label: 'Preparing', count: getTabCount('preparing') },
              { key: 'ready' as const, label: 'Ready', count: getTabCount('ready') },
              { key: 'completed' as const, label: 'Completed', count: getTabCount('completed') },
              { key: 'cancelled' as const, label: 'Cancelled', count: getTabCount('cancelled') }
            ] as TabItem[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>



        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: Order.IOrder) => (
              <Card key={order._id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown date'}
                      </p>
                      {order.restaurantId && (
                        <p className="text-xs text-gray-400 mt-1">
                          {typeof order.restaurantId === 'string' 
                            ? order.restaurantId 
                            : order.restaurantId.restaurantName || 'Unknown Restaurant'
                          } • {typeof order.restaurantId === 'string' 
                            ? order.restaurantId 
                            : order.restaurantId.cuisineType || 'Unknown Cuisine'
                          }
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Order Items */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-3 text-sm">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item: Order.IOrderItem, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <div 
                            className="w-10 h-10 relative flex-shrink-0 rounded overflow-hidden cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImage(item.image || "/placeholder.svg")}
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.isVeg && (
                              <div className="absolute top-0 left-0">
                                <div className="w-2 h-2 rounded border border-green-500 bg-green-100 flex items-center justify-center">
                                  <Leaf className="w-1 h-1 text-green-600" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × ₹{item.priceAtTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-800 text-sm">
                              ₹{(item.priceAtTime * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {order.deliveryAddress}
                        </span>
                        {order.contactPhone && (
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {order.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod}</p>
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="font-semibold text-gray-800">₹{order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => {/* TODO: Handle page change */}}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => {/* TODO: Handle page change */}}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {activeTab === 'all' 
                ? "No Orders Found"
                : `No ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all' 
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders at the moment.`
              }
            </p>
            {activeTab !== 'all' && (
              <Button 
                onClick={() => setActiveTab('all')} 
                variant="outline"
                className="cursor-pointer"
              >
                View All Orders
              </Button>
            )}
          </div>
        )}

        {/* Image Preview Modal */}
        <ImagePreviewModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          alt="Food item preview"
        />
      </div>
    </div>
  );
};

export default OrdersPage; 