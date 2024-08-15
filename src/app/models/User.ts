import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  nickname: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
