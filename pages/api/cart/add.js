// pages/api/cart/add.js
import { getSession } from "next-auth/react";
import dbConnect from "@/lib/dbConnect";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session || !session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId, quantity } = req.body;
    const userId = session.user.id; // The ID of the logged-in user

    await dbConnect();

    try {
        // Check if the user already has a cart, if not create one
        const cart = await Cart.findOneAndUpdate(
            { userId },
            {
                $push: { items: { productId, quantity } }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
