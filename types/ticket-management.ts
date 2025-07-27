export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: string;
    type: string;
}
export interface TicketApiResponse {
  success: boolean;
  data: Ticket[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    simpleBlogsPerPage: number;
    totalBlogs: number;
  };
}
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}