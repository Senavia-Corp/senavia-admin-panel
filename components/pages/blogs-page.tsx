"use client"

import { useState, useEffect } from "react"
import { BlogsTable } from "@/components/organisms/blogs-table"
import { CreateBlogDialog } from "@/components/organisms/create-blog-dialog"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"
import { BlogManagementService } from "@/services/blog-management-service"
import type { Blog, BlogTheme } from "@/types/blog-management"
import { BlogEditor } from "@/components/organisms/blog-editor"

export function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [themes, setThemes] = useState<BlogTheme[]>([])
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [themeFilter, setThemeFilter] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)

  useEffect(() => {
    loadBlogs()
    loadThemes()
  }, [searchTerm, themeFilter])

  const loadBlogs = async () => {
    try {
      const blogsData = await BlogManagementService.getBlogs(searchTerm, themeFilter)
      setBlogs(blogsData)
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

  if (showEditor) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center space-x-2">
                <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">U</span>
                </div>
                <span className="text-sm font-medium">Username</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <BlogEditor
              blogId={editingBlogId}
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">U</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">Blog Posts</h1>

            <div className="flex-1 min-h-0">
              <BlogsTable
                blogs={blogs}
                themes={themes}
                onAddBlog={handleCreateBlog}
                onViewBlog={handleViewBlog}
                onDeleteBlog={setBlogToDelete}
                onSearch={setSearchTerm}
                onThemeFilter={setThemeFilter}
              />
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
    </div>
  )
}
