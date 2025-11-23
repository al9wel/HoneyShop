import User from "../model/userModel.js"
// For regstring user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || name.trim() === "" ||
            !email || email.trim() === "" ||
            !password || password.trim() === "") {
            return res.status(400).json({ message: "All fields (name, email, password) are required." });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
// for checking if user exist 
export const login = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Wrong email" })
        }
        if (user.password === req.body.password) {
            res.status(200).json({ user })
        }
        res.status(400).json({ message: "Wrong password" })
    } catch (error) {
        res.status(500).json({ error: "Error. " })
    }
}
// For getting all users from database 
export const getAll = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ message: "User not Found." })
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: " Error. " })
    }
}
// For getting one users from database 
export const getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findOne({ _id: id })
        if (!userExist) {
            return res.status(404).json({ message: "User not found." })
        }
        res.status(201).json(userExist);
    } catch (error) {
        res.status(500).json({ error: "Error. " })
    }
}
// For updating user 
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findOne({ _id: id })
        if (!userExist) {
            return res.status(404).json({ message: "User not found." })
        }
        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updateUser);
    } catch (error) {
        res.status(500).json({ error: "Error. " })
    }
}
// For deleting user
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findOne({ _id: id })
        if (!userExist) {
            return res.status(404).json({ message: " User Not Found. " })
        }
        await User.findByIdAndDelete(id);
        res.status(201).json({ message: " User deleted Successfully." })
    } catch (error) {
        res.status(500).json({ error: " Error. " })
    }
}