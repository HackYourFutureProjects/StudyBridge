export interface LessonPrice {
  subject: string;
  description: string;
  levels: Array<{
    level: string;
    price: string;
  }>;
}
