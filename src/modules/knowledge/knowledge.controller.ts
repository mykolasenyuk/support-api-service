import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateKnowledgeDto } from "./knowledge.dto";
import { KnowledgeService } from "./knowledge.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  BaseResponse,
  withArrayBaseResponse,
  withSingleBaseResponse,
} from "src/helper/base-response.dto";
import { Knowledge } from "./knowledge.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { AzureFileService } from "../files/files.service";
// import { Multer } from "multer";
@ApiTags("Knowledge")
@Controller("knowledge")
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
    private readonly fileService: AzureFileService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create knowledge",
  })
  @ApiResponse({
    status: 201,
    type: withSingleBaseResponse(Knowledge),
  })
  @UseInterceptors(FileInterceptor("icon"))
  async create(
    @Body()
    dto: CreateKnowledgeDto,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<BaseResponse<Knowledge>> {
    console.log("Received DTO:", dto);
    console.log("Received file:", icon);
    if (icon) {
      return await this.knowledgeService.create(dto, icon);
    }
    return await this.knowledgeService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all knowledge",
  })
  @ApiResponse({
    status: 200,
    type: withArrayBaseResponse(Knowledge),
  })
  async getAll(): Promise<BaseResponse<Knowledge[]>> {
    return await this.knowledgeService.getAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get knowledge by id",
  })
  @ApiResponse({
    status: 200,
    type: withSingleBaseResponse(Knowledge),
  })
  async getById(@Param("id") id: number): Promise<BaseResponse<Knowledge>> {
    return await this.knowledgeService.getById(id);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update knowledge by id",
  })
  @ApiResponse({
    status: 200,
    type: withSingleBaseResponse(Knowledge),
  })
  @UseInterceptors(FileInterceptor("icon"))
  async update(
    @Param("id") id: number,
    @Body() dto: CreateKnowledgeDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<BaseResponse<Knowledge>> {
    if (icon) {
      return this.knowledgeService.update(id, dto, icon);
    }
    return await this.knowledgeService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete knowledge by id",
  })
  @ApiResponse({
    status: 200,
  })
  async delete(@Param("id") id: number) {
    await this.knowledgeService.delete(id);
    return { message: "Knowledge removed successfully." };
  }
}
