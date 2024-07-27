import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { ArticleBaseDto, ArticleResponseDto } from "../article/articles.dto";

export class CreateKnowledgeDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  description: string;

  // @ApiPropertyOptional()
  // icon: string;
}

export class KnowledgeResponseDto extends CreateKnowledgeDto {
  @IsNumber()
  @ApiProperty()
  id: number = -1;
}

export class GetKnowledgeResponseDto extends KnowledgeResponseDto {
  @IsOptional()
  @ApiProperty({ type: () => [ArticleBaseDto] })
  articles: ArticleBaseDto[];
}
