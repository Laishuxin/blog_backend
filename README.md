<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label}=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
一个基于`nesjs` + `mysql`实现的个人博客系统。

## Mental journey

### init

1. 构建目录结构
2. 设置配置文件啊

### 数据库

#### 创建数据库

创建数据库通过`nest`提供`TypeOrm`实现。



#### 模拟数据

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





#### 数据库的使用

### 登录/注册

#### 加密

1. 制盐：make_salt
2. 加密：根据`salt`进行加密。

##### 验证

1. 查询用户信息，获取`salt`
2. 根据`password`与`salt`进行加密。判断加密后的密码是否与数据库查询到的密码相同。

#### token验证

安装依赖：

```sh
yarn add passport passport-jwt @nestjs/passport @nestjs/jwt -S
yarn add  passport-local --dev
```





### 日志系统

### 异常处理

### API文档--swagger





## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



## reference

+ [Nest.js 从零到壹系列](https://mp.weixin.qq.com/s?__biz=MzA5NTcxOTcyMg==&mid=2247484008&idx=1&sn=ba8a48505525365bb2ac46cf2201569f&chksm=90ba5a2da7cdd33bf0790dc66c253a4bfad21996922b75969d00dbcbfd2a46af9b2aa2264431&scene=178&cur_album_id=1327095836240838656#rd)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
