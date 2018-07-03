const storage = (thumbnail, productInfo) => {

	return new Promise((resolve, reject) => {

		if (thumbnail) {
			console.log(productInfo);
			resolve();
		}
		else {
			reject('null thumbnail');
		}
	});
};

module.exports = {storage};
