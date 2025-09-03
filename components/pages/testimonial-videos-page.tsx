"use client";

import { useEffect, useState } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { TestimonialVideoEditor } from "@/components/organisms/testimonial-video-editor";

type TestimonialVideo = {
  id: number;
  title: string;
  resume?: string;
  createdAt: Date;
};

export function TestimonialVideosPage() {
  const [items, setItems] = useState<TestimonialVideo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // TODO: replace with real service
    const seed: TestimonialVideo[] = [
      { id: 1, title: "Example testimonial", createdAt: new Date() },
    ];
    setItems(seed);
  }, []);

  const handleCreate = () => {
    setEditingId(null);
  };
  const handleView = (item: TestimonialVideo) => {
    setEditingId(item.id);
  };
  const handleDelete = (item: TestimonialVideo) => {
    // TODO: hook up delete API
    setItems((prev) => prev.filter((x) => x.id !== item.id));
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
                  onSave={(data) => {
                    if (!data.id || !items.some((x) => x.id === data.id)) {
                      const nextId =
                        items.length > 0
                          ? Math.max(...items.map((x) => x.id)) + 1
                          : 1;
                      setItems((prev) => [
                        ...prev,
                        {
                          id: nextId,
                          title: data.title,
                          resume: data.resume,
                          createdAt: new Date(),
                        },
                      ]);
                      setEditingId(nextId);
                    } else {
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === data.id
                            ? { ...x, title: data.title, resume: data.resume }
                            : x
                        )
                      );
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
