import type { components, paths } from './schema';

export type MerchantListItem = components['schemas']['MerchantListItem'];

export type PaginationMeta = components['schemas']['PaginationMeta'];

export type MerchantDetail = components['schemas']['MerchantDetail'];

export type MerchantsQuery =
  paths['/api/v1/merchants']['get']['parameters']['query'];

export type MerchantsResponse =
  paths['/api/v1/merchants']['get']['responses']['200']['content']['application/json'];

export type MerchantsError =
  paths['/api/v1/merchants']['get']['responses']['422']['content']['application/json'];

export type MerchantPath =
  paths['/api/v1/merchants/{merchant_id}']['get']['parameters']['path'];

export type MerchantQuery =
  paths['/api/v1/merchants/{merchant_id}']['get']['parameters']['query'];

export type MerchantResponse =
  paths['/api/v1/merchants/{merchant_id}']['get']['responses']['200']['content']['application/json'];

export type MerchantError =
  paths['/api/v1/merchants/{merchant_id}']['get']['responses']['422']['content']['application/json'];

export type MerchantPhotoPath =
  paths['/api/v1/merchants/{merchant_id}/photos']['get']['parameters']['path'];

export type MerchantPhotosResponse =
  paths['/api/v1/merchants/{merchant_id}/photos']['get']['responses']['200']['content']['application/json'];

export type MerchantPhotosError =
  paths['/api/v1/merchants/{merchant_id}/photos']['get']['responses']['422']['content']['application/json'];

export type MerchantReviewsPath =
  paths['/api/v1/merchants/{merchant_id}/reviews']['get']['parameters']['path'];

export type MerchantReviewsResponse =
  paths['/api/v1/merchants/{merchant_id}/reviews']['get']['responses']['200']['content']['application/json'];

export type MerchantReviewsError =
  paths['/api/v1/merchants/{merchant_id}/reviews']['get']['responses']['422']['content']['application/json'];

export type MerchantTypesPath =
  paths['/api/v1/merchants/{merchant_id}/types']['get']['parameters']['path'];

export type MerchantTypesResponse =
  paths['/api/v1/merchants/{merchant_id}/types']['get']['responses']['200']['content']['application/json'];

export type MerchantTypesError =
  paths['/api/v1/merchants/{merchant_id}/types']['get']['responses']['422']['content']['application/json'];

export type MerchantOpeningHoursPath =
  paths['/api/v1/merchants/{merchant_id}/opening-hours']['get']['parameters']['path'];

export type MerchantOpeningHoursResponse =
  paths['/api/v1/merchants/{merchant_id}/opening-hours']['get']['responses']['200']['content']['application/json'];

export type MerchantOpeningHoursError =
  paths['/api/v1/merchants/{merchant_id}/opening-hours']['get']['responses']['422']['content']['application/json'];

export type MerchantAmenitiesPath =
  paths['/api/v1/merchants/{merchant_id}/amenities']['get']['parameters']['path'];

export type MerchantAmenitiesResponse =
  paths['/api/v1/merchants/{merchant_id}/amenities']['get']['responses']['200']['content']['application/json'];

export type MerchantAmenitiesError =
  paths['/api/v1/merchants/{merchant_id}/amenities']['get']['responses']['422']['content']['application/json'];
