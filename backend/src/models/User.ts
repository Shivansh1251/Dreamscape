import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
