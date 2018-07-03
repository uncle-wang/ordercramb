// url爬取
const cramb = require('./cramb');

cramb(1, 2)
.then(() => {console.log('complete')})
.catch(err => {console.error(err)});
