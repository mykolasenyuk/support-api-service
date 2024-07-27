import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { ArticleModule } from "./modules/article/articles.module";
import { AzureFileService } from "./modules/files/files.service";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("MYSQL_HOST"),
        port: +configService.get<number>("DB_PORT"),
        username: configService.get<string>("MYSQL_USER"),
        password: configService.get<string>("MYSQL_PASSWORD"),
        database: configService.get<string>("MYSQL_DB"),
        entities: [path.join(process.cwd(), "dist/**/*.entity.js")],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    KnowledgeModule,
    ArticleModule,
  ],
  providers: [AzureFileService],
})
export class AppModule {}
