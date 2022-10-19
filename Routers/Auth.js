const router = require("express").Router(); //requiring router
const passport = require("passport"); //requiring passport

const CLIENT_URL = "https://secretmeph.herokuapp.com/";
const CLIENT_URL_LOGIN = "https://secretmeph.herokuapp.com/login";

//if authentication in Google succeded
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  }
});

//if authentication in Google failed
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});


//logout
router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect(CLIENT_URL_LOGIN);
})

//Router for Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] })); //get only the profile

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);



// Router for Facebook

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);


//if successful, it will redirect to homepage else /login/failed/




module.exports = router;