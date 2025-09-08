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

// Hook genérico para manejar loading states
function useLoadingStates(initialStates: Record<string, boolean>) {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { loadingStates, setLoading };
}

export function useTestPortfolioData() {
  // Estados consolidados
  const [data, setData] = useState({
    requests: [] as any[],
    projects: [] as any[],
    selectedRequest: null as string | null,
    selectedProject: null as string | null,
    requestDetail: null as any,
    requestChat: [] as any[],
    requestEstimate: null as any,
    requestInvoice: null as any,
    projectDetail: null as any,
    projectChat: [] as any[],
    chatTab: "Chat" as string,
  });

  // Loading states consolidados
  const { loadingStates, setLoading } = useLoadingStates({
    requests: false,
    projects: false,
    requestDetail: false,
    requestChat: false,
    requestEstimate: false,
    requestInvoice: false,
    projectDetail: false,
    projectChat: false,
  });

  // Estados para EstimatedValue e Invoice
  const [estimateStates, setEstimateStates] = useState({
    openStates: [false],
    showDeclineReasons: [false],
    declineMessages: [""],
  });

  const [invoiceStates, setInvoiceStates] = useState({
    openStates: [false],
  });

  // Helper genérico para fetch
  const fetchData = useCallback(
    async (
      loadingKey: string,
      dataKey: string,
      mockData: any[],
      id?: string,
      transform?: (data: any) => any
    ) => {
      setLoading(loadingKey, true);
      try {
        let result;
        if (id) {
          const item = mockData.find((item) => item.id === id);
          result = await fakeFetch(item);
        } else {
          result = await fakeFetch(mockData);
        }

        const finalResult = transform ? transform(result) : result;
        setData((prev) => ({ ...prev, [dataKey]: finalResult }));
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [setLoading]
  );

  // Métodos de fetch simplificados
  const fetchRequests = useCallback(
    () => fetchData("requests", "requests", mockRequests),
    [fetchData]
  );

  const fetchProjects = useCallback(
    () => fetchData("projects", "projects", mockProjects),
    [fetchData]
  );

  const fetchRequestDetail = useCallback(
    (id: string) =>
      fetchData("requestDetail", "requestDetail", mockRequests, id),
    [fetchData]
  );

  const fetchRequestChat = useCallback(
    (id: string) =>
      fetchData("requestChat", "requestChat", mockRequests, id, (data) =>
        (data?.chat || []).map(toDisplayMessage)
      ),
    [fetchData]
  );

  const fetchRequestEstimate = useCallback(
    (id: string) => {
      fetchData(
        "requestEstimate",
        "requestEstimate",
        mockRequests,
        id,
        (data) => data?.estimate || null
      );
      setEstimateStates({
        openStates: [false],
        showDeclineReasons: [false],
        declineMessages: [""],
      });
    },
    [fetchData]
  );

  const fetchRequestInvoice = useCallback(
    (id: string) => {
      fetchData(
        "requestInvoice",
        "requestInvoice",
        mockRequests,
        id,
        (data) => data?.invoice || null
      );
      setInvoiceStates({ openStates: [false] });
    },
    [fetchData]
  );

  const fetchProjectDetail = useCallback(
    (id: string) =>
      fetchData("projectDetail", "projectDetail", mockProjects, id),
    [fetchData]
  );

  const fetchProjectChat = useCallback(
    (id: string) =>
      fetchData("projectChat", "projectChat", mockProjects, id, (data) =>
        (data?.chat || []).map(toDisplayMessage)
      ),
    [fetchData]
  );

  // Limpieza de detalles al cambiar selección
  const clearRequestData = useCallback(() => {
    setData((prev) => ({
      ...prev,
      requestDetail: null,
      requestChat: [],
      requestEstimate: null,
      requestInvoice: null,
    }));
    setEstimateStates({
      openStates: [false],
      showDeclineReasons: [false],
      declineMessages: [""],
    });
    setInvoiceStates({ openStates: [false] });
  }, []);

  const clearProjectData = useCallback(() => {
    setData((prev) => ({
      ...prev,
      projectDetail: null,
      projectChat: [],
    }));
  }, []);

  // Handler para enviar mensaje al chat (simula respuesta automática)
  const handleSendMessageRequest = useCallback(
    (message: string) => {
      const newMsg = toDisplayMessage(
        { from: "user", text: message },
        Date.now()
      );

      const isRequest = !!data.selectedRequest;
      const chatKey = isRequest ? "requestChat" : "projectChat";

      setData((prev) => ({
        ...prev,
        [chatKey]: [...prev[chatKey], newMsg],
      }));

      setTimeout(() => {
        setData((prev) => ({
          ...prev,
          [chatKey]: [
            ...prev[chatKey],
            toDisplayMessage(
              { from: "admin", text: `Respuesta automática a: ${message}` },
              Date.now()
            ),
          ],
        }));
      }, 800);
    },
    [data.selectedRequest, data.selectedProject]
  );

  // Handler para cargar historial de chat (simula paginación, aquí solo repite el mock)
  const handleRequestHistoryLoad = useCallback(() => {
    // Simula cargar más mensajes antiguos (no implementado, solo ejemplo)
    // Podrías agregar mensajes al principio del array si tuvieras paginación real
  }, []);

  // Setters para compatibilidad
  const setSelectedRequest = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, selectedRequest: id }));
  }, []);

  const setSelectedProject = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, selectedProject: id }));
  }, []);

  const setChatTab = useCallback((tab: string) => {
    setData((prev) => ({ ...prev, chatTab: tab }));
  }, []);

  return {
    // Datos principales
    ...data,
    // Loading states
    loadingRequests: loadingStates.requests,
    loadingProjects: loadingStates.projects,
    loadingRequestDetail: loadingStates.requestDetail,
    loadingRequestChat: loadingStates.requestChat,
    loadingRequestEstimate: loadingStates.requestEstimate,
    loadingRequestInvoice: loadingStates.requestInvoice,
    loadingProjectDetail: loadingStates.projectDetail,
    loadingProjectChat: loadingStates.projectChat,
    // Estados de estimate e invoice
    estimateOpenStates: estimateStates.openStates,
    setEstimateOpenStates: (states: boolean[]) =>
      setEstimateStates((prev) => ({ ...prev, openStates: states })),
    estimateShowDeclineReasons: estimateStates.showDeclineReasons,
    setEstimateShowDeclineReasons: (states: boolean[]) =>
      setEstimateStates((prev) => ({ ...prev, showDeclineReasons: states })),
    estimateDeclineMessages: estimateStates.declineMessages,
    setEstimateDeclineMessages: (messages: string[]) =>
      setEstimateStates((prev) => ({ ...prev, declineMessages: messages })),
    invoiceOpenStates: invoiceStates.openStates,
    setInvoiceOpenStates: (states: boolean[]) =>
      setInvoiceStates((prev) => ({ ...prev, openStates: states })),
    // Setters
    setSelectedRequest,
    setSelectedProject,
    setChatTab,
    setLoadingRequests: (loading: boolean) => setLoading("requests", loading),
    setLoadingProjects: (loading: boolean) => setLoading("projects", loading),
    setLoadingRequestDetail: (loading: boolean) =>
      setLoading("requestDetail", loading),
    setLoadingProjectDetail: (loading: boolean) =>
      setLoading("projectDetail", loading),
    // Métodos de fetch
    fetchRequests,
    fetchProjects,
    fetchRequestDetail,
    fetchRequestChat,
    fetchRequestEstimate,
    fetchRequestInvoice,
    fetchProjectDetail,
    fetchProjectChat,
    // Métodos de limpieza y handlers
    clearRequestData,
    clearProjectData,
    handleSendMessageRequest,
    handleRequestHistoryLoad,
  };
}
