const express = require("express");
const jwt = require("jsonwebtoken"); // Ensure you have this library installed
const router = express.Router();
const Review = require("../models/reviewModel");

// Middleware to check if the user is logged in and extract their role
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Decode token and verify with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// POST: Submit a review
<<<<<<< HEAD
router.post("/submit", async (req, res) => {
    const { email, rating, reviewText } = req.body;
  
    if (!email || !rating || !reviewText) {
      return res.status(400).json({ message: "Email, rating, and review text are required." });
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
  
    try {
      const newReview = new Review({ email, rating, reviewText });
      await newReview.save();
      return res.status(201).json({ message: "Review submitted successfully!" });
    } catch (error) {
      console.error("Error saving review:", error);
      
      return res.status(500).json({ message: "Failed to submit review. Try again later." });
    }
  });
  
// GET: Fetch all reviews (optional)
=======
router.post("/submit", authenticateUser, async (req, res) => {
  const { email, rating, reviewText } = req.body;

  // Restrict admins from submitting reviews
  if (req.user.role && req.user.role.toLowerCase() === "admin") {
    return res.status(403).json({ message: "Admins are not allowed to submit reviews." });
  }

  // Validate input
  if (!email || !rating || !reviewText) {
    return res.status(400).json({ message: "Email, rating, and review text are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const newReview = new Review({ email, rating, reviewText });
    await newReview.save();
    return res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ message: "Failed to submit review. Try again later." });
  }
});

// GET: Fetch all reviews
>>>>>>> cbf5890e020779475066abe4027a5b702e2cb306
router.get("/", async (req, res) => {
  try {
    console.log("in th")
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews. Try again later." });
  }
});

module.exports = router;
