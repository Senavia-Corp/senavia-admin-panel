import type { Blog, CreateBlogData, BlogTheme } from "@/types/blog-management"

// Mock data
const mockThemes: BlogTheme[] = [
  { id: "1", name: "Technology", color: "#3B82F6" },
  { id: "2", name: "Design", color: "#8B5CF6" },
  { id: "3", name: "Marketing", color: "#F59E0B" },
  { id: "4", name: "Business", color: "#10B981" },
  { id: "5", name: "Development", color: "#EF4444" },
]

const mockBlogs: Blog[] = [
  {
    id: "0001",
    title: "Getting Started with Web Design",
    content: {
      subtitle: "Essential principles for modern web design",
      content1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper vitae lacus eu convallis.",
      quote: "Design is not just what it looks like and feels like. Design is how it works.",
      imageSubtitle: "Modern web design trends",
      content2:
        "Mauris nec volutpat odio. Fusce rhoncus pretium vestibulum. Etiam ut purus pretium, volutpat odio non.",
    },
    theme: "Design",
    summary: "Learn the fundamental principles of modern web design and how to create engaging user experiences.",
    mainImage: "/placeholder.svg?height=400&width=600",
    secondaryImage: "/placeholder.svg?height=300&width=400",
    secondaryImageReference: "Design tools and resources",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    published: true,
    author: "Admin",
  },
  {
    id: "0002",
    title: "Modern Development Practices",
    content: {
      subtitle: "Best practices for modern software development",
      content1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
      quote: "Code is like humor. When you have to explain it, it's bad.",
      imageSubtitle: "Development workflow",
      content2: "Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae.",
    },
    theme: "Development",
    summary: "Explore modern development practices and methodologies that improve code quality and team productivity.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    published: true,
    author: "Admin",
  },
]

export class BlogManagementService {
  static async getBlogs(search?: string, themeFilter?: string): Promise<Blog[]> {
    let filteredBlogs = [...mockBlogs]

    if (search) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.theme.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (themeFilter && themeFilter !== "all") {
      filteredBlogs = filteredBlogs.filter((blog) => blog.theme === themeFilter)
    }

    return filteredBlogs
  }

  static async getBlogById(id: string): Promise<Blog | null> {
    return mockBlogs.find((blog) => blog.id === id) || null
  }

  static async createBlog(blogData: CreateBlogData): Promise<Blog> {
    const newBlog: Blog = {
      id: (mockBlogs.length + 1).toString().padStart(4, "0"),
      title: blogData.title,
      content: blogData.content,
      theme: blogData.theme,
      summary: blogData.summary,
      secondaryImageReference: blogData.secondaryImageReference,
      published: blogData.published,
      author: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockBlogs.push(newBlog)
    return newBlog
  }

  static async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog | null> {
    const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)
    if (blogIndex === -1) return null

    mockBlogs[blogIndex] = { ...mockBlogs[blogIndex], ...updates, updatedAt: new Date() }
    return mockBlogs[blogIndex]
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)
    if (blogIndex === -1) return false

    mockBlogs.splice(blogIndex, 1)
    return true
  }

  static async getBlogThemes(): Promise<BlogTheme[]> {
    return mockThemes
  }
}
