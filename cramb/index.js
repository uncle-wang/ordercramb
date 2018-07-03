const request = require('request');
const query = require('./../query');
const siteUrl = 'http://www.myuncle.cn/category.php?api=jp_yahoo&keywords=&categoryid=23960&parent=1223&id=1818';

// 爬取指定的url
const crambUrl = url => {

	return new Promise((resolve, reject) => {

		request({url, timeout: 80000}, (err, response, data) => {

			if (err) {
				// 超时跳过
				if (err.code === 'ESOCKETTIMEDOUT') {
					reject('continue');
				}
				else {
					reject(err);
				}
			}
			else {
				resolve(data);
			}
		});
	});
};

// 爬取商品详细信息
const crambProduct = url => {

	return new Promise((resolve, reject) => {
		crambUrl(url).then(query.getProduct).then(productInfo => {
			if (productInfo.pdName) {
				console.log(productInfo.pdName);
			}
			else {
				console.log('name null ' + url);
			}
			resolve(productInfo);
		}).catch(err => {
			// 超时跳过
			if (err.code === 'ESOCKETTIMEDOUT') {
				console.log('product timeout ' + urlList[i]);
				i ++;
				crambProductsUrl();
			}
			else {
				reject(err);
			}
		});
	});
};

// 爬取一组商品详情页url(提取商品详细信息)
const crambProducts = urlList => {

	return new Promise((resolve, reject) => {

		let i = 0;

		const crambProductsUrl = callback => {

			if (i < urlList.length) {
				crambUrl(urlList[i]).then(query.getProduct).then(productInfo => {
					if (productInfo.pdName) {
						console.log(productInfo.pdName);
					}
					else {
						console.log('name null ' + urlList[i]);
					}
					i ++;
					crambProductsUrl();
				}).catch(err => {
					// 超时跳过
					if (err.code === 'ESOCKETTIMEDOUT') {
						console.log('product timeout ' + urlList[i]);
						i ++;
						crambProductsUrl();
					}
					else {
						reject(err);
					}
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
				crambUrl(url).then(query.getLinks).then(crambProducts).then(products => {
					console.log('page ' + page + ' ok');
					page ++;
					crambPagesUrl();
				}).catch(err => {
					if (err.code === 'ESOCKETTIMEDOUT') {
						console.log('page timeout ' + url);
						page ++;
						crambPagesUrl();
					}
					else {
						reject(err)
					}
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
