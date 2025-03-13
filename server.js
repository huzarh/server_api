require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Statik dosya yollarını işlemek için
const authRoutes = require("./routes/auth");
const fs = require("fs");
const app = express();

// Middleware
app.use(express.json());

// CORS Middleware
app.use(
  cors({
    origin: "*", // Frontend URL'sini buraya ekleyin
    credentials: true,
  })
);

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));


app.get("/videos/:filename", (req, res) => {
  const filePath = path.join("/root/file", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Dosya bulunamadı.");
  }
});
// Rotalar
app.use("/api/auth", authRoutes);

// Sunucuyu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});