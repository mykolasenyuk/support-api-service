import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Article } from "../article/articles.entity";

@Entity({ name: "knowledge" })
export class Knowledge {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column("text")
  @ApiProperty({ example: "Knowledge Title" })
  title: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @ApiProperty({ example: "knowledge-icon.png" })
  icon: string;

  @Column("text")
  @ApiProperty({ example: "This is a description of the knowledge." })
  description: string;

  @OneToMany(() => Article, (article) => article.knowledge, {
    onDelete: "CASCADE",
  })
  @ApiProperty({ type: () => [Article] })
  public articles: Article[];
}
