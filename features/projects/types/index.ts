// projects feature — TypeScript types

export type ClientProjectPhase = {
  value: string;
  key: string | null;
  name: string | null;
};

export type ClientProjectReport = {
  id: number;
  title: string | null;
  date: string | null;
  summary: string | null;
  reportText: string | null;
};

export type ClientProjectExtras = {
  status: string | number | null;
  phase: ClientProjectPhase | null;
  rejectionReason: string | null;
  reports: ClientProjectReport[];
};
