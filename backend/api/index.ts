import { createApp } from '../src/bootstrap';

let server: any;
let appReady: Promise<void> | undefined;

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await createApp();
    appReady = app.init().then(() => undefined);
    await appReady;
    server = app.getHttpAdapter().getInstance();
  } else if (appReady) {
    await appReady;
  }

  return server(req, res);
}
