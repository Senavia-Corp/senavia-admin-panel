"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type TestimonialVideo = {
  id: number;
  title: string;
  resume?: string;
  createdAt: Date;
  videoFileName?: string;
};

type Props = {
  item: TestimonialVideo | null;
  onSave: (data: Omit<TestimonialVideo, "createdAt"> & { video?: File | null }) => void;
};

export function TestimonialVideoEditor({ item, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    setTitle(item?.title ?? "");
    setResume(item?.resume ?? "");
    setVideo(null);
  }, [item?.id]);

  const isEditing = useMemo(() => Boolean(item?.id), [item?.id]);

  const handleSave = () => {
    const payload = {
      id: item?.id ?? 0,
      title,
      resume,
      video,
    };
    onSave(payload);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 flex w-full h-full">
      <div className="flex-1 bg-white rounded-lg p-6">
        <Card className="bg-white border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Case Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Write a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />

            <Label className="text-sm font-medium text-gray-700 mb-2 block">Resume</Label>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={5}
              maxLength={200}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">{resume.length}/200</div>

            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Video</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">Drag and drop a video here</p>
                <span className="text-gray-500 mb-2 block">or</span>
                <label className="cursor-pointer rounded-full bg-[#99CC33] text-white font-bold text-xs py-2 px-4 inline-block">
                  Upload from my Computer
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      setVideo(files && files.length > 0 ? files[0] : null);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSave}
                className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-6"
              >
                {isEditing ? "Update Entry" : "Publish Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


