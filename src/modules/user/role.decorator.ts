import { SetMetadata } from '@nestjs/common';
import { UserAuthEnum } from '.';

export const Role = (roleType: UserAuthEnum) => SetMetadata('role', roleType);
