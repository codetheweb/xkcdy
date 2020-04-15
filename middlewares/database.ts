import mongoose from 'mongoose';
import refreshDatabase from '../lib/refresh-database';

let db: typeof mongoose;

export default async (request, _, next: () => void) => {
	if (!db) {
		db = await mongoose.connect(process.env.MONGO_URL!, {
			useNewUrlParser: true
		});
	}

	request.db = db;

	await refreshDatabase();

	next();
};
