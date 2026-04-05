import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Review from '../models/Review.model.js';

dotenv.config();

const users = [
  {
    name: 'John Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    shopName: 'Handcrafted Wonders',
    shopDescription: 'Beautiful handmade items crafted with love and care',
    bio: 'Artisan with 10 years of experience in woodworking',
    location: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    },
    isEmailVerified: true,
    isSellerVerified: true
  },
  {
    name: 'Jane Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    bio: 'Love supporting local artisans',
    location: {
      city: 'Seattle',
      state: 'Washington',
      country: 'USA'
    },
    isEmailVerified: true
  },
  {
    name: 'Alice Artisan',
    email: 'alice@example.com',
    password: 'password123',
    role: 'seller',
    shopName: 'Alice\'s Pottery Studio',
    shopDescription: 'Unique ceramic pieces for your home',
    bio: 'Potter specializing in functional ceramics',
    location: {
      city: 'Austin',
      state: 'Texas',
      country: 'USA'
    },
    isEmailVerified: true,
    isSellerVerified: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    const seller1 = createdUsers.find(u => u.email === 'seller@example.com');
    const seller2 = createdUsers.find(u => u.email === 'alice@example.com');
    const buyer = createdUsers.find(u => u.email === 'buyer@example.com');

    const products = [
      {
        name: 'Handcrafted Wooden Bowl',
        description: 'Beautiful hand-turned wooden bowl made from sustainable cherry wood. Perfect for serving salads or as a decorative piece.',
        price: 89.99,
        category: 'Woodwork',
        seller: seller1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa',
            alt: 'Wooden bowl'
          }
        ],
        inventory: {
          quantity: 10,
          sku: 'WB-001',
          trackInventory: true
        },
        materials: ['Cherry Wood', 'Food-safe finish'],
        colors: ['Natural'],
        tags: ['kitchen', 'wooden', 'handmade', 'sustainable'],
        processingTime: {
          min: 3,
          max: 5,
          unit: 'days'
        },
        shipping: {
          freeShipping: false,
          shippingCost: 12.99
        },
        isFeatured: true,
        status: 'active'
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 2 handmade ceramic mugs with unique glaze. Microwave and dishwasher safe.',
        price: 45.00,
        category: 'Pottery',
        seller: seller2._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d',
            alt: 'Ceramic mugs'
          }
        ],
        inventory: {
          quantity: 25,
          sku: 'CM-002',
          trackInventory: true
        },
        materials: ['Stoneware clay', 'Food-safe glaze'],
        colors: ['Blue', 'Green'],
        tags: ['pottery', 'kitchen', 'ceramic', 'coffee'],
        processingTime: {
          min: 1,
          max: 2,
          unit: 'weeks'
        },
        shipping: {
          freeShipping: true,
          shippingCost: 0
        },
        isFeatured: true,
        status: 'active'
      },
      {
        name: 'Leather Wallet',
        description: 'Minimalist leather wallet with 4 card slots and cash compartment. Hand-stitched with quality leather.',
        price: 65.00,
        category: 'Leather',
        seller: seller1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
            alt: 'Leather wallet'
          }
        ],
        inventory: {
          quantity: 15,
          sku: 'LW-003',
          trackInventory: true
        },
        materials: ['Full-grain leather', 'Waxed thread'],
        colors: ['Brown', 'Black', 'Tan'],
        tags: ['leather', 'wallet', 'accessories', 'minimalist'],
        customizationOptions: [
          {
            name: 'Initials Engraving',
            type: 'text',
            required: false,
            additionalCost: 10
          },
          {
            name: 'Color',
            type: 'select',
            options: ['Brown', 'Black', 'Tan'],
            required: true,
            additionalCost: 0
          }
        ],
        processingTime: {
          min: 5,
          max: 7,
          unit: 'days'
        },
        shipping: {
          freeShipping: false,
          shippingCost: 8.99
        },
        status: 'active'
      },
      {
        name: 'Handwoven Throw Blanket',
        description: 'Cozy throw blanket handwoven with soft cotton yarn. Perfect for your couch or bed.',
        price: 120.00,
        compareAtPrice: 150.00,
        category: 'Textiles',
        seller: seller2._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2',
            alt: 'Throw blanket'
          }
        ],
        inventory: {
          quantity: 8,
          sku: 'TB-004',
          trackInventory: true
        },
        materials: ['100% Cotton'],
        colors: ['Cream', 'Grey'],
        tags: ['textile', 'blanket', 'home decor', 'cozy'],
        dimensions: {
          length: 150,
          width: 120,
          unit: 'cm'
        },
        processingTime: {
          min: 2,
          max: 3,
          unit: 'weeks'
        },
        shipping: {
          freeShipping: true,
          shippingCost: 0
        },
        status: 'active'
      },
      {
        name: 'Silver Pendant Necklace',
        description: 'Handcrafted sterling silver pendant with intricate design. Comes with an 18-inch chain.',
        price: 95.00,
        category: 'Jewelry',
        seller: seller1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
            alt: 'Silver necklace'
          }
        ],
        inventory: {
          quantity: 12,
          sku: 'SN-005',
          trackInventory: true
        },
        materials: ['Sterling Silver'],
        colors: ['Silver'],
        tags: ['jewelry', 'necklace', 'silver', 'handmade'],
        processingTime: {
          min: 3,
          max: 5,
          unit: 'days'
        },
        shipping: {
          freeShipping: false,
          shippingCost: 5.99,
          expeditedAvailable: true,
          expeditedCost: 15.99
        },
        isFeatured: true,
        status: 'active'
      }
    ];

    console.log('Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSample Credentials:');
    console.log('Seller: seller@example.com / password123');
    console.log('Buyer: buyer@example.com / password123');
    console.log('Seller 2: alice@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
