import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const Available = (...type: Role[]) => SetMetadata('roles', type);
