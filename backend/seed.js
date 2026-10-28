import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";
dotenv.config();

const hotels = [
  {
    name: "The Grand Meridian", city: "Indore", address: "MG Road, Indore, Madhya Pradesh",
    description: "A refined city stay with thoughtful service, contemporary rooms, and easy access to popular shopping and dining areas.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    rating: 4.8, amenities: ["Free Wi-Fi", "Pool", "Restaurant", "Parking", "Room service"],
    rooms: [
      { type: "Deluxe Room", pricePerNight: 3200, capacity: 2, availableRooms: 8, description: "Comfortable room with a queen bed." },
      { type: "Executive Suite", pricePerNight: 5600, capacity: 3, availableRooms: 4, description: "Spacious suite with a sitting area." }
    ]
  },
  {
    name: "Lakeview Retreat", city: "Bhopal", address: "VIP Road, Bhopal, Madhya Pradesh",
    description: "Relax in a peaceful hotel with lake views, warm hospitality, and spaces designed for an easy weekend escape.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    rating: 4.6, amenities: ["Lake view", "Free Wi-Fi", "Restaurant", "Breakfast", "Parking"],
    rooms: [
      { type: "Standard Room", pricePerNight: 2400, capacity: 2, availableRooms: 10, description: "A bright room for a comfortable stay." },
      { type: "Lake View Suite", pricePerNight: 4900, capacity: 3, availableRooms: 3, description: "Suite with scenic lake views." }
    ]
  },
  {
    name: "Royal Orchid Stay", city: "Jaipur", address: "Civil Lines, Jaipur, Rajasthan",
    description: "A modern stay inspired by local hospitality, featuring elegant interiors and convenient access to the city.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
    rating: 4.7, amenities: ["Free Wi-Fi", "Pool", "Spa", "Restaurant", "Airport shuttle"],
    rooms: [
      { type: "Classic Room", pricePerNight: 2800, capacity: 2, availableRooms: 7, description: "Classic comfort with modern essentials." },
      { type: "Family Room", pricePerNight: 4300, capacity: 4, availableRooms: 5, description: "Extra space for families and groups." }
    ]
  },
  {
    name: "Coastal Breeze Hotel", city: "Goa", address: "Candolim, North Goa, Goa",
    description: "A laid-back coastal hideaway with airy rooms and easy access to beaches, cafes, and local attractions.",
    image: "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=1200",
    rating: 4.5, amenities: ["Beach access", "Free Wi-Fi", "Pool", "Restaurant", "Breakfast"],
    rooms: [
      { type: "Garden Room", pricePerNight: 3500, capacity: 2, availableRooms: 9, description: "Relaxed room overlooking green gardens." },
      { type: "Family Suite", pricePerNight: 6200, capacity: 4, availableRooms: 3, description: "A spacious suite for family holidays." }
    ]
  }
    ,
  {
    name: "Mountain Pearl Resort",
    city: "Manali",
    address: "Old Manali Road, Manali, Himachal Pradesh",
    description: "A peaceful mountain resort offering beautiful valley views, cozy rooms, and a relaxing atmosphere.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
    rating: 4.7,
    amenities: ["Free Wi-Fi", "Mountain View", "Restaurant", "Parking", "Room service"],
    rooms: [
      { type: "Mountain Deluxe", pricePerNight: 3800, capacity: 2, availableRooms: 6, description: "A cozy room with beautiful mountain views." },
      { type: "Family Suite", pricePerNight: 5800, capacity: 4, availableRooms: 3, description: "A spacious suite suitable for families." }
    ]
  },
  {
    name: "The Pink City Palace",
    city: "Jaipur",
    address: "MI Road, Jaipur, Rajasthan",
    description: "An elegant hotel combining traditional Rajasthani charm with modern comfort.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200",
    rating: 4.6,
    amenities: ["Free Wi-Fi", "Pool", "Restaurant", "Spa", "Breakfast"],
    rooms: [
      { type: "Royal Deluxe", pricePerNight: 3600, capacity: 2, availableRooms: 8, description: "An elegant room with traditional decor." },
      { type: "Royal Suite", pricePerNight: 6500, capacity: 4, availableRooms: 3, description: "A spacious suite with premium amenities." }
    ]
  },
  {
    name: "Ocean Pearl Residency",
    city: "Mumbai",
    address: "Juhu Beach Road, Mumbai, Maharashtra",
    description: "A comfortable coastal stay with modern interiors and convenient access to the beach.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    rating: 4.5,
    amenities: ["Free Wi-Fi", "Restaurant", "Parking", "Breakfast", "Room service"],
    rooms: [
      { type: "City View Room", pricePerNight: 4200, capacity: 2, availableRooms: 7, description: "A modern room with city views." },
      { type: "Premium Suite", pricePerNight: 7200, capacity: 3, availableRooms: 3, description: "A spacious suite with premium comforts." }
    ]
  },
  {
    name: "Green Valley Retreat",
    city: "Ooty",
    address: "Fern Hill Road, Ooty, Tamil Nadu",
    description: "A relaxing hill retreat surrounded by greenery, fresh air, and scenic landscapes.",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200",
    rating: 4.4,
    amenities: ["Free Wi-Fi", "Garden", "Restaurant", "Parking", "Breakfast"],
    rooms: [
      { type: "Garden Room", pricePerNight: 3000, capacity: 2, availableRooms: 6, description: "A comfortable room overlooking the garden." },
      { type: "Hill View Suite", pricePerNight: 5200, capacity: 4, availableRooms: 3, description: "A spacious suite with scenic views." }
    ]
  },
  {
    name: "Golden Sands Hotel",
    city: "Kochi",
    address: "Fort Kochi, Kochi, Kerala",
    description: "A welcoming hotel inspired by Kerala's coastal culture, with comfortable rooms and local hospitality.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
    rating: 4.6,
    amenities: ["Free Wi-Fi", "Restaurant", "Pool", "Airport Shuttle", "Parking"],
    rooms: [
      { type: "Classic Room", pricePerNight: 2700, capacity: 2, availableRooms: 8, description: "A comfortable room with modern essentials." },
      { type: "Coastal Suite", pricePerNight: 4800, capacity: 3, availableRooms: 4, description: "A spacious suite with coastal-inspired decor." }
    ]
  },
  {
    name: "The Sapphire Grand",
    city: "Hyderabad",
    address: "HITEC City, Hyderabad, Telangana",
    description: "A contemporary city hotel offering stylish rooms and convenient access to business and shopping areas.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    rating: 4.8,
    amenities: ["Free Wi-Fi", "Gym", "Restaurant", "Pool", "Room service"],
    rooms: [
      { type: "Business Deluxe", pricePerNight: 3400, capacity: 2, availableRooms: 9, description: "A modern room designed for comfortable stays." },
      { type: "Executive Suite", pricePerNight: 6100, capacity: 3, availableRooms: 4, description: "A premium suite with a separate sitting area." }
    ]
  }
];

try {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotelpro");
  
  await Hotel.insertMany(hotels);
  console.log(`Seeded ${hotels.length} hotels.`);
  await mongoose.disconnect();
} catch (err) {
  console.error(err);
  process.exit(1);
}
