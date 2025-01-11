/**
 * product-option-type service
 */

import { factories } from '@strapi/strapi';
import { ProductOption } from '../../webhook/controllers/webhook';

export default factories.createCoreService('api::product-option-type.product-option-type', ({ strapi }) => ({
	async getOptionTypes(options: ProductOption[]) {

		const optionTypesInDb = await strapi.documents('api::product-option-type.product-option-type').findMany({})

		const optionTypesNotInDb = options.filter(o => !optionTypesInDb.some(type => type.type === o.type))

		if (optionTypesNotInDb.length === 0) {
			return optionTypesInDb
		}
		return await Promise.all(
			optionTypesNotInDb.map(option => strapi.documents('api::product-option-type.product-option-type').create({
				data: {
					type: option.type,
					name: option.name
				}
			}))
		)
	}
}));
