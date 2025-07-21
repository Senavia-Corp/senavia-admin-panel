"use client";

import React, { useState, useEffect } from "react";
import MobilePortfolioLayout from "../../organisms/dashboard/MobilePortfolioLayout";
import RequestList from "../../organisms/dashboard/RequestList";
import ProjectList from "../../organisms/dashboard/ProjectList";
import { ProfileChat } from "../../atoms/chat/profile-chat";
import { RequestDetail } from "../../atoms/dashboard/request/request-detail";
import { ProfileProjectDetail } from "../../atoms/dashboard/profile-project-detail";
import { EstimatedValue } from "../../atoms/dashboard/request/estimated-value";
import { Invoice } from "../../atoms/dashboard/request/invoice";
import { useTestPortfolioData } from "@/hooks/useTestPortfolioData";

export default function DashboardPage() {
  // Tabs y chat tabs
  const REQUEST_TABS = ["Requests", "Projects"];
  const CHAT_TABS = ["Chat", "Estimated value", "Invoices"];

  // Hook de datos y lógica
  const data = useTestPortfolioData();

  // Estado real para la tab activa
  const [requestTab, setRequestTab] = useState<string>(REQUEST_TABS[0]);

  // Limpieza centralizada de selección y datos
  function clearAllSelectionAndData() {
    data.setSelectedRequest(null);
    data.setSelectedProject(null);
    data.clearRequestData();
    data.clearProjectData();
  }

  // Cambiar de tab: limpia selección y datos, y actualiza la tab
  const handleTabChange = (tab: string) => {
    clearAllSelectionAndData();
    data.setChatTab("Chat");
    if (tab === "Requests") {
      data.setLoadingRequests(true);
      setRequestTab(tab);
      data.fetchRequests();
    } else if (tab === "Projects") {
      data.setLoadingProjects(true);
      setRequestTab(tab);
      data.fetchProjects();
    }
  };

  // Helper para cambiar selección y cargar datos
  const handleSelectRequest = (id: string) => {
    data.setSelectedRequest(id);
    data.clearRequestData();
    data.fetchRequestDetail(id);
    data.fetchRequestChat(id);
    data.fetchRequestEstimate(id);
    data.fetchRequestInvoice(id);
    setRequestTab("Requests");
  };
  const handleSelectProject = (id: string) => {
    data.setSelectedProject(id);
    data.clearProjectData();
    data.fetchProjectDetail(id);
    data.fetchProjectChat(id);
    data.setChatTab("Chat");
    setRequestTab("Projects");
  };

  // Cargar listados al entrar a cada tab
  useEffect(() => {
    if (requestTab === "Requests") data.fetchRequests();
    if (requestTab === "Projects") data.fetchProjects();
  }, [requestTab]);

  // Chat tabs para desktop según tab
  const getChatTabs = (tab: string) =>
    tab === "Projects" ? [CHAT_TABS[0]] : CHAT_TABS;

  // Chat component instance (usa el chat de request o project según selección)
  const chatComponentInstance = (
    <ProfileChat
      entityId={data.selectedRequest || data.selectedProject || undefined}
      entityType={
        data.selectedRequest
          ? "request"
          : data.selectedProject
          ? "project"
          : undefined
      }
      messagesToDisplay={
        data.selectedRequest ? data.requestChat : data.projectChat
      }
      onSendMessageRequest={data.handleSendMessageRequest}
      onRequestHistoryLoad={data.handleRequestHistoryLoad}
      isLoadingHistory={data.loadingRequestChat || data.loadingProjectChat}
    />
  );

  // --- COMPONENTES AUXILIARES INTERNOS ---
  function TabButtons({
    tabs,
    activeTab,
    onTabChange,
  }: {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
  }) {
    return (
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full font-bold border-2 transition-colors text-[14px] h-8 ${
              activeTab === tab
                ? "bg-[#99CC33] text-[#13103A] border-[#99CC33]"
                : "bg-transparent text-[#99CC33] border-[#99CC33]"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  function renderMainDetails() {
    if (requestTab === "Requests" && data.selectedRequest) {
      return (
        <RequestDetail
          requestName={data.requestDetail?.name}
          associatedService={data.requestDetail?.service}
          companyPlan={data.requestDetail?.plan}
          description={data.requestDetail?.description}
          leadStatus={data.requestDetail?.status}
          loading={data.loadingRequestDetail}
        />
      );
    }
    if (requestTab === "Projects" && data.selectedProject) {
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
          {(data.projectDetail?.details || []).map(
            (detail: any, idx: number) => (
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
            )
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-400 text-lg font-semibold border-2 border-dashed border-gray-700 rounded-lg">
        {requestTab === "Projects"
          ? "Main Details (Projects)"
          : "Main Details (Requests)"}
      </div>
    );
  }

  function renderBottomSection() {
    return (
      <div className="bg-[#13103A] rounded-xl shadow p-4 flex-1 flex flex-col gap-2 min-h-0 h-0">
        {/* Tabs fijos */}
        <TabButtons
          tabs={getChatTabs(requestTab)}
          activeTab={data.chatTab}
          onTabChange={data.setChatTab}
        />
        {/* Contenido con scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-2">
          {/* Content for "Chat" tab */}
          <div
            className={`h-full ${
              data.chatTab === CHAT_TABS[0] ? "block" : "hidden"
            }`}
          >
            {data.chatTab === CHAT_TABS[0] && chatComponentInstance}
          </div>
          {/* Content for "Estimated value" tab */}
          {getChatTabs(requestTab).includes(CHAT_TABS[1]) && (
            <div
              className={`h-full ${
                data.chatTab === CHAT_TABS[1] ? "block" : "hidden"
              }`}
            >
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
          )}
          {/* Content for "Invoices" tab */}
          {getChatTabs(requestTab).includes(CHAT_TABS[2]) && (
            <div
              className={`h-full  ${
                data.chatTab === CHAT_TABS[2] ? "block" : "hidden"
              }`}
            >
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
          )}
        </div>
      </div>
    );
  }

  const handleMobileTabChange = (tab: string) => {
    clearAllSelectionAndData();
    if (tab === "Requests") {
      data.setLoadingRequests(true);
      setRequestTab(tab);
      data.fetchRequests();
    } else if (tab === "Projects") {
      data.setLoadingProjects(true);
      setRequestTab(tab);
      data.fetchProjects();
    }
  };

  return (
    <div className="w-full bg-[#04081E] p-4 flex flex-col gap-4 h-[calc(100vh-72px)] text-gray-200">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:grid grid-cols-3 gap-4 w-full h-full min-h-0">
        {/* Sidebar */}
        <div className="col-span-1 bg-[#13103A] rounded-xl shadow p-4 flex flex-col gap-4 h-full min-h-0">
          <TabButtons
            tabs={REQUEST_TABS}
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
        {/* Main Content */}
        <div className="col-span-2 flex flex-col gap-4 h-full min-h-0">
          {/* Top Section */}
          <div className="bg-[#13103A] rounded-xl shadow p-4 flex flex-col gap-4">
            {renderMainDetails()}
          </div>
          {/* Bottom Section */}
          {renderBottomSection()}
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-4 w-full h-screen min-h-0 flex-1 lg:mt-0">
        <MobilePortfolioLayout
          requestTab={requestTab}
          onTabChange={handleMobileTabChange}
          selectedRequest={data.selectedRequest}
          setSelectedRequest={data.setSelectedRequest}
          selectedProject={data.selectedProject}
          setSelectedProject={data.setSelectedProject}
          chatComponent={chatComponentInstance}
          handleSelectProject={handleSelectProject}
          handleSelectRequest={handleSelectRequest}
          chatTab={data.chatTab}
          setChatTab={data.setChatTab}
          getChatTabs={getChatTabs}
          estimateOpenStates={data.estimateOpenStates}
          setEstimateOpenStates={data.setEstimateOpenStates}
          estimateShowDeclineReasons={data.estimateShowDeclineReasons}
          setEstimateShowDeclineReasons={data.setEstimateShowDeclineReasons}
          estimateDeclineMessages={data.estimateDeclineMessages}
          setDeclineMessages={data.setEstimateDeclineMessages}
          invoiceOpenStates={data.invoiceOpenStates}
          setInvoiceOpenStates={data.setInvoiceOpenStates}
          requests={data.requests}
          projects={data.projects}
          loadingRequests={data.loadingRequests}
          loadingProjects={data.loadingProjects}
          requestDetail={data.requestDetail}
          loadingRequestDetail={data.loadingRequestDetail}
          requestEstimate={data.requestEstimate}
          loadingRequestEstimate={data.loadingRequestEstimate}
          requestInvoice={data.requestInvoice}
          loadingRequestInvoice={data.loadingRequestInvoice}
          projectDetail={data.projectDetail}
          loadingProjectDetail={data.loadingProjectDetail}
        />
      </div>
    </div>
  );
}
