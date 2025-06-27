"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BlogManagementService } from "@/services/blog-management-service"
import type { BlogTheme, CreateBlogData } from "@/types/blog-management"

interface CreateBlogDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  themes: BlogTheme[]
}

export function CreateBlogDialog({ open, onClose, onSuccess, themes }: CreateBlogDialogProps) {
  const [formData, setFormData] = useState<CreateBlogData>({
    title: "",
    content: "",
    theme: "",
    published: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await BlogManagementService.createBlog(formData)
      onSuccess()
      onClose()
      setFormData({
        title: "",
        content: "",
        theme: "",
        published: false,
      })
    } catch (error) {
      console.error("Error creating blog:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof CreateBlogData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="theme">Theme *</Label>
            <Select value={formData.theme} onValueChange={(value) => handleChange("theme", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.name}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleChange("published", checked as boolean)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white">
              {isLoading ? "Creating..." : "Create Blog Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
