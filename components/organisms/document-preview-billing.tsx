import { BillingRecord } from "@/types/billing-management";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface DocumentPreviewBillingProps extends BillingRecord {
  onBack: () => void;
}

export function DocumentPreviewBilling(props: DocumentPreviewBillingProps) {
  const { onBack, ...data } = props;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">Document Preview</h1>
        </div>
        <Button className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-4">Download Document</Button>
      </div>

      {/* Body */}
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto max-w-7xl space-y-8">

          {/* Banner verde superior */}
          <div className="h-8 w-full bg-green-500 rounded-t-lg" />

          {/* Logo + Título + Descripción */}
          <div className="space-y-2">
            <img src="/senavia-logo.svg" alt="Senavia" className="h-10" />
            <h2 className="text-2xl font-semibold">{data.service}</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet odio ut lorem scelerisque auctor.
            </p>
          </div>
                     {/* Cuatro tarjetas de detalle */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <InfoCard title="Customer">
               <p>{data.associatedLead}</p>
               <p>ID: {data.id}</p>
               <p>Service: {data.service}</p>
             </InfoCard>
             <InfoCard title="Invoice Details">
               <p>Creation Date: {new Date(data.createdAt).toLocaleDateString()}</p>
               <p>Total: €{data.totalValue.toLocaleString()}</p>
               <p>Service Date: {new Date(data.updatedAt).toLocaleDateString()}</p>
             </InfoCard>
             <InfoCard title="Payment">
               <p>Status: {data.status}</p>
               <p>€{data.totalValue.toLocaleString()}</p>
             </InfoCard>
             <InfoCard title="Details">
               <p>Estimated Time: {data.estimatedTime} months</p>
               <p>Description: {data.description}</p>
             </InfoCard>
           </div>

           {/* Invoice summary */}
           <div className="space-y-4">
             <h3 className="text-xl font-medium">Invoice summary</h3>
             <div className="overflow-x-auto">
               <table className="w-full table-auto border-collapse bg-gray-50">
                 <thead className="bg-gray-200">
                   <tr>
                     <th className="px-4 py-2 text-left">Service</th>
                     <th className="px-4 py-2 text-left">Time (months)</th>
                     <th className="px-4 py-2 text-left">Amount</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b">
                     <td className="px-4 py-2">{data.service}</td>
                     <td className="px-4 py-2">{data.estimatedTime}</td>
                     <td className="px-4 py-2">€{data.totalValue.toLocaleString()}</td>
                   </tr>
                 </tbody>
               </table>
             </div>
             <div className="flex justify-between items-center text-2xl font-bold">
               <span>Total Paid</span>
               <span>€{data.totalValue.toLocaleString()}</span>
             </div>
           </div>

          {/* Pie verde inferior */}
          <div className="h-8 w-full bg-green-500 rounded-b-lg" />
        </div>
             </div>
     </div>
   );
 }

 function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
   return (
     <div className="border border-green-500 rounded-lg p-4 space-y-2">
       <h4 className="font-semibold">{title}</h4>
       <div className="text-sm text-gray-800">{children}</div>
     </div>
   );
 }