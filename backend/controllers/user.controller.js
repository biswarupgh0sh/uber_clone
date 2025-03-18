const blacklistTokenModel = require("../models/blacklistToken.model");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { fullname, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });

        if (isUserAlreadyExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({ firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashedPassword });

        const token = user.generateAuthToken();

        return res.status(200).json({ token, user });
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) return res.status(401).json({ message: "Invalid email or password " });


        const isMatch = await user.comparePassword(password);

        if (!isMatch) return res.status(401).json({ message: "Invalid email or password " });
    

        const token = user.generateAuthToken();

        res.cookie("token", token);

        return res.status(200).json({ token, user });
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    return res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(" ", [1]);

    await blacklistTokenModel.create({ token });

    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out successfully" });
}
