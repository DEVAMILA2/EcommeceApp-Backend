const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const JWT = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
        img: req.body.img,
        address: req.body.address,
    });
    try {
        const saveUser = await newUser.save();
        res.status(200).json(saveUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            userName: req.body.userName
        });
        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        const inputPassword = req.body.password;

        originalPassword != inputPassword && res.status(401).json("Wrong Password");

        const accessToken = JWT.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin
            },
            process.env.JWT_SEC,
            {
                expiresIn:"3d"
            }
        );
        const {password, ...others}=user._doc;
        res.status(200).json({...others,accessToken});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }

});


module.exports = router;