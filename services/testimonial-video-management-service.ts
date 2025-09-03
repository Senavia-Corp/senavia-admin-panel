import type {
  TestimonialVideo,
  CreateTestimonialVideoData,
  UpdateTestimonialVideoData,
} from "@/types/testimonial-video-management";
import Axios from "axios";

export class TestimonialVideoManagementService {
  static async getTestimonialVideos(
    search?: string
  ): Promise<TestimonialVideo[]> {
    try {
      const response = await Axios.get(
        "http://localhost:3000/api/testimonial-video",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching testimonial videos"
        );
      }

      let testimonialVideos = response.data.data;

      // Apply client-side filtering if needed
      if (search) {
        testimonialVideos = testimonialVideos.filter(
          (video: TestimonialVideo) =>
            video.title?.toLowerCase().includes(search.toLowerCase()) ||
            video.resume?.toLowerCase().includes(search.toLowerCase())
        );
      }

      return testimonialVideos;
    } catch (error: any) {
      console.error("Error fetching testimonial videos:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener videos testimoniales. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async getTestimonialVideoById(
    id: string
  ): Promise<TestimonialVideo | null> {
    try {
      const response = await Axios.get(
        `http://localhost:3000/api/testimonial-video?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching testimonial video"
        );
      }

      return response.data.data[0] || null;
    } catch (error: any) {
      console.error("Error fetching testimonial video:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener el video testimonial. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async createTestimonialVideo(
    videoData: CreateTestimonialVideoData
  ): Promise<TestimonialVideo> {
    try {
      const response = await fetch(
        "http://localhost:3000/api/testimonial-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error creating testimonial video");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error creating testimonial video:", error);
      throw error;
    }
  }

  static async updateTestimonialVideo(
    id: string,
    updates: UpdateTestimonialVideoData
  ): Promise<TestimonialVideo | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/testimonial-video?id=${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error updating testimonial video");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error updating testimonial video:", error);
      throw error;
    }
  }

  static async deleteTestimonialVideo(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/testimonial-video?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error deleting testimonial video");
      }

      return true;
    } catch (error) {
      console.error("Error deleting testimonial video:", error);
      throw error;
    }
  }

  static async uploadVideo(
    file: File
  ): Promise<{ fileName: string; url?: string }> {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(
        "http://localhost:3000/api/testimonial-video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error uploading video");
      }

      return data.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  }
}
