"use client";

import { useEffect, useState } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { TestimonialVideoEditor } from "@/components/organisms/testimonial-video-editor";
import { TestimonialVideoManagementService } from "@/services/testimonial-video-management-service";
import type { TestimonialVideo } from "@/types/testimonial-video-management";

export function TestimonialVideosPage() {
  const [items, setItems] = useState<TestimonialVideo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonialVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const videos =
        await TestimonialVideoManagementService.getTestimonialVideos();
      setItems(videos);
    } catch (err: any) {
      setError(err.message || "Error loading testimonial videos");
      console.error("Error loading testimonial videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonialVideos();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
  };

  const handleView = (item: TestimonialVideo) => {
    setEditingId(item.id);
  };

  const handleDelete = async (item: TestimonialVideo) => {
    try {
      await TestimonialVideoManagementService.deleteTestimonialVideo(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (editingId === item.id) {
        setEditingId(null);
      }
    } catch (err: any) {
      setError(err.message || "Error deleting testimonial video");
      console.error("Error deleting testimonial video:", err);
    }
  };

  const handlers = {
    onCreate: handleCreate,
    onView: handleView,
    onDelete: handleDelete,
    onSearch: (_: string) => {},
    onFilter: (_: string) => {},
  };

  const selectedItem = editingId
    ? items.find((x) => x.id === editingId) ?? null
    : null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Study Cases
            </h1>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {loading && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                Loading testimonial videos...
              </div>
            )}
            <div className="flex-1 min-h-0 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-h-0">
                {GeneralTable(
                  "testimonial-videos-page",
                  "Add Case",
                  "Description",
                  "All Cases",
                  "Description",
                  ["Case ID", "Title", "Actions"],
                  items,
                  handlers
                )}
              </div>
              <div className="min-h-0">
                <TestimonialVideoEditor
                  item={selectedItem}
                  onSave={async (data) => {
                    try {
                      if (!data.id || !items.some((x) => x.id === data.id)) {
                        // Create new testimonial video
                        const createData = {
                          title: data.title,
                          resume: data.resume,
                        };

                        const newVideo =
                          await TestimonialVideoManagementService.createTestimonialVideo(
                            createData
                          );
                        setItems((prev) => [...prev, newVideo]);
                        setEditingId(newVideo.id);
                      } else {
                        // Update existing testimonial video
                        const updateData = {
                          title: data.title,
                          resume: data.resume,
                        };

                        const updatedVideo =
                          await TestimonialVideoManagementService.updateTestimonialVideo(
                            data.id,
                            updateData
                          );
                        if (updatedVideo) {
                          setItems((prev) =>
                            prev.map((x) =>
                              x.id === data.id ? updatedVideo : x
                            )
                          );
                        }
                      }
                    } catch (err: any) {
                      setError(err.message || "Error saving testimonial video");
                      console.error("Error saving testimonial video:", err);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
