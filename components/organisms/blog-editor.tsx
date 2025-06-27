"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bold, Italic, Underline, Type, Upload } from "lucide-react"
import { BlogManagementService } from "@/services/blog-management-service"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import type { Blog, BlogContent, BlogTheme } from "@/types/blog-management"

interface BlogEditorProps {
  blogId?: string
  onBack: () => void
  onSave: () => void
}

export function BlogEditor({ blogId, onBack, onSave }: BlogEditorProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [themes, setThemes] = useState<BlogTheme[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: {
      subtitle: "",
      content1: "",
      quote: "",
      imageSubtitle: "",
      content2: "",
    } as BlogContent,
    theme: "",
    summary: "",
    secondaryImageReference: "",
    published: false,
  })

  useEffect(() => {
    loadThemes()
    if (blogId) {
      loadBlog(blogId)
    }
  }, [blogId])

  const loadBlog = async (id: string) => {
    try {
      const blogData = await BlogManagementService.getBlogById(id)
      if (blogData) {
        setBlog(blogData)
        setFormData({
          title: blogData.title,
          content: blogData.content,
          theme: blogData.theme,
          summary: blogData.summary,
          secondaryImageReference: blogData.secondaryImageReference || "",
          published: blogData.published,
        })
      }
    } catch (error) {
      console.error("Error loading blog:", error)
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

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (blogId) {
        await BlogManagementService.updateBlog(blogId, formData)
      } else {
        await BlogManagementService.createBlog({
          ...formData,
          published: formData.published,
        })
      }
      onSave()
    } catch (error) {
      console.error("Error saving blog:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (blogId) {
      try {
        await BlogManagementService.deleteBlog(blogId)
        setShowDeleteDialog(false)
        onBack()
      } catch (error) {
        console.error("Error deleting blog:", error)
      }
    }
  }

  const handleContentChange = (field: keyof BlogContent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
  }

  return (
    <div className="h-full w-screen max-w-none px-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Post Editor</h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full">
        {/* Left Column - Content Editor */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          {/* Publication Date and Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Publication Date:</span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                {blog ? formatDate(blog.createdAt) : formatDate(new Date())}
              </span>
            </div>
          </div>

          {/* Blog Title */}
          <div className="mb-6">
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="text-2xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">by Writer's Name</p>
          </div>

          {/* Formatting Tools */}
          <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
            <Select defaultValue="Arial">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Aa</SelectItem>
                <SelectItem value="Times">Tt</SelectItem>
                <SelectItem value="Helvetica">Hh</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Type className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Subtitle</Label>
              <Input
                value={formData.content.subtitle}
                onChange={(e) => handleContentChange("subtitle", e.target.value)}
                placeholder="Enter subtitle..."
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Content 1</Label>
              <Textarea
                value={formData.content.content1}
                onChange={(e) => handleContentChange("content1", e.target.value)}
                placeholder="Enter first content section..."
                rows={6}
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Quote</Label>
              <Textarea
                value={formData.content.quote}
                onChange={(e) => handleContentChange("quote", e.target.value)}
                placeholder="Enter quote..."
                rows={3}
                className="mb-4 italic border-l-4 border-gray-300 pl-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Image Subtitle</Label>
              <Input
                value={formData.content.imageSubtitle}
                onChange={(e) => handleContentChange("imageSubtitle", e.target.value)}
                placeholder="Enter image subtitle..."
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Content 2</Label>
              <Textarea
                value={formData.content.content2}
                onChange={(e) => handleContentChange("content2", e.target.value)}
                placeholder="Enter second content section..."
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="w-96 space-y-6 flex-shrink-0">
          {/* Resume */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-2">{formData.summary.length}/200</div>
            </CardContent>
          </Card>

          {/* Topic */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.theme}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, theme: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.name}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Main Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">Drag and drop an image here</p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload from my Computer
                  </Button>
                </div>
              </div>

              {/* Secondary Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Secondary Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">Drag and drop an image here</p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload from my Computer
                  </Button>
                </div>
                <Input
                  value={formData.secondaryImageReference}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secondaryImageReference: e.target.value }))}
                  placeholder="Image reference..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            >
              {isLoading ? "Saving..." : blogId ? "Update Entry" : "Publish Entry"}
            </Button>
            {blogId && (
              <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" className="w-full py-3">
                Delete Entry
              </Button>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${formData.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
