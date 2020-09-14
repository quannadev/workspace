import {model, models, Schema, Document, Model} from 'mongoose';

const PublisherSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    api: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export interface IPublisher extends Document{
    _id: Schema.Types.ObjectId;
    name: string;
    domain: string;
    api: string;
    created_at: Date;
    updated_at: Date;
}

export const Publisher: Model<IPublisher> = models.Publisher || model<IPublisher>('Publisher', PublisherSchema);
