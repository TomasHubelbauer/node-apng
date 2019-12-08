const apng = require('../');
const fs = require('fs-extra');

void async function () {
  // `large` comes from `cmd/generate-screenshots`
  const scenario = 'large';
  const frame1 = await fs.readFile(scenario + '/frame1.png');
  const frame2 = await fs.readFile(scenario + '/frame2.png');
  const frame3 = await fs.readFile(scenario + '/frame3.png');
  const animated = apng([frame1, frame2, frame3], index => ({ numerator: 1, denominator: 10 }));
  await fs.writeFile(scenario + '/apng.png', animated);
}()
