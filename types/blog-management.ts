export interface Blog {
  id: string
  title: string
  content: BlogContent
  theme: string
  summary: string
  mainImage?: string
  secondaryImage?: string
  secondaryImageReference?: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  author: string
}

export interface BlogContent {
  subtitle: string
  content1: string
  quote: string
  imageSubtitle: string
  content2: string
}

export interface CreateBlogData {
  title: string
  content: BlogContent
  theme: string
  summary: string
  mainImage?: File
  secondaryImage?: File
  secondaryImageReference?: string
  published: boolean
}

export interface BlogTheme {
  id: string
  name: string
  color: string
}
