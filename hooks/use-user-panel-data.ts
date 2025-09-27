"use client";

import { useCallback, useState } from "react";
import { UserPanelService } from "@/services/user-panel/user-panel-service";
import type {
  UserRequestDetail,
  UserProjectDetail,
  RequestEstimate,
  RequestInvoice,
} from "@/services/user-panel/user-panel-service";

export function useUserPanelData(userId: string) {
  // Lists
  const [requests, setRequests] = useState<UserRequestDetail[]>([]);
  const [projects, setProjects] = useState<UserProjectDetail[]>([]);

  // Selection
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Details
  const [requestDetail, setRequestDetail] = useState<UserRequestDetail | null>(
    null
  );
  const [projectDetail, setProjectDetail] = useState<UserProjectDetail | null>(
    null
  );

  // Request extras
  const [requestEstimate, setRequestEstimate] =
    useState<RequestEstimate | null>(null);
  const [requestInvoice, setRequestInvoice] = useState<RequestInvoice | null>(
    null
  );

  // UI state
  const [chatTab, setChatTab] = useState<string>("Chat");
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

  // Loading flags
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingRequestDetail, setLoadingRequestDetail] = useState(false);
  const [loadingProjectDetail, setLoadingProjectDetail] = useState(false);
  const [loadingRequestEstimate, setLoadingRequestEstimate] = useState(false);
  const [loadingRequestInvoice, setLoadingRequestInvoice] = useState(false);

  // Clear helpers
  const clearRequestData = useCallback(() => {
    setRequestDetail(null);
    setRequestEstimate(null);
    setRequestInvoice(null);
    setEstimateOpenStates([false]);
    setEstimateShowDeclineReasons([false]);
    setEstimateDeclineMessages([""]);
    setInvoiceOpenStates([false]);
  }, []);

  const clearProjectData = useCallback(() => {
    setProjectDetail(null);
  }, []);

  // Fetch lists
  const fetchRequests = useCallback(async () => {
    //if (!userId) return;
    setLoadingRequests(true);
    try {
      const data = await UserPanelService.getUserRequests("1");
      setRequests(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, [userId]);

  const fetchProjects = useCallback(async () => {
    //if (!userId) return;
    setLoadingProjects(true);
    try {
      const data = await UserPanelService.getUserProjects("8");
      setProjects(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  }, [userId]);

  const goToPayment = useCallback(async (invoiceId: string) => {
    try {
      const { paymentUrl } = await UserPanelService.processInvoicePayment(
        invoiceId
      );
      if (typeof window !== "undefined") {
        window.open(paymentUrl, "_blank");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error processing payment:", error);
    }
  }, []);

  return {
    // Lists
    requests,
    projects,
    loadingRequests,
    loadingProjects,
    fetchRequests,
    fetchProjects,

    // Selection
    selectedRequest,
    setSelectedRequest,
    selectedProject,
    setSelectedProject,

    // Details
    requestDetail,
    loadingRequestDetail,

    projectDetail,
    loadingProjectDetail,

    // Request extras
    requestEstimate,
    loadingRequestEstimate,

    requestInvoice,
    loadingRequestInvoice,

    goToPayment,

    // UI state
    chatTab,
    setChatTab,
    estimateOpenStates,
    setEstimateOpenStates,
    estimateShowDeclineReasons,
    setEstimateShowDeclineReasons,
    estimateDeclineMessages,
    setEstimateDeclineMessages,
    invoiceOpenStates,
    setInvoiceOpenStates,

    // Clear helpers
    clearRequestData,
    clearProjectData,
  };
}
