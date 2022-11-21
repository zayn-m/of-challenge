const validationErrors = (type, fields) => async (req, res, next) => {
	try {
		const body = req.body;
		let errors = {};

		switch (type) {
			case 'required':
				fields.forEach((field) => {
					if (!Object.keys(body).includes(field) || body[field] === '') {
						errors = {
							...errors,
							[field]: 'This field is required'
						};
					}
				});
				break;

			default:
				break;
		}

		if (Object.keys(errors).length) {
			return res.status(400).json({ success: false, errors });
		}

		next();
	} catch (err) {
		console.log(err);
	}
};

module.exports = validationErrors;