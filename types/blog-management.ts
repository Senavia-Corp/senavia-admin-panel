export interface Blog {
  id: number;
  title: string;
  resume: string;
  topic: string;
  publicationDate: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  ContentImageUrl: string;
  ImageReference: string;
  
  ImageSubTitle:string
  SubTitle:string
  userId:number
  content: ContentJson;
}

export interface ContentJson {
  content1: string;
  content2: string;
  quote: string;
}

export interface CreateBlogData {
  title: string;
  content: ContentJson;
  theme: string;
  summary: string;
  mainImage?: File;
  secondaryImage?: File;
  secondaryImageReference?: string;
  published: boolean;
}

export interface BlogTopic {
  id: string;
  name: string;
  color: string;
}
