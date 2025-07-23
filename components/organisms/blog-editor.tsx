"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bold, Italic, Underline, Type, Upload } from "lucide-react";
import { BlogManagementService } from "@/services/blog-management-service";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Blog, BlogContent, BlogTheme } from "@/types/blog-management";

const topics = [
  { id: "1", name: "WEBDESIGN", displayName: "Web Design" },
  { id: "2", name: "DIGITALMARKETING", displayName: "Digital Marketing" },
];

interface BlogEditorProps {
  blogId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function BlogEditor({ blogId, onBack, onSave }: BlogEditorProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [themes, setThemes] = useState<BlogTheme[]>([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  });

  const [formData2, setFormData2] = useState({
    title: "",
    resume: "",
    topic: "",
    publicationDate: "",
    imageUrl: null as File | null,
    ContentImageUrl: null as File | null,
    ImageReference: "",
    ImageSubTitle: "",
    SubTitle: "",
    content: {
      content1: "",
      content2:
        "Contenido después de la imagen. Aquí puedes expandir las ideas principales con más detalle.",
      quote:
        "La creatividad es la inteligencia divirtiéndose. - Albert Einstein",
      subtitle: "Subtítulo opcional para sección adicional",
      imageSubtitle: "Imagen ilustrativa de las tendencias 2025",
    },
    userId: 1,
  });

  useEffect(() => {
    loadThemes();
    if (blogId) {
      loadBlog(blogId);
    }
  }, [blogId]);

  const loadBlog = async (id: string) => {
    try {
      const blogData = await BlogManagementService.getBlogById(id);
      if (blogData) {
        setBlog(blogData);
        setFormData({
          title: blogData.title,
          content: blogData.content,
          theme: blogData.theme,
          summary: blogData.summary,
          secondaryImageReference: blogData.secondaryImageReference || "",
          published: blogData.published,
        });
      }
    } catch (error) {
      console.error("Error loading blog:", error);
    }
  };

  const loadThemes = async () => {
    try {
      const themesData = await BlogManagementService.getBlogThemes();
      setThemes(themesData);
    } catch (error) {
      console.error("Error loading themes:", error);
    }
  };

  //-----------------
  const logFormData2 = () => {
    console.log("Contenido de formData2:");

    Object.entries(formData2).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(
          `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    });
  };
  //-----------------
  const handleSave = async () => {
    const form_data = new FormData();

    if (formData2.imageUrl instanceof File) {
      form_data.append("imageUrl", formData2.imageUrl);
    } else {
      console.error("imageUrl no es un archivo válido:", formData2.imageUrl);
      return;
    }
    if (formData2.ContentImageUrl) {
      if (formData2.ContentImageUrl instanceof File) {
        form_data.append("ContentImageUrl", formData2.ContentImageUrl);
      } else {
        console.error(
          "ContentImageUrl no es un archivo válido:",
          formData2.ContentImageUrl
        );
        return;
      }
    }
    if (formData2.ImageReference) {
      form_data.append("ImageReference", formData2.ImageReference);
    }
    if (formData2.ImageSubTitle) {
      form_data.append("ImageSubTitle", formData2.ImageSubTitle);
    }
    if (formData2.content) {
      form_data.append("content", JSON.stringify(formData2.content));
    }

    form_data.append("title", formData2.title);
    form_data.append("resume", formData2.resume);
    form_data.append("topic", formData2.topic);
    form_data.append("publicationDate", _date);
    if (formData2.imageUrl) {
      form_data.append("imageUrl", formData2.imageUrl);
    }
    form_data.append("SubTitle", formData2.SubTitle);
    form_data.append("userId", "1");
    form_data.append("content", JSON.stringify(formData2.content));

    const response = await fetch("http://localhost:3000/api/blog", {
      method: "POST",
      body: form_data,
    });
    const data = await response.json();
    logFormData2();
    setIsLoading(true);
    try {
      if (blogId) {
        await BlogManagementService.updateBlog(blogId, formData);
      } else {
        await BlogManagementService.createBlog({
          ...formData,
          published: formData.published,
        });
      }
      onSave();
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (blogId) {
      try {
        await BlogManagementService.deleteBlog(blogId);
        setShowDeleteDialog(false);
        onBack();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleContentChange = (field: keyof BlogContent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const _date = String(formatDate(new Date()));

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
                {_date}
              </span>
            </div>
          </div>

          {/* Blog Title */}
          <div className="mb-6">
            <Input
              value={formData2.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                setFormData2((prev) => ({ ...prev, title: e.target.value }));
              }}
              placeholder="Digite el titulo de su blog"
              className="text-2xl font-bold "
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
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Subtitle
              </Label>
              <Input
                value={formData2.SubTitle}
                onChange={(e) => {
                  handleContentChange("subtitle", e.target.value);
                  setFormData2((prev) => ({
                    ...prev,
                    SubTitle: e.target.value,
                  }));
                }}
                placeholder="Enter subtitle..."
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Content 1
              </Label>
              <Textarea
                value={formData2.content.content1}
                onChange={(e) =>
                  /*  handleContentChange("content1", e.target.value)*/
                  setFormData2((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content, // Mantenemos el resto de propiedades de content
                      content1: e.target.value,
                    },
                  }))
                }
                placeholder="Enter first content section..."
                rows={6}
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Quote
              </Label>
              <Textarea
                value={formData2.content.quote}
                onChange={(e) =>
                  /*  handleContentChange("quote", e.target.value)*/
                  setFormData2((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content, // Mantenemos el resto de propiedades de content
                      quote: e.target.value,
                    },
                  }))
                }
                placeholder="Enter quote..."
                rows={3}
                className="mb-4 italic border-l-4 border-gray-300 pl-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Image SubTitle
              </Label>
              <Input
                value={formData2.ImageSubTitle}
                onChange={(e) =>
                  setFormData2((prev) => ({
                    ...prev,
                    ImageSubTitle: e.target.value,
                  }))
                }
                placeholder="Enter image subtitle..."
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Content 2
              </Label>
              <Textarea
                value={formData2.content.content2}
                onChange={(e) =>
                  /* handleContentChange("content2", e.target.value)*/
                  setFormData2((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content, // Mantenemos el resto de propiedades de content
                      content2: e.target.value,
                    },
                  }))
                }
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
                value={formData2.resume}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, resume: e.target.value }));
                  setFormData2((prev) => ({ ...prev, resume: e.target.value }));
                  console.log("Resumen cambiado: ", e.target.value);
                }}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {formData.summary.length}/200
              </div>
            </CardContent>
          </Card>

          {/* Topic */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData2.topic}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, theme: value }));
                  setFormData2((prev) => ({ ...prev, topic: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((elem) => (
                    <SelectItem key={elem.id} value={elem.name}>
                      {elem.displayName}
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
                <Label className="text-sm font-medium mb-2 block">
                  Main Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Drag and drop an image here
                  </p>
                  <Button
                    onClick={(e) => {
                      console.log(e);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload from my Computer
                  </Button>
                  <input
                    type="file"
                    onChange={(e) => {
                      // Get the files from the input event
                      const files = e.target.files;
                      // If files are selected, update the state with the first file
                      if (files && files.length > 0) {
                        setFormData2((prev) => ({
                          ...prev,
                          imageUrl: files[0],
                        }));
                      }
                    }}
                  ></input>
                </div>
              </div>

              {/* Secondary Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Secondary Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Drag and drop an image here
                  </p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload from my Computer
                  </Button>
                  <input
                    type="file"
                    onChange={(e) => {
                      // Get the files from the input event
                      const files = e.target.files;
                      // If files are selected, update the state with the first file
                      if (files && files.length > 0) {
                        setFormData2((prev) => ({
                          ...prev,
                          ContentImageUrl: files[0],
                        }));
                      }
                    }}
                  ></input>
                </div>
                <Input
                  value={formData2.ImageReference}
                  onChange={(e) =>
                    setFormData2((prev) => ({
                      ...prev,
                      ImageReference: e.target.value,
                    }))
                  }
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
              {isLoading
                ? "Saving..."
                : blogId
                ? "Update Entry"
                : "Publish Entry"}
            </Button>
            {blogId && (
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="w-full py-3"
              >
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
  );
}
