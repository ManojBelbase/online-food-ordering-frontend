"use client"

import { useRestaurantMenu } from "@/hooks/restaurant/useRestaurants"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { RestaurantHero } from "@/components/restaurant/RestaurantHero"
import { RestaurantStats } from "@/components/restaurant/RestaurantStats"
import { RestaurantSidebar } from "@/components/restaurant/RestaurantSidebar"
import { CategorySection } from "@/components/restaurant/CategorySection"
import { RestaurantLoadingSkeleton } from "@/components/restaurant/RestaurantLoadingSkeleton"
import { RestaurantErrorState } from "@/components/restaurant/RestaurantErrorState"
import { NoResultsFound } from "@/components/restaurant/NoResultsFound"
import { ImagePreviewModal } from "@/components/ui/image-preview-modal"
import { useImagePreview } from "@/hooks/useImagePreview"
import { useRestaurantStatus } from "@/hooks/restaurant/useRestaurantStatus"
const ViewRestaurantDetails = () => {
  const { id }: { id: string } = useParams()
  const { data: restaurantMenu, isLoading } = useRestaurantMenu(id)
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { selectedImage, openImageModal, closeImageModal } = useImagePreview()

  const restaurantStatus = useRestaurantStatus(restaurantMenu?.restaurant)

  // Handle scroll to update active category
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !restaurantMenu?.menu) return

      const scrollTop = contentRef.current.scrollTop + 150

      for (const category of restaurantMenu.menu) {
        const categoryElement = categoryRefs.current[category._id]
        if (categoryElement) {
          const { offsetTop, offsetHeight } = categoryElement
          if (scrollTop >= offsetTop && scrollTop < offsetTop + offsetHeight) {
            setActiveCategory(category._id)
            break
          }
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll)
      handleScroll()
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [restaurantMenu])

  // Set first category as active on load
  useEffect(() => {
    if (restaurantMenu?.menu && restaurantMenu.menu.length > 0 && !activeCategory) {
      setActiveCategory(restaurantMenu.menu[0]._id)
    }
  }, [restaurantMenu, activeCategory])

  // Scroll to category when clicked
  const scrollToCategory = (categoryId: string) => {
    const categoryElement = categoryRefs.current[categoryId]
    if (categoryElement && contentRef.current) {
      contentRef.current.scrollTo({
        top: categoryElement.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

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

  if (isLoading) {
    return <RestaurantLoadingSkeleton />
  }

  if (!restaurantMenu?.restaurant) {
    return (
      <RestaurantErrorState
        title="Restaurant not found"
        message="The restaurant you're looking for doesn't exist."
      />
    )
  }

  if (!restaurantMenu?.menu || restaurantMenu.menu.length === 0) {
    return (
      <RestaurantErrorState
        title="No menu available"
        message="This restaurant hasn't uploaded their menu yet."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Hero Section */}
      <RestaurantHero
        restaurant={restaurantMenu.restaurant}
        status={restaurantStatus}
      />

      {/* Restaurant Stats Bar */}
      <RestaurantStats restaurant={restaurantMenu.restaurant} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Sidebar with Search and Categories */}
        <RestaurantSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          vegFilter={vegFilter}
          onVegFilterChange={setVegFilter}
          menu={restaurantMenu.menu}
          activeCategory={activeCategory}
          onCategoryClick={scrollToCategory}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Right Content - Food Items */}
        <div ref={contentRef} className="flex-1 overflow-y-auto h-screen bg-gray-50">
          <div className="p-6">
            {restaurantMenu.menu.map((category: Restaurant.IMenuCategory) => {
              const filteredItems = filterFoodItems(category.foodItems)
              if (filteredItems.length === 0 && (searchQuery || vegFilter !== "all")) {
                return null
              }

              return (
                <div
                  key={category._id}
                  ref={(el) => {
                    categoryRefs.current[category._id] = el
                  }}
                >
                  <CategorySection
                    category={{
                      ...category,
                      foodItems: filteredItems
                    }}
                    restaurantId={id}
                    onImageClick={openImageModal}
                  />
                </div>
              )
            })}

            {/* No results message */}
            {restaurantMenu.menu.every((category: Restaurant.IMenuCategory) => filterFoodItems(category.foodItems).length === 0) &&
              (searchQuery || vegFilter !== "all") && <NoResultsFound />}
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
  )
}

export default ViewRestaurantDetails
