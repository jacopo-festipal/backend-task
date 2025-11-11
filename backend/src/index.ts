import { config } from "dotenv";
config(); // Loads .env file into process.env

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
