export type DBUser = {
  id: number;
  walletId: string;
  auth: 0 | 1;
  created_at: string;
  number: string | null;
  introduce: string;
  name: string;
};
