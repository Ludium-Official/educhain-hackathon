export type DBUser = {
  id: number;
  walletId: string;
  auth: 0 | 1;
  name: string;
  number: string | null;
  introduce: string | null;
  created_at: string;
};
