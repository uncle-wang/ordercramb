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
			const url = 'http://www.myuncle.cn/' + node.find('a').attr('href');
			links.push({thumbnail, url});
		});
		resolve(links);
	});
};

const getProduct = (data) => {

	return new Promise((resolve, reject) => {

			if (data.indexOf('alert("抱歉!! 此商品为限制购买分类') > -1) {
				reject({code: 2001});
			}
			else {
				const $ = cheerio.load(data);

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
				const itemdesc = $('#d1_iframe').attr('src');

				if (!itemname) {
					reject({code: 2002});
					return;
				}
				if (!itemcode) {
					reject({code: 2003});
					return;
				}
				if (!itemdesc) {
					reject({code: 2004});
					return;
				}
				if (!itemprice) {
					reject({code: 2005});
					return;
				}
				if (previews.length <= 0) {
					reject({code: 2006});
					return;
				}

				resolve({itemname, itemcode, itemdesc, itemprice, previews});
			}
			

	});
};

module.exports = {getLinks, getProduct};
