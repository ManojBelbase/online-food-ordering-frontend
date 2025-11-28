"use client";

import { Search, Leaf, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface RestaurantSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vegFilter: "all" | "veg" | "non-veg";
  onVegFilterChange: (filter: "all" | "veg" | "non-veg") => void;
  menu: Restaurant.IMenuCategory[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export const RestaurantSidebar = ({
  searchQuery,
  onSearchChange,
  vegFilter,
  onVegFilterChange,
  menu,
  activeCategory,
  onCategoryClick,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: RestaurantSidebarProps) => {
  // Filter food items based on search and veg filter
  const filterFoodItems = (items: Restaurant.IFoodItem[]) => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesVegFilter =
        vegFilter === "all" || (vegFilter === "veg" && item.isVeg) || (vegFilter === "non-veg" && !item.isVeg)
      return matchesSearch && matchesVegFilter
    })
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <Button
          onClick={onMobileMenuToggle}
          variant="outline"
          className="w-full justify-between cursor-pointer"
        >
          <span>Menu Categories</span>
          <ChefHat className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Categories Sidebar */}
      <div className={`lg:w-80 bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-r ${
        isMobileMenuOpen ? 'block' : 'hidden lg:block'
      }`}>
        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={vegFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onVegFilterChange("all")}
                className="flex-1 cursor-pointer"
              >
                All
              </Button>
              <Button
                variant={vegFilter === "veg" ? "default" : "outline"}
                size="sm"
                onClick={() => onVegFilterChange("veg")}
                className="flex-1 text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
              >
                <Leaf className="h-3 w-3 mr-1" />
                Veg
              </Button>
              <Button
                variant={vegFilter === "non-veg" ? "default" : "outline"}
                size="sm"
                onClick={() => onVegFilterChange("non-veg")}
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
              >
                Non-Veg
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
              Menu Categories
            </h2>

            <div className="space-y-2">
              {menu.map((category: Restaurant.IMenuCategory) => {
                const filteredItems = filterFoodItems(category.foodItems)
                if (filteredItems.length === 0 && (searchQuery || vegFilter !== "all")) {
                  return null
                }

                return (
                  <button
                    key={category._id}
                    onClick={() => {
                      onCategoryClick(category._id)
                      onMobileMenuToggle() // Close mobile menu on category click
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeCategory === category._id
                        ? "bg-orange-50 border-l-4 border-orange-500 text-orange-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{category.name}</span>
                        <div className="text-xs text-gray-500 mt-1">{filteredItems.length} items</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {filteredItems.length}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
