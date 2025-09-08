import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import { Project, ProjectApiResponse, ApiResponse } from "./project";

export interface ProjectViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
}

export const ProjectViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
}: ProjectViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Para GET by ID
  useEffect(() => {
    // Cargar datos al montar.
    const getProjects = async () => {
      const { response, status, errorLogs } = await fetchData<any>(
        endpoints.project.getAll,
        "get"
      );
    };
    getProjects();
  }, []);

  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginated, offset, itemsPerPage]);

  const getAllProjects = async () => {
    
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());
      const url = `${endpoints.project.getAll}${
        params.toString() ? `?${params.toString()}` : ""
      }`;    

      if (isPaginated) {
        const { response, status, errorLogs } =
          await fetchData<ProjectApiResponse>(url, "get");
        if (status === 200 && response && response.success) {
          setProjects(response.data);
          setPageInfo(response.page);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch blog posts (Status: ${status})`;
          setError(errorMessage);
          setProjects([]);
          setPageInfo(null);
        }
      } else {
        const { response, status, errorLogs } = await fetchData<
          ApiResponse<Project>
        >(url, "get");
        if (status === 200 && response && response.success) {
          setProjects(response.data);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch blog posts (Status: ${status})`;
          setError(errorMessage);
          setProjects([]);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        "An unexpected error occurred while fetching blog posts.";
      setError(errorMessage);
      setProjects([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };
  // Nuevo: Obtener proyecto por ID
  const getProjectById = async (id: number) => {    
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.project.getById(id);
      console.log("Soy url: "+url)
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Project>
      >(url, "get");
console.log("Respuesta completa:", response);

      if (status === 200 && response?.success) {
        setSelectedProject(response.data[0]);
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch project with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        setSelectedProject(null);
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage || `An unexpected error occurred while fetching project with ID ${id}.`;
      setError(errorMessage);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };
  return { projects, loading, error, pageInfo,getProjectById, selectedProject  };
};

export default ProjectViewModel;
