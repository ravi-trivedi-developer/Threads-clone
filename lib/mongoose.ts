import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  /**
   * When the strict option is set to true,
   * Mongoose will ensure that only the fields
   * that are specified in your schema will be saved in the database,
   * and all other fields will not be saved
   * (if some other fields are sent).
   */

  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

  if (isConnected) return console.log("Already connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  } catch (error) {
    console.log("~ connectToDB ~ error:", error);
  }
};

// const Connect = async () => {
//   const databaseURL: string = process.env.DB_URL
//     ? process.env.DB_URL
//     : "mongodb://localhost:27017/threads";
//   mongoose.connect(databaseURL, {
//     dbName: process.env.DB_NAME,
//     autoCreate: true,
//   });
// };

// const connectWithRetry = async () => {
//   try {
//     await Connect();
//     console.log("Connection Established...");
//   } catch (error) {
//     console.log(
//       "Database Connection Error Will retry connection after 5 seconds"
//     );
//     setTimeout(connectWithRetry, 5000);
//   }
// };

// connectWithRetry();
