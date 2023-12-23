import mongoose, { model, Schema } from "mongoose";

export const connectDB = () => {
  const MONGO_URI = "mongodb://127.0.0.1:27017/chat-app";
  console.log(MONGO_URI);
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Connected to database..."))
    .catch((e) => console.log(e));
};

const UserSchema = new Schema({
  username: String,
  name: String,
  password: String,
  contacts: [{ type: String, default: [] }],
});

export const User = model("User", UserSchema);
