import {model, models, Schema, Document, Model} from 'mongoose';

const NetworkSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    api: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export interface INetwork extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    api: string;
    apiKey: string;
    created_at: Date;
    updated_at: Date;
}

export const Network: Model<INetwork> = models.Network || model<INetwork>('Network', NetworkSchema);
