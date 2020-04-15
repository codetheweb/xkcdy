import mongoose, {Schema, Document} from 'mongoose';

const SettingsModel = new Schema({
	lastUpdated: Date
});

export interface ISettings extends Document {
	lastUpdated: Date;
}

let compiledModel: mongoose.Model<ISettings>;

try {
	compiledModel = mongoose.model('Settings');
} catch (_) {
	compiledModel = mongoose.model<ISettings>('Settings', SettingsModel);
}

export default compiledModel;
