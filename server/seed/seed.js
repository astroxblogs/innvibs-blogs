require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI);

const seedBlogs = [
  {
    title: "Hello World (English)",
    content: "This is the first blog post in English.",
    image: "https://via.placeholder.com/600x300",
    tags: ["welcome", "english"],
    language: "en",
    likes: 0,
    comments: []
  },
  {
    title: "नमस्ते दुनिया (Hindi)",
    content: "यह हिंदी में पहला ब्लॉग पोस्ट है।",
    image: "https://via.placeholder.com/600x300",
    tags: ["welcome", "hindi"],
    language: "hi",
    likes: 0,
    comments: []
  }
];

const seedAdmin = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  return {
    username: 'admin',
    password: hash
  };
};

async function seed() {
  await Blog.deleteMany({});
  await Blog.insertMany(seedBlogs);
  await Admin.deleteMany({});
  await Admin.create(await seedAdmin());
  console.log('Seeded blogs and admin!');
  mongoose.disconnect();
}

seed(); 