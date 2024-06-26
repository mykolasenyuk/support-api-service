import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { ArticleModule } from "./modules/article/articles.module";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("HOST"),
        port: +configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [path.join(process.cwd(), "dist/**/*.entity.js")],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    KnowledgeModule,
    ArticleModule,
  ],
})
export class AppModule {}
