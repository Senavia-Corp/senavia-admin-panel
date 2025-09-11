export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  imageUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  active: boolean;
  color?: string;
}

export interface UserRequest {
  id: string;
  userId: string;
  name: string;
  service: "Web Design" | "Web Development" | "Digital Marketing";
  companyPlan: string;
  description: string;
  status: "Send" | "Processing" | "Estimating" | "Finished";
  workTeam?: WorkTeam;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProject {
  id: string;
  userId: string;
  name: string;
  backgroundImage: string;
  status: "In Progress" | "Completed";
  phase: "Analysis" | "Design" | "Development" | "Deploy";
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  description: string;
  documents: ProjectDocument[];
  createdAt: Date;
  createdBy: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface WorkTeam {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profileImage?: File;
  roleId: number;
}
