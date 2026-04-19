import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const adminEmail = process.env.ADMIN_EMAIL;
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (clientID && clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value || '';
          const role = email === adminEmail ? 'admin' : 'user';

          let user = await User.findOne({ googleId: profile.id });
          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatar,
              role
            });
          } else {
            user.googleId = profile.id;
            user.email = email;
            user.name = profile.displayName;
            user.avatar = avatar;
            user.role = role;
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.log('Google OAuth skipped: missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

export default passport;
