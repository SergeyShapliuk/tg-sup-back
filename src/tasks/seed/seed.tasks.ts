import { Task } from '../application/dtos/task.attributes';

export const DEFAULT_TASKS = (tg_id: string): Task[] => {
  const now = new Date().toISOString();

  return [
    {
      tg_id,
      title: 'Join Telegram channel',
      amount: 100,
      link: 'https://t.me/invmatch',
      icon: 'tg',
      img: '',
      stat: 1,
      user_stat: 1,
      dt_create: now,
    },
    {
      tg_id,
      title: 'Follow on X',
      amount: 150,
      link: 'https://discord.com/',
      icon: 'discord',
      img: '',
      stat: 1,
      user_stat: 1,
      dt_create: now,
    },
    {
      tg_id,
      title: 'Follow on X',
      amount: 150,
      link: 'https://www.instagram.com/',
      icon: 'instagram',
      img: '',
      stat: 1,
      user_stat: 1,
      dt_create: now,
    },
  ];
};
