"use client";

import React, { useState, useEffect } from "react";
import RequestList from "../../organisms/dashboard/RequestList";
import ProjectList from "../../organisms/dashboard/ProjectList";
import { ChatSection } from "../../organisms/dashboard/ChatSection";
import { RequestDetail } from "../../atoms/dashboard/request/request-detail";
import { ProfileProjectDetail } from "../../atoms/dashboard/profile-project-detail";
import { EstimatedValue } from "../../atoms/dashboard/request/estimated-value";
import { Invoice } from "../../atoms/dashboard/request/invoice";
import { TabButtons } from "../../atoms/tab-buttons";
import { useUserPanelData } from "@/hooks/use-user-panel-data";

const DASHBOARD_CONFIG = {
  REQUEST_TABS: ["Requests", "Projects"] as const,
  CHAT_TABS: ["Chat", "Estimated value", "Invoices"] as const,
  DEFAULT_TAB: "Requests" as const,
  DEFAULT_CHAT_TAB: "Chat" as const,
} as const;

export default function UserPanel({ userId }: { userId: string }) {
  const [requestTab, setRequestTab] = useState<string>(
    DASHBOARD_CONFIG.DEFAULT_TAB
  );
  const data = useUserPanelData(userId);

  const clearAllSelections = () => {
    data.setSelectedRequest(null);
    data.setSelectedProject(null);
    data.clearRequestData();
    data.clearProjectData();
    data.setChatTab(DASHBOARD_CONFIG.DEFAULT_CHAT_TAB);
  };

  const handleTabChange = (tab: string) => {
    clearAllSelections();
    setRequestTab(tab);
  };

  const handleSelect = (type: "request" | "project", id: string) => {
    if (type === "request") {
      data.setSelectedRequest(id);
      data.clearRequestData();
    } else {
      data.setSelectedProject(id);
      data.clearProjectData();
      data.setChatTab(DASHBOARD_CONFIG.DEFAULT_CHAT_TAB);
    }
  };

  useEffect(() => {
    if (requestTab === "Requests") {
      data.fetchRequests();
    } else if (requestTab === "Projects") {
      data.fetchProjects();
    }
  }, [requestTab]);

  const renderChatContent = () => (
    <div className="h-full">
      <ChatSection
        entityId={data.selectedRequest || data.selectedProject || undefined}
        entityType={
          (data.selectedRequest ? "request" : "project") as
            | "request"
            | "project"
        }
        userId={userId}
      />
    </div>
  );

  const renderEstimateContent = () => (
    <div className="h-full">
      <EstimatedValue
        estimates={[]}
        currencySymbol="$"
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

  const renderInvoiceContent = () => {
    return (
      <div className="h-full">
        <Invoice
          invoices={[]}
          currencySymbol="$"
          openStates={data.invoiceOpenStates}
          setOpenStates={data.setInvoiceOpenStates}
          loading={data.loadingRequestInvoice}
        />
      </div>
    );
  };

  const renderBottomSection = () => {
    const tabs = DASHBOARD_CONFIG.CHAT_TABS as unknown as string[];
    let content: JSX.Element | null;
    switch (data.chatTab) {
      case "Chat":
        content = renderChatContent();
        break;
      case "Estimated value":
        content = requestTab === "Projects" ? null : renderEstimateContent();
        break;
      case "Invoices":
        content = requestTab === "Projects" ? null : renderInvoiceContent();
        break;
      default:
        content = null;
    }

    return (
      <div className="bg-user-container rounded-xl shadow p-4 flex-1 flex flex-col gap-2 min-h-0 h-0">
        <TabButtons
          tabs={tabs}
          activeTab={data.chatTab}
          onTabChange={data.setChatTab}
        />
        <div className="flex-1 min-h-0 overflow-y-auto mt-2">{content}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-secondary-dark rounded-lg p-4 flex flex-col gap-4 h-[calc(100vh-72px)] text-gray-200">
      {/* Botón Back - solo visible en responsive cuando hay selección */}
      {(data.selectedRequest || data.selectedProject) && (
        <button
          className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start lg:hidden"
          onClick={clearAllSelections}
        >
          {data.selectedRequest
            ? "← Back to Requests"
            : data.selectedProject
            ? "← Back to Projects"
            : ""}
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full min-h-0">
        {/* Sidebar - en responsive, solo se muestra cuando no hay selección */}
        <div
          className={`lg:col-span-1 bg-user-container rounded-xl shadow p-4 flex flex-col gap-4 h-full min-h-0 ${
            data.selectedRequest || data.selectedProject
              ? "hidden lg:flex"
              : "flex"
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
              onSelect={(id) => handleSelect("request", id)}
              loading={data.loadingRequests}
            />
          ) : (
            <ProjectList
              projects={data.projects}
              selectedId={data.selectedProject}
              onSelect={(id) => handleSelect("project", id)}
              loading={data.loadingProjects}
            />
          )}
        </div>

        {/* Main Content - en responsive, ocupa todo el ancho cuando hay selección */}
        <div
          className={`flex flex-col gap-4 h-full min-h-0 ${
            data.selectedRequest || data.selectedProject
              ? "col-span-1 lg:col-span-2"
              : "hidden lg:flex lg:col-span-2"
          }`}
        >
          <div className="bg-user-container rounded-xl shadow p-4 flex flex-col gap-4">
            {requestTab === "Requests" && data.selectedRequest ? (
              <RequestDetail
                requestName={data.requestDetail?.name || ""}
                associatedService={data.requestDetail?.service || ""}
                companyPlan={data.requestDetail?.companyPlan || ""}
                description={data.requestDetail?.description || ""}
                leadStatus={data.requestDetail?.status || "Send"}
                loading={data.loadingRequestDetail}
              />
            ) : requestTab === "Projects" && data.selectedProject ? (
              <div className="overflow-y-auto h-[190px] pr-2 py-2 flex flex-col gap-y-4">
                {(data.projectDetail?.details || []).map(
                  (detail: any, idx: number) => (
                    <ProfileProjectDetail
                      key={idx}
                      description={detail.description}
                      documents={[]}
                      date={undefined}
                      loading={false}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-400 text-lg font-semibold border-2 border-dashed border-gray-700 rounded-lg">
                {requestTab === "Projects"
                  ? "Main Details (Projects)"
                  : "Main Details (Requests)"}
              </div>
            )}
          </div>
          {renderBottomSection()}
        </div>
      </div>
    </div>
  );
}
