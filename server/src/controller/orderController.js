import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

// Create a new order. Calculates item prices from products collection.
export const create = async (req, res) => {
  try {
    const { user, products, address, paymentMethod } = req.body;
    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Fields (user, products) are required." });
    }

    // Build order items and compute total
    let total = 0;
    const items = [];
    for (const item of products) {
      const { product: productId, quantity } = item;
      const prod = await Product.findById(productId);
      if (!prod) return res.status(400).json({ message: `Product not found: ${productId}` });
      const price = prod.price || 0;
      const qty = quantity && quantity > 0 ? quantity : 1;
      total += price * qty;
      items.push({ product: productId, quantity: qty, price });
    }

    const newOrder = new Order({ user, products: items, totalAmount: total, address, paymentMethod });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Get all orders (optional filter by user id: ?user=<id>)
export const getAll = async (req, res) => {
  try {
    const { user } = req.query;
    const filter = {};
    if (user) filter.user = user;
    const orders = await Order.find(filter).populate("user").populate("products.product");
    if (orders.length === 0) return res.status(404).json({ message: "Orders not Found." });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Error. " });
  }
};

// Get single order by id
export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate("user").populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error. " });
  }
};

// Update order (commonly used to update status)
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const exist = await Order.findById(id);
    if (!exist) return res.status(404).json({ message: "Order not found." });
    const allowed = { status: req.body.status, address: req.body.address, paymentMethod: req.body.paymentMethod };
    const updated = await Order.findByIdAndUpdate(id, { $set: allowed }, { new: true });
    res.status(201).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error. " });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const exist = await Order.findById(id);
    if (!exist) return res.status(404).json({ message: "Order Not Found. " });
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted Successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Error. " });
  }
};
