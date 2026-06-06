const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://blog10-epia.onrender.com/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const db = mongodb.getDb().db();
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ googleId: profile.id });

    if (!user) {
      const result = await usersCollection.insertOne({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePhoto: profile.photos[0].value,
        createdAt: new Date()
      });
      user = await usersCollection.findOne({ _id: result.insertedId });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const mongodb = require('../db/connect');
    const db = mongodb.getDb().db();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;