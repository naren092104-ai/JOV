import type { Location } from "@/types/app";

export type LocationType = "Area" | "Airport" | "Railway Station" | "Bus Terminal" | "Landmark" | "City";

export interface DemoLocation extends Location {
  district: string;
  type: LocationType;
  searchText: string;
}

const cityGroups: Record<string, { district: string; places: string[] }> = {
  Chennai: {
    district: "Chennai",
    places: [
      "T Nagar", "Anna Nagar", "Adyar", "Velachery", "Guindy", "Nungambakkam", "Egmore", "Mylapore", "Tambaram", "Chromepet", "Pallavaram", "Porur", "Ambattur", "Avadi", "Sholinganallur", "Perungudi", "Thoraipakkam", "OMR", "ECR", "Kilpauk", "Saidapet", "Royapettah", "Besant Nagar", "Kodambakkam", "Vadapalani", "Koyambedu", "Mogappair", "Medavakkam", "Kelambakkam",
    ],
  },
  Coimbatore: {
    district: "Coimbatore",
    places: ["Gandhipuram", "RS Puram", "Peelamedu", "Saibaba Colony", "Singanallur", "Ukkadam", "Kuniyamuthur", "Saravanampatti", "Avinashi Road", "Race Course"],
  },
  Madurai: {
    district: "Madurai",
    places: ["Anna Nagar", "KK Nagar", "Tallakulam", "Mattuthavani", "Arapalayam", "Thirumalai Nayakkar Mahal", "Meenakshi Amman Temple", "Madurai Airport"],
  },
  Tiruchirappalli: {
    district: "Tiruchirappalli",
    places: ["Srirangam", "Thillai Nagar", "Cantonment", "Woraiyur", "Rockfort", "Trichy Airport", "Central Bus Stand"],
  },
  Salem: { district: "Salem", places: ["Fairlands", "Hasthampatti", "Five Roads", "Ammapet", "Kondalampatti", "Salem Junction"] },
  Tiruppur: { district: "Tiruppur", places: ["Avinashi", "Palladam", "Dharapuram", "Kangeyam", "Tiruppur Central"] },
  Erode: { district: "Erode", places: ["Perundurai", "Bhavani", "Gobichettipalayam", "Sathyamangalam", "Erode Bus Stand", "Erode Railway Station"] },
  Tirunelveli: { district: "Tirunelveli", places: ["Palayamkottai", "Vannarpettai", "Melapalayam", "Tirunelveli Junction", "Tirunelveli New Bus Stand"] },
  Thoothukudi: { district: "Thoothukudi", places: ["Tuticorin Port", "New Bus Stand", "Railway Station", "VOC College area"] },
  Thanjavur: { district: "Thanjavur", places: ["Thanjavur Big Temple", "Medical College", "New Bus Stand", "Railway Station"] },
  Kumbakonam: { district: "Thanjavur", places: ["Kumbakonam Town", "Mahamaham Tank", "Railway Station"] },
  Vellore: { district: "Vellore", places: ["Katpadi", "Vellore Fort", "Sathuvachari", "CMC Vellore", "Vellore New Bus Stand"] },
  Ranipet: { district: "Ranipet", places: ["Ranipet", "Arcot", "Walajapet"] },
  Tiruvannamalai: { district: "Tiruvannamalai", places: ["Arunachaleswarar Temple", "Girivalam Road", "Bus Stand", "Railway Station"] },
  Villupuram: { district: "Villupuram", places: ["Villupuram Town", "Railway Station", "Bus Stand"] },
  Cuddalore: { district: "Cuddalore", places: ["Cuddalore Town", "Silver Beach", "Bus Stand", "Railway Station"] },
  Kanchipuram: { district: "Kanchipuram", places: ["Kanchipuram Temple Area", "Bus Stand", "Railway Station"] },
  Chengalpattu: { district: "Chengalpattu", places: ["Chengalpattu", "Maraimalai Nagar", "Mahindra World City"] },
  Dindigul: { district: "Dindigul", places: ["Dindigul Town", "Railway Station", "Bus Stand"] },
  Karur: { district: "Karur", places: ["Karur Town", "Bus Stand", "Railway Station"] },
  Namakkal: { district: "Namakkal", places: ["Namakkal Town", "Bus Stand", "Anjaneyar Temple"] },
  Krishnagiri: { district: "Krishnagiri", places: ["Krishnagiri Town", "Hosur", "Hosur Bus Stand", "Hosur Railway Station"] },
  Dharmapuri: { district: "Dharmapuri", places: ["Dharmapuri Town", "Bus Stand", "Railway Station"] },
  Nagapattinam: { district: "Nagapattinam", places: ["Nagapattinam Town", "Velankanni", "Nagore"] },
  Mayiladuthurai: { district: "Mayiladuthurai", places: ["Mayiladuthurai Town", "Railway Station", "Bus Stand"] },
  Pudukkottai: { district: "Pudukkottai", places: ["Pudukkottai Town", "Bus Stand", "Railway Station"] },
  Ramanathapuram: { district: "Ramanathapuram", places: ["Ramanathapuram Town", "Rameswaram", "Rameswaram Temple", "Railway Station"] },
  Sivaganga: { district: "Sivaganga", places: ["Sivaganga", "Karaikudi", "Chettinad"] },
  Virudhunagar: { district: "Virudhunagar", places: ["Virudhunagar", "Sivakasi", "Rajapalayam"] },
  Tenkasi: { district: "Tenkasi", places: ["Tenkasi", "Courtallam", "Sengottai"] },
  Kanniyakumari: { district: "Kanniyakumari", places: ["Nagercoil", "Kanyakumari", "Suchindram", "Nagercoil Bus Stand", "Kanyakumari Beach"] },
  Nilgiris: { district: "The Nilgiris", places: ["Ooty", "Coonoor", "Kotagiri", "Gudalur"] },
  Ariyalur: { district: "Ariyalur", places: ["Ariyalur Town"] },
  Perambalur: { district: "Perambalur", places: ["Perambalur Town"] },
  Kallakurichi: { district: "Kallakurichi", places: ["Kallakurichi Town"] },
  Tirupathur: { district: "Tirupathur", places: ["Tirupattur Town", "Ambur", "Vaniyambadi"] },
};

const specialLocations: Array<[string, string, string, LocationType]> = [
  ["Chennai International Airport", "Chennai", "Chennai", "Airport"],
  ["Coimbatore International Airport", "Coimbatore", "Coimbatore", "Airport"],
  ["Madurai Airport", "Madurai", "Madurai", "Airport"],
  ["Tiruchirappalli International Airport", "Trichy", "Tiruchirappalli", "Airport"],
  ["Salem Airport", "Salem", "Salem", "Airport"],
  ["Tuticorin Airport", "Thoothukudi", "Thoothukudi", "Airport"],
  ["Chennai Central", "Central Chennai", "Chennai", "Railway Station"],
  ["Chennai Egmore", "Egmore", "Chennai", "Railway Station"],
  ["Tambaram Railway Station", "Tambaram", "Chennai", "Railway Station"],
  ["Coimbatore Junction", "Coimbatore", "Coimbatore", "Railway Station"],
  ["Madurai Junction", "Madurai", "Madurai", "Railway Station"],
  ["Tiruchirappalli Junction", "Trichy", "Tiruchirappalli", "Railway Station"],
  ["Salem Junction", "Salem", "Salem", "Railway Station"],
  ["Erode Junction", "Erode", "Erode", "Railway Station"],
  ["Tirunelveli Junction", "Tirunelveli", "Tirunelveli", "Railway Station"],
  ["Katpadi Junction", "Katpadi", "Vellore", "Railway Station"],
  ["Chennai CMBT / Koyambedu", "Koyambedu", "Chennai", "Bus Terminal"],
  ["Kilambakkam Bus Terminus", "Kilambakkam", "Chengalpattu", "Bus Terminal"],
  ["Coimbatore Gandhipuram Bus Stand", "Gandhipuram", "Coimbatore", "Bus Terminal"],
  ["Madurai Mattuthavani Bus Stand", "Mattuthavani", "Madurai", "Bus Terminal"],
  ["Trichy Central Bus Stand", "Cantonment", "Tiruchirappalli", "Bus Terminal"],
  ["Salem New Bus Stand", "Salem", "Salem", "Bus Terminal"],
];

function makeLocation(name: string, city: string, district: string, type: LocationType): DemoLocation {
  const key = `${city}-${type}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    id: key,
    name,
    area: name,
    city,
    district,
    lat: 10 + (key.length % 30) / 10,
    lng: 76 + (name.length % 30) / 10,
    type,
    searchText: `${name} ${city} ${district} ${type}`.toLowerCase(),
  };
}

export const tamilNaduLocations: DemoLocation[] = [
  ...Object.entries(cityGroups).flatMap(([city, group]) =>
    group.places.map((place) => makeLocation(place, city, group.district, place.toLowerCase().includes("temple") ? "Landmark" : "Area")),
  ),
  ...specialLocations.map(([name, area, city, type]) => makeLocation(name, city, city, type)),
];

export interface LocationSearchService {
  search(query: string): DemoLocation[];
}

export class MockLocationSearchService implements LocationSearchService {
  search(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tamilNaduLocations.slice(0, 8);
    return tamilNaduLocations
      .filter((location) => location.searchText.includes(normalized))
      .slice(0, 10);
  }
}

export interface RoutingService {
  route(pickup: DemoLocation, destination: DemoLocation): { distanceKm: number; durationMinutes: number; traffic: string };
}

export class MockRoutingService implements RoutingService {
  route(pickup: DemoLocation, destination: DemoLocation) {
    const sameCity = pickup.city === destination.city;
    const distanceKm = sameCity ? 6 + ((pickup.name.length + destination.name.length) % 90) / 10 : 28 + ((pickup.city.length + destination.city.length) % 180);
    return {
      distanceKm: Number(distanceKm.toFixed(1)),
      durationMinutes: Math.max(12, Math.round(distanceKm * 2.6)),
      traffic: distanceKm > 30 ? "Moderate traffic" : "Light traffic",
    };
  }
}

export class MockMapProvider {
  readonly name = "MockMapProvider";
}

export class MockGeocodingService {
  findByName(value: string) {
    return tamilNaduLocations.find((location) => location.name.toLowerCase() === value.trim().toLowerCase()) ?? null;
  }
}

export const locationSearchService = new MockLocationSearchService();
export const routingService = new MockRoutingService();
export const mapProvider = new MockMapProvider();
export const geocodingService = new MockGeocodingService();
