const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Just some requirements of passport JS, cast types;
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true,
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile.id);
            /* */
            User.findOne({ googleId: profile.id }).then((existingUser) => {
                    console.log("resposta!")
                    if (existingUser) {
                        console.log("User Already exists");
                        done(null, existingUser);
                    } else {
                        new User({ googleId: profile.id })
                            .save()
                            .then(user => done(null,user));
                        console.log("user added successfully");
                    }
            });
            console.log("no paso na'")

        }
    )
); 