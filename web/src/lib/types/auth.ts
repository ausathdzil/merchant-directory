import type { components, paths } from '../schema';

export type Token = components['schemas']['Token'];

export type LoginBody =
  paths['/api/v1/auth/login']['post']['requestBody']['content']['application/x-www-form-urlencoded'];

export type LoginResponse =
  paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json'];

export type LoginError =
  paths['/api/v1/auth/login']['post']['responses']['422']['content']['application/json'];

export type RegisterBody =
  paths['/api/v1/auth/register']['post']['requestBody']['content']['application/json'];

export type RegisterResponse =
  paths['/api/v1/auth/register']['post']['responses']['200']['content']['application/json'];

export type RegisterError =
  paths['/api/v1/auth/register']['post']['responses']['422']['content']['application/json'];

export type LogoutResponse =
  paths['/api/v1/auth/logout']['post']['responses']['200']['content']['application/json'];

export type RefreshResponse =
  paths['/api/v1/auth/refresh']['post']['responses']['200']['content']['application/json'];
