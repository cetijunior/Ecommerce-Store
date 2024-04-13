import mongoose, { Document, Model } from 'mongoose';

export interface ProductDoc extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

// Check if the model already exists, if not, define it
const ProductModel: Model<ProductDoc> = mongoose.models.Product || mongoose.model<ProductDoc>('Product', new mongoose.Schema<ProductDoc>({
  name: {
    type: String,
    required: [true, "Please provide a name for the product."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the product."],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the product."],
  },
  category: {
    type: String,
    required: [true, "Please specify the category of your product."],
    maxlength: [40, "Category cannot be more than 40 characters"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide an image url for the product."],
  },
  inStock: {
    type: Boolean,
    required: [true, "Please specify if the product is in stock."],
  },
}));

export default ProductModel;
