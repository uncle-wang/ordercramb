// mysql
const mysql = require('mysql');
// config
const options = require('./../config.json').MYSQL;
// 连接池
const pool = mysql.createPool(options);

const insert = (thumbnail, productInfo) => {

	return new Promise((resolve, reject) => {

		const {itemcode, itemname, itemprice, itemdesc} = productInfo;
		const previews = productInfo.previews.join(',');
		const sql = 'insert into items set ?';
		const item = {
			code: itemcode,
			name: itemname,
			price: itemprice,
			desc: itemdesc,
			create_time: Date.now(),
			previews,
			thumbnail,
		};
		pool.query(sql, item, (err, result) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					reject({code: 3001, msg: err.message});
				}
				else {
					reject(err);
				}
			}
			else {
				resolve(itemcode);
			}
		})
	});
};

const storage = (thumbnail, productInfo) => {

	if (thumbnail) {
		return insert(thumbnail, productInfo);
	}
	else {
		return Promise.reject({code: 3002});
	}
};

module.exports = {storage};
