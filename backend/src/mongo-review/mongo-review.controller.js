import { getMongo } from '../../mongodb.js';

export const getAllReviews = async (req, res) => {
  try {
    const db = getMongo();
    const reviews = await db.collection('reviews').find().toArray();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const db = getMongo();
    const review = {
      ...req.body,
      created_at: new Date(),
      status: 'PENDING'
    };
    const result = await db.collection('reviews').insertOne(review);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};