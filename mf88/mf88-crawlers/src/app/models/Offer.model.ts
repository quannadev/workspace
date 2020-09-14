import { model, models, Schema } from 'mongoose';

const OfferSchema: Schema = new Schema({

});

export const Offer = models.Offer || model('Offer', OfferSchema);
