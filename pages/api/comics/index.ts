import {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';
import middleware from '../../../middlewares';
import {Comic} from '../../../lib/database';

export default nextConnect()
	.use(middleware)
	.get(async (request: NextApiRequest, response: NextApiResponse) => {
		let filter = {};

		if (request.query.since) {
			filter = {
				id: {
					$gt: parseInt(request.query.since as string, 10)
				}
			};
		}

		response.status(200).json(await Comic.find(filter).sort([['id', -1]]));
	});
