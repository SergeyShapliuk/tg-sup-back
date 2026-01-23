export type UserAttributes = {
  tg_id: string;
  tg_nick: string;
  tg_firstname: string;
  tg_lastname: string;
  tg_language: string;
  business_models: string[];
  description: string;
  geography: string[];
  industries: string[];
  name: string;
  project_stages: string[];
  user_types: string[];
  wallet?: string;
  donuts?: {
    current_amount: number;
    purpose_amount: string;
    currency: string;
  }
};
