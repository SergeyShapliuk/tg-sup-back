export type Task = {
  tg_id: string;        // владелец
  // id таски (для фронта)
  title: string;
  amount: number;
  link: string;
  icon: string;
  img: string;

  stat: number;         // 1 — активна
  user_stat: number;    // 1 start | 2 claim | 3 done

  dt_create: string;
  dt_start?: string;
  dt_done?: string;
};
