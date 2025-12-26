export interface HistoryData {
  id: string;
  createdAt: string;
  score?: number;
  questionnaire: {
    id: string;
    title: string;
  };
}