import type {
  TestimonialVideo,
  CreateTestimonialVideoData,
  UpdateTestimonialVideoData,
} from "@/types/testimonial-video-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

export class TestimonialVideoManagementService {
  static async getTestimonialVideos(
    search?: string
  ): Promise<TestimonialVideo[]> {
    try {
      const response = await Axios.get(endpoints.studycases.getPosts, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching study cases");
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
      console.error("Error fetching study cases:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener casos de estudio. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async getTestimonialVideoById(
    id: string | number
  ): Promise<TestimonialVideo | null> {
    try {
      const response = await Axios.get(endpoints.studycases.getPost(id), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching Testimonial Video");
      }

      return response.data.data[0] || null;
    } catch (error: any) {
      console.error("Error fetching study case:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener el caso de estudio. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async createTestimonialVideo(
    videoData: CreateTestimonialVideoData
  ): Promise<TestimonialVideo> {
    try {
      // Add potentially required fields that backend might expect
      const payload = {
        ...videoData,
        // Add userId if backend requires it (like in blog example)
        userId: "1", // Default user ID, you might want to get this from auth context
      };

      console.log("Creating study case with data:", videoData);
      console.log("Enhanced payload:", payload);
      console.log("Endpoint URL:", endpoints.studycases.createPost);
      console.log("JSON payload:", JSON.stringify(payload));

      const response = await fetch(endpoints.studycases.createPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (!data.success) {
        throw new Error(data.message || "Error creating study case");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error creating study case:", error);
      throw error;
    }
  }

  static async updateTestimonialVideo(
    id: string | number,
    updates: UpdateTestimonialVideoData
  ): Promise<TestimonialVideo | null> {
    try {
      const response = await fetch(endpoints.studycases.updatePost(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error updating study case");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error updating study case:", error);
      throw error;
    }
  }

  static async deleteTestimonialVideo(id: string | number): Promise<boolean> {
    try {
      const response = await fetch(endpoints.studycases.deletePost(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error deleting study case");
      }

      return true;
    } catch (error) {
      console.error("Error deleting study case:", error);
      throw error;
    }
  }

  static async uploadVideo(
    file: File
  ): Promise<{ fileName: string; url?: string }> {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(endpoints.studycases.upload, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

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
