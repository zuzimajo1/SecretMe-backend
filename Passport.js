//Google OAuth Client
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const dotenv = require("dotenv"); //requiring dotenv

dotenv.config();

//GOOGLE APP ID and CLIENT SECRET
//FACEBOOK APP ID AND CLIENT SECRET


//USER Model
const User = require("./Models/User");

const { AES, generateRandomBytes } = require("@empo/encryption"); //requiring @empo/encryption for encrypting Password
const secret = generateRandomBytes({ type: "salt", encoding: "base64" });
const aes = new AES(secret);

//Passport Strategy for Google
passport.use(
  new GoogleStrategy( 
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://secretmeph.herokuapp.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const res = await User.findOne({ email: profile.emails[0].value }); //find in the db if there is a user

        if (!res) {
          //if there is no user, it will create
          const newUser = new User({
            username: profile.displayName,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            password: aes.encrypt(profile.familyName),
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await newUser.save();
          return cb(null, newUser);
        } else {
          return cb(null, res);
        }
      } catch (error) {}
    }
  )
);


//Passport Strategy for Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "https://secretmeph.herokuapp.com/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile2, done2) => {
       try {
        const resfacebook = await User.findOne({
          userID: profile2.id,
        });
        //find in the db if there is a user

        if (!resfacebook) {
          //if there is no user, it will create
          const newUserFacebook = new User({
            userID: profile2.id,
            username: profile2.displayName,
            firstname: profile2.displayName,
          });
          await newUserFacebook.save();
          return done2(null, newUserFacebook);
        } else {
          return done2(null, resfacebook);
        }
      } catch (error) {}
      
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
