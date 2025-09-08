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
            video &&
            video.id &&
            (video.title?.toLowerCase().includes(search.toLowerCase()) ||
              video.resume?.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filter out any invalid items
      return testimonialVideos.filter((video: any) => video && video.id);
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
        throw new Error(
          response.data.message || "Error fetching Testimonial Video"
        );
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
      console.log("Server response for create:", JSON.stringify(data, null, 2));
      console.log("data.success:", data.success);
      console.log("data.data exists:", !!data.data);
      console.log("data.id exists:", !!data.id);

      if (!data.success) {
        throw new Error(data.message || "Error creating study case");
      }

      // Handle different response formats
      let createdVideo;
      console.log("Starting response format detection...");

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Format: { success: true, data: [video] }
        console.log("Using format 1: array data");
        createdVideo = data.data[0];
      } else if (data.data && typeof data.data === "object" && data.data.id) {
        // Format: { success: true, data: video }
        console.log("Using format 2: object data");
        createdVideo = data.data;
      } else if (data.id) {
        // Format: { success: true, id: "...", title: "...", ... }
        console.log("Using format 3: root level data");
        createdVideo = data;
      } else {
        console.error("Unexpected response format:", data);
        console.error("data.data:", data.data);
        console.error("typeof data.data:", typeof data.data);
        console.error("Array.isArray(data.data):", Array.isArray(data.data));
        console.error("data.data?.length:", data.data?.length);

        // Temporary fallback - try to use the entire data object if it has an id
        if (data && typeof data === "object") {
          console.log("Using fallback: entire data object");
          console.log("Fallback data keys:", Object.keys(data));
          createdVideo = data;
        } else {
          console.error("No fallback possible - data is not an object");
          throw new Error("Invalid response: no data returned from server");
        }
      }

      if (!createdVideo || !createdVideo.id) {
        console.error("Created video missing ID:", createdVideo);
        console.error(
          "Full createdVideo object:",
          JSON.stringify(createdVideo, null, 2)
        );
        throw new Error("Invalid response: created video has no ID");
      }

      return createdVideo;
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
      console.log("Server response for update:", JSON.stringify(data, null, 2));

      if (!data.success) {
        throw new Error(data.message || "Error updating study case");
      }

      // Handle different response formats
      let updatedVideo;

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Format: { success: true, data: [video] }
        updatedVideo = data.data[0];
      } else if (data.data && typeof data.data === "object" && data.data.id) {
        // Format: { success: true, data: video }
        updatedVideo = data.data;
      } else if (data.id) {
        // Format: { success: true, id: "...", title: "...", ... }
        updatedVideo = data;
      } else {
        console.error("Unexpected response format:", data);
        console.error("data.data:", data.data);
        console.error("typeof data.data:", typeof data.data);
        console.error("Array.isArray(data.data):", Array.isArray(data.data));
        console.error("data.data?.length:", data.data?.length);

        // Temporary fallback - try to use the entire data object if it has an id
        if (data && typeof data === "object") {
          console.log("Attempting to use entire data object as fallback");
          updatedVideo = data;
        } else {
          throw new Error("Invalid response: no data returned from server");
        }
      }

      if (!updatedVideo || !updatedVideo.id) {
        console.error("Updated video missing ID:", updatedVideo);
        console.error(
          "Full updatedVideo object:",
          JSON.stringify(updatedVideo, null, 2)
        );
        throw new Error("Invalid response: updated video has no ID");
      }

      return updatedVideo;
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
}
