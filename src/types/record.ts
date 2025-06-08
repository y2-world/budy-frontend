export type WeightRecord = {
  date: string; 
  timestamp: string;
  weight: number;
  bodyFat: number;
  userId: string;
}

export type DiaryRecord = {
  date: string; 
  timestamp: string;
  diary?: string;
};