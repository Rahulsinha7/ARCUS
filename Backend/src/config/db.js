const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING, {

    });
    console.log(" Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
}

module.exports = main;
