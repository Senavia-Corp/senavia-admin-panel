"use client";

import { useEffect, useState } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { TestimonialVideoEditor } from "@/components/organisms/testimonial-video-editor";
import { TestimonialVideoManagementService } from "@/services/testimonial-video-management-service";
import type { TestimonialVideo } from "@/types/testimonial-video-management";

export function TestimonialVideosPage() {
  const [items, setItems] = useState<TestimonialVideo[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonialVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const videos =
        await TestimonialVideoManagementService.getTestimonialVideos();
      // Ensure all videos have valid IDs
      const validVideos = videos.filter((video) => video && video.id);
      setItems(validVideos);
    } catch (err: any) {
      setError(err.message || "Error loading study cases");
      console.error("Error loading study cases:", err);
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
      setError(err.message || "Error deleting study case");
      console.error("Error deleting study case:", err);
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
              Testimonial Videos
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
                  "Add Testimonial",
                  "Description",
                  "All Testimonial",
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
                      if (
                        !data.id ||
                        data.id === "" ||
                        !items.some((x) => x.id === data.id)
                      ) {
                        // Create new study case
                        const createData = {
                          title: data.title,
                          resume: data.resume,
                          videoUrl: data.videoUrl,
                        };

                        const newVideo =
                          await TestimonialVideoManagementService.createTestimonialVideo(
                            createData
                          );
                        if (newVideo && newVideo.id) {
                          setItems((prev) => [...prev, newVideo]);
                          setEditingId(newVideo.id);
                        } else {
                          throw new Error(
                            "Failed to create testimonial video - invalid response"
                          );
                        }
                      } else {
                        // Update existing study case
                        const updateData = {
                          title: data.title,
                          resume: data.resume,
                          videoUrl: data.videoUrl,
                        };

                        const updatedVideo =
                          await TestimonialVideoManagementService.updateTestimonialVideo(
                            data.id,
                            updateData
                          );
                        if (updatedVideo && updatedVideo.id) {
                          setItems((prev) =>
                            prev.map((x) =>
                              x.id === data.id ? updatedVideo : x
                            )
                          );
                        } else {
                          throw new Error(
                            "Failed to update testimonial video - invalid response"
                          );
                        }
                      }
                    } catch (err: any) {
                      setError(err.message || "Error saving study case");
                      console.error("Error saving study case:", err);
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
