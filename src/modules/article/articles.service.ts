import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "./articles.entity";
import { Knowledge } from "../knowledge/knowledge.entity";
import {
  withSingleBaseResponse,
  withArrayBaseResponse,
  BaseResponse,
} from "src/helper/base-response.dto";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Knowledge)
    private knowledgeRepository: Repository<Knowledge>,
  ) {}

  async findAll(): Promise<BaseResponse<Article[]>> {
    const result = await this.articleRepository.find({
      relations: ["knowledge"],
    });
    if (!result.length) {
      throw new HttpException(`No articles found`, HttpStatus.NOT_FOUND);
    }
    const responseDto = withArrayBaseResponse(Article);
    return new responseDto(true, 200, "Fetched Successfully", result);
  }

  async findByKnowledge(knowledgeId: number): Promise<BaseResponse<Article[]>> {
    const articles = await this.articleRepository
      .createQueryBuilder("article")
      .innerJoin(
        "article.knowledge",
        "knowledge",
        "knowledge.id = :knowledgeId",
        { knowledgeId },
      )
      .getMany();

    if (!articles.length) {
      throw new HttpException(
        `No articles found for knowledge with id ${knowledgeId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const responseDto = withArrayBaseResponse(Article);
    return new responseDto(true, 200, "Fetched Successfully", articles);
  }

  async findOne(id: number): Promise<BaseResponse<Article>> {
    const article = await this.articleRepository.findOne({ where: { id } });
    const responseDto = withSingleBaseResponse(Article);
    return new responseDto(true, 200, "Fetched Successfully", article);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }

  async create(
    article: Partial<Article>,
    knowledgeId: number,
  ): Promise<BaseResponse<Article>> {
    const knowledge = await this.knowledgeRepository.findOne({
      where: { id: knowledgeId },
    });
    if (!knowledge) {
      throw new HttpException(
        `Knowledge with id ${knowledgeId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Create the new article from the given object
    const newArticle = this.articleRepository.create(article);

    if (Array.isArray(article.images)) {
      newArticle.images = JSON.stringify(article.images);
    }

    newArticle.knowledge = knowledge;

    const savedArticle = await this.articleRepository.save(newArticle);
    const responseDto = withSingleBaseResponse(Article);
    return new responseDto(true, 201, "Created Successfully", savedArticle);
  }

  async update(
    id: number,
    updatedArticle: { knowledgeId: number; [key: string]: any },
  ): Promise<BaseResponse<Article>> {
    const articleToUpdate = await this.articleRepository.findOne({
      where: { id },
    });
    if (!articleToUpdate) {
      throw new HttpException(
        `Article with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updatedArticle.knowledgeId) {
      const knowledge = await this.knowledgeRepository.findOne({
        where: { id: updatedArticle.knowledgeId },
      });
      if (!knowledge) {
        throw new HttpException(
          `Knowledge with id ${updatedArticle.knowledgeId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      delete updatedArticle.knowledgeId;
      articleToUpdate.knowledge = knowledge;
    }

    Object.assign(articleToUpdate, updatedArticle);
    await this.articleRepository.save(articleToUpdate);

    const savedArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ["knowledge"],
    });
    const responseDto = withSingleBaseResponse(Article);
    return new responseDto(true, 201, "Updated Successfully", savedArticle);
  }
}
