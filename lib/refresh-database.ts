import got from 'got';
import {imageSize} from 'image-size';
import {Settings, Comic} from './database';

const REFRESH_INTERVAL = 5 * 60; // Seconds, every 5 minutes

interface XKCDResponse {
	month: string;
	num: number;
	link: string;
	year: string;
	news: string;
	safe_title: string;
	transcript: string;
	alt: string;
	img: string;
	title: string;
	day: string;
}

export default async () => {
	let settings = await Settings.findOne();

	if (settings === null || new Date(settings.lastUpdated.getTime() + (REFRESH_INTERVAL * 1000)) < new Date()) {
		const lastComic = await Comic.findOne({}, ['id'], {sort: {id: -1}});
		const lastId = lastComic ? lastComic.id : 1;

		const latestComic = await got('https://xkcd.com/info.0.json').json<XKCDResponse>();

		if (lastId !== latestComic.num) {
			for (let i = lastId + 1; i <= latestComic.num; i++) {
				if (i === 404) {
					continue;
				}

				const response = await got(`https://xkcd.com/${i}/info.0.json`).json<XKCDResponse>();

				if (response.img === 'https://imgs.xkcd.com/comics/') {
					continue;
				}

				const comic = new Comic({
					id: response.num,
					publishedAt: new Date(`${response.year}-${response.month}-${response.day}`),
					news: response.news,
					safeTitle: response.safe_title,
					title: response.title,
					transcript: response.transcript,
					alt: response.alt,
					urls: {
						source: `https://xkcd.com/${response.num}`,
						explain: `https://www.explainxkcd.com/wiki/index.php/${response.num}`
					}
				});

				const imageUrls = [response.img];

				if (response.num >= 1084) {
					const imageUrlSplit = response.img.split('.');
					imageUrls.push(`${imageUrlSplit.splice(0, imageUrlSplit.length - 1).join('.')}_2x.${imageUrlSplit[imageUrlSplit.length - 1]}`);
				}

				const imageDetails = await Promise.all(imageUrls.map(async imageUrl => {
					const {width = 200, height = 200} = imageSize(await got(response.img).buffer());
					const ratio = width / height;

					return {
						url: imageUrl,
						width,
						height,
						ratio
					};
				}));

				comic.imgs = {x1: imageDetails[0], x2: imageDetails.length === 2 ? imageDetails[1] : null};

				await comic.save();
			}
		}

		if (settings === null) {
			settings = new Settings({lastUpdated: new Date()});

			await settings.save();
		} else {
			await settings.updateOne({lastUpdated: new Date()});
		}
	}
};
