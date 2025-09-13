import Axios, { AxiosResponse } from "axios";
// API Base URLs
const API_BASE = "https://senaviacorp.com/api";
const API_LOCAL = "http://localhost:3000/api";

// Use local API for development, production API for production
//const API = process.env.NODE_ENV === "development" ? API_LOCAL : API_BASE;
const API = "http://localhost:3000/api";

export const endpoints = {
  service:{
    getAll:`${API}/service`,
  },

  product:{
    getAll:`${API}/product`,
    getById: (id: number) => `${API}/product?id=${id}`,
    delete:(id: number) => `${API}/product?id=${id}`,
    create:`${API}/product`,
    update: (id: number) => `${API}/product?id=${id}`
  },

  blog: {
    getPosts: `${API}/blog`,
    getPost: (id: number) => `${API}/blog?id=${id}`,
    createPost: `${API}/blog`,
    updatePost: (id: number) => `${API}/blog?id=${id}`,
    deletePost: (id: number) => `${API}/blog?id=${id}`,
  },
  ticket: {
    getTickets: `${API}/ticket`,
    createTicket: `${API}/ticket`,
    updateTicket: (id: number) => `${API}/ticket?id=${id}`,
    deleteTicket: (id: number) => `${API}/ticket?id=${id}`,
  },
  lead: {
    getPosts: `${API}/lead`,
    getPost: (id: number) => `${API}/lead?id=${id}`,
    createPost: `${API}/lead`,
    updatePost: (id: number) => `${API}/lead?id=${id}`,
    deletePost: (id: number) => `${API}/lead?id=${id}`,
  },
  project: {    
    getAll: `${API}/project`,
    getById: (id: number) => `${API}/project?id=${id}`,
    create: `${API}/project`,
    update: (id: number) => `${API}/project?id=${id}`,
    remove: (id: number) => `${API}/project?id=${id}`,
  },
};

// Header configurations
const CONFIG_JSON = {
  headers: {
    accept: "/",
    "Content-Type": "application/json",
    // Asegurarse de que las credenciales se envíen siempre
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
};

const CONFIG_FORM = {
  headers: {
    accept: "/",
    "Content-Type": "multipart/form-data",
  },
};

export interface FetchResponse<T> {
  response: T | null;
  loading: boolean;
  status: number | null;
  errorLogs: any;
}

export const useFetch = () => {
  const configTypes: Record<string, object> = {
    json: CONFIG_JSON,
    form: CONFIG_FORM,
    // token: CONFIG_FORM_TOKEN,
  };

  type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

  const isValidHttpMethod = (method: string): method is HttpMethod => {
    return ["get", "post", "put", "delete", "patch"].includes(method);
  };

  /**
   * Function to make HTTP requests using Axios
   * @param {string} url - Endpoint URL
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
   * @param {object|null} body - Data to send in the request (optional)
   * @param {string} typeConfig - Configuration type ("json" or "form")
   * @param {object|null} formFiles - Files to send in the form (optional)
   * @param {boolean} withCredentials - Whether to send cookies (optional)
   * @returns {Promise<FetchResponse<T>>} - Object with response, loading state, status code and errors
   */
  const fetchData = async <T>(
    url: string,
    method: string,
    body: object | null = null,
    typeConfig: "json" | "form" = "json",
    withCredentials: boolean = false, // <-- Move withCredentials here
    formFiles?: object // <-- Make formFiles last and optional
  ): Promise<FetchResponse<T>> => {
    let response: T | null = null;
    let loading = true;
    let status: number | null = null;
    let errorLogs: any = null;

    try {
      let axiosConfig = { ...configTypes[typeConfig] };

      if (formFiles) {
        axiosConfig = { ...axiosConfig, data: formFiles };
      }

      // Siempre mantener withCredentials en true para las llamadas API
      axiosConfig = { ...axiosConfig, withCredentials: true };

      if (isValidHttpMethod(method)) {
        const res: AxiosResponse<T> = await Axios[method](
          url,
          body ?? {},
          axiosConfig
        );
        response = res.data;
        status = res.status;
      } else {
        throw new Error(`Método HTTP no válido: ${method}`);
      }
    } catch (error: any) {
      if (Axios.isCancel(error)) {
        console.log("Request canceled by Axios");
      } else {
        console.error("Error in request:", error);
        try {
        } catch (error) {
          console.error("Error in toast:", error);
        }
        status = error.response ? error.response.status : 500;
        response = error.response?.data;
        errorLogs = error.response ? error.response.data : "Unknown error";
      }
    } finally {
      loading = false;
    }

    return { response, loading, status, errorLogs };
  };

  return { fetchData };
};
