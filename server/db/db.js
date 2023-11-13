import mongoose from "mongoose";
const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`mongoDb connected on server::${conn.connection.host}`);
    })
    .catch((err) => console.log(err.message));
};
export default connectDb;
