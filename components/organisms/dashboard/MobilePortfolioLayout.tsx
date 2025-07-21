"use client";
import React, { useState } from "react";
import ProjectList from "./ProjectList";
import RequestList from "./RequestList";
import { ProfileProjectDetail } from "../../atoms/dashboard/profile-project-detail";
import { RequestDetail } from "../../atoms/dashboard/request/request-detail";
import { EstimatedValue } from "../../atoms/dashboard/request/estimated-value";
import { Invoice } from "../../atoms/dashboard/request/invoice";

const REQUEST_TABS = ["Requests", "Projects"];

type Props = {
  requestTab: string;
  onTabChange: (tab: string) => void;
  selectedRequest: string | null;
  setSelectedRequest: (id: string | null) => void;
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  chatComponent: React.ReactNode;
  handleSelectProject: (id: string) => void;
  handleSelectRequest: (id: string) => void;
  chatTab: string;
  setChatTab: (tab: string) => void;
  getChatTabs: (tab: string) => string[];
  // Estado compartido para EstimatedValue e Invoice
  estimateOpenStates: boolean[];
  setEstimateOpenStates: (v: boolean[]) => void;
  estimateShowDeclineReasons: boolean[];
  setEstimateShowDeclineReasons: (v: boolean[]) => void;
  estimateDeclineMessages: string[];
  setDeclineMessages: (v: string[]) => void;
  invoiceOpenStates: boolean[];
  setInvoiceOpenStates: (v: boolean[]) => void;
  // NUEVOS PROPS PARA DATOS Y LOADING
  requests: any[];
  projects: any[];
  loadingRequests: boolean;
  loadingProjects: boolean;
  requestDetail: any;
  loadingRequestDetail: boolean;
  requestEstimate: any;
  loadingRequestEstimate: boolean;
  requestInvoice: any;
  loadingRequestInvoice: boolean;
  projectDetail: any;
  loadingProjectDetail: boolean;
};

export default function MobilePortfolioLayout({
  requestTab,
  onTabChange,
  selectedRequest,
  setSelectedRequest,
  selectedProject,
  setSelectedProject,
  chatComponent,
  handleSelectProject,
  handleSelectRequest,
  chatTab,
  setChatTab,
  getChatTabs,
  estimateOpenStates,
  setEstimateOpenStates,
  estimateShowDeclineReasons,
  setEstimateShowDeclineReasons,
  estimateDeclineMessages,
  setDeclineMessages,
  invoiceOpenStates,
  setInvoiceOpenStates,
  requests,
  projects,
  loadingRequests,
  loadingProjects,
  requestDetail,
  loadingRequestDetail,
  requestEstimate,
  loadingRequestEstimate,
  requestInvoice,
  loadingRequestInvoice,
  projectDetail: projectDetail,
  loadingProjectDetail,
}: Props) {
  const [projectDetailTab, setProjectDetailTab] = useState("Chat");

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
      <div className="flex gap-2 mb-2">
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

  // --- RENDER PRINCIPAL ---
  if (requestTab === "Projects" && selectedProject) {
    if (loadingProjectDetail) {
      return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
          <button
            className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start"
            onClick={() => setSelectedProject(null)}
          >
            ← Back to Projects
          </button>
          <TabButtons
            tabs={["Chat", "Documents"]}
            activeTab={projectDetailTab}
            onTabChange={setProjectDetailTab}
          />
          <div className="flex-1 min-h-0 h-full">
            {projectDetailTab === "Chat" &&
              chatComponent &&
              React.cloneElement(chatComponent as React.ReactElement<any>, {
                isLoadingHistory: true,
              })}
            {projectDetailTab === "Documents" && (
              <div className="flex flex-col gap-4 flex-1 min-h-0 h-full overflow-y-auto pr-2">
                {[...Array(2)].map((_, idx) => (
                  <ProfileProjectDetail key={idx} description="" documents={[]} loading={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    if (!projectDetail) return null;
    return (
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        <button
          className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start"
          onClick={() => setSelectedProject(null)}
        >
          ← Back to Projects
        </button>
        <div className="flex flex-col gap-2 h-full min-h-0">
          <h2 className="font-bold text-xl mb-2">{projectDetail.name}</h2>
          <TabButtons
            tabs={["Chat", "Documents"]}
            activeTab={projectDetailTab}
            onTabChange={setProjectDetailTab}
          />
          <div className="flex-1 min-h-0 h-full">
            {projectDetailTab === "Chat" ? (
              chatComponent
            ) : (
              <div className="flex flex-col gap-4 flex-1 min-h-0 h-full overflow-y-auto pr-2">
                {(projectDetail.details || []).map((detail: any, idx: number) => (
                  <ProfileProjectDetail
                    key={idx}
                    description={detail.description}
                    documents={detail.documents.map((doc: any, j: number) => ({
                      id: `${projectDetail.id}-${idx}-${j}`,
                      name: doc.name,
                      url: `/docs/${doc.name}`,
                    }))}
                    date={detail.date ? new Date(detail.date) : undefined}
                    loading={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (requestTab === "Requests" && selectedRequest) {
    if (loadingRequestDetail) {
      return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
          <button
            className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start"
            onClick={() => setSelectedRequest(null)}
          >
            ← Back to Requests
          </button>
          <RequestDetail
            requestName=""
            associatedService=""
            companyPlan=""
            description=""
            leadStatus=""
            loading={true}
          />
          <TabButtons tabs={getChatTabs("Requests")} activeTab={chatTab} onTabChange={setChatTab} />
          <div className="flex-1 min-h-0">
            {chatTab === "Chat" &&
              chatComponent &&
              React.cloneElement(chatComponent as React.ReactElement<any>, {
                isLoadingHistory: true,
              })}
            {chatTab === "Estimated value" && <EstimatedValue estimates={[]} loading={true} />}
            {chatTab === "Invoices" && <Invoice invoices={[]} loading={true} />}
          </div>
        </div>
      );
    }
    if (!requestDetail) return null;
    return (
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        <button
          className="mb-1 px-2 py-1 rounded bg-[#99CC33] text-[#13103A] text-xs font-semibold hover:bg-[#7fa82a] transition-colors self-start"
          onClick={() => setSelectedRequest(null)}
        >
          ← Back to Requests
        </button>
        <RequestDetail
          requestName={requestDetail.name}
          associatedService={requestDetail.service}
          companyPlan={requestDetail.plan}
          description={requestDetail.description}
          leadStatus={requestDetail.status}
          loading={false}
        />
        <TabButtons tabs={getChatTabs("Requests")} activeTab={chatTab} onTabChange={setChatTab} />
        <div className="flex-1 min-h-0">
          {chatTab === "Chat" && chatComponent}
          {chatTab === "Estimated value" && (
            <EstimatedValue
              estimates={requestEstimate ? [requestEstimate] : []}
              currencySymbol="$"
              onAccept={() => alert(`Estimate accepted!`)}
              onDecline={(_, reason) =>
                alert(`Estimate declined: ${reason || "No reason provided"}`)
              }
              openStates={estimateOpenStates}
              setOpenStates={setEstimateOpenStates}
              showDeclineReasons={estimateShowDeclineReasons}
              setShowDeclineReasons={setEstimateShowDeclineReasons}
              declineMessages={estimateDeclineMessages}
              setDeclineMessages={setDeclineMessages}
              loading={loadingRequestEstimate}
            />
          )}
          {chatTab === "Invoices" && (
            <Invoice
              invoices={requestInvoice ? [requestInvoice] : []}
              currencySymbol="$"
              onGoToPayment={() =>
                alert(`Redirecting to payment for Invoice #${requestInvoice?.invoiceNumber}`)
              }
              openStates={invoiceOpenStates}
              setOpenStates={setInvoiceOpenStates}
              loading={loadingRequestInvoice}
            />
          )}
        </div>
      </div>
    );
  }
  // Lista principal
  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 flex-1 overflow-y-auto">
      <TabButtons tabs={REQUEST_TABS} activeTab={requestTab} onTabChange={onTabChange} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {requestTab === "Projects" ? (
          <ProjectList
            projects={projects}
            selectedId={selectedProject}
            onSelect={handleSelectProject}
            loading={loadingProjects}
          />
        ) : (
          <RequestList
            requests={requests}
            selectedId={selectedRequest}
            onSelect={handleSelectRequest}
            loading={loadingRequests}
          />
        )}
      </div>
    </div>
  );
}
