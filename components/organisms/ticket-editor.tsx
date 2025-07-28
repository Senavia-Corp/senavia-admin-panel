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
import { SupportTicket } from "@/types/support-management";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Blog, ContentJson, BlogTopic } from "@/types/blog-management";

const ticketPlan = [
  { id: 1, name: "BUG", displayName: "Bug" },
  { id: 2, name: "REQUEST", displayName: "Request" },
  { id: 3, name: "REVIEW", displayName: "Review" },
  { id: 4, name: "OTHER", displayName: "Other" },
];
const ticketStatus = [
  { id: 1, name: "PENDING", displayName: "Pending" },
  { id: 2, name: "ASSIGNED", displayName: "Assigned" },
  { id: 3, name: "INPROCESS", displayName: "In Process" },
  { id: 4, name: "UNDERREVIEW", displayName: "Under Review" },
  { id: 5, name: "SOLVED", displayName: "Solved" },
  { id: 6, name: "CLOSED", displayName: "Closed" },
];

interface TicketEditorProps {
  ticketId?: number;
  onBack: () => void;
  onSave: () => void;
}

export function TicketEditor({ ticketId, onBack, onSave }: TicketEditorProps) {
  const [ticket, setBlog] = useState<SupportTicket | null>(null);
  const [themes, setThemes] = useState<BlogTopic[]>([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [ticketData, setticketData] = useState({
    title: "",
    type: "",
    description: "",
    status: "",
  });

/*  useEffect(() => {
    loadThemes();
    if (blogId) {
      loadBlog(blogId);
    }
  }, [blogId]);
*/
  const loadBlog = async (id: number) => {
    try {
     /* const blogData = await BlogManagementService.getBlogById(id);
       if (blogData) {
        setBlog(blogData);
        setticketData2({
          title: blogData.title,
          resume: blogData.resume,
          topic: blogData.topic,
          publicationDate: blogData.publicationDate,
          imageUrl: blogData.imageUrl,

          ContentImageUrl: blogData.imageUrl,
          ImageReference: blogData.ImageReference,
          ImageSubTitle: blogData.ImageSubTitle,
          SubTitle: blogData.SubTitle,
          userId: blogId,
          content: blogData.content,
        });
      }*/
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

  //------- eliminar antes de gitpush console ----------
  const logticketData2 = () => {
    console.log("Contenido de ticketData2:");

    Object.entries(ticketData).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  };
  //  eliminar antes de gitpush console -----------------

  const handleSave = async () => {
    const _ticketData = {
      title: ticketData.title,
      type: ticketData.type,
      status: ticketData.status,
      description: ticketData.description,
    };

    const response = await fetch("http://localhost:3000/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_ticketData),
    });
    
  };

  const handleUpdate = async () => {
const rawTicketData={
  title: ticketData.title,
  type: ticketData.type,
  status: ticketData.status,
  description: ticketData.description,
}
const _ticketData = Object.fromEntries(
    Object.entries(rawTicketData).filter(([_, value]) => 
      value != null && (typeof value !== "string" || value.trim() !== "")
    )
  );
const response =await fetch(`http://localhost:3000/api/ticket?id=${ticketId}`,{
  method:"PATCH",
  body:JSON.stringify(_ticketData),
  headers:{
    "Content-Type": "application/json",
  }
})
}


  

  const handleDelete = async () => {
    if (ticketId) {
      const response = await fetch(
        `http://localhost:3000/api/ticket?id=${ticketId}`,
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
    /* setticketData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));*/
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const _date = String(formatDate(new Date()));

  return (
    <div className="h-full w-screen max-w-none px-6 ">
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
          {ticketId ? "Ticket Editor" : "Ticket Create"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full " >
        {/* Left Column - Content Editor */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4"></div>
          </div>

          {/* Blog Title */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Ticket Title
            </Label>
            <Input
              value={ticketId?ticketData.title:""}
              onChange={(e) => {
                setticketData((prev) => ({ ...prev, title: e.target.value }));
              }}
              placeholder="Write a title"
            />
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Add a description
              </Label>
              <Textarea
                value={ticketData.description}
                onChange={(e) =>
                  setticketData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter a description..."
                rows={6}
              />
            </div>
          </div>
          {/* Type TicketPlan */}
          <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={ticketData.type}
                onValueChange={(value) => {
                  setticketData((prev) => ({ ...prev, type: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {ticketPlan.map((elem) => (
                    <SelectItem key={elem.id} value={elem.name}>
                      {elem.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          {/* Fin Type TicketPlan */}
</div>
          {/* Select Status */}
          <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={ticketData.status}
                onValueChange={(value) => {
                  setticketData((prev) => ({ ...prev, status: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {ticketStatus.map((elem) => (
                    <SelectItem key={elem.id} value={elem.name}>
                      {elem.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          </div>
          {/* Fin  Select Status*/}
        </div>
        {/* Fin Left Column - Metadata */}

        {/* Right Column - Metadata */}
        <div className="w-96 space-y-6 flex-shrink-0">
          {/* Action Buttons */}
          <div className="space-y-3">
            {ticketId ? (
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
              >
                Update Entry
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
              >
                {isLoading
                  ? "Saving..."
                  : ticketId
                  ? "Create Entry"
                  : "Publish Entry"}
              </Button>
            )}

            {ticketId && (
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="w-full py-3"
              >
                Delete Entry
              </Button>
            )}
          </div>
            {/*Fin  Right Column - Metadata */}
        </div>
        <div className="border"></div>

      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${ticketData.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
