import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsBoolean, ValidateNested } from "class-validator";
import { Type as TransformType } from "class-transformer";
import { mixin } from "@nestjs/common";
// import { BaseResponse } from './base-response.interface';

export interface BaseResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  result: T;
}

export function withSingleBaseResponse<TBase>(
  Base: new (...args: any[]) => TBase,
) {
  @ApiExtraModels(Base)
  class SingleResponseDTO implements BaseResponse<TBase> {
    @ApiProperty({ example: true })
    @IsBoolean()
    status: boolean;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: "Fetched successfully" })
    message: string;

    @ApiProperty({ type: Base })
    @TransformType(() => Base)
    @ValidateNested()
    result: TBase;

    constructor(
      status: boolean,
      statusCode: number,
      message: string,
      result: TBase,
    ) {
      this.status = status;
      this.statusCode = statusCode;
      this.message = message;
      this.result = result;
    }
  }
  return mixin(SingleResponseDTO);
}

export function withArrayBaseResponse<TBase>(
  Base: new (...args: any[]) => TBase,
) {
  @ApiExtraModels(Base)
  class ArrayResponseDTO implements BaseResponse<TBase[]> {
    @ApiProperty({ example: true })
    @IsBoolean()
    status: boolean;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: "Fetched successfully" })
    message: string;

    @ApiProperty({ isArray: true, type: Base })
    @TransformType(() => Base)
    @ValidateNested({ each: true })
    result: TBase[];

    constructor(
      status: boolean,
      statusCode: number,
      message: string,
      result: TBase[],
    ) {
      this.status = status;
      this.statusCode = statusCode;
      this.message = message;
      this.result = result;
    }
  }
  return mixin(ArrayResponseDTO);
}
