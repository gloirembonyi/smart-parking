import { Platform } from 'react-native';
import * as Location from 'expo-location';

export type ParkingSpot = {
  id: string;
  name: string;
  address: string;
  available: number;
  total: number;
  latitude: number;
  longitude: number;
  price: number;
  features: string[];
  operatingHours: string;
  rating: number;
  type: 'public' | 'private';
  accessibility: {
    handicapped: boolean;
    ev_charging: boolean;
    covered: boolean;
  };
  distance?: number; // Distance from user's location
  eta?: number; // Estimated time of arrival in minutes
};

export type ParkingFilter = {
  type?: 'public' | 'private' | 'all';
  maxPrice?: number;
  features?: string[];
  accessibility?: {
    handicapped?: boolean;
    ev_charging?: boolean;
    covered?: boolean;
  };
  maxDistance?: number; // in kilometers
};

class ParkingService {
  private static instance: ParkingService;
  private userLocation: Location.LocationObject | null = null;

  private constructor() {}

  public static getInstance(): ParkingService {
    if (!ParkingService.instance) {
      ParkingService.instance = new ParkingService();
    }
    return ParkingService.instance;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      this.userLocation = location;
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async getNearbyParkingSpots(filters?: ParkingFilter): Promise<ParkingSpot[]> {
    // In a real app, this would make an API call to get nearby parking spots
    // For now, we'll return mock data
    const mockSpots: ParkingSpot[] = [
      {
        id: '1',
        name: 'Downtown Parking',
        address: '123 Main St',
        available: 45,
        total: 100,
        latitude: 37.7749,
        longitude: -122.4194,
        price: 5,
        features: ['Security Cameras', '24/7 Access', 'Covered Parking', 'EV Charging'],
        operatingHours: '6:00 AM - 11:00 PM',
        rating: 4.5,
        type: 'public',
        accessibility: {
          handicapped: true,
          ev_charging: true,
          covered: true,
        },
      },
      {
        id: '2',
        name: 'City Center Garage',
        address: '456 Market St',
        available: 25,
        total: 75,
        latitude: 37.7833,
        longitude: -122.4167,
        price: 8,
        features: ['Security Cameras', 'Valet Parking', 'Car Wash'],
        operatingHours: '24/7',
        rating: 4.2,
        type: 'private',
        accessibility: {
          handicapped: true,
          ev_charging: false,
          covered: true,
        },
      },
    ];

    if (this.userLocation) {
      // Calculate distance and ETA for each spot
      return mockSpots.map(spot => ({
        ...spot,
        distance: this.calculateDistance(
          this.userLocation!.coords.latitude,
          this.userLocation!.coords.longitude,
          spot.latitude,
          spot.longitude
        ),
        eta: this.calculateETA(
          this.userLocation!.coords.latitude,
          this.userLocation!.coords.longitude,
          spot.latitude,
          spot.longitude
        ),
      }));
    }

    return mockSpots;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateETA(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Mock ETA calculation - in a real app, this would use a routing service
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    const averageSpeed = 30; // km/h
    return Math.round((distance / averageSpeed) * 60); // Convert to minutes
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async reserveSpot(spotId: string, duration: number): Promise<boolean> {
    // In a real app, this would make an API call to reserve the spot
    console.log('Reserving spot:', spotId, 'for', duration, 'hours');
    return true;
  }

  async cancelReservation(reservationId: string): Promise<boolean> {
    // In a real app, this would make an API call to cancel the reservation
    console.log('Canceling reservation:', reservationId);
    return true;
  }
}

export default ParkingService.getInstance(); 