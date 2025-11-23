import Category from "../model/categoryModel.js"
// for creating new category
export const create = async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name || name.trim() === "" ||
            !image || image.trim() === "") {
            return res.status(400).json({ message: "All fields (name,image) are required." });
        }
        const category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ message: "Category already exists." });
        }
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
// For getting all Category from database 
export const getAll = async (req, res) => {
    try {
        const categoryes = await Category.find();
        if (Category.length === 0) {
            return res.status(404).json({ message: "Category not Found." })
        }
        res.status(200).json(categoryes);
    } catch (error) {
        res.status(500).json({ error: " Error. " })
    }
}
// For updating Category 
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const categoryExist = await Category.findOne({ _id: id })
        if (!categoryExist) {
            return res.status(404).json({ message: "Category not found." })
        }
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updateCategory);
    } catch (error) {
        res.status(500).json({ error: "Error. " })
    }
}
// For deleting Category
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const categoryExist = await Category.findOne({ _id: id })
        if (!categoryExist) {
            return res.status(404).json({ message: "Category Not Found. " })
        }
        await Category.findByIdAndDelete(id);
        res.status(201).json({ message: " Category deleted Successfully." })
    } catch (error) {
        res.status(500).json({ error: " Error. " })
    }
}