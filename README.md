<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
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
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

Music Platform

Music Platform is a backend application designed to manage and play music. This project provides a robust and scalable infrastructure for creating a modern music platform, built using NestJS.

 Features
- User management (registration, login, authorization)
- Music management (songs, albums, artists)
- Database connectivity and operations
- Modular and scalable architecture
- TypeORM integration for database interactions

 Technologies Used
- NestJS: A modern Node.js framework with a modular architecture.
- TypeScript: Used for safer and more readable code.
- PostgreSQL: A robust relational database management system.
- TypeORM: An ORM library for database interactions.

 Installation

Requirements
- Node.js (16.x or higher)
- npm or yarn
- PostgreSQL (a running database instance is required)

Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/dilgusha/music-platform.git
   cd music-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create and configure the `.env` file:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=music_platform
   JWT_SECRET=your_jwt_secret
   ```
4. Migrate the database:
   ```bash
   npm run migration:run
   ```
5. Start the application:
   ```bash
   npm run start
   ```

 Project Structure
```
src/
├── app/
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
├── common/
│   └── ...
├── config/
│   └── ...
├── database/
│   └── ...
├── guards/
│   └── ...
├── shared/
│   └── ...
├── migrations/
│   └── Database migration files.
├── music/
│   └── Music management modules.
└── main.ts
```

- migrations/: Database migration files and configurations.
- music/: Modules for managing songs, albums, and artists.
- main.ts: Entry point of the application.

 Scripts
The following scripts are available for development and testing:

```json
"scripts": {
  "build": "nest build",
  "format": "prettier --write \"src//*.ts\" \"test//*.ts\"",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "typeorm": "ts-node ./node_modules/typeorm/cli -d ./data-source.ts",
  "migration:run": "npm run typeorm -- migration:run",
  "migration:generate": "npm run typeorm -- migration:generate -n $npm_config_name",
  "migration:create": "npm run typeorm -- migration:create ./src/migrations/$npm_config_name",
  "migration:revert": "npm run typeorm -- migration:revert",
  "lint": "eslint \"{src,apps,libs,test}//*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

Commonly Used Commands
- Build the project:
  ```bash
  npm run build
  ```
- Start the development server:
  ```bash
  npm run start:dev
  ```
- Run all tests:
  ```bash
  npm run test
  ```
- Format the code:
  ```bash
  npm run format
  ```
- Run migrations:
  ```bash
  npm run migration:run
  ```
- Generate a new migration:
  ```bash
  npm run migration:generate --name MigrationName
  ```

Support
Music Platform is an open-source project licensed under MIT. Contributions, feedback, and support are always welcome. If you'd like to contribute, please submit a pull request or open an issue.

Stay in Touch
- GitHub - https://github.com/dilgusha  
- LinkedIn - https://www.linkedin.com/in/dilgusha-hasanova-251a01219/

 License
This project is licensed under the MIT License.

