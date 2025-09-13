import arcjet, { shield, tokenBucket, detectBot } from '@arcjet/node';
import { ARCJET_KEY } from './env.js';

const aj = arcjet({
	key: ARCJET_KEY,
	characteristics: ['ip.src'],
	rules: [
		shield({ mode: 'LIVE' }),
		tokenBucket({
			mode: 'LIVE',
			refillRate: 5,
			interval: 10,
			capacity: 10,
		}),
		detectBot({
			mode: 'LIVE',
			allow: ['CATEGORY:SEARCH_ENGINE'],
		}),
	],
});

export default aj;
