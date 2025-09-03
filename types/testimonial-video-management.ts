export interface TestimonialVideo {
  id: string;
  title: string;
  resume?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTestimonialVideoData {
  title: string;
  resume?: string;
}

export interface UpdateTestimonialVideoData {
  title?: string;
  resume?: string;
}
