const { AES, generateRandomBytes } = require("@empo/encryption"); //requiring @empo/encryption for encrypting Password
const jwt = require("jsonwebtoken");
const express = require("express"); //requiring express
const router = express.Router(); //making a router
const User = require("../Models/User");
const date = new Date();

const plaintext = "Ajo!12345";
const secret = generateRandomBytes({ type: "salt", encoding: "base64" });

const aes = new AES(secret);

const encrypted = aes.encrypt(plaintext);

const decrypted = aes.decrypt(encrypted);

//router for register
router.post("/register", async (req, res) => {
  const newUser = new User({
    userID: req.body.userID,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: aes.encrypt(req.body.password), //encrypting the password
    email: req.body.email,
    image: req.body.image,
  });
  try {
    const savedUser = await newUser.save(); //saving the newUser
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//router for login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //get the data if it is equal to the inputted username

    if (!user) {
      //if the user is not equal
      return res.status(401).json("No existing username!");
    }

    const decryptedPassword = aes.decrypt(user.password);
    //  //decrypting the password

    // const password2 = decryptedPassword.toString(cryptojs.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Password is incorrect!");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const AllUser = await User.find();
    res.status(200).json(AllUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete User
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User was deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:email", async (req, res)=>{
  try{
    const findUser = await User.find({email: req.params.email});
    res.status(200).json(findUser);
  }catch(error){
    res.status(500).json(error);
  }
})


router.get("/findUser/:id", async (req, res)=>{
  try{
    const findUserById = await User.findById(req.params.id);
    res.status(200).json(findUserById);
  }catch(error){
    res.status(500).json(error);
  }
})


module.exports = router;
