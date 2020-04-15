import mongoose, {Schema, Document} from 'mongoose';

const SettingsModel = new Schema({
	lastUpdated: Date
});

export interface Settings extends Document {
	lastUpdated: Date;
}

let compiledModel: mongoose.Model<Settings>;

try {
	compiledModel = mongoose.model('Settings');
} catch (_) {
	compiledModel = mongoose.model<Settings>('Settings', SettingsModel);
}

export default compiledModel;
