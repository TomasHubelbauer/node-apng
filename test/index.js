import apng from '../index.js';
import fs from 'fs';

// `large` comes from `cmd/generate-screenshots`
const scenario = 'large';
const frame1 = await fs.promises.readFile(scenario + '/frame1.png');
const frame2 = await fs.promises.readFile(scenario + '/frame2.png');
const frame3 = await fs.promises.readFile(scenario + '/frame3.png');
const animated = apng([frame1, frame2, frame3], index => ({ numerator: 1, denominator: 10 }));
await fs.promises.writeFile(scenario + '/apng.png', animated);
