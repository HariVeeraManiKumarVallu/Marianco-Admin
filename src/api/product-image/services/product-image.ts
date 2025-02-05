/**
 * product-image service
 */

import { factories } from '@strapi/strapi';
import { ProductImage } from '../../webhook/controllers/webhook';

export default factories.createCoreService('api::product-image.product-image', ({ strapi }) => ({
	async addProductImages(images: ProductImage[], variants: { id: String, documentId: string, variantId: string }[]) {
		const variantsMap = new Map()
		for (const variant of variants) { variantsMap.set(variant.variantId, variant.documentId) }
		console.log(variantsMap)
		try {
			const addedImages = await Promise.all(images.map((image) => strapi.documents('api::product-image.product-image').create({
				data: {
					url: image.src,
					isDefault: image.is_default,
					variants: {
						connect: image.variant_ids.map(id => variantsMap.get(id))
					}
					,
				},
				fields: 'documentId',
			})))
			return
			// addedImages.map(s => s.documentId)
		} catch (error) {
			console.log(error)
		}
	},
})
)
