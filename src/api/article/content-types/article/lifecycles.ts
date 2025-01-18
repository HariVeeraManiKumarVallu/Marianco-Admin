import { errors } from '@strapi/utils'
export default {
	async beforeCreate(event) {
		try {
			const { data } = event.params;
			console.log(data)

			if (data.featuredGridPosition) {
				const existingItem = await strapi.db.query('api::article.article').findOne({
					where: { featuredGridPosition: data.featuredGridPosition }
				});

				if (existingItem) {
					throw new errors.ApplicationError(
						`${data.featuredGridPosition} position is already being used by "${existingItem.title}"`,
						{ name: 'validation' })
				}
			}
		} catch (error) {
			console.error('Error in afterCreate:', error)
		}
	},
	beforeUpdate: async (event) => {
		const { data, where } = event.params;

		if (data.featuredGridPosition) {
			const existingItem = await strapi.db.query('api::article.article').findOne({
				where: {
					featuredGridPosition: data.featuredGridPosition,
					id: { $ne: where.id }
				}
			});

			if (existingItem) {
				throw new errors.ApplicationError(
					`${data.featuredGridPosition} position is already being used by "${existingItem.title}"`,
					{ name: 'validation', displayTime: 5000 },

				);
			}
		}
	}
}

async function gridPositionValidation(position: 'left' | 'top-right' | 'bottom-right') {
	try {
		const existingItem = await strapi.db.query('api::article.article').findOne({
			where: { featuredGridPosition: position }
		});

		if (existingItem) {
			throw new errors.ApplicationError(
				`${position} position is already being used by "${existingItem.title}"`,
				{ name: 'validation' })
		}
	} catch (error) {
		console.error('Error in afterCreate:', error)
	}
}
