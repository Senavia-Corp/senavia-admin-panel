import { useEffect, useState } from "react";
import { endpoints,useFetch } from "@/lib/services/endpoints";
import { apiResponse, Billing,Billings } from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";

export function BillingViewModel() {
   const { fetchData } = useFetch();
   const [billing, setBilling] = useState<Billing[]>([]);
   const [leads, setLeads] = useState<Leads[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [billings, setBillings] = useState<Billings[]>([]);
   const [lead, setLead] = useState<Lead[]>([]);

    const getBillings = async () => {
        setLoading(true);
        setError(null);
        const { response, status, errorLogs } = await fetchData<apiResponse<Billings>>(endpoints.estimate.getEstimates, "get");
        if(status === 200 && response && response.success) {
            setBillings(response.data);
        } else {
            setError(errorLogs?.message || response?.message || "Failed to fetch billings");
        }
        setLoading(false);
    }

    const getBilling = async (id: number) => {
        setLoading(true);
        setError(null);
        const { response, status, errorLogs } = await fetchData<apiResponse<Billing>>(endpoints.estimate.getEstimate(id), "get");
        if(status === 200 && response && response.success) {
            setBilling(response.data);
        }else {
            setError(errorLogs?.message || response?.message || "Failed to fetch billing");
        }
        setLoading(false);
    }

    const getLeads = async () => {
        setLoading(true);
        setError(null);
        const {response, status, errorLogs} = await fetchData<apiResponse<Lead>>(endpoints.lead.getLeads, "get");
        if (status === 200 && response && response.success) {
            setLeads(response.data);
        }else {
            setError(errorLogs?.message || response?.message || "Failed to fetch leads");
        }
        setLoading(false);
    }

    const deleteBilling = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const {response, status, errorLogs} = await fetchData<apiResponse<Billing>>(endpoints.estimate.deleteEstimate(id), "delete");
            if (status === 200 && response && response.success) {
                await getBillings(); // Recargar la lista después de eliminar
                return true;
            } else {
                setError(errorLogs?.message || response?.message || "Failed to delete billing");
                return false;
            }
        } catch (error) {
            setError("Error deleting billing");
            return false;
        } finally {
            setLoading(false);
        }
    }

    const getLeadById = async (id: number) => {
        setLoading(true);
        setError(null);
        const {response, status, errorLogs} = await fetchData<apiResponse<Lead>>(endpoints.lead.getLead(id), "get");
        if (status === 200 && response && response.success) {
            setLead(response.data);
        }else {
            setError(errorLogs?.message || response?.message || "Failed to fetch lead");
        }
        setLoading(false);
    }

    return {
        billings,
        billing,
        loading,
        error,
        getBillings,
        getBilling,
        getLeads,
        leads,
        getLeadById,
        lead,
        deleteBilling,
    }
    
}