import { InjectRepository } from "@nestjs/typeorm";
import { Knowledge } from "./knowledge.entity";
import { Repository } from "typeorm";
import { CreateKnowledgeDto } from "./knowledge.dto";
import { NotFoundException } from "@nestjs/common";
import {
  BaseResponse,
  withArrayBaseResponse,
  withSingleBaseResponse,
} from "src/helper/base-response.dto";
import { AzureFileService } from "../files/files.service";

export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private readonly knowledgeRepo: Repository<Knowledge>,
    private readonly fileService: AzureFileService,
  ) {}
  async create(dto: CreateKnowledgeDto, icon?: Express.Multer.File) {
    let iconUrl = null;
    if (icon) {
      iconUrl = await this.fileService.uploadFile(icon);
    }
    const knowledge = this.knowledgeRepo.create({
      ...dto,
      icon: iconUrl ? iconUrl : null, // Ensure the icon is set if URL is provided
    });
    const createdKnowledge = await this.knowledgeRepo.save(knowledge);
    const ResponseDTO = withSingleBaseResponse(Knowledge);
    return new ResponseDTO(true, 200, "Fetched Successfully", createdKnowledge);
  }

  async getAll(): Promise<BaseResponse<Knowledge[]>> {
    const result = await this.knowledgeRepo.find({ relations: ["articles"] });
    if (result.length) {
      const ResponseDTO = withArrayBaseResponse(Knowledge);
      return new ResponseDTO(true, 200, "Fetched Successfully", result);
    }
    throw new NotFoundException(`Knowledges not found.`);
  }

  async getById(id: number): Promise<BaseResponse<Knowledge>> {
    const knowledge = await this.knowledgeRepo.findOne({
      where: { id },
      relations: ["articles"],
    });
    if (!knowledge) {
      throw new NotFoundException(`Knowledge with ID ${id} not found.`);
    }
    const ResponseDTO = withSingleBaseResponse(Knowledge);
    return new ResponseDTO(true, 200, "Fetched Successfully", knowledge);
  }

  async update(
    id: number,
    dto: CreateKnowledgeDto,
    icon?: Express.Multer.File,
  ): Promise<BaseResponse<Knowledge>> {
    let iconUrl = null;
    const existingKnowledge = await this.knowledgeRepo.findOne({
      where: { id },
    });
    if (!existingKnowledge) {
      throw new NotFoundException(`Knowledge with ID ${id} not found.`);
    }

    if (icon && existingKnowledge.icon) {
      await this.fileService.deleteFile(existingKnowledge.icon); // Delete old image
    }
    if (icon) {
      iconUrl = await this.fileService.uploadFile(icon);
    }

    const updatedValues = {
      ...existingKnowledge,
      ...dto,
      icon: iconUrl ?? existingKnowledge.icon,
    };

    await this.knowledgeRepo.update(id, updatedValues);

    const updatedKnowledgeRecord = await this.knowledgeRepo.findOne({
      where: { id },
    });
    if (!updatedKnowledgeRecord) {
      throw new NotFoundException(`Knowledge with ID ${id} not found.`);
    }

    const ResponseDTO = withSingleBaseResponse(Knowledge);
    return new ResponseDTO(
      true,
      201,
      "Fetched Successfully",
      updatedKnowledgeRecord,
    );
  }

  async delete(id: number): Promise<void> {
    const knowledge = await this.knowledgeRepo.findOne({ where: { id } });
    if (!knowledge) {
      throw new NotFoundException(`Knowledge with ID ${id} not found.`);
    }

    if (knowledge.icon) {
      await this.fileService.deleteFile(knowledge.icon);
    }

    const deleteResult = await this.knowledgeRepo.delete({ id });
    if (!deleteResult.affected) {
      throw new NotFoundException(`Knowledge with ID ${id} not found.`);
    }
  }
}
