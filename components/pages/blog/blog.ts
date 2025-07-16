interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  tag: string;
}

export interface BlogContent {
  quote: string;
  content1: string;
  content2: string;
}

export interface User{
  name:string;
  email: string;
  imageUrl: string;
}

export interface Blog {
  id: number;
  title: string;
  resume: string;
  content: BlogContent;
  topic: string;
  publicationDate: string;
  imageUrl: string;
  SubTitle: string;
  ImageSubTitle: string;
  ContentImageUrl: string;
  ImageReference: string;
  createdAt: string;
  updatedAt: string;
  User: User;
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
