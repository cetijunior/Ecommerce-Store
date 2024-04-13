import dbConnect from '@/lib/dbConnect';
import ProductModel from '../../../models/Product';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { method } = req;

    switch (method) {
      case 'POST': {
        try {
          const product = await ProductModel.create(req.body);
          res.status(201).json({ success: true, product });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;
      }
      case 'GET': {
        try {
          const products = await ProductModel.find({});
          res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
        break;
      }
      default: {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error('Failed to connect to the database or retrieve data:', error);
    res.status(500).json({ message: 'Failed to connect to the database or retrieve data.' });
  }
}
