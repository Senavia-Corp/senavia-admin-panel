import { useState, useCallback } from "react";
import {
  mockRequests,
  mockProjects,
} from "../components/organisms/dashboard/mockData";

// Simula un fetch a una API con delay
function fakeFetch(data: any, delay = 600): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// Helper para transformar mensajes mock a formato ProfileChat
function toDisplayMessage(msg: any, idx: number): any {
  return {
    id: msg.id || String(idx) + "-" + Math.random().toString(36).slice(2),
    content: msg.text || msg.content,
    role:
      msg.from === "user"
        ? "user"
        : msg.from === "admin"
        ? "assistant"
        : msg.role || "user",
    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
  };
}

export function useTestPortfolioData() {
  // Listados principales
  const [requests, setRequests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Selección
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Detalles y subdatos de request
  const [requestDetail, setRequestDetail] = useState<any | null>(null);
  const [requestChat, setRequestChat] = useState<any[]>([]);
  const [requestEstimate, setRequestEstimate] = useState<any | null>(null);
  const [requestInvoice, setRequestInvoice] = useState<any | null>(null);
  const [loadingRequestDetail, setLoadingRequestDetail] = useState(false);
  const [loadingRequestChat, setLoadingRequestChat] = useState(false);
  const [loadingRequestEstimate, setLoadingRequestEstimate] = useState(false);
  const [loadingRequestInvoice, setLoadingRequestInvoice] = useState(false);

  // Detalles y subdatos de project
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectChat, setProjectChat] = useState<any[]>([]);
  const [loadingProjectDetail, setLoadingProjectDetail] = useState(false);
  const [loadingProjectChat, setLoadingProjectChat] = useState(false);

  // Estado compartido para EstimatedValue e Invoice SOLO para la request seleccionada
  const [estimateOpenStates, setEstimateOpenStates] = useState<boolean[]>([
    false,
  ]);
  const [estimateShowDeclineReasons, setEstimateShowDeclineReasons] = useState<
    boolean[]
  >([false]);
  const [estimateDeclineMessages, setEstimateDeclineMessages] = useState<
    string[]
  >([""]);
  const [invoiceOpenStates, setInvoiceOpenStates] = useState<boolean[]>([
    false,
  ]);

  // Estado para la tab activa del chat
  const [chatTab, setChatTab] = useState<string>("Chat");

  // --- Métodos de "fetch" ---
  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    const data = await fakeFetch(mockRequests);
    setRequests(data);
    setLoadingRequests(false);
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    const data = await fakeFetch(mockProjects);
    setProjects(data);
    setLoadingProjects(false);
  }, []);

  const fetchRequestDetail = useCallback(async (id: string) => {
    setLoadingRequestDetail(true);
    const req = mockRequests.find((r) => r.id === id);
    const data = await fakeFetch(req);
    setRequestDetail(data);
    setLoadingRequestDetail(false);
  }, []);

  const fetchRequestChat = useCallback(async (id: string) => {
    setLoadingRequestChat(true);
    const req = mockRequests.find((r) => r.id === id);
    const data = await fakeFetch(req?.chat || []);
    setRequestChat((data as any[]).map(toDisplayMessage));
    setLoadingRequestChat(false);
  }, []);

  const fetchRequestEstimate = useCallback(async (id: string) => {
    setLoadingRequestEstimate(true);
    const req = mockRequests.find((r) => r.id === id);
    const data = await fakeFetch(req?.estimate || null);
    setRequestEstimate(data);
    setEstimateOpenStates([false]);
    setEstimateShowDeclineReasons([false]);
    setEstimateDeclineMessages([""]);
    setLoadingRequestEstimate(false);
  }, []);

  const fetchRequestInvoice = useCallback(async (id: string) => {
    setLoadingRequestInvoice(true);
    const req = mockRequests.find((r) => r.id === id);
    const data = await fakeFetch(req?.invoice || null);
    setRequestInvoice(data);
    setInvoiceOpenStates([false]);
    setLoadingRequestInvoice(false);
  }, []);

  const fetchProjectDetail = useCallback(async (id: string) => {
    setLoadingProjectDetail(true);
    const proj = mockProjects.find((p) => p.id === id);
    const data = await fakeFetch(proj);
    setProjectDetail(data);
    setLoadingProjectDetail(false);
  }, []);

  const fetchProjectChat = useCallback(async (id: string) => {
    setLoadingProjectChat(true);
    const proj = mockProjects.find((p) => p.id === id);
    const data = await fakeFetch(proj?.chat || []);
    setProjectChat((data as any[]).map(toDisplayMessage));
    setLoadingProjectChat(false);
  }, []);

  // Limpieza de detalles al cambiar selección
  const clearRequestData = useCallback(() => {
    setRequestDetail(null);
    setRequestChat([]);
    setRequestEstimate(null);
    setRequestInvoice(null);
    setEstimateOpenStates([false]);
    setEstimateShowDeclineReasons([false]);
    setEstimateDeclineMessages([""]);
    setInvoiceOpenStates([false]);
  }, []);
  const clearProjectData = useCallback(() => {
    setProjectDetail(null);
    setProjectChat([]);
  }, []);

  // Handler para enviar mensaje al chat (simula respuesta automática)
  const handleSendMessageRequest = useCallback(
    (message: string) => {
      const newMsg = toDisplayMessage(
        { from: "user", text: message },
        Date.now()
      );
      if (selectedRequest) {
        setRequestChat((prev) => [...prev, newMsg]);
        setTimeout(() => {
          setRequestChat((prev) => [
            ...prev,
            toDisplayMessage(
              { from: "admin", text: `Respuesta automática a: ${message}` },
              Date.now()
            ),
          ]);
        }, 800);
      } else if (selectedProject) {
        setProjectChat((prev) => [...prev, newMsg]);
        setTimeout(() => {
          setProjectChat((prev) => [
            ...prev,
            toDisplayMessage(
              { from: "admin", text: `Respuesta automática a: ${message}` },
              Date.now()
            ),
          ]);
        }, 800);
      }
    },
    [selectedRequest, selectedProject]
  );

  // Handler para cargar historial de chat (simula paginación, aquí solo repite el mock)
  const handleRequestHistoryLoad = useCallback(() => {
    // Simula cargar más mensajes antiguos (no implementado, solo ejemplo)
    // Podrías agregar mensajes al principio del array si tuvieras paginación real
  }, []);

  return {
    // Listados
    requests,
    projects,
    loadingRequests,
    loadingProjects,
    fetchRequests,
    fetchProjects,
    setLoadingRequests,
    setLoadingProjects,
    // Selección
    selectedRequest,
    setSelectedRequest,
    selectedProject,
    setSelectedProject,
    // Request detail y subdatos
    requestDetail,
    requestChat,
    requestEstimate,
    requestInvoice,
    loadingRequestDetail,
    loadingRequestChat,
    loadingRequestEstimate,
    loadingRequestInvoice,
    fetchRequestDetail,
    fetchRequestChat,
    fetchRequestEstimate,
    fetchRequestInvoice,
    setLoadingRequestDetail,
    // Project detail y subdatos
    projectDetail,
    projectChat,
    loadingProjectDetail,
    loadingProjectChat,
    fetchProjectDetail,
    fetchProjectChat,
    setLoadingProjectDetail,
    // Estado compartido para EstimatedValue e Invoice
    estimateOpenStates,
    setEstimateOpenStates,
    estimateShowDeclineReasons,
    setEstimateShowDeclineReasons,
    estimateDeclineMessages,
    setEstimateDeclineMessages,
    invoiceOpenStates,
    setInvoiceOpenStates,
    chatTab,
    setChatTab,
    clearRequestData,
    clearProjectData,
    handleSendMessageRequest,
    handleRequestHistoryLoad,
  };
}
