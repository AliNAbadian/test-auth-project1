import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request
    const { user } = context.switchToHttp().getRequest();

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user has roles array
    if (!user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('User roles not found');
    }

    // Check if user is active
    if (user.isActive === false) {
      throw new ForbiddenException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    // Check if user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some((requiredRole) =>
      user.roles.includes(requiredRole),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required role(s): ${requiredRoles.join(', ')}. Your role(s): ${user.roles.join(', ')}`,
      );
    }

    return true;
  }
}
