import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriber extends Document {
    email: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriberSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: "community" },
}, { timestamps: true });

export const Subscriber = mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
