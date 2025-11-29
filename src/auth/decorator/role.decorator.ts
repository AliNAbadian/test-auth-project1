import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from '../enum/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

/**
 * Basic roles decorator - sets required roles metadata
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Admin only decorator - combines JWT auth, roles guard, and Swagger docs
 * Use: @AdminOnly()
 */
export const AdminOnly = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.Admin),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin only' }),
  );

/**
 * User or Admin decorator - allows both roles
 * Use: @UserOrAdmin()
 */
export const UserOrAdmin = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.User, Role.Admin),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );

/**
 * Authenticated decorator - just requires valid JWT (any role)
 * Use: @Authenticated()
 */
export const Authenticated = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
