import type { Blog, CreateBlogData, BlogTopic } from "@/types/blog-management";
import { useFetch } from "@/lib/services/endpoints";

// Mock data
const mockThemes: BlogTopic[] = [
  { id: "1", name: "WEBDESIGN", color: "#3B82F6" },
  { id: "2", name: "DIGITALMARKETING", color: "#8B5CF6" },
 
];
const mockBlogs: Blog[] = [
  {
    id: 1,
     title: "blog 1",
     resume: "resumen 1",
     topic: "DIGITALMARKETING",
     publicationDate: "22-07-2025",
     imageUrl: "image.png",
     createdAt: new Date("2024-01-10"),
     updatedAt: new Date("2024-01-10"),
     ContentImageUrl: "string",
     ImageReference: "string",
     ImageSubTitle: "string",
     SubTitle: "string",
     userId: 1,
     content:{
      content1:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
      quote: "Code is like humor. When you have to explain it, it's bad.",
      content2:
        "Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae.",
    },
  },
  {
    id: 2,
     title: "blog 1",
     resume: "resumen 1",
     topic: "DIGITALMARKETING",
     publicationDate: "22-07-2025",
     imageUrl: "image.png",
     createdAt: new Date("2024-01-10"),
     updatedAt: new Date("2024-01-10"),
     ContentImageUrl: "string",
     ImageReference: "string",
     ImageSubTitle: "string",
     SubTitle: "string",
     userId: 1,
     content:{
      content1:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
      quote: "Code is like humor. When you have to explain it, it's bad.",
      content2:
        "Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae.",
    },
  },
];

export class BlogManagementService {
  static async getBlogs(
    search?: string,
    themeFilter?: string
  ): Promise<Blog[]> {
    let filteredBlogs = [...mockBlogs];

    if (search) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (themeFilter && themeFilter !== "all") {
      filteredBlogs = filteredBlogs.filter(
        (blog) => blog.topic === themeFilter
      );
    }

    return filteredBlogs;
  }

  static async getBlogById(id: number): Promise<Blog | null> {
    return mockBlogs.find((blog) => blog.id === id) || null;
  }

  static async createBlog(blogData: CreateBlogData): Promise<Blog> {
    const newBlog: Blog = {
    //  id: (mockBlogs.length + 1).toString().padStart(4, "0"),
    id:1,
      title: blogData.title,
      content: blogData.content,
      topic: blogData.theme,
      
      resume: blogData.summary,
      
      
      
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockBlogs.push(newBlog)
    return newBlog
  }

  static async updateBlog(
    id: number,
    updates: Partial<Blog>
  ): Promise<Blog | null> {
    const blogIndex = mockBlogs.findIndex((blog) => blog.id === id);
    if (blogIndex === -1) return null;

    mockBlogs[blogIndex] = {
      ...mockBlogs[blogIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return mockBlogs[blogIndex];
  }

  static async deleteBlog(id: number): Promise<boolean> {
    const blogIndex = mockBlogs.findIndex((blog) => blog.id === id);
    if (blogIndex === -1) return false;

    mockBlogs.splice(blogIndex, 1);
    return true;
  }

  static async getBlogThemes(): Promise<BlogTopic[]> {
    return mockThemes;
  }
}
