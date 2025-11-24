import Product from "../model/productModel.js";

// Create a new product
export const create = async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || name.trim() === "" || price === undefined) {
            return res.status(400).json({ message: "Fields (name, price) are required." });
        }
        const existing = await Product.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Product already exists." });
        }
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get all products (optionally filter by category or featured)
export const getAll = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};
        if (category) filter.category = category;
        const products = await Product.find(filter).populate("category");
        if (products.length === 0) {
            return res.status(404).json({ message: "Products not Found." });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: " Error. " });
    }
};

// Get single product by id
export const getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate("category");
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error. " });
    }
};

// Update product
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const exist = await Product.findById(id);
        if (!exist) {
            return res.status(404).json({ message: "Product not found." });
        }
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error. " });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const exist = await Product.findById(id);
        if (!exist) {
            return res.status(404).json({ message: "Product Not Found. " });
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted Successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: " Error. " });
    }
};
