import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings/settings';
import { runDB } from './db/db';
import dotenv from 'dotenv';
// import lt from 'localtunnel';

// import { webhookCallback } from 'grammy';
import { createBot } from './bot';


dotenv.config();

const getHost = (): string => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? '0.0.0.0' : 'localhost';
};


const token = process.env.NODE_ENV === 'development' ? process.env.TOKEN_BOT_DEV : process.env.TOKEN_BOT_PROD;
if (!token) {
  throw new Error('TOKEN_BOT_DEV не найден в .env файле');
}
export const bot = createBot(token);


let isInitialized = false;
let appInstance: express.Application;


const initApp = async () => {
  if (isInitialized) return appInstance;

  const app = express();
  setupApp(app);

  console.log('🔄 Connecting to database...');
  // await bot.start();
  await runDB(SETTINGS.MONGO_URL);

  console.log('✅ Database connected');

  // if (process.env.NODE_ENV === 'production') {
  //   app.post('/webhook', webhookCallback(bot, 'express'));
  // }

  appInstance = app;
  isInitialized = true;

  return appInstance;
};


/* ===========================
   DEV — локальный запуск
=========================== */
// if (process.env.NODE_ENV === 'development') {
  initApp().then((app) => {
    const PORT = SETTINGS.PORT || 3000;
    const HOST = getHost();

    app.listen(Number(PORT), HOST, () => {
      console.log(`🚀 Dev server on http://localhost:${PORT}`);

      bot.start({
        onStart: (info) =>
          console.log(`🤖 Bot @${info.username} started (polling)`),
      });
    });
  });
// }

/* ===========================
   PROD — Vercel handler
=========================== */

export default async function handler(req: any, res: any) {
  const app = await initApp();
  return app(req, res);
}
// // ✅ Обязательно указываем '0.0.0.0' для Render
// if (process.env.NODE_ENV === 'production') {
//   // 1. Настраиваем webhook endpoint
//   app.post('/webhook', webhookCallback(bot, 'express'));
//
//   // 2. Health check для Vercel
//   app.get('/', (req, res) => {
//     res.json({
//       status: 'Bot is running',
//       mode: 'webhook',
//       timestamp: new Date().toISOString(),
//     });
//   });
//
//   // 3. Запускаем сервер
//   app.listen(Number(PORT), '0.0.0.0', () => {
//     console.log(`🚀 Production server listening on port ${PORT}`);
//
//     // 4. Устанавливаем webhook автоматически
//     setWebhook().catch(console.error);
//   });
// }


