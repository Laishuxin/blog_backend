# Mental journey

## init

1. 构建目录结构
2. 设置配置文件啊

## 数据库

### 创建数据库

创建数据库通过`nest`提供`TypeOrm`实现。



### 模拟数据

```mysql
USE db_blog;

# - user
INSERT INTO t_user (
  `user_id`,
  `create_at`,
  `update_at`,
  `username`,
  `nickname`,
  `password`,
  `password_salt`,
  `auth`,
  `email`,
  `avatar`
) 
VALUES
  (
    UUID(),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin',
    'rushui',
    'admin',
    'abcdef',
    1,
    '123@163.com',
    'https://tse2-mm.cn.bing.net/th/id/OIP.CaABKOAUNogJ5qqEiCo22AAAAA?w=211&h=211&c=7&o=5&dpr=1.38&pid=1.7'
  ),
  (
    UUID(),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'user1',
    'user1_nickname',
    'user1',
    'abcdef',
    2,
    '123@163.com',
    'https://tse2-mm.cn.bing.net/th/id/OIP.CaABKOAUNogJ5qqEiCo22AAAAA?w=211&h=211&c=7&o=5&dpr=1.38&pid=1.7'
  ),
  (
    UUID(),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'user2',
    'user2_nickname',
    'user2',
    'abcdef',
    2,
    '123@163.com',
    'https://tse2-mm.cn.bing.net/th/id/OIP.CaABKOAUNogJ5qqEiCo22AAAAA?w=211&h=211&c=7&o=5&dpr=1.38&pid=1.7'
  ) ;
  
SELECT * FROM t_user;

# - category
# insert into db_blog.t_category (create_at, update_at, `name`) 
# values
#  (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'series'),
#  (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic') ;
  
# 如果不存在，则插入。存在，则更行
# 插入语句中需要有index
INSERT INTO t_category (update_at, `name`) 
VALUES
  (CURRENT_TIMESTAMP, 'series'),
  (CURRENT_TIMESTAMP, 'basic')
ON DUPLICATE KEY 
  UPDATE update_at = CURRENT_TIMESTAMP


SELECT * FROM t_category;

# - tag
INSERT INTO t_tag (update_at, `name`) 
VALUES
  (CURRENT_TIMESTAMP, 'frontend'),
  (CURRENT_TIMESTAMP, 'typescript'),
  (CURRENT_TIMESTAMP, 'javascript')
ON DUPLICATE KEY 
  UPDATE update_at = CURRENT_TIMESTAMP


SELECT * FROM t_tag;


# article
INSERT INTO t_article (
  `title`,
  `description`,
  `content`,
  `first_picture`,
  `views`,
  `star`,
  `user_id`,
  `category_id`
) 
VALUES
  (
    'title1',
    'description1',
    '# content1
       ## heading2
       article content
      ',
    'https://tse3-mm.cn.bing.net/th/id/OIP.5VPaZxeubluBG-HtHvYQBgHaEj?w=254&h=180&c=7&o=5&dpr=1.38&pid=1.7',
    0,
    1,
    NULL,
    1
  ),
  (
    'title2',
    'description2',
    '# content2
       ## heading2
       article content
      ',
    'https://tse3-mm.cn.bing.net/th/id/OIP.5VPaZxeubluBG-HtHvYQBgHaEj?w=254&h=180&c=7&o=5&dpr=1.38&pid=1.7',
    10,
    0,
    NULL,
    2
  ),
  (
    'title3',
    'description3',
    '# content3
       ## heading2
       article content
      ',
    'https://tse3-mm.cn.bing.net/th/id/OIP.5VPaZxeubluBG-HtHvYQBgHaEj?w=254&h=180&c=7&o=5&dpr=1.38&pid=1.7',
    0,
    0,
    NULL,
    2
  ) ;

  
  
SELECT * FROM t_article;

# - article tag
INSERT INTO t_article_tag (`article_id`, `tag_id`) 
VALUES
  (1, 1),
  (1, 2),
  (2, 2) ;

SELECT 
  a.article_id,
  a.title,
  t.name 
FROM
  t_article AS a 
  INNER JOIN t_article_tag AS t_at 
    ON a.article_id = t_at.article_id 
  INNER JOIN t_tag AS t 
    ON t_at.tag_id = t.tag_id ;

    
    
    
    
# - coment
INSERT INTO t_comment (
  `content`,
  `nickname`,
  `email`,
  `article_id`
) 
VALUES
  (
    'comment 1',
    'nickname1',
    'email1@163.com',
    1
  ),
  (
    'comment 2',
    'nickname2',
    'email2@163.com',
    1
  ),
  (
    'comment 3',
    'nickname3',
    'email3@163.com',
    1
  ),
  (
    'comment 21',
    'nickname1',
    'email1@163.com',
    2
  ) ;
  
INSERT INTO t_comment (
  `content`,
  `nickname`,
  `email`,
  `article_id`,
  `parent_id`
) 
VALUES
  (
    'children comment 1',
    'children nickname1',
    'Cemail1@163.com',
    1,
    1
  ),
  (
    'children comment 2',
    'children nickname2',
    'Cemail1@163.com',
    1,
    1
  ),
  (
    'children comment 21',
    'children nickname1',
    'Cemail1@163.com',
    1,
    2
  ) ;

  
SELECT * FROM t_comment;

SELECT c.comment_id, c.parent_id, c.content, c.nickname FROM t_comment AS c
WHERE c.parent_id = 1;
```





### 数据库的使用

## 登录/注册

### 使用中间件实现加密

### 创建中间件

这里先做简单的测试：

```ts
/* src/common/middlewares/hash-password.middleware.ts */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: Response<any>, res: Request, next: NextFunction) {
    console.log('hello ')
    next();
  }
}
```

在模块中使用中间件:

```ts
/* src/modules/user.module.ts */

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('user/register');
  }
}
```

### 密码加密

（这里使用`crypto`进行加密）

1. 制盐：make_salt
2. 加密：根据`salt`进行加密。

```ts
/* src/utils/cryptogram.ts */

import * as crypto from 'crypto';

/**
 * Make salt
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * Encrypt password
 * @param password 密码
 * @param salt 密码盐
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 1000, 16, 'sha256').toString('base64')
  );
}

/**
 * Validate password
 * @param password raw
 * @param salt
 * @param hashedPassword encrypted password
 * @returns true if pass, else false.
 */
export function validate(
  password: string,
  salt: string,
  hashedPassword: string,
): boolean {
  return encryptPassword(password, salt) === hashedPassword;
}
```





### 使用中间件截获用户密码

从`req.body`中获取用户的密码和密码盐，然后对密码进行加密，再将密码设置回去。

```ts
/* src/common/middlewares/hash-password.middleware.ts */
// ...
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body: CreateUserDto = req.body;
    // User may want to find the password he forgot,
    // so if password not passed, skip to encrypt.
    const salt = body.password_salt ? body.password_salt : makeSalt();
    body.password = encryptPassword(body.password, salt);
    body.password_salt = salt;

    next();
  }
}

```

## token验证

### 安装依赖

```sh
yarn add passport passport-jwt @nestjs/passport @nestjs/jwt -S
yarn add  passport-local --dev
```

我们将权限认证模块放置在`./src/modules/auth`中

### 设置密钥

```ts
/* src/modules/auth/constants.ts */

export const jwtConstants = {
  secret: 'miyao',
  expiresIn: '8h'
}
```

### 设置jwt策略

```ts
// src/logical/auth/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserAuthEnum } from '../user';

export interface Payload {
  sub: string;
  username: string;
  nickname: string;
  auth: UserAuthEnum;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload) {
    // console.log(`JWT验证 - Step 4: 被守卫调用`);
    return {
      userId: payload.sub,
      username: payload.username,
      realName: payload.nickname,
      auth: payload.auth,
    };
  }
}
```

这里我们将验证token的字段放置`reuqest header`中。

### 授权验证逻辑

```ts
/* src/modules/auth/auth.service.ts */

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'src/utils/cryptogram';
import { deleteProperties } from 'src/utils/object_property_utils';
import { User } from '../user/classes/User';
import UserLoginDto from '../user/dto/UserLoginDto';
import { UserService } from '../user/user.service';
import { Payload } from './jwt.strategy';
export interface ServiceResponse<T = any> {
  status: HttpStatus;
  success: boolean;
  data?: null | T;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService, // private readonly jwtService: JwtService,
  ) {}

  private async validateUser(
    userLoginDto: UserLoginDto,
  ): Promise<ServiceResponse<User | null>> {
    const user = await this.usersService.findOneByUsername(
      userLoginDto.username,
    );
    if (user === undefined) {
      return {
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: 'user not found',
      };
    }

    const { password: hashedPassword, password_salt } = user;
    const ok = validate(userLoginDto.password, password_salt, hashedPassword);
    if (!ok) {
      return {
        status: HttpStatus.FORBIDDEN,
        success: false,
        message: 'password error',
      };
    }

    deleteProperties(user, 'password', 'password_salt');
    return {
      status: HttpStatus.OK,
      success: true,
      data: user,
      message: 'validation pass',
    };
  }

  async certificate(user: User): Promise<string> {
    const payload: Payload = {
      sub: user.user_id,
      username: user.username,
      nickname: user.nickname,
      auth: user.auth,
    };
    console.log('jWT validating...');
    return this.jwtService.sign(payload);
  }

  async login(userDto: UserLoginDto) {
    return await this.validateUser(userDto);
  }
}
```

### 本地策略



### 关联模块

```ts
/* src/modules/auth/auth.module.ts */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn:jwtConstants.expiresIn
      }
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
```

### 编写login路由

```ts
/* src/modules/auth/auth.controller.ts */

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  // ...
    
  @Post('login')
  @ApiOperation({
    summary: 'User login',
  })
  public async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<RestFulApi<{ info: User; token: string }>> {
    if (!userLoginDto.password || !userLoginDto.username) {
      throw new BadRequestException('lacks username or password');
    }

    const serviceResponse = await this.authService.login(userLoginDto);
    const success: boolean = serviceResponse.success;
    if (!success) {
      throw new HttpException(
        { message: serviceResponse.message },
        serviceResponse.status,
      );
    }

    const user = serviceResponse.data;
    return {
      status: serviceResponse.status,
      success: SuccessStatus.SUCCESS,
      message: serviceResponse.message,
      data: {
        info: user,
        token: await this.authService.certificate(user),
      },
    };
  }
}

```

login路由的主要逻辑在：当用户登录成功后，服务器还应该返回`token`字段`token: await this.authService.certificate(user),`

### 使用守卫

完成token派发后，我们接下来就可以在需要进行权限校验的位置设置守卫，例如：以`user/test`为例：

```ts
/* src/modules/user/user.controller.ts */

@Get('test')
@ApiOperation({
    summary: 'Testing guard',
})
@UseGuards(AuthGuard('jwt'))
test(): RestFulApi<string> {
    return {
    status: 200,
    message: 'testing success',
    data: null,
    success: 1,
};

```

在对应的路由上设置`@UseGuards(AuthGuard('jwt'))`。当然也可以对user下所有的路由设置守卫。

### swagger支持

1. 配置swagger
2. 使用认证

主要是代码中的6-8行，设为swagger添加`bearerAuth`

```ts
/* src/main.ts */
const options = new DocumentBuilder()
.setTitle('Blog api document')
.setDescription('My personal blog api document')
.setVersion('1.0')
.addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'jwt',
)
.build();

```

对于需要用到token认证的api，添加`bearerAuth`装饰器，以`UserController`为例：

```ts
/* src/modules/user/user.controller.ts */
	
@ApiTags('user')			
@ApiBearerAuth('jwt')		 // <===
@Controller('user')
@UseGuards(AuthGuard('jwt')) // <===
export class UserController {
  constructor(private readonly usersService: UserService) {}
// ...
}
```









## 日志系统

## 异常处理

1. 创建异常处理过滤器

   ```ts
   /* src/common/filters/exception/HttpException.filter.ts */
   
   import {
     ArgumentsHost,
     Catch,
     ExceptionFilter,
     HttpException,
   } from '@nestjs/common';
   import { Response, Request } from 'express';
   import { RestFulApi, SuccessStatus } from 'src/api/restful';
   
   @Catch(HttpException)
   export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
     catch(exception: HttpException, host: ArgumentsHost) {
       const ctx = host.switchToHttp();
       const response: Response = ctx.getResponse();
       const status = exception.getStatus();
   
       const responseJson: RestFulApi = {
         status,
         data: null,
         message: exception.message,
         success: SuccessStatus.ERROR,
       };
       response.json(responseJson);
     }
   }
   ```

2. 注册为全局过滤器

   ```ts
   /* src/main.ts */
   // ...
   app.useGlobalFilters(new HttpExceptionFilter());
   ```

3. 自动捕获

   ```ts
   // xxx.ts
   throw new HttpException(/* ... */)
   throw new BadRequestException(/* ... */)
   ```

   

