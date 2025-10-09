import Axios, { AxiosResponse } from "axios";
// API Base URLs
const API_BASE = "https://senaviacorp.com/api";
const API_LOCAL = "http://localhost:3000/api";

// Use local API for development, production API for production
export const API = process.env.NODE_ENV === "development" ? API_LOCAL : API_BASE;
// const API = process.env.API_URL;

export const endpoints = {
  service: {
    getAll: `${API}/service`,
  },
  clause: {
    getAll: `${API}/clause`,
    getById: (id: number) => `${API}/clause?id=${id}`,
    create: `${API}/clause`,
    update: (id: number) => `${API}/clause?id=${id}`,
    delete: (id: number) => `${API}/clause?id=${id}`,
    search: (
      term: string,
      isPaginated = false,
      offset = 0,
      itemsPerPage = 10
    ) =>
      `${API}/clause?searchTerm=${encodeURIComponent(
        term
      )}&isPaginated=${isPaginated}&offset=${offset}&itemsPerPage=${itemsPerPage}`,
  },
  contractClause: {
    getByContract: (contractId: number) => `${API}/contract-clause?contractId=${contractId}`,
    link: `${API}/contract-clause`, // POST { contractId, clauseId }
    createAndAttach: `${API}/contract-clause`, // POST { contractId, title, description }
    unlink: (contractId: number, clauseId: number) =>
      `${API}/contract-clause?contractId=${contractId}&clauseId=${clauseId}`, // DELETE
  },

  product: {
    getAll: `${API}/product`,
    getById: (id: number) => `${API}/product?id=${id}`,
    delete: (id: number) => `${API}/product?id=${id}`,
    create: `${API}/product`,
    update: (id: number) => `${API}/product?id=${id}`,
  },

  stripe: {
    createCheckoutSession: `${API}/checkout`,
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
    getPostsByUser: (userId: string | number) => `${API}/lead?userId=${userId}`,
    createPost: `${API}/lead`,
    getLeads: `${API}/lead`,
    getLead: (id: number) => `${API}/lead?id=${id}`,
    createLead: `${API}/lead`,
    updatePost: (id: number) => `${API}/lead?id=${id}`,
    deleteLead: (id: number) => `${API}/lead?id=${id}`,
    ////////////////////////Nuevos endpoints//////////////////////
    createSchedule: `${API}/lead/schedule`,
    getSchedules: (leadId: number) => `${API}/lead/${leadId}/schedules`,
    updateSchedule: (scheduleId: number) =>
      `${API}/lead/schedule?id=${scheduleId}`,
    deleteSchedule: (scheduleId: number) =>
      `${API}/lead/schedule?id=${scheduleId}`,
    creatCalendarEvent: `https://damddev.app.n8n.cloud/webhook/4e962737-09f2-461d-9f4b-5264f424ea39`,
    createMultiGuestCalendarEvent: `https://damddev.app.n8n.cloud/webhook/a2d1235a-74bb-4349-bf50-e041978b11fe`,
  },
  project: {
    getPosts: `${API}/project`,
    getPost: (id: number) => `${API}/project?id=${id}`,
    getPostsByUser: (userId: string | number) =>
      `${API}/project?userId=${userId}`,
    createPost: `${API}/project`,
    updatePost: (id: number) => `${API}/project?id=${id}`,
    deletePost: (id: number) => `${API}/project?id=${id}`,
    getAll: `${API}/project`,
    getById: (id: number) => `${API}/project?id=${id}`,
    create: `${API}/project`,
    update: (id: number) => `${API}/project?id=${id}`,
    remove: (id: number) => `${API}/project?id=${id}`,
  },
  studycases: {
    getPosts: `${API}/studycase`,
    getPost: (id: string | number) => `${API}/studycase?id=${id}`,
    createPost: `${API}/studycase`,
    updatePost: (id: string | number) => `${API}/studycase?id=${id}`,
    deletePost: (id: string | number) => `${API}/studycase?id=${id}`,
    upload: `${API}/studycase/upload`,
  },
  user: {
    getUsers: `${API}/user`,
    getUser: (id: number) => `${API}/user?id=${id}`,
    createUser: `${API}/user`,
    updateUser: `${API}/user`,
    deleteUser: (id: number) => `${API}/user?id=${id}`,
    getRoles: `${API}/role`,
    getPermissions: `${API}/permission`,
  },
  auth: {
    register: `${API}/auth/register-simple`,
  },
  estimate: {
    getEstimates: `${API}/estimate`,
    getEstimate: (id: number) => `${API}/estimate?id=${id}`,
    createEstimate: `${API}/estimate`,
    updateEstimate: (id: number) => `${API}/estimate?id=${id}`,
    deleteEstimate: (id: number) => `${API}/estimate?id=${id}`,
    sendToClient:
      "https://damddev.app.n8n.cloud/webhook/a7bc5d49-a603-4741-9cae-f62bc7ce98d3",
  },
  plan: {
    getPlans: `${API}/plan`,
    getById: (id: number) => `${API}/plan?id=${id}`,
    delete: (id: number) => `${API}/plan?id=${id}`,
    update: (id: number) => `${API}/plan?id=${id}`,
    create: `${API}/plan`,
  },
  cost: {
    createCost: `${API}/cost`,
    deleteCost: (id: number) => `${API}/cost?id=${id}`,
    updateCost: (id: number) => `${API}/cost?id=${id}`,
  },
  payment: {
    getPayments: `${API}/payment`,
    getPayment: (id: number) => `${API}/payment?id=${id}`,
    createPayment: `${API}/payment`,
    deletePayment: (id: number) => `${API}/payment?id=${id}`,
    updatePayment: (id: number) => `${API}/payment?id=${id}`,
  },
  contract: {
    getAllContracts: `${API}/contract`,
    deleteContract: (id: number) => `${API}/contract?id=${id}`,
    createContract: `${API}/contract`,
    updateContract: (id: number) => `${API}/contract?id=${id}`,
    sendEmail: `https://damddev.app.n8n.cloud/webhook-test/29008715-57c9-40c4-abac-6bad9a0d6f9e`,
  },
  docusign: {
    createEnvelope: `${API}/docusign/create-envelope`,
  }
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

      // Siempre mantener withCredentials en true para las llamadas API, excepto para webhooks externos
      const isExternalWebhook =
        url.includes("n8n.cloud") || url.includes("webhook");
      axiosConfig = { ...axiosConfig, withCredentials: !isExternalWebhook };

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
