export const RETAILER_CSV_COLUMNS = [
  "type",
  "product_internal_id",
  "product_sku",
  "product_name",
  "product_price",
  "product_compare_to_price",
  "product_is_inventory_tracked",
  "product_quantity",
  "product_quantity_out_of_stock_behaviour",
  "product_low_stock_notification_quantity",
  "product_quantity_minimum_allowed_for_purchase",
  "product_quantity_maximum_allowed_for_purchase",
  "product_is_available",
  "product_media_main_image_url",
  "product_media_main_image_alt",
  "product_media_gallery_image_url_1",
  "product_media_gallery_image_alt_1",
  "product_media_gallery_image_url_2",
  "product_media_gallery_image_alt_2",
  "product_media_gallery_image_url_3",
  "product_media_gallery_image_alt_3",
  "product_media_gallery_image_url_4",
  "product_media_gallery_image_alt_4",
  "product_media_gallery_image_url_5",
  "product_media_gallery_image_alt_5",
  "product_media_gallery_image_url_6",
  "product_media_gallery_image_alt_6",
  "product_media_gallery_image_url_7",
  "product_media_gallery_image_alt_7",
  "product_media_gallery_image_url_8",
  "product_media_gallery_image_alt_8",
  "product_media_gallery_image_url_9",
  "product_media_gallery_image_alt_9",
  "product_media_gallery_image_url_10",
  "product_media_gallery_image_alt_10",
  "product_media_gallery_image_url_11",
  "product_media_gallery_image_alt_11",
  "product_media_gallery_image_url_12",
  "product_media_gallery_image_alt_12",
  "product_media_gallery_image_url_13",
  "product_media_gallery_image_alt_13",
  "product_media_gallery_image_url_14",
  "product_media_gallery_image_alt_14",
  "product_media_gallery_image_url_15",
  "product_media_gallery_image_alt_15",
  "product_media_gallery_image_url_16",
  "product_media_gallery_image_alt_16",
  "product_media_gallery_image_url_17",
  "product_media_gallery_image_alt_17",
  "product_description",
  "product_category_1",
  "product_category_2",
  "product_category_3",
  "product_is_featured",
  "product_is_featured_order_by",
  "product_brand",
  "product_upc",
  "product_weight",
  "product_is_shipping_required",
  "product_length",
  "product_width",
  "product_height",
  "product_shipping_preparation_time_for_shipping_in_days",
  "product_shipping_preparation_time_for_pickup_in_minutes",
  "product_shipping_preparation_time_for_local_delivery_in_minutes",
  "product_shipping_preparation_time_for_preorders_in_days",
  "product_shipping_show_delivery_date_on_the_product_page",
  "product_shipping_type",
  "product_shipping_fixed_rate",
  "product_shipping_method_markup",
  "product_shipping_white_list",
  "product_shipping_black_list",
  "product_tax_class_code",
  "product_battery_included",
  "product_seo_title",
  "product_seo_description",
  "product_related_item_ids",
  "product_related_item_skus",
  "product_related_items_random",
  "product_related_items_random_category",
  "product_related_items_random_number_of_items",
  "product_custom_price_enabled",
  "product_subscription_enabled",
  "product_subscription_one_time_purchase_enabled",
  "product_subscription_one_time_purchase_price",
  "product_subscription_price_with_signup_fee",
  "product_subscription_recurring_interval",
  "product_subscription_recurring_interval_count",
  "product_google_product_category_code",
  "product_option_name",
  "product_option_type",
  "product_option_is_required",
  "product_option_value",
  "product_option_markup",
  "product_option_is_default_option_selection",
  "product_option_swatch_hex_value",
  "product_option_swatch_image",
  "product_option_swatch_selector_is_image",
  "category_internal_id",
  "category_path",
  "category_is_available",
  "category_description",
  "category_seo_title",
  "category_seo_description",
  "category_image",
  "category_image_alt",
  "category_order_by",
  "source_store_id",
  "url",
] as const;

export type RetailerCsvColumn = (typeof RETAILER_CSV_COLUMNS)[number];
export type IRetailerCsvData = Record<RetailerCsvColumn, string>;

export function mapRetailerCsvData(productData: Record<string, unknown>): IRetailerCsvData {
  return Object.fromEntries(
    RETAILER_CSV_COLUMNS.map((column) => [
      column,
      productData[column] != null ? String(productData[column]) : "",
    ])
  ) as IRetailerCsvData;
}

export type RetailerCsvExportProduct = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  compareAtPrice?: number | null;
  stockCount: number;
  categorySlug?: string;
  subcategorySlug?: string;
  images?: string[];
  description?: string;
  shortDescription?: string;
  tags?: string[];
  isFeatured?: boolean;
  retailerCsvData?: Partial<IRetailerCsvData>;
};

export function buildRetailerCsvExportRow(product: RetailerCsvExportProduct): IRetailerCsvData {
  if (product.retailerCsvData && Object.keys(product.retailerCsvData).length > 0) {
    return Object.fromEntries(
      RETAILER_CSV_COLUMNS.map((column) => [
        column,
        product.retailerCsvData?.[column] ?? "",
      ])
    ) as IRetailerCsvData;
  }

  const row = Object.fromEntries(
    RETAILER_CSV_COLUMNS.map((column) => [column, ""])
  ) as IRetailerCsvData;

  row.type = "product";
  row.product_internal_id = product.id;
  row.product_sku = product.sku;
  row.product_name = product.name;
  row.product_price = String(product.price);
  row.product_compare_to_price =
    product.compareAtPrice != null ? String(product.compareAtPrice) : "";
  row.product_quantity = String(product.stockCount);
  row.product_brand = product.brand;
  row.product_description = product.description || product.shortDescription || product.name;
  row.product_category_1 = product.tags?.[0] || product.categorySlug || "";
  row.product_category_2 = product.subcategorySlug || "";
  row.product_is_featured = product.isFeatured ? "TRUE" : "FALSE";
  row.product_media_main_image_url = product.images?.[0] || "";

  return row;
}
