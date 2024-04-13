import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Product from "../../../models/Product"; // Correct path for Product model

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect(); // Ensure proper database connection

    switch (method) {
        case "GET":
            try {
                const product = await Product.findById(id);
                if (!product) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }
                res.status(200).json({ success: true, data: product });
            } catch (error) {
                console.error("Error fetching product:", error); // Log error
                res.status(500).json({ success: false, message: "Server error" });
            }
            break;

        case "PUT":
            try {
                const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedProduct) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }
                res.status(200).json({ success: true, data: updatedProduct });
            } catch (error) {
                console.error("Error updating product:", error); // Log error
                res.status(500).json({ success: false, message: "Server error" });
            }
            break;

        case "DELETE":
            try {
                const deletedProduct = await Product.deleteOne({ _id: id });
                if (!deletedProduct) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                console.error("Error deleting product:", error); // Log error
                res.status(500).json({ success: false, message: "Server error" });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid method" });
            break;
    }
}
