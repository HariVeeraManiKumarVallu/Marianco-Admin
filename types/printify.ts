export type PrintifyRequest = {
	headers: {
		'x-pfy-signature'?: string;
	};
	body: PrintifyWebhookRequestPayload;
}
export type PrintifyWebhookRequestPayload = {
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

export type ProductResponse = {
	current_page: number
	data: PrintifyProduct
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

export type PrintifyProduct = {
	id: string
	title: string
	description: string
	tags: string[]
	options: PrintifyOption[]
	variants: VariantPrintify[]
	images: ProductImage[]
}

export type PrintifyOption = {
	name: string,
	type: string
	values: {
		id: number
		title: string
		previewUrl?: string
		colors?: string[]
	}[]
}

export type OptionType = {
	name: string,
	type: string
}

export type OptionValue = {
	optionId: number
	title: string
	previewUrl?: string
	colors?: string[]
}

export type Variant = {
	variantId: number
	title: string
	cost: number
	price: number
	grams: number
	is_enabled: boolean
	is_default: boolean
	is_available: boolean
	is_printify_express_eligible: boolean
	quantity: number
	options: number[]
}

export type VariantPrintify = {
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
}

export type ProductImage = {
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
