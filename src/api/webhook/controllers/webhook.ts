import fs from 'fs'
import path from 'path'
import util from 'util'

type PrintifyWebhookPayload = {
  id: string
  type: string
  created_at: string
  resource: {
    id: string
    type: string
    data: {
      shop_id: number
      publish_details: {
        title: boolean
        variants: boolean
        description: boolean
        tags: boolean
        images: boolean
        key_features: boolean
        shipping_template: boolean
        shipping_methods: number[]
      }
      action: string
      out_of_stock_publishing: number
      external_sku_mapping: []
    }
  }
}

type ProductData = {
  productId: string
  title: string
  description?: string
  basePrice: number
  variants: string[]
  images: {
    src: string
    variantIds: number[]
    is_default: boolean
  }[]
}

export default {
  async webhook(ctx) {
    // console.log(
    //   'Webhook received:',
    //   util.inspect(ctx.request.body, false, null, true)
    // )
    // console.log({ details: ctx.request.body?.resource?.data?.publish_details })

    // Get the directory of the current module
    // const currentModulePath = path.resolve(__dirname)
    // const logDir = path.join(currentModulePath, '..', '..', '..', '..', 'logs')
    // console.log({ currentModulePath, logDir })

    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true })
    // }

    // const timestamp = new Date().toISOString().replace(/:/g, '-')
    // const logFilePath = path.join(logDir, `webhook_log_${timestamp}.json`)

    // const logData = {
    //   body: ctx.request.body,
    //   details: ctx.request.body?.data?.publish_details ?? {},
    // title}

    // fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2), 'utf8')

    try {
      const payload = ctx.request.body as PrintifyWebhookPayload

      // Validate webhook payload
      if (!payload || !payload.resource.data.action) {
        ctx.throw(400, 'Invalid webhook payload')
      }

      // TODO: Validate webhook signature
      // const printifySignature = ctx.request.headers['x-printify-signature']
      // if (!printifySignature) {
      //   ctx.throw(401, 'Unauthorized webhook')
      // }

      switch (payload.resource.data.action) {
        case 'created':
          await addProduct({
            shopId: payload.resource.data.shop_id,
            productId: payload.resource.id,
          })

          ctx.send({ message: 'Product created successfully' }, 200)
          break

        // Create product in Strapi database
        //   const newProduct = await strapi.entityService.create(
        //     'api::product.product',
        //     {
        //       data: productData,
        //     }
        //   )

        //   ctx.send(
        //     {
        //       message: 'Product created successfully',
        //       productId: newProduct.id,
        //     },
        //     200
        //   )
        //   break

        // case 'product.updated':
        // Handle product updates
        // const updatedProduct = await strapi.entityService.update(
        //   'api::product.product',
        //   payload.data.id,
        //   {
        //     data: {
        //       name: payload.data.title,
        //       description: payload.data.description,
        //       basePrice: payload.data.variants?.[0]?.price,
        //       sku: payload.data.variants?.[0]?.sku,
        //     },
        //   }
        // )
        // ctx.send(
        //   {
        //     message: 'Product updated successfully',
        //     productId: updatedProduct.id,
        //   },
        //   200
        // )
        // break

        default:
          strapi.log.info(
            `Unhandled webhook event: ${payload.resource.data.action}`
          )
          ctx.send({ message: 'Webhook received but not processed' }, 202)
      }
    } catch (error) {
      strapi.log.error('Webhook processing error:', error)

      // Handle different types of errors
      if (error instanceof Error) {
        ctx.throw(500, `Webhook processing failed: ${error.message}`)
      } else {
        ctx.throw(500, 'Unexpected error processing webhook')
      }
    }
  },
}

async function addProduct({
  shopId,
  productId,
}: {
  shopId: number
  productId: string
}) {
  const res = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
      },
    }
  )
  const data = (await res.json()) as Product

  const variants = []

  const skus = data.variants
    .filter(v => v.is_enabled)
    .map(
      ({
        is_printify_express_eligible,
        id,
        grams,
        options,
        sku,
        ...variant
      }) => {
        const variantId = id.toString()
        variants.push({ variantId, options })
        return {
          variantId,
          skuId: sku,
          weight: grams,
          ...variant,
        }
      }
    )
  const optionsInDb = await strapi
    .service('api::product-option.product-option')
    .addProductOptions(data.options)

  const variantsInDb = await strapi
    .service('api::product-variant.product-variant')
    .addProductVariants(variants, optionsInDb)

  const skusInDb = await strapi
    .service('api::sku.sku')
    .addProductSkus(skus, variantsInDb)

  await strapi.documents('api::product.product').create({
    data: {
      productId: data.id,
      title: data.title,
      description: data.description,
      basePrice: Math.min(...skus.map(sku => sku.price)),
      skus: {
        connect: skusInDb,
      },

      images: data.images.map(image => ({
        src: image.src,
        variantIds: image.variant_ids,
        isDefault: image.is_default,
      })),
    },
    fields: 'documentId',
  })
}

type ProductResponse = {
  current_page: number
  data: Product
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type Product = {
  id: string
  title: string
  description: string
  tags: string[]
  options: ProductOption[]
  variants: VariantPrintify[]
  images: ProductImage[]
}

export type ProductOption = {
  name: string
  type: string
  values: OptionValue[]
  display_in_preview: boolean
}

type OptionValue = {
  id: number
  title: string
  colors?: string[]
}

export type Variant = {
  variantId: string
  options: number[]
}

type VariantPrintify = {
  id: number,
  sku: string
  cost: number
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  is_printify_express_eligible: boolean
  quantity: number
  options: number[]
}

export type Sku = {
  skuId: string
  variantId: string
  cost: number
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  is_printify_express_eligible: boolean
  quantity: number
}

type ProductImage = {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
  is_selected_for_publishing: boolean
  order: number | null
}

type PaginationLink = {
  url: string | null
  label: string
  active: boolean
}
