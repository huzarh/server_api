const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Kayıt işlemi
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password)
    // Gerekli alanların kontrolü
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar gereklidir!" });
    }

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı!" });
    }

    // Şifreyi hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluşturma
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi!" });
  } catch (error) {
    console.error("Kayıt hatası:", error); // Log the error
    res.status(500).json({ message: "Bir hata oluştu!", error: error.message });
  }
});

// Giriş işlemi
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı!" });
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Yanlış şifre!" });
    }

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Giriş başarılı!", token });
  } catch (error) {
    console.error("Giriş hatası:", error); // Log the error
    res.status(500).json({ message: "Bir hata oluştu!", error: error.message });
  }
});

module.exports = router;