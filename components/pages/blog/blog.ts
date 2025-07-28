interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  tag: string;
}

export interface BlogContent {
  content1: string;
  content2: string;
  quote: string;
}



export interface Blog {
  id: number;
  title: string;
  resume: string;
  topic: string;
  publicationDate: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  ContentImageUrl: string;
  ImageReference: string;
  ImageSubTitle: string;
  SubTitle: string;
  userId: number;
  content: BlogContent;
}

export type { BlogPost };

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}

// Interfaz para un blog simplificado según la respuesta de la API
export interface SimpleBlog {
  id: number;
  title: string;
  resume: string;
  topic: string;
  publicationDate: string;
  imageUrl: string;
}

// Interfaz para la respuesta de la API de blogs simplificados
export interface SimpleBlogApiResponse {
  success: boolean;
  data: SimpleBlog[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    simpleBlogsPerPage: number;
    totalBlogs: number;
  };
}
