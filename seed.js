require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Product = require("./backend/models/Transaction");

const MONGO_URI =  "mongodb+srv://Pratik:Zc3zewFkgaCstPzk@cluster0.xexyi.mongodb.net/Roxiler-main";

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Fetch data from API
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const products = response.data;

        // Clear existing data (optional)
        await Product.deleteMany({});

        // Insert data into MongoDB
        await Product.insertMany(products);
        console.log("Data seeded successfully!");

        // Close connection
        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding data:", error);
        mongoose.connection.close();
    }
};

seedDatabase();
