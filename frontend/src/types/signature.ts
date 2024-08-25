export type Signature = {
  id: number;
  program_id: number;
  mission_id: number;
  recipient: string;
  validator: string;
  prize: string;
  sig: string;
  sig_hash: string;
  is_claimed: boolean;
};
