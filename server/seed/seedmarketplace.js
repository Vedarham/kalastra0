import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const categories = ['Jewelry',
            'Pottery',
            'Textiles',
            'Woodwork',
            'Metalwork',
            'Glass',
            'Leather',
            'Paper Crafts',
            'Home Decor',
            'Art',
            'Clothing',
            'Accessories',
            'Toys',
            'Other'];

const productImages = [
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa",
  "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5",
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
];

// 8 artisans
const artisansData = [
  { name: "Ananya Sharma", email: "ananya@test.com" },
  { name: "Priya Patel", email: "priya@test.com" },
  { name: "Rohan Mehta", email: "rohan@test.com" },
  { name: "Isha Singh", email: "isha@test.com" },
  { name: "Vikram Verma", email: "vikram@test.com" },
  { name: "Sunita Devi", email: "sunita@test.com" },
  { name: "Rajesh Kumar", email: "rajesh@test.com" },
  { name: "Neha Gupta", email: "neha@test.com" },
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const productTitles = [
  "Handcrafted Vase",
  "Traditional Scarf",
  "Silver Pendant",
  "Abstract Painting",
  "Wooden Sculpture",
  "Decorative Bowl",
  "Embroidered Cushion",
  "Beaded Necklace",
];

// create 3–5 products per artisan
const createProductsForArtisan = (artisanId, name) => {
  const productCount = Math.floor(Math.random() * 3) + 3; // 3 to 5

  return Array.from({ length: productCount }).map((_, i) => ({
    name: `${name}'s ${getRandom(productTitles)}`,
    description: "Authentic handmade product crafted with traditional techniques and premium materials.",
    price: Math.floor(Math.random() * 3000) + 300,
    category: getRandom(categories),
    artisan: artisanId,
    images: [
      { url: getRandom(productImages) },
      { url: getRandom(productImages) },
    ],
    rating: Number((Math.random() * 1 + 4).toFixed(1)),
    reviews: [],
    stock: Math.floor(Math.random() * 50) + 5,
    isActive: true,
  }));
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ DB Connected");

    // साफ पुराना data
    await User.deleteMany({ role: "seller" });
    await Product.deleteMany({});

    const createdArtisans = [];

    // 1️⃣ Create artisans
    for (const artisan of artisansData) {
      const user = await User.create({
        ...artisan,
        password: "123456",
        role: "seller",
        shopName: `${artisan.name}'s Craft Store`,
        category: getRandom(categories),
        rating: Number((Math.random() * 1 + 4).toFixed(1)),
        totalSales: Math.floor(Math.random() * 2000),
        bio: "Passionate artisan creating unique handmade products.",
        avatar: `https://i.pravatar.cc/150?u=${artisan.email}`,
      });

      createdArtisans.push(user);
    }

    // 2️⃣ Create products
    for (const artisan of createdArtisans) {
      const products = createProductsForArtisan(artisan._id, artisan.name);

      const createdProducts = await Product.insertMany(products);

      // link products to artisan
      artisan.products = createdProducts.map((p) => p._id);
      await artisan.save();
    }

    console.log("🔥 Marketplace seeded with 8 artisans & 3+ products each");
    process.exit();

  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();