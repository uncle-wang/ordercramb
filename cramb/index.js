const request = require('request');
const query = require('./../query');
const sql = require('./../sql');
const siteUrl = 'http://www.myuncle.cn/category.php?api=jp_yahoo&keywords=&categoryid=23960&parent=1223&id=1818';

// 爬取指定的url
const crambUrl = url => {

	return new Promise((resolve, reject) => {

		request({url, timeout: 10000}, (err, response, data) => {

			if (err) {
				reject(err);
			}
			else {
				if (data) {
					resolve(data);
				}
				else {
					reject('[CRAMBURL]: null data');
				}
			}
		});
	});
};

// 爬取一组商品详情页url(提取商品详细信息)
const crambProducts = links => {

	return new Promise((resolve, reject) => {

		let i = 0;

		const crambProductsUrl = () => {

			if (i < links.length) {
				const link = links[i];
				Promise.all([
					crambUrl(link.infourl),
					crambUrl(link.descurl)
				]).then(query.getProduct).then(productInfo => {
					sql.storage(link.thumbnail, productInfo);
				}).catch(err => {
					console.log(err);
					console.log(link);
				}).then(() => {
					i ++;
					crambProductsUrl();
				}).catch(err => {
					reject(err);
				});
			}
			else {
				resolve();
			}
		};

		crambProductsUrl();
	});
};

// 爬取一组商品列表页url(提取商品详情页url)
const crambPages = (startPage, endPage) => {

	return new Promise((resolve, reject) => {

		let page = startPage;

		const crambPagesUrl = () => {

			if (page <= endPage) {
				const url = siteUrl + '&pageID=' + page;
				crambUrl(url).then(query.getLinks).then(crambProducts).catch(err => {
					console.log('[CRAMBPRODUCTS ERROR] PAGE:' + page);
					console.log(err);
				}).then(() => {
					console.log('page ' + page + ' ok');
					page ++;
					crambPagesUrl();
				});
			}
			else {
				resolve();
			}
		};

		crambPagesUrl();
	});
};

module.exports = function(startPage, endPage) {

	return crambPages(startPage, endPage);
};
