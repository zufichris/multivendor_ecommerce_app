import mongoose from "mongoose";
import { IUser } from "../../entities/user";
import { AuthTypes, OAuthProviders } from "../../enums/auth";

const schema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    userName: String,
    accessToken: String,
    authType: {
      type: String,
      enum: AuthTypes,
      default:AuthTypes.EmailAndPassword
    },
    avatar: String,
    oAuthId: String,
    oAuthProvider: {
      type: String,
      enum: OAuthProviders,
    },
    password: String,
    refreshToken: String,
    tokenExpiry: Number,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model("User", schema);
