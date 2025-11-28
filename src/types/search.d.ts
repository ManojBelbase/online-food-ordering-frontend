declare namespace Search {
  interface Result {
    foodId: string
    restaurantId: string
    categoryId: string | null
    restaurantName: string
    categoryName: string | null
    foodName: string
    price: number
    description: string
    image?: string
    matchedOn: string[]
  }
}

