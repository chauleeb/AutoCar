// require("dotenv").config();
// const mongoose = require("mongoose");
// const User = require("./models/User");
// const Car = require("./models/Car");
// const Booking = require("./models/Booking");

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// async function seedDatabase() {
//   try {
//     console.log("🗑️  Clearing existing data...");
//     await User.deleteMany({});
//     await Car.deleteMany({});
//     await Booking.deleteMany({});

//     // 1. Create Users
//     console.log("👥 Creating users...");
//     const users = await User.create([
//       {
//         name: "Châu",
//         email: "admin@gmail.com",
//         password: "password123",
//         role: "ADMIN",
//         phone: "0901234567"
//       },
//       {
//         name: "Lan",
//         email: "lan@gmail.com",
//         password: "password123",
//         role: "OWNER",
//         phone: "0902345678"
//       },
//       {
//         name: "Trung",
//         email: "bob@gmail.com",
//         password: "password123",
//         role: "OWNER",
//         phone: "0903456789"
//       },
//       {
//         name: "Minh",
//         email: "minh@gmail.com",
//         password: "password123",
//         role: "CUSTOMER",
//         phone: "0904567890"
//       },
//       {
//         name: "Toan",
//         email: "toannpd@gmail.com",
//         password: "password123",
//         role: "CUSTOMER",
//         phone: "0905678901"
//       }
//     ]);

//     console.log(`✅ Created ${users.length} users`);

//     // 2. Create Cars
//     console.log("🚗 Creating cars...");
//     const cars = await Car.create([
//       {
//         brand: "Toyota",
//         model: "Camry 2023",
//         licensePlate: "30A-12345",
//         pricePerDay: 50,
//         status: "AVAILABLE",
//         ownerId: users[1]._id // Lan
//       },
//       {
//         brand: "Honda",
//         model: "Civic 2023",
//         licensePlate: "30B-67890",
//         pricePerDay: 45,
//         status: "AVAILABLE",
//         ownerId: users[1]._id // Lan
//       },
//       {
//         brand: "Mercedes",
//         model: "E-Class 2023",
//         licensePlate: "51A-11111",
//         pricePerDay: 120,
//         status: "AVAILABLE",
//         ownerId: users[2]._id // Trung
//       },
//       {
//         brand: "BMW",
//         model: "320i 2023",
//         licensePlate: "51B-22222",
//         pricePerDay: 100,
//         status: "RENTED",
//         ownerId: users[2]._id // Trung
//       },
//       {
//         brand: "Ford",
//         model: "Ranger 2023",
//         licensePlate: "30C-33333",
//         pricePerDay: 70,
//         status: "AVAILABLE",
//         ownerId: users[1]._id // Lan
//       },
//       {
//         brand: "Mazda",
//         model: "CX-5 2023",
//         licensePlate: "51C-44444",
//         pricePerDay: 60,
//         status: "MAINTENANCE",
//         ownerId: users[2]._id // Trung
//       },
//       {
//         brand: "Hyundai",
//         model: "Tucson 2023",
//         licensePlate: "30D-55555",
//         pricePerDay: 55,
//         status: "AVAILABLE",
//         ownerId: users[1]._id // Lan
//       },
//       {
//         brand: "Kia",
//         model: "Seltos 2023",
//         licensePlate: "51D-66666",
//         pricePerDay: 50,
//         status: "AVAILABLE",
//         ownerId: users[2]._id // Trung
//       }
//     ]);

//     console.log(`✅ Created ${cars.length} cars`);

//     // 3. Create Bookings
//     console.log("📅 Creating bookings...");
//     const now = new Date();
//     const bookings = await Booking.create([
//       {
//         userId: users[3]._id, // Minh
//         carId: cars[0]._id,   // Toyota Camry
//         startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
//         endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),   // 2 days ago
//         totalPrice: 150,
//         status: "COMPLETED"
//       },
//       {
//         userId: users[4]._id, // Toan
//         carId: cars[3]._id,   // BMW 320i
//         startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
//         endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),   // in 4 days
//         totalPrice: 500,
//         status: "ACTIVE"
//       },
//       {
//         userId: users[3]._id, // Minh
//         carId: cars[2]._id,   // Mercedes E-Class
//         startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
//         endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),   // in 5 days
//         totalPrice: 360,
//         status: "CONFIRMED"
//       },
//       {
//         userId: users[4]._id, // Toan
//         carId: cars[1]._id,   // Honda Civic
//         startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // in 7 days
//         endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),  // in 10 days
//         totalPrice: 135,
//         status: "PENDING"
//       },
//       {
//         userId: users[3]._id, // Minh
//         carId: cars[4]._id,   // Ford Ranger
//         startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
//         endDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),   // 10 days ago
//         totalPrice: 350,
//         status: "COMPLETED"
//       },
//       {
//         userId: users[4]._id, // Toan
//         carId: cars[6]._id,   // Hyundai Tucson
//         startDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),  // 8 days ago
//         endDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),    // 6 days ago
//         totalPrice: 110,
//         status: "CANCELLED"
//       }
//     ]);

//     console.log(`✅ Created ${bookings.length} bookings`);

//     console.log("\n🎉 Database seeded successfully!");
//     console.log("\n📊 Summary:");
//     console.log(`   - Users: ${users.length}`);
//     console.log(`   - Cars: ${cars.length}`);
//     console.log(`   - Bookings: ${bookings.length}`);
    
//     console.log("\n🔐 Demo Users:");
//     console.log("   - Châu (ADMIN): admin@gmail.com / password123");
//     console.log("   - Lan (OWNER): lan@gmail.com / password123");
//     console.log("   - Trung (OWNER): bob@gmail.com / password123");
//     console.log("   - Minh (CUSTOMER): minh@gmail.com / password123");
//     console.log("   - Toan (CUSTOMER): toannpd@gmail.com / password123");

//     console.log("\n🚀 You can now start the server with: node app.js");
//     console.log("   Visit: http://localhost:3000\n");

//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//   } finally {
//     await mongoose.connection.close();
//     console.log("👋 Database connection closed");
//     process.exit(0);
//   }
// }

// // Run the seed function
// seedDatabase();
