/**
 * product-option service
 */

import { factories } from '@strapi/strapi'
import { OptionType, ProductOption } from '../../webhook/controllers/webhook'

export default factories.createCoreService(
  'api::product-option-value.product-option-value',
  ({ strapi }) => ({
    async addProductOptions(productOptions: ProductOption[], optionTypes: (OptionType & { documentId: string })[]) {

      const optionTypesMap = new Map()
      optionTypes.forEach(t => optionTypesMap.set(t.type, t.documentId))

      const formattedOptions = productOptions.flatMap(option =>
        option.values.map(value => option.type === 'color' ? {
          optionId: value.id.toString(),
          type: option.type,
          title: value.title,
          color: value?.colors[0],
          previewUrl: value?.previewUrl
        } : {
          optionId: value.id.toString(),
          type: option.type,
          title: value.title,
        })
      )
      const optionIds = formattedOptions.map(option => option.optionId)

      try {
        const existingOptions = await strapi
          .documents('api::product-option-value.product-option-value')
          .findMany({
            filters: {
              optionId: {
                $in: optionIds,
              },
            },
            fields: 'optionId',
          })

        if (existingOptions.length === 0) {
          const createdOptions = await Promise.all(
            formattedOptions.map(({ type, ...option }) =>
              strapi.documents('api::product-option-value.product-option-value').create({
                data: {
                  ...option,
                  optionTypes: {
                    connect: optionTypesMap.get(type)
                  },
                },
                fields: 'optionId',
              })
            )
          )
          return createdOptions
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
              strapi.documents('api::product-option-value.product-option-value').create({
                data: {
                  ...option,
                  optionType: {
                    connect: optionTypesMap.get(option.type)
                  },
                },
                fields: 'optionId',
              })
            )
          )

          return [...existingOptions, ...createdOptions]
        }

        return existingOptions

      }
      catch (error) {
        console.log(error.details.errors)
      }


    },
  })
)
