import { bot } from './index';

export async function setWebhook() {
  try {
    // Vercel автоматически дает VERCEL_URL
    const vercelUrl = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

    if (!vercelUrl) {
      console.log('⚠️ VERCEL_URL не найден. Webhook не установлен.');
      return;
    }

    const webhookUrl = `https://${vercelUrl}/webhook`;

    await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
      // allowed_updates: ['message', 'callback_query'],
    });

    console.log(`✅ Webhook установлен: ${webhookUrl}`);

    // Проверяем
    const info = await bot.api.getWebhookInfo();
    console.log('📋 Webhook info:', info);

  } catch (error) {
    console.error('❌ Ошибка установки webhook:', error);
  }
}
