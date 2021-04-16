import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/class/User';

// export class AuthSchema implements RestFulApi {
//   @ApiProperty({
//     description: 'Response data.',
//     example: {
//       info: {},
//       token: 'token...',
//     },
//   })
//   data: {
//     info: User,
//     token: string;
//   };

//   @ApiProperty({
//     description: 'Http response status',
//     example: HttpStatus.OK,
//   })
//   status: HttpStatus;

//   @ApiProperty({
//     description: 'Response message.',
//     example: 'success',
//   })
//   message: string;

//   @ApiProperty({
//     description: 'Request is successful or not. 0: error, 1: success.',
//     example: 1,
//   })
//   success: SuccessStatus;
// }
