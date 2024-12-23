/**
 * product-option service
 */

import { Data, factories } from '@strapi/strapi'
import { ProductOption } from '../../webhook/controllers/webhook'

export default factories.createCoreService(
  'api::product-option.product-option',
  ({ strapi }) => ({
    async addProductOptions(productOptions: ProductOption[]) {
      const formattedOptions = productOptions.flatMap(option =>
        option.values.map(value => ({
          optionId: value.id.toString(),
          name: option.name,
          type: option.type,
          title: value.title,
        }))
      )
      const optionIds = formattedOptions.map(option => option.optionId)

      const existingOptions = await strapi
        .documents('api::product-option.product-option')
        .findMany({
          filters: {
            optionId: {
              $in: optionIds,
            },
          },
          fields: 'optionId',
        })

      if (existingOptions.length === 0) {
        await Promise.all(
          formattedOptions.map(option =>
            strapi.documents('api::product-option.product-option').create({
              data: option,
              fields: 'optionId',
            })
          )
        )
        return
      }

      const existingOptionIds = new Set(
        existingOptions.map(opt => opt.optionId)
      )

      const newOptions = formattedOptions.filter(
        option => !existingOptionIds.has(option.optionId)
      )

      if (newOptions.length > 0) {
        const createdOptions = await Promise.all(
          newOptions.map(option =>
            strapi.documents('api::product-option.product-option').create({
              data: option,
              fields: 'optionId',
            })
          )
        )

        // return [...existingOptions, ...createdOptions]
      }

      // return existingOptions
    },
  })
)
