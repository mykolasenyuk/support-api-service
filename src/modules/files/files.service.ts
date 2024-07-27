import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { uuid } from "uuidv4";

@Injectable()
export class AzureFileService {
  constructor() {}
  private containerName: string;

  private async getBlobServiceInstance() {
    const connectionString = process.env.AZURE_CONNECTION_STRING;
    if (!connectionString) {
      throw new InternalServerErrorException(
        "Azure connection string is not defined",
      );
    }
    const blobClientService =
      await BlobServiceClient.fromConnectionString(connectionString);
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = process.env.AZURE_CONTAINER_NAME;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  public async uploadFile(file: Express.Multer.File) {
    const extension = file.originalname.split(".").pop();
    const file_name = uuid() + "." + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  public async deleteFile(fileUrl: string) {
    const blobName = fileUrl.split("/").pop();
    const blockBlobClient = await this.getBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  }
}
