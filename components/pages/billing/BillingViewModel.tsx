import { useEffect, useState } from "react";
import { endpoints,useFetch } from "@/lib/services/endpoints";
import { apiResponse, Billing,Billings, Cost, CreateBillingData } from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";
import { Plans, Plan } from "@/types/plan";
import { CreateCostData,PatchCost } from "@/types/cost-management";
import { toast } from "sonner"
import { PatchBillingData } from "@/types/billing-management";

export function BillingViewModel() {
   const { fetchData } = useFetch();
   const [billing, setBilling] = useState<Billing[]>([]);
   const [leads, setLeads] = useState<Leads[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [billings, setBillings] = useState<Billings[]>([]);
   const [lead, setLead] = useState<Lead[]>([]);
   const [plans, setPlans] = useState<Plans[]>([]);
   const [plan, setPlan] = useState<Plan[]>([]);
   const [cost, setCost] = useState<CreateCostData[]>([]);

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

    const createBilling = async (billing: CreateBillingData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            
            // Validar datos requeridos
            if (!billing.lead_id || !billing.plan_id) {
                throw new Error("Total value, lead ID and plan ID are required");
            }

            const { response, status, errorLogs } = await fetchData<apiResponse<Billing>>(
                endpoints.estimate.createEstimate,
                "post",
                billing
            );

            if (status === 201 && response?.success) {
                const billingData = Array.isArray(response.data) ? response.data : [response.data];
                setBilling(billingData);
                setSuccessMessage("Estimate created successfully!");
                return { success: true, data: billingData };
            } else {
                throw new Error(errorLogs?.message || response?.message || "Failed to create billing");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create billing";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }

    const PatchBilling = async (id: number, billing: Partial<CreateBillingData>) => {
        try {
            setLoading(true);
            setError(null);
            const {response, status, errorLogs} = await fetchData<apiResponse<Billing>>(
                endpoints.estimate.updateEstimate(id), 
                "patch", 
                billing
            );
            if (status === 200 && response && response.success) {
                setBilling(response.data);
                return response.data;
            } else {
                throw new Error(errorLogs?.message || response?.message || "Failed to update billing");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update billing");
            throw error;
        } finally {
            setLoading(false);
        }
    };

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
            }
             else {
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

    const getPlans = async () => {
        setLoading(true);
        setError(null);
        const {response, status, errorLogs} = await fetchData<apiResponse<Plan>>(endpoints.plan.getPlans, "get");
        if (status === 200 && response && response.success) {
            setPlans(response.data);
        }else {
            setError(errorLogs?.message || response?.message || "Failed to fetch plans");
        }
        setLoading(false);
    }

    const createCost = async (cost: CreateCostData) => {
        setLoading(true);
        setError(null);
        const {response, status, errorLogs} = await fetchData<apiResponse<Cost>>(endpoints.cost.createCost, "post", cost);
        if (status === 201 && response && response.success) {
            setCost(response.data);
            setLoading(false);
            return true;
        }else {
            setError(errorLogs?.message || response?.message || "Failed to create cost");
            setLoading(false);
            return false;
        }
    }

    const deleteCost = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const {response, status, errorLogs} = await fetchData<apiResponse<Cost>>(endpoints.cost.deleteCost(id), "delete");
            if (status === 200 && response && response.success){
                toast.success("Costo eliminado"); // No funciona
            } else {
                setError(errorLogs?.message || response?.message || "Failed to delete Cost");
                return false;
            }
        } catch (error) {
            setError("Error deleting cost");
            return false;
        } finally {
            setLoading(false);
        }
    }

    const updateCost = async (id:number, PatchCost: PatchCost) => {
        try {
            setLoading(true)
            setError(null)
            const {response, status, errorLogs} = await fetchData<apiResponse<PatchCost>>(endpoints.cost.updateCost(id), "patch", PatchCost);
            if (status === 200){
                console.log("Cost patched successfully") //Cambiar luego por un toast
            } else {
                setError(errorLogs?.message || response?.message || "Failed to delete Cost");
                return false;
            }
        } catch (error) {
            setError("error un updateCost BillingViewModel")
            
        }finally {(setLoading(false))}
    }





    return {
        billings,
        billing,
        loading,
        error,
        successMessage,
        getBillings,
        getBilling,
        getLeads,
        leads,
        getLeadById,
        lead,
        deleteBilling,
        getPlans,
        plans,
        createBilling,
        PatchBilling,
        createCost,
        deleteCost,
        updateCost
    }
    
}