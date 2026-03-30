const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
  callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {

  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: "google"
      });

      await user.save();
    }

    done(null, user);

  } catch (err) {
    done(err, null);
  }
}));