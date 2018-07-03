const cheerio = require('cheerio');

const getLinks = function(data) {

	const $ = cheerio.load(data);
	const nodeList = $('.pd_name a');
	let links = [];
	nodeList.each(function() {
		const link = $(this).attr('href');
		links.push('http://www.myuncle.cn/' + link);
	});
	return links;
};

const getProduct = function(data) {

	return new Promise((resolve, reject) => {
		const $ = cheerio.load(data);
		const pdName = $('.pd_name').text();
		if (pdName) {
			resolve({pdName});
		}
		else {
			reject('continue');
		}
	});
};

module.exports = {getLinks, getProduct};
