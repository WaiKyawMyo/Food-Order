import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: "djfmiswjx",
  api_key: "889914658812828",
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;