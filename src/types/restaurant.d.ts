declare namespace Restaurant {
  interface IFoodItem {
    _id: string
    name: string
    image: string
    price: number
    isVeg: boolean
    description: string
    restaurantId: string
  }

  interface IMenuCategory {
    _id: string
    name: string
    foodItems: IFoodItem[]
  }

  interface IRestaurant {
    _id: string
    restaurantName: string
    logo?: string
    cuisineType: string
    address: string
    licenseNumber: string
    manualOverride: {
      isManuallySet: boolean
      isOpen: boolean
    }
    weeklySchedule: {
      [key: string]: {
        isClosed: boolean
        open: string
        close: string
      }
    }
  }

  interface IRestaurantMenu {
    restaurant: IRestaurant
    menu: IMenuCategory[]
  }

  interface IRestaurantStatus {
    isOpen: boolean
    status: string
  }
}
