import { Bot, Context, InputFile } from 'grammy';
import fs from 'fs';
import path from 'path';
import { UserService } from './users/application/user.service';
import { container } from './composition-root';


export function createBot(token: string) {

  if (!token) {
    throw new Error('❌ TOKEN_BOT_DEV не установлен в переменных окружения');
  }
  const bot = new Bot(token);


  const userService = container.get<UserService>(UserService);

  // if (false) {
  //   const createUserIfNotExists = async () => {
  //     await userService.createUserAndInitTasks({
  //       tg_id: String(6007991820),
  //       tg_firstname: 'Andrew',
  //       tg_lastname: 'Rogue',
  //       tg_nick: 'roguedasdsadsd',
  //       tg_language: 'en',
  //     });
  //   };
  //   createUserIfNotExists();
  // }

// bot.on("message", (ctx) => ctx.reply("Got another message!"));
  async function ensureUserExists(ctx: Context) {
    if (!ctx.from) return null;

    try {
      const result = await userService.createUserAndInitTasks({
        tg_id: String(ctx.from.id),
        tg_firstname: ctx.from.first_name ?? '',
        tg_lastname: ctx.from.last_name ?? '',
        tg_nick: ctx.from.username ?? '',
        tg_language: ctx.from.language_code ?? 'en',
      });

      return result;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      return null;
    }
  }

// Команда /start
  bot.command('start', async (ctx) => {
    if (!ctx.from) {
      await ctx.reply('Не удалось получить информацию о пользователе');
      return;
    }

    try {
      // Создаем/проверяем пользователя
      const userResult = await ensureUserExists(ctx);

      if (!userResult) {
        await ctx.reply('❌ Ошибка при создании пользователя');
        return;
      }

      // Отправляем приветственное сообщение с фото
      const filePath = path.resolve(process.cwd(), 'public', 'assets', 'main.jpg');

      const welcomeMessage = userResult.created
        ? '🎉 Welcome to Support Durov'
        : '👋 Welcome back to Support Durov';

      // await ctx.reply(welcomeMessage);

      // Отправляем фото с описанием (если нужно)
      if (fs.existsSync(filePath)) {
        await ctx.replyWithPhoto(new InputFile(fs.createReadStream(filePath)), {
          caption: `<b>${welcomeMessage}</b>\n\n` +
            // `Your gateway to hotel discounts with HH tokens!\n\n` +
            // `💰 <b>Earn HH tokens</b> in our mini-games\n` +
            // `🏨 <b>Redeem for discounts</b> on Booking.com\n` +
            // `📱 <b>Play anytime</b> in Telegram\n\n` +
            `Click the button below to start earning tokens!`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 Start Earning Tokens',
                  web_app: { url: 'https://tg-bot-support-delta.vercel.app/' },
                },
              ],
            ],
          },
        });
      } else {
        // Если фото нет, отправляем просто сообщение
        await ctx.reply(`🚀 Начните зарабатывать SD токены!\n\nИспользуйте кнопку ниже:`, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🎮 Open Game',
                  web_app: { url: 'https://tg-bot-support-delta.vercel.app/' },
                },
              ],
            ],
          },
        });
      }

    } catch (error) {
      console.error('Error in start command:', error);
      await ctx.reply('❌ Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
  });
  return bot;
}

// async function botApi() {
//     await bot.api.sendMessage(909630753, "Welcome to investmatch, we helps founders and investors find each other: for founders – automatic matching by industry, stage and funding amount; built-in chat with templates and secure doc exchange; dashboard of profile views, responses and improvement tips. For investors – filters by sector, stage and region; daily startup digests; scoring and metrics; instant pitch previews and KPI summaries; secure file sharing and real-time alerts. Trusted by 115+ founders, 35 angels and 2 accelerators. Worldwide reach.!");
//     // await bot.command('start',{middleware})
//     const me = await bot.api.getMe();
//     console.log("botApi", me);
// }


