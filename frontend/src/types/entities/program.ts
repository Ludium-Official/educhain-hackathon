export type DBProgram = {
  id: number;
  owner: string;
  is_private: boolean;
  type: "announcement"; // TODO: 다른 것들도 추가
  title: string;
  guide: string | null;
  missionCnt: number;
  end_at: string;
  created_at: string;
};
