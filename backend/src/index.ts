import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});