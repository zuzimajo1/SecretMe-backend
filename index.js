const mongoose = require("mongoose"); //requiring mongoose
const express = require("express"); //requiring express
const app = express(); //making an app variable

var path = require("path"); 

const dotenv = require("dotenv"); //requiring dotenv
const cors = require("cors"); //requiring cors
const passport = require("passport"); //requiring passport
const GooglePassport = require("./Passport");
const UserRouter = require('./Routers/UserRouter');
const AuthRoute = require("./Routers/Auth");
const cookieSession = require("cookie-session")
const MessageRouter = require("./Routers/MessageRouter");




dotenv.config();

app.use(cookieSession({
  name: "session",
  keys:["zuzim"],
  maxAge: 24 * 60 * 60 * 100
}))



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());


//connect to mongodb

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to the DB"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", UserRouter);
app.use("/auth", AuthRoute);
app.use("/api/message", MessageRouter);

  app.get('/*', (req, res)=>{
    res.send("This is backend for secret me")
  });


//creating port on 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log("Server is listening on port 5000")
})



