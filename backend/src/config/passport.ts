import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User, IUser } from '../models/User';
import { config } from '../config';
import { logger } from '../logger';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (config.google && config.google.clientId && config.google.clientSecret) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl
    },
        async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ googleId: profile.id });

                if (existingUser) {
                    return done(null, existingUser);
                }

                // Create a new User
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                    firstName: profile.name?.givenName || '',
                    lastName: profile.name?.familyName || '',
                    profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                logger.error('Error during Google authentication', err);
                done(err, false);
            }
        }));
} else {
    logger.warn('Google Client ID or Secret is missing in .env. Passport Google Strategy skipped.');
}

export default passport;
