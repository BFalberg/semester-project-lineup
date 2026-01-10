import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "../db.sqlite",
  synchronize: true,
  entities: ["**/*.entity.ts"],
  migrations: ["src/database/migrations/*-migration.ts"],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
