"use client";

import React, { useState, useEffect } from "react";
import RequestList from "../../organisms/dashboard/RequestList";
import ProjectList from "../../organisms/dashboard/ProjectList";
import { ProfileChat } from "../../atoms/chat/profile-chat";
import { RequestDetail } from "../../atoms/dashboard/request/request-detail";
import { ProfileProjectDetail } from "../../atoms/dashboard/profile-project-detail";
import { EstimatedValue } from "../../atoms/dashboard/request/estimated-value";
import { Invoice } from "../../atoms/dashboard/request/invoice";
import { TabButtons } from "../../atoms/tab-buttons";
import { useTestPortfolioData } from "@/hooks/useTestPortfolioData";

// Configuración del dashboard
const DASHBOARD_CONFIG = {
  REQUEST_TABS: ["Requests", "Projects"] as const,
  CHAT_TABS: ["Chat", "Estimated value", "Invoices"] as const,
  DEFAULT_TAB: "Requests" as const,
  DEFAULT_CHAT_TAB: "Chat" as const,
} as const;

export default function DashboardPage() {
  const data = useTestPortfolioData();
  const [requestTab, setRequestTab] = useState<string>(
    DASHBOARD_CONFIG.DEFAULT_TAB
  );

  // Helpers para limpiar y cargar datos
  const clearAllSelectionAndData = () => {
    data.setSelectedRequest(null);
    data.setSelectedProject(null);
    data.clearRequestData();
    data.clearProjectData();
  };

  const loadTabData = (tab: string) => {
    if (tab === "Requests") {
      data.setLoadingRequests(true);
      data.fetchRequests();
    } else if (tab === "Projects") {
      data.setLoadingProjects(true);
      data.fetchProjects();
    }
  };

  const loadEntityData = (type: "request" | "project", id: string) => {
    if (type === "request") {
      data.setSelectedRequest(id);
      data.clearRequestData();
      data.fetchRequestDetail(id);
      data.fetchRequestChat(id);
      data.fetchRequestEstimate(id);
      data.fetchRequestInvoice(id);
      setRequestTab("Requests");
    } else {
      data.setSelectedProject(id);
      data.clearProjectData();
      data.fetchProjectDetail(id);
      data.fetchProjectChat(id);
      data.setChatTab(DASHBOARD_CONFIG.DEFAULT_CHAT_TAB);
      setRequestTab("Projects");
    }
  };

  // Handlers simplificados
  const handleTabChange = (tab: string) => {
    clearAllSelectionAndData();
    data.setChatTab(DASHBOARD_CONFIG.DEFAULT_CHAT_TAB);
    setRequestTab(tab);
    loadTabData(tab);
  };

  const handleSelectRequest = (id: string) => loadEntityData("request", id);
  const handleSelectProject = (id: string) => loadEntityData("project", id);

  // Cargar listados al entrar a cada tab
  useEffect(() => {
    loadTabData(requestTab);
  }, [requestTab]);

  // Helpers para renderizado
  const getChatTabs = (tab: string) =>
    tab === "Projects"
      ? [DASHBOARD_CONFIG.CHAT_TABS[0]]
      : DASHBOARD_CONFIG.CHAT_TABS;

  const isRequestSelected = !!data.selectedRequest;
  const currentEntity = {
    id: data.selectedRequest || data.selectedProject,
    type: isRequestSelected ? "request" : "project",
    messages: isRequestSelected ? data.requestChat : data.projectChat,
    loading: data.loadingRequestChat || data.loadingProjectChat,
  };

  // Componentes de renderizado
  const renderRequestDetail = () => (
    <RequestDetail
      requestName={data.requestDetail?.name}
      associatedService={data.requestDetail?.service}
      companyPlan={data.requestDetail?.plan}
      description={data.requestDetail?.description}
      leadStatus={data.requestDetail?.status}
      loading={data.loadingRequestDetail}
    />
  );

  const renderProjectDetails = () => {
    if (data.loadingProjectDetail) {
      return (
        <div className="overflow-y-auto h-[190px] pr-2 py-2 flex flex-col gap-y-4">
          {[...Array(2)].map((_, idx) => (
            <ProfileProjectDetail
              key={idx}
              description=""
              documents={[]}
              loading={true}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-y-auto h-[190px] pr-2 py-2 flex flex-col gap-y-4">
        {(data.projectDetail?.details || []).map((detail: any, idx: number) => (
          <ProfileProjectDetail
            key={idx}
            description={detail.description}
            documents={detail.documents.map((doc: any, j: number) => ({
              id: `${data.selectedProject}-${idx}-${j}`,
              name: doc.name,
              url: `/docs/${doc.name}`,
            }))}
            date={detail.date ? new Date(detail.date) : undefined}
            loading={false}
          />
        ))}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full w-full text-gray-400 text-lg font-semibold border-2 border-dashed border-gray-700 rounded-lg">
      {requestTab === "Projects"
        ? "Main Details (Projects)"
        : "Main Details (Requests)"}
    </div>
  );

  const renderMainDetails = () => {
    if (requestTab === "Requests" && data.selectedRequest)
      return renderRequestDetail();
    if (requestTab === "Projects" && data.selectedProject)
      return renderProjectDetails();
    return renderEmptyState();
  };

  // Componentes de contenido del chat
  const renderChatContent = () => (
    <div className="h-full">
      <ProfileChat
        entityId={currentEntity.id || undefined}
        entityType={currentEntity.type as "request" | "project"}
        messagesToDisplay={currentEntity.messages}
        onSendMessageRequest={data.handleSendMessageRequest}
        onRequestHistoryLoad={data.handleRequestHistoryLoad}
        isLoadingHistory={currentEntity.loading}
      />
    </div>
  );

  const renderEstimateContent = () => (
    <div className="h-full">
      <EstimatedValue
        estimates={data.requestEstimate ? [data.requestEstimate] : []}
        currencySymbol="$"
        onAccept={() => alert(`Estimate accepted!`)}
        onDecline={(_, reason) =>
          alert(`Estimate declined: ${reason || "No reason provided"}`)
        }
        openStates={data.estimateOpenStates}
        setOpenStates={data.setEstimateOpenStates}
        showDeclineReasons={data.estimateShowDeclineReasons}
        setShowDeclineReasons={data.setEstimateShowDeclineReasons}
        declineMessages={data.estimateDeclineMessages}
        setDeclineMessages={data.setEstimateDeclineMessages}
        loading={data.loadingRequestEstimate}
      />
    </div>
  );

  const renderInvoiceContent = () => (
    <div className="h-full">
      <Invoice
        invoices={data.requestInvoice ? [data.requestInvoice] : []}
        currencySymbol="$"
        onGoToPayment={() =>
          alert(
            `Redirecting to payment for Invoice #${data.requestInvoice?.invoiceNumber}`
          )
        }
        openStates={data.invoiceOpenStates}
        setOpenStates={data.setInvoiceOpenStates}
        loading={data.loadingRequestInvoice}
      />
    </div>
  );

  const renderTabContent = () => {
    const availableTabs = getChatTabs(requestTab);

    if (data.chatTab === DASHBOARD_CONFIG.CHAT_TABS[0])
      return renderChatContent();
    if (
      data.chatTab === DASHBOARD_CONFIG.CHAT_TABS[1] &&
      availableTabs.includes(DASHBOARD_CONFIG.CHAT_TABS[1] as any)
    ) {
      return renderEstimateContent();
    }
    if (
      data.chatTab === DASHBOARD_CONFIG.CHAT_TABS[2] &&
      availableTabs.includes(DASHBOARD_CONFIG.CHAT_TABS[2] as any)
    ) {
      return renderInvoiceContent();
    }
    return null;
  };

  const renderBottomSection = () => (
    <div className="bg-user-container rounded-xl shadow p-4 flex-1 flex flex-col gap-2 min-h-0 h-0">
      <TabButtons
        tabs={getChatTabs(requestTab) as string[]}
        activeTab={data.chatTab}
        onTabChange={data.setChatTab}
      />
      <div className="flex-1 min-h-0 overflow-y-auto mt-2">
        {renderTabContent()}
      </div>
    </div>
  );

  // Helper para manejar el botón back
  const handleBackClick = () => {
    clearAllSelectionAndData();
  };

  // Helper para obtener el texto del botón back
  const getBackButtonText = () => {
    if (data.selectedRequest) return "← Back to Requests";
    if (data.selectedProject) return "← Back to Projects";
    return "";
  };

  // Helper para determinar si hay algo seleccionado
  const hasSelection = !!data.selectedRequest || !!data.selectedProject;

  return (
    <div className="w-full bg-secondary-dark rounded-lg p-4 flex flex-col gap-4 h-[calc(100vh-72px)] text-gray-200">
      {/* Botón Back - solo visible en responsive cuando hay selección */}
      {hasSelection && (
        <button
          className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start lg:hidden"
          onClick={handleBackClick}
        >
          {getBackButtonText()}
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full min-h-0">
        {/* Sidebar - en responsive, solo se muestra cuando no hay selección */}
        <div
          className={`lg:col-span-1 bg-user-container rounded-xl shadow p-4 flex flex-col gap-4 h-full min-h-0 ${
            hasSelection ? "hidden lg:flex" : "flex"
          }`}
        >
          <TabButtons
            tabs={[...DASHBOARD_CONFIG.REQUEST_TABS]}
            activeTab={requestTab}
            onTabChange={handleTabChange}
          />
          {requestTab === "Requests" ? (
            <RequestList
              requests={data.requests}
              selectedId={data.selectedRequest}
              onSelect={handleSelectRequest}
              loading={data.loadingRequests}
            />
          ) : (
            <ProjectList
              projects={data.projects}
              selectedId={data.selectedProject}
              onSelect={handleSelectProject}
              loading={data.loadingProjects}
            />
          )}
        </div>

        {/* Main Content - en responsive, ocupa todo el ancho cuando hay selección */}
        <div
          className={`flex flex-col gap-4 h-full min-h-0 ${
            hasSelection
              ? "col-span-1 lg:col-span-2"
              : "hidden lg:flex lg:col-span-2"
          }`}
        >
          <div className="bg-user-container rounded-xl shadow p-4 flex flex-col gap-4">
            {renderMainDetails()}
          </div>
          {renderBottomSection()}
        </div>
      </div>
    </div>
  );
}
