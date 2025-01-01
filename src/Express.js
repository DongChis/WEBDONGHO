// Mock backend example (Express.js)

import express from "express";

const app = express();

let cart = [];

app.use(express.json());

app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    res.status(200).json({ message: 'Added to cart', cart });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
