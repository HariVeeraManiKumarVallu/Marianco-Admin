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
        case 'create':
          await addProduct({
            shopId: payload.resource.data.shop_id,
            productId: payload.resource.id,
          })

          ctx.send({ message: 'Product created successfully' }, 200)
          break

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



