
import express from 'express';
import Farmer from '../models/Farmer.js';
import multer from 'multer';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/farmer-register', upload.single('document'), async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // Check if the email is already registered
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) return res.json("Already registered");

    // Create a new farmer
    const farmer = new Farmer({
      name,
      email,
      password,
      address,
      phone,
      document: req.file.path
    });

    await farmer.save();
    res.json("Registered successfully");
  } catch (err) {
    console.error("Error registering farmer:", err);
    res.status(500).send("Server error");
  }
});

export default router;
