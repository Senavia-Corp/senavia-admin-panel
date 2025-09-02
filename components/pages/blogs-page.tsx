"use client"

import { useState, useEffect } from "react"
import { CreateBlogDialog } from "@/components/organisms/create-blog-dialog"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import { BlogManagementService } from "@/services/blog-management-service"
import type { Blog, BlogTopic } from "@/types/blog-management"
import { BlogEditor } from "@/components/organisms/blog-editor"
import { GeneralTable } from "@/components/organisms/tables/general-table"
import BlogViewModel from "./blog/BlogViewModel"
 
export function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [themes, setThemes] = useState<BlogTopic[]>([])
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [themeFilter, setThemeFilter] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)

  const [simpleBlogsPerPage, setSimpleBlogsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);  
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { posts, loading, pageInfo } = BlogViewModel({ simpleBlog: true, offset,simpleBlogsPerPage});

  useEffect(() => {
    loadBlogs()
    loadThemes()
  }, [searchTerm, themeFilter])

  const loadBlogs = async () => {
    try {
      const blogsData = await BlogManagementService.getBlogs(searchTerm, themeFilter)
      //setBlogs(blogsData)      
    } catch (error) {
      console.error("Error loading blogs:", error)
    }
  }

  const loadThemes = async () => {
    try {
      const themesData = await BlogManagementService.getBlogThemes()
      setThemes(themesData)
    } catch (error) {
      console.error("Error loading themes:", error)
    }
  }

  const handleDeleteBlog = async (blog: Blog) => {
    try {
      await BlogManagementService.deleteBlog(blog.id)
      setBlogToDelete(null)
      loadBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  const handleViewBlog = (blog: Blog) => {
    setEditingBlogId(blog.id)
    setShowEditor(true)
  }

  const handleCreateBlog = () => {
    setEditingBlogId(null)
    setShowEditor(true)
  }
  const handleFilterChange=()=>{
    
  }
const handlers = {
    onCreate: handleCreateBlog,
    onView: handleViewBlog,
    onDelete: (blog: Blog) => setBlogToDelete(blog),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }

  if (showEditor) {
    return (
      <div  >     
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <BlogEditor
              blogId={editingBlogId??undefined}
              onBack={() => setShowEditor(false)}
              onSave={() => {
                setShowEditor(false)
                loadBlogs()
              }}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">     
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">Blog Posts</h1>

            <div className="flex-1 min-h-0">
             {GeneralTable(
              "blogs-page",
              "Add post",
              "Description",
              "All Posts",
              "Description",
              ["Blog ID","Title", "Date","Topic","Actions"],
              posts,handlers               
             )}
            </div>
          </div>
        </div>
      </main>

      <CreateBlogDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadBlogs}
        themes={themes}
      />

      <DeleteConfirmDialog
        open={!!blogToDelete}
        onClose={() => setBlogToDelete(null)}
        onConfirm={() => blogToDelete && handleDeleteBlog(blogToDelete)}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
      />
      {/* Controles de paginación */}
<div className="flex justify-between items-center mt-4">
  <button
    onClick={() => setOffset((prev) => Math.max(prev - simpleBlogsPerPage, 0))}
    disabled={offset === 0 || loading}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    ⬅️ Anterior
  </button>

  <span>
    Página {Math.floor(offset / simpleBlogsPerPage) + 1}
  </span>

  <button
    onClick={() => {
      if (!pageInfo || offset + simpleBlogsPerPage < pageInfo.totalBlogs) {                
        const lastBlogId = posts[posts.length - 1].id;
        setOffset(lastBlogId);        
      }     
    }}
    disabled={loading || (pageInfo && offset + simpleBlogsPerPage >= pageInfo.totalBlogs)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Siguiente ➡️
  </button>
</div>
    </div>
    
  )
  
}
