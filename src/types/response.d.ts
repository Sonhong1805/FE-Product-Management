interface IResponse<T> {
  error?: string | string[];
  message: string;
  success: boolean;
  pagination?: IPagination;
  priceMax?: number;
  data?: T;
}