import mongoose from 'mongoose';
import refreshDatabase from '../lib/refresh-database';
import {NextApiRequest, NextApiResponse} from 'next';

let db: typeof mongoose;

export default async (_request: NextApiRequest, _response: NextApiResponse, next: () => void) => {
	if (!db) {
		db = await mongoose.connect(process.env.MONGO_URL!, {
			useNewUrlParser: true
		});
	}

	await refreshDatabase();

	next();
};
