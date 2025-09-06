"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import type { TestimonialVideo } from "@/types/testimonial-video-management";

type Props = {
  item: TestimonialVideo | null;
  onSave: (data: Partial<TestimonialVideo> & { title: string }) => void;
};

export function TestimonialVideoEditor({ item, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    setTitle(item?.title ?? "");
    setResume(item?.resume ?? "");
    setVideoUrl(item?.videoUrl ?? "");
  }, [item?.id]);

  const isEditing = useMemo(() => Boolean(item?.id), [item?.id]);

  const handleSave = () => {
    const payload = {
      ...(item?.id && { id: item.id }),
      title,
      resume,
      videoUrl,
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

            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Resume
            </Label>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={5}
              maxLength={200}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {resume.length}/200
            </div>

            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Video URL
              </Label>
              <Input
                type="url"
                placeholder="Here put the video URL https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mb-4"
              />

              {/* Guía paso a paso para obtener el src de YouTube */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                <h4 className="font-semibold text-gray-800 mb-2">
                  📋 Cómo obtener la URL del video de YouTube:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Ve al video en YouTube que quieres usar</li>
                  <li>Haz clic en el botón "Compartir" debajo del video</li>
                  <li>Selecciona "Insertar" en las opciones que aparecen</li>
                  <li>
                    Copia la URL que aparece en el campo src (entre comillas)
                  </li>
                  <li>Pega la URL completa en el campo de arriba</li>
                </ol>
                <p className="mt-2 text-xs text-gray-500">
                  💡 Ejemplo: https://www.youtube.com/embed/VIDEO_ID
                </p>
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
