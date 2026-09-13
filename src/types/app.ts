export type AppRole = "customer" | "driver" | "admin";
export type RideStatus =
  "idle" | "searching" | "assigned" | "arrived" | "in_progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  avatar: string;
  isActive: boolean;
}

export interface Customer extends User {
  role: "customer";
  savedLocations: SavedLocation[];
  paymentMethods: string[];
}

export interface Driver extends User {
  role: "driver";
  vehicle: Vehicle;
  status: DriverStatus;
  rating: number;
  earnings: number;
}

export interface Admin extends User {
  role: "admin";
  department: string;
  permissions: string[];
}

export interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  registration: string;
  capacity: number;
  status: "available" | "in_use" | "maintenance";
}

export interface Location {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  landmark?: string;
}

export interface SavedLocation extends Location {
  label: "Home" | "Work" | "Airport" | "Custom";
}

export interface RideRequest {
  id: string;
  customerId: string;
  driverId?: string;
  pickup: Location;
  destination: Location;
  status: RideStatus;
  fare: number;
  etaMinutes: number;
  distanceKm: number;
  createdAt: string;
}

export interface Ride extends RideRequest {
  id: string;
  paymentMethod: string;
  driverName?: string;
  customerName?: string;
}

export interface ScheduledRide {
  id: string;
  customerId: string;
  pickup: Location;
  destination: Location;
  scheduledFor: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export interface Payment {
  id: string;
  userId: string;
  type: "ride" | "wallet" | "refund" | "payout";
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

export interface RideHistory {
  rideId: string;
  date: string;
  route: string;
  fare: number;
  status: RideStatus;
}

export type DriverStatus = "online" | "offline" | "busy" | "on_break";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  kind: "info" | "success" | "warning" | "critical";
  createdAt: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface AuthSession {
  user: User;
  role: AppRole;
  token: string;
  expiresAt: string;
}
