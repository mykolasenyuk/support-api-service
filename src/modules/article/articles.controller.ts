import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ArticleService } from "./articles.service";
import { ArticleResponseDto, CreateArticleDto } from "./articles.dto";
import { Article } from "./articles.entity";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: "Get all article",
  })
  @ApiResponse({
    status: 200,
    type: [ArticleResponseDto],
  })
  getAllArticles() {
    return this.articleService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: "Create article",
  })
  @ApiResponse({
    status: 201,
    type: ArticleResponseDto,
  })
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    const { knowledgeId, ...articleData } = createArticleDto;
    const article: Article = new Article();

    Object.assign(article, articleData);

    return await this.articleService.create(article, knowledgeId);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update article by id",
  })
  @ApiResponse({
    status: 200,
    type: ArticleResponseDto,
  })
  async updateArticle(
    @Param("id") id: string,
    @Body() updateArticleDto: CreateArticleDto,
  ) {
    return await this.articleService.update(Number(id), updateArticleDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete article by id",
  })
  @ApiResponse({
    status: 200,
  })
  async deleteArticle(@Param("id") id: string) {
    await this.articleService.remove(Number(id));
    return { message: "Article removed successfully." };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get article by id",
  })
  @ApiResponse({
    status: 200,
    type: ArticleResponseDto,
  })
  async findById(@Param("id") id: string): Promise<Article> {
    return this.articleService.findOne(Number(id));
  }

  @Get("knowledge/:knowledgeId")
  @ApiOperation({
    summary: "Get article by knowledgeId",
  })
  @ApiResponse({
    status: 200,
    type: ArticleResponseDto,
  })
  async findByKnowledge(
    @Param("knowledgeId") knowledgeId: string,
  ): Promise<Article[]> {
    return this.articleService.findByKnowledge(Number(knowledgeId));
  }
}
