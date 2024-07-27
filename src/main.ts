import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
require("dotenv").config();
const { PORT, HOST, SWAGGER_PREFIX } = process.env;

async function bootstrap() {
  console.log("Environment Variables:");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
  console.log("HOST:", process.env.HOST);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("MYSQL_DB:", process.env.MYSQL_DB);
  console.log("MYSQL_USER:", process.env.MYSQL_USER);
  console.log("MYSQL_PASSWORD:", process.env.MYSQL_PASSWORD);
  console.log("MEDIA_STORAGE_URL:", process.env.MEDIA_STORAGE_URL);
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == "dev") {
    app.enableCors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: "Content-Type, Accept, Authorization",
      credentials: true,
    });
  }

  const config = new DocumentBuilder()
    .setTitle("Support API")
    .setDescription("Support API documentation")
    .setVersion("1.0")
    .addServer("https://prosperity-dev.onza.me/api/v1/support-service/")
    .addServer("http://localhost:3900")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port: ${PORT}`);

    console.log(
      `Swagger doc available at ⚠️  http://${HOST}:${PORT}/${SWAGGER_PREFIX} ⚠️`,
    );
  });
}
bootstrap();
