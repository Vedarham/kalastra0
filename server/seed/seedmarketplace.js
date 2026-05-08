import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

dotenv.config();

// ─── Helpers ───────────────────────────────────────────────────────────────

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));

const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// ─── Static Data ───────────────────────────────────────────────────────────

const CATEGORIES = [
  "Jewelry", "Pottery", "Textiles", "Woodwork", "Metalwork",
  "Glass", "Leather", "Paper Crafts", "Home Decor", "Art",
  "Clothing", "Accessories", "Toys", "Other",
];

// Curated artisan profiles — each has a specialty
const ARTISANS = [
  {
    name: "Ananya Sharma",
    email: "ananya@craftmarket.dev",
    shopName: "Ananya's Jewelry House",
    shopDescription: "Handcrafted silver and gemstone jewelry inspired by Rajasthani traditions.",
    bio: "10+ years crafting statement jewelry using sterling silver and semi-precious stones.",
    specialty: "Jewelry",
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=ananya",
    rating: 4.8,
    totalSales: 342,
  },
  {
    name: "Priya Patel",
    email: "priya@craftmarket.dev",
    shopName: "Priya's Pottery Studio",
    shopDescription: "Functional and decorative pottery wheel-thrown in small batches.",
    bio: "Studio potter with a love for earthy glazes and organic forms.",
    specialty: "Pottery",
    location: { city: "Ahmedabad", state: "Gujarat", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=priya",
    rating: 4.6,
    totalSales: 218,
  },
  {
    name: "Rohan Mehta",
    email: "rohan@craftmarket.dev",
    shopName: "Rohan's Woodcraft",
    shopDescription: "Reclaimed wood furniture and decorative sculptures built to last generations.",
    bio: "Carpenter and sculptor using sustainably sourced Indian hardwoods.",
    specialty: "Woodwork",
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=rohan",
    rating: 4.9,
    totalSales: 156,
  },
  {
    name: "Isha Singh",
    email: "isha@craftmarket.dev",
    shopName: "Isha's Textile Tales",
    shopDescription: "Block-printed and hand-dyed textiles celebrating Indian weaving traditions.",
    bio: "Textile artist trained in Bagru block printing and natural indigo dyeing.",
    specialty: "Textiles",
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=isha",
    rating: 4.7,
    totalSales: 289,
  },
  {
    name: "Vikram Verma",
    email: "vikram@craftmarket.dev",
    shopName: "Vikram Metalworks",
    shopDescription: "Handbeaten brassware and copper home décor with antique finishing.",
    bio: "Third-generation metalsmith from Moradabad, the brass city of India.",
    specialty: "Metalwork",
    location: { city: "Moradabad", state: "Uttar Pradesh", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=vikram",
    rating: 4.5,
    totalSales: 198,
  },
  {
    name: "Sunita Devi",
    email: "sunita@craftmarket.dev",
    shopName: "Sunita's Weave World",
    shopDescription: "Handloom sarees and stoles woven on traditional pit looms.",
    bio: "Master weaver from Varanasi keeping the Banarasi silk tradition alive.",
    specialty: "Clothing",
    location: { city: "Varanasi", state: "Uttar Pradesh", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=sunita",
    rating: 4.9,
    totalSales: 412,
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@craftmarket.dev",
    shopName: "Rajesh Art Gallery",
    shopDescription: "Original oil and watercolour paintings — landscapes, portraits, and abstract.",
    bio: "Fine arts graduate painting full-time since 2012 from his Mumbai studio.",
    specialty: "Art",
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=rajesh",
    rating: 4.7,
    totalSales: 134,
  },
  {
    name: "Neha Gupta",
    email: "neha@craftmarket.dev",
    shopName: "Neha's Leather Studio",
    shopDescription: "Vegetable-tanned leather bags and accessories stitched by hand.",
    bio: "Self-taught leather crafter obsessed with clean lines and durable construction.",
    specialty: "Leather",
    location: { city: "Delhi", state: "Delhi", country: "India" },
    avatar: "https://i.pravatar.cc/150?u=neha",
    rating: 4.6,
    totalSales: 176,
  },
];

// Buyers — needed to create real orders
const BUYERS = [
  { name: "Arjun Nair", email: "arjun@buyer.dev" },
  { name: "Meera Iyer", email: "meera@buyer.dev" },
  { name: "Sameer Khan", email: "sameer@buyer.dev" },
  { name: "Pooja Reddy", email: "pooja@buyer.dev" },
  { name: "Kartik Bose", email: "kartik@buyer.dev" },
];

// Products per artisan — keyed by specialty for realism
const PRODUCTS_BY_SPECIALTY = {
  Jewelry: [
    {
      name: "Sterling Silver Oxidised Jhumkas",
      description: "Traditional Rajasthani jhumka earrings crafted from 92.5 sterling silver with oxidised finish. Each pair is handmade and slightly unique.",
      price: 1200,
      stock: 15,
    },
    {
      name: "Turquoise Gemstone Necklace",
      description: "Hand-strung turquoise beads with a sterling silver clasp. Inspired by Mughal jewellery traditions.",
      price: 2800,
      stock: 8,
    },
    {
      name: "Meenakari Bangle Set",
      description: "Set of 4 hand-painted Meenakari bangles with floral motifs in vibrant enamel colours.",
      price: 1800,
      stock: 20,
    },
    {
      name: "Tribal Silver Cuff Bracelet",
      description: "Wide cuff bracelet with engraved tribal patterns. Handcrafted by silversmiths in Jodhpur.",
      price: 3200,
      stock: 6,
    },
  ],
  Pottery: [
    {
      name: "Terracotta Planter Set",
      description: "Set of 3 hand-thrown terracotta planters in graduating sizes. Unglazed exterior with a sealed interior.",
      price: 950,
      stock: 12,
    },
    {
      name: "Blue Pottery Dinner Plate",
      description: "Iconic Jaipur blue pottery dinner plate with floral motifs. Handpainted with traditional cobalt blue pigment.",
      price: 650,
      stock: 25,
    },
    {
      name: "Stoneware Coffee Mug",
      description: "Wheel-thrown stoneware mug with a reactive glaze that makes each piece unique. Microwave and dishwasher safe.",
      price: 480,
      stock: 30,
    },
    {
      name: "Handbuilt Serving Bowl",
      description: "Large handbuilt ceramic serving bowl with a speckled glaze. Food safe and oven proof.",
      price: 1400,
      stock: 10,
    },
  ],
  Woodwork: [
    {
      name: "Sheesham Wood Side Table",
      description: "Solid Indian rosewood (Sheesham) side table with hand-carved legs. Natural oil finish. Ships unassembled.",
      price: 6500,
      stock: 5,
    },
    {
      name: "Reclaimed Wood Wall Clock",
      description: "Wall clock made from reclaimed teak with a matte black clock mechanism. Each piece has its own character.",
      price: 2200,
      stock: 8,
    },
    {
      name: "Hand-Carved Elephant Figurine",
      description: "Detailed elephant sculpture carved from a single block of sandalwood. 6 inches tall.",
      price: 1800,
      stock: 12,
    },
    {
      name: "Mango Wood Cheese Board",
      description: "Rustic mango wood cheese board with a juice groove and a natural wax finish. Food safe.",
      price: 890,
      stock: 20,
    },
  ],
  Textiles: [
    {
      name: "Indigo Block Print Kurta",
      description: "Hand block-printed cotton kurta using natural indigo dye on 100% organic cotton. Available in size M–XL.",
      price: 1600,
      stock: 18,
    },
    {
      name: "Bagru Print Table Runner",
      description: "Traditional Bagru block print table runner in earthy tones. 100% cotton, machine washable.",
      price: 580,
      stock: 35,
    },
    {
      name: "Hand-Dyed Linen Scarf",
      description: "Shibori-dyed linen scarf with a distinctive pleated texture. Each piece is uniquely dyed.",
      price: 1200,
      stock: 15,
    },
    {
      name: "Patchwork Kantha Throw",
      description: "Hand-stitched kantha throw made from upcycled vintage cotton saris. Reversible design.",
      price: 3200,
      stock: 7,
    },
  ],
  Metalwork: [
    {
      name: "Handbeaten Brass Vase",
      description: "Tall handbeaten brass vase with a hammered texture and antique patina. 12 inches tall.",
      price: 2400,
      stock: 10,
    },
    {
      name: "Copper Serving Kadhai",
      description: "Traditional copper kadhai with two handles. Tin-lined interior for food safety. 28cm diameter.",
      price: 3800,
      stock: 6,
    },
    {
      name: "Dhokra Art Wall Hanging",
      description: "Lost-wax cast Dhokra art piece depicting folk motifs. Comes with a jute hanging cord.",
      price: 4200,
      stock: 4,
    },
    {
      name: "Brass Diya Set",
      description: "Set of 5 handcrafted brass diyas with intricate engravings. Perfect for gifting.",
      price: 780,
      stock: 40,
    },
  ],
  Clothing: [
    {
      name: "Banarasi Silk Saree",
      description: "Handwoven Banarasi silk saree with a gold zari border and pallav. Takes 3–4 days to weave on a pit loom.",
      price: 12000,
      stock: 5,
    },
    {
      name: "Cotton Handloom Stole",
      description: "Lightweight handloom cotton stole with a natural dye stripe pattern. 200cm x 70cm.",
      price: 850,
      stock: 22,
    },
    {
      name: "Silk Dupatta with Zari",
      description: "Pure silk dupatta with traditional zari weave at both ends. 250cm length.",
      price: 4500,
      stock: 8,
    },
    {
      name: "Kantha Embroidered Jacket",
      description: "Cotton jacket with dense Kantha hand embroidery all over. Fully lined interior.",
      price: 5800,
      stock: 6,
    },
  ],
  Art: [
    {
      name: "Watercolour Landscape — Ghats",
      description: "Original watercolour painting of the Varanasi ghats at sunrise. 12x16 inches, framed.",
      price: 8500,
      stock: 1,
    },
    {
      name: "Abstract Oil on Canvas",
      description: "Large abstract oil painting in warm earth tones. 24x30 inches on stretched canvas. Unframed.",
      price: 14000,
      stock: 1,
    },
    {
      name: "Madhubani Folk Art Print",
      description: "Giclée print of an original Madhubani painting on archival cotton rag paper. Limited edition of 50.",
      price: 2200,
      stock: 12,
    },
    {
      name: "Miniature Portrait Commission",
      description: "Commission a miniature portrait in the Mughal style. Painted in gouache on wasli paper. 4x6 inches.",
      price: 6000,
      stock: 3,
    },
  ],
  Leather: [
    {
      name: "Vegetable Tanned Tote Bag",
      description: "Full-grain vegetable tanned leather tote. Saddle-stitched by hand with waxed linen thread. Gets better with age.",
      price: 7200,
      stock: 6,
    },
    {
      name: "Slim Cardholder Wallet",
      description: "Minimalist 4-card leather wallet with a centre cash slot. Available in tan, brown, and black.",
      price: 1200,
      stock: 25,
    },
    {
      name: "Leather Journal Cover",
      description: "Hand-stitched leather journal cover to fit A5 notebooks. Includes a pen loop and bookmark.",
      price: 1800,
      stock: 15,
    },
    {
      name: "Crossbody Satchel",
      description: "Medium crossbody bag with a magnetic closure and adjustable strap. Fits a 10-inch tablet.",
      price: 5400,
      stock: 8,
    },
  ],
};

// Curated Unsplash images per category (with proper sizing params)
const IMAGES_BY_SPECIALTY = {
  Jewelry:    ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"],
  Pottery:    ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800", "https://images.unsplash.com/photo-1493106641515-5b6f77bc3d14?w=800"],
  Woodwork:   ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"],
  Textiles:   ["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800", "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800"],
  Metalwork:  ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800"],
  Clothing:   ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800", "https://images.unsplash.com/photo-1594938298603-c8148c4b4de4?w=800"],
  Art:        ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800", "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800"],
  Leather:    ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800"],
};

const ORDER_STATUSES = ["pending", "confirmed", "processing", "cancelled", "refunded"];
const PAYMENT_STATUSES = ["paid", "paid", "paid", "pending", "refunded"]; // weighted toward paid
const PAYMENT_METHODS = ["card", "stripe", "paypal", "cash_on_delivery"];

// ─── Seed ──────────────────────────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // ── Wipe previous seed data ──
    await User.deleteMany({ email: { $regex: /@craftmarket\.dev$|@buyer\.dev$/ } });
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Cleared previous seed data");

    const hashedPassword = await bcrypt.hash("Test@1234", 10);

    // ── 1. Create buyers ──
    const createdBuyers = await User.insertMany(
      BUYERS.map((b) => ({
        ...b,
        password: hashedPassword,
        role: "buyer",
        avatar: `https://i.pravatar.cc/150?u=${b.email}`,
        isEmailVerified: true,
      }))
    );
    console.log(`👤 Created ${createdBuyers.length} buyers`);

    // ── 2. Create artisans + products ──
    const allProducts = [];

    for (const artisanData of ARTISANS) {
      const artisan = await User.create({
        name: artisanData.name,
        email: artisanData.email,
        password: hashedPassword,
        role: "seller",
        shopName: artisanData.shopName,
        shopDescription: artisanData.shopDescription,
        bio: artisanData.bio,
        location: artisanData.location,
        avatar: artisanData.avatar,
        rating: artisanData.rating,
        totalSales: artisanData.totalSales,
        isSellerVerified: true,
        isEmailVerified: true,
        category: artisanData.specialty,
      });

      const productTemplates = PRODUCTS_BY_SPECIALTY[artisanData.specialty];
      const images = IMAGES_BY_SPECIALTY[artisanData.specialty];

      const products = await Product.insertMany(
        productTemplates.map((p) => ({
          name: p.name,
          description: p.description,
          price: p.price,
          category: artisanData.specialty,
          artisan: artisan._id,
          stock: p.stock,
          sales: getRandomInt(10, artisanData.totalSales),
          rating: getRandomFloat(4.0, 5.0),
          numReviews: getRandomInt(5, 80),
          images: [
            { url: images[0] },
            { url: images[1] },
          ],
          isActive: true,
          status: "active",
          tags: [artisanData.specialty.toLowerCase(), "handmade", "artisan", "india"],
        }))
      );

      allProducts.push(...products.map((p) => ({ ...p.toObject(), artisanDoc: artisan })));
      console.log(`🎨 ${artisan.name} — ${products.length} products created`);
    }

    // ── 3. Create orders (2–4 per buyer) ──
    let orderCount = 0;

    for (const buyer of createdBuyers) {
      const numOrders = getRandomInt(2, 4);

      for (let o = 0; o < numOrders; o++) {
        // Pick 1–3 random products from different artisans
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const pickedProducts = shuffled.slice(0, getRandomInt(1, 3));

        const items = pickedProducts.map((p) => ({
          product: p._id,
          seller: p.artisan,
          name: p.name,
          image: p.images[0]?.url || "",
          price: p.price,
          quantity: getRandomInt(1, 2),
          status: getRandom(["pending", "confirmed", "processing"]),
        }));

        const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        const paymentStatus = getRandom(PAYMENT_STATUSES);
        const orderStatus = paymentStatus === "paid"
          ? getRandom(["confirmed", "processing"])
          : paymentStatus === "refunded"
          ? "refunded"
          : "pending";

        const daysAgo = getRandomInt(1, 90);

        const order = await Order.create({
          buyer: buyer._id,
          items,
          shippingAddress: {
            fullName: buyer.name,
            addressLine1: `${getRandomInt(1, 200)}, Example Street`,
            city: getRandom(["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"]),
            state: getRandom(["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal"]),
            postalCode: String(getRandomInt(100000, 999999)),
            country: "India",
            phone: `+91${getRandomInt(7000000000, 9999999999)}`,
          },
          pricing: { subtotal, tax, discount: 0, total },
          payment: {
            method: getRandom(PAYMENT_METHODS),
            status: paymentStatus,
            transactionId: paymentStatus === "paid" ? `txn_${Date.now()}_${getRandomInt(100, 999)}` : undefined,
            paidAt: paymentStatus === "paid" ? getPastDate(daysAgo) : undefined,
          },
          status: orderStatus,
          isPaid: paymentStatus === "paid",
          createdAt: getPastDate(daysAgo),
        });

        orderCount++;
      }
    }

    console.log(`📦 Created ${orderCount} orders across ${createdBuyers.length} buyers`);

    // ── 4. Summary ──
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌱 SEED COMPLETE");
    console.log(`   Artisans : ${ARTISANS.length}`);
    console.log(`   Products : ${allProducts.length}`);
    console.log(`   Buyers   : ${createdBuyers.length}`);
    console.log(`   Orders   : ${orderCount}`);
    console.log("\n🔑 Login credentials (all accounts):");
    console.log("   Password : Test@1234");
    console.log("\n   Artisans:");
    ARTISANS.forEach((a) => console.log(`   ${a.email}`));
    console.log("\n   Buyers:");
    BUYERS.forEach((b) => console.log(`   ${b.email}`));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();