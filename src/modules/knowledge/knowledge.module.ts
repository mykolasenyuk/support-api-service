import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Knowledge } from "./knowledge.entity";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import { AzureFileService } from "../files/files.service";

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge])],
  providers: [KnowledgeService, AzureFileService],
  controllers: [KnowledgeController],
})
export class KnowledgeModule {}
