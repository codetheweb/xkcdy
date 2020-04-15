import mongoose, {Schema, Document} from 'mongoose';

const Image = new Schema({
	url: String,
	width: Number,
	height: Number,
	ratio: Number
});

const ComicModel = new Schema({
	id: {
		type: Number,
		index: {
			unique: true
		}
	},
	publishedAt: Date,
	news: String,
	safeTitle: String,
	title: String,
	transcript: String,
	alt: String,
	urls: new Schema({
		source: String,
		explain: String
	}),
	imgs: new Schema({
		x1: Image,
		x2: Image
	})
});

interface ComicImage {
	url: string;
	width: number;
	height: number;
	ratio: number;
}

export interface Comic extends Document {
	id: number;
	publishedAt: Date;
	news: string;
	safeTitle: string;
	title: string;
	transcript: string;
	alt: string;
	urls: {
		source: string;
		explain: string;
	};
	imgs: {
		x1: ComicImage;
		x2: ComicImage | null;
	};
}

let compiledModel: mongoose.Model<Comic>;

try {
	compiledModel = mongoose.model('Comic');
} catch (_) {
	compiledModel = mongoose.model<Comic>('Comic', ComicModel);
}

export default compiledModel;
