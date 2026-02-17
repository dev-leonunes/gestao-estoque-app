import { createApp } from './bootstrap';

async function bootstrap() {
  const app = await createApp();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(`📚 API disponível em: http://localhost:${port}/api`);
}
bootstrap();
