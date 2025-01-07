/**
 * product-variant service
 */

import { factories } from '@strapi/strapi'
import { Variant } from '../../webhook/controllers/webhook'

export default factories.createCoreService(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async addProductVariants(
      variants: Variant[],
      options: { id: number; documentId: string; optionId: string }[]
    ) {
      const optionsMap = new Map()

      for (const option of options) {
        optionsMap.set(option.optionId, option.documentId)
      }


      const variantIds = variants.map(variant => variant.variantId)

      const existingVariants = await strapi
        .documents('api::product-variant.product-variant')
        .findMany({
          filters: {
            variantId: {
              $in: variantIds,
            },
          },
          fields: 'variantId',
        })

      if (existingVariants.length === 0) {
        const addedVariants = await Promise.all(
          createProductVariantsDb(variants, optionsMap)
        )
        return addedVariants
      }

      const existingVariantIds = new Set(
        existingVariants.map(variant => variant.variantId)
      )

      const newVariants = variants.filter(
        variant => !existingVariantIds.has(variant.variantId)
      )

      if (newVariants.length > 0) {
        const addedVariants = await Promise.all(
          createProductVariantsDb(newVariants, optionsMap)
        )
        return [...existingVariants, ...addedVariants]
      }

      return existingVariants
    },
  })
)

function createProductVariantsDb(
  variants: { variantId: string, options: number[] }[],
  optionsMap: Map<string, string>
) {
  return variants.map(({ variantId, options }) =>
    strapi.documents('api::product-variant.product-variant').create({
      data: {
        variantId,
        options: {
          connect: options.map(o => optionsMap.get(String(o))),
        },
      },
      fields: 'variantId',
    })
  )
}
