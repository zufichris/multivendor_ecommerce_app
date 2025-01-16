import dotenv from "dotenv";
const { error, parsed } = dotenv.config();

if (error) {
  throw new Error("Missing .env file");
}

export const env = {
  in_prod: parsed!.NODE_ENV?.toLowerCase()?.includes("prod"),
  port: parsed!.PORT,
  mongo_uri: parsed!.MongoDB_URI,
  google_callback_url:parsed!.GOOGLE_CALLBACK_URL,
  google_client_id:parsed!.GOOGLE_CLIENT_ID,
  google_client_secret:parsed!.GOOGLE_CLIENT_SECRET,
  jwt_secret:parsed!.JWT_SECRET
};
