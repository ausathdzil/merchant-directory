import type { paths } from './schema';

export type CreateFeedbackBody =
  paths['/api/v1/feedbacks']['post']['requestBody']['content']['application/json'];

export type CreateFeedbackResponse =
  paths['/api/v1/feedbacks']['post']['responses']['201']['content']['application/json'];

export type CreateFeedbackError =
  paths['/api/v1/feedbacks']['post']['responses']['422']['content']['application/json'];
