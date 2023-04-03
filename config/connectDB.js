const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(
      `Failed to connect to database: ${err.message}. Exiting application.`
    );
    process.exit(1);
  }
};

module.exports = connectDB;
