const cheerio = require('cheerio');

const getLinks = data => {

	return new Promise((resolve, reject) => {

		const $ = cheerio.load(data);
		const nodeList = $('.pdItems .pdBox.pdBid li');
		let links = [];
		nodeList.each(function() {
			const node = $(this).find('.pd_photo');
			// 商品缩略图
			const thumbnail = node.find('img').attr('src');
			// 商品信息页地址
			const infourl = 'http://www.myuncle.cn/' + node.find('a').attr('href');
			// 商品描述页地址
			const descurl = infourl.replace('product_view', 'product_description');
			links.push({thumbnail, infourl, descurl});
		});
		resolve(links);
	});
};

const getProduct = (data) => {

	return new Promise((resolve, reject) => {

		const [infoData, descData] = data;
		
		const $ = cheerio.load(infoData);

		// 商品预览图片
		let previews = [];
		const imgs = $('.photoBox .items li img');
		imgs.each(function() {
			const url = $(this).attr('src');
			previews.push(url);
		});

		// 商品名称
		const itemname = $('.pd_name').text();
		// 商品编号
		const itemcode = $('#itemscode').attr('value');
		// 商品价格(日元)
		const itemprice = parseInt($('#itemprice').attr('value'));
		// 商品图文描述
		const itemdesc = cheerio.load(descData)('.goog-trans-section').html();

		if (!itemname) {
			reject('[GETPRODUCT] itemname null');
			return;
		}
		if (!itemcode) {
			reject('[GETPRODUCT] itemcode null');
			return;
		}
		if (!itemdesc) {
			reject('[GETPRODUCT] itemdesc null');
			return;
		}
		if (!itemprice) {
			reject('[GETPRODUCT] itemprice null');
			return;
		}
		if (previews.length <= 0) {
			reject('[GETPRODUCT] previews null');
			return;
		}

		resolve({itemname, itemcode, itemdesc, itemprice, previews});
	});
};

module.exports = {getLinks, getProduct};
