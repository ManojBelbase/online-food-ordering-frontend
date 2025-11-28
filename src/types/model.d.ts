declare namespace Model {
  interface IRestaurant {
    _id: string;
    userId: string;
    restaurantName: string;
    logo: string;
    address: string;
    cuisineType: string;
    distanceInKm: number;

    licenseNumber: string;
    weeklySchedule: {
      [key: string]: {
        open: string;
        close: string;
        isClosed: boolean;
      };
    };
    manualOverride: {
      isManuallySet: boolean;
      isOpen: boolean;
    };
    location: {
      type: string;
      coordinates: number[];
    };
    createdAt?: string;
    updatedAt?: string;
  }
}
