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
import type { Blog, ContentJson, BlogTopic } from "@/types/blog-management";
import type { Clause } from "../pages/clause/clause";
import ClauseViewModel from "../pages/clause/ClauseViewModel";

const topics = [
  { id: "1", name: "WEBDESIGN", displayName: "Web Design" },
  { id: "2", name: "DIGITALMARKETING", displayName: "Digital Marketing" },
];

interface EditorProps {
  entityId?: number;
  onBack: () => void;
  onSave: () => void;
}

export function ClauseEditor({ entityId, onBack, onSave }: EditorProps) {
  const [clause, setClause] = useState<Clause | null>(null);
  const [themes, setThemes] = useState<BlogTopic[]>([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const { getClauseById, saveClause } = ClauseViewModel();

  const [jsonData, setJsonData] = useState({
    title: "",
    description: "",
  });
  useEffect(() => {
    if (entityId) {
      handleView(entityId);
    }
  }, [entityId]);

  const handleSave = async () => {
    const payload = {
      title: jsonData.title,
      description: jsonData.description,
    };

    try {
      setIsLoading(true);

      const success = await saveClause(payload, entityId ?? undefined);
      console.log("existe id: " + entityId);
      if (success) {
        console.log("✅ Cláusula guardada correctamente");
        onSave?.(); // usa optional chaining por si onSave no está definido
      } else {
        console.error("❌ Error guardando cláusula:");
      }
    } catch (err) {
      console.error("💥 Error inesperado en handleSave:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (id: number) => {
    setEditingProductId(id);
    const res = await getClauseById(id);
    console.log("soy respuesta: " + res?.title);
    if (res) {
      setJsonData({
        title: res.title,
        description: res.description,
      });
    }
  };

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
      content2: "",
      quote: "",
    },
    userId: "",
  });

  /*useEffect(() => {
    loadThemes();
    if (blogId) {
      loadBlog(blogId);
    }
  }, [blogId]);
*/
  /*const loadBlog = async (id: number) => {
    try {
      const blogData = await BlogManagementService.getBlogById(id);

      if (blogData) {
        setBlog(blogData);
        setFormData({
          title: blogData.title,
          resume: blogData.resume,
          topic: blogData.topic,
          publicationDate: blogData.publicationDate,
          ImageReference: blogData.ImageReference,
          ImageSubTitle: blogData.ImageSubTitle,
          SubTitle: blogData.SubTitle,
          content: blogData.content,
          userId: "1",
        });
      }
    } catch (error) {
      console.error("Error loading blog:", error);
    }
  };
*/
  const loadThemes = async () => {
    try {
      const themesData = await BlogManagementService.getBlogThemes();
      setThemes(themesData);
    } catch (error) {
      console.error("Error loading themes:", error);
    }
  };

  //------- eliminar antes de gitpush console ----------
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
  
  
  

  const handleDelete = async () => {
    if (entityId) {
      const response = await fetch(
        `http://localhost:3000/api/blog?id=${entityId}`,
        {
          method: "DELETE",
        }
      );
    }

    /* if (blogId) {
      try {
        await BlogManagementService.deleteBlog(blogId);
        setShowDeleteDialog(false);
        onBack();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }*/
  };

  const handleContentChange = (field: keyof ContentJson, value: string) => {
    setFormData2((prev) => ({
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
    <div className="flex flex-col">
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
        <h1 className="text-2xl font-bold text-gray-900">
          {entityId ? "Clause Editor" : "Clause Create"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full">
        {/* Left Column - Content Editor */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          {/* Blog Title */}
          <CardTitle className="text-lg">Title</CardTitle>
          <div className="mb-6">
            <Input
              value={entityId && clause ? jsonData.title : jsonData.title}
              onChange={(e) => {
                setJsonData((prev) => ({ ...prev, title: e.target.value }));
              }}
              placeholder="Digite el titulo de su blog"
              className="text-2xl font-bold "
            />
          </div>

          {/* Content Sections */}
          <div className="space-y-6"></div>
        </div>

        {/* Right Column - Metadata */}
        <div className="w-96 bg-white rounded-lg space-y-6 flex-shrink-0 p-4">
          {/* Resume */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={entityId ? jsonData.description : jsonData.description}
                onChange={(e) => {
                  setJsonData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {jsonData.description.length}/200
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {entityId ? (
              <div className="flex justify-center my-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-4"
                >
                  Update Entry
                </Button>
              </div>
            ) : (
              <div className="flex justify-center my-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
                >
                  {isLoading
                    ? "Saving..."
                    : entityId
                    ? "Create Entry"
                    : "Publish Entry"}
                </Button>
              </div>
            )}

            {entityId && (
              <div className="flex justify-end my-4">
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="rounded-full bg-[#C61417] text-white font-bold text-base items-center py-2 px-4"
                >
                  Delete Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${jsonData.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
