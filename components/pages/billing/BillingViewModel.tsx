import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import {
  apiResponse,
  Billing,
  Billings,
  Cost,
  CreateBillingData,
} from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";
import { Plans, Plan } from "@/types/plan";
import { CreateCostData, PatchCost } from "@/types/cost-management";
import { PaymentManagementService } from "@/services/payment-management-service";
import {
  CreatePaymentData,
  PatchPaymentData,
  Payment,
} from "@/types/payment-management";
import { toast } from "sonner";

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
  const [payment, setPayment] = useState<CreatePaymentData[]>([]);

  const getBillings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billings>
      >(endpoints.estimate.getEstimates, "get");

      if (status === 200 && response && response.success) {
        setBillings(response.data);
      } else {
        // Si la API falla, usar datos mock para testing
        console.warn(
          "API failed, using mock billings data for payments testing"
        );
        const mockBillings: Billings[] = [
          {
            id: 1,
            title: "Mock Billing 1",
            estimatedTime: 6,
            state: "CREATED",
            totalValue: "10000",
          },
          {
            id: 2,
            title: "Mock Billing 2",
            estimatedTime: 3,
            state: "PROCESSING",
            totalValue: "5000",
          },
          {
            id: 3,
            title: "Mock Billing 3",
            estimatedTime: 12,
            state: "ACCEPTED",
            totalValue: "15000",
          },
          {
            id: 4,
            title: "Mock Billing 4",
            estimatedTime: 8,
            state: "INVOICE",
            totalValue: "8000",
          },
          {
            id: 5,
            title: "Mock Billing 5",
            estimatedTime: 4,
            state: "PAID",
            totalValue: "12000",
          },
        ];
        setBillings(mockBillings);
      }
    } catch (error) {
      console.warn(
        "API request failed, using mock billings data for payments testing"
      );
      // Si hay un error de red/autenticación, usar datos mock
      const mockBillings: Billings[] = [
        {
          id: 1,
          title: "Mock Billing 1",
          estimatedTime: 6,
          state: "CREATED",
          totalValue: "10000",
        },
        {
          id: 2,
          title: "Mock Billing 2",
          estimatedTime: 3,
          state: "PROCESSING",
          totalValue: "5000",
        },
        {
          id: 3,
          title: "Mock Billing 3",
          estimatedTime: 12,
          state: "ACCEPTED",
          totalValue: "15000",
        },
        {
          id: 4,
          title: "Mock Billing 4",
          estimatedTime: 8,
          state: "INVOICE",
          totalValue: "8000",
        },
        {
          id: 5,
          title: "Mock Billing 5",
          estimatedTime: 4,
          state: "PAID",
          totalValue: "12000",
        },
      ];
      setBillings(mockBillings);
    }

    setLoading(false);
  };

  const getBilling = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.getEstimate(id), "get");

      if (status === 200 && response && response.success) {
        // Cargar los pagos asociados al billing
        const paymentsData =
          await PaymentManagementService.getPaymentsByEstimateId(id);

        // Agregar los pagos al billing
        const billingWithPayments = response.data.map((billing: Billing) => ({
          ...billing,
          payments: paymentsData,
        }));

        setBilling(billingWithPayments);
      } else {
        // Si la API falla, crear un billing mock con pagos para testing
        console.warn(
          "API failed, using mock billing data for payments testing"
        );
        const mockBilling: Billing = {
          id: id,
          title: `Mock Billing ${id}`,
          estimatedTime: 6,
          description: "Mock billing for testing payments functionality",
          state: "CREATED",
          totalValue: "10000",
          percentagePaid: 0,
          remainingPercentage: 100,
          lead_id: 1,
          plan_id: 1,
          deadLineToPay: "2025-12-31",
          invoiceDateCreated: "",
          invoiceReference: "",
          Project: [],
          costs: [],
          payments: await PaymentManagementService.getPaymentsByEstimateId(id),
        };

        setBilling([mockBilling]);
      }
    } catch (error) {
      console.warn(
        "API request failed, using mock billing data for payments testing"
      );
      // Si hay un error de red/autenticación, usar datos mock
      const mockBilling: Billing = {
        id: id,
        title: `Mock Billing ${id}`,
        estimatedTime: 6,
        description: "Mock billing for testing payments functionality",
        state: "CREATED",
        totalValue: "10000",
        percentagePaid: 0,
        remainingPercentage: 100,
        lead_id: 1,
        plan_id: 1,
        deadLineToPay: "2025-12-31",
        invoiceDateCreated: "",
        invoiceReference: "",
        Project: [],
        costs: [],
        payments: await PaymentManagementService.getPaymentsByEstimateId(id),
      };

      setBilling([mockBilling]);
    }

    setLoading(false);
  };

  const createBilling = async (billing: CreateBillingData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Validar datos requeridos
      if (!billing.lead_id || !billing.plan_id) {
        throw new Error("Total value, lead ID and plan ID are required");
      }

      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.createEstimate, "post", billing);

      if (status === 201 && response?.success) {
        const billingData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setBilling(billingData);
        setSuccessMessage("Estimate created successfully!");
        return { success: true, data: billingData };
      } else {
        throw new Error(
          errorLogs?.message || response?.message || "Failed to create billing"
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create billing";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const PatchBilling = async (id: number, billing: CreateBillingData) => {
    setLoading(true);
    setError(null);
    const { response, status, errorLogs } = await fetchData<
      apiResponse<Billing>
    >(endpoints.estimate.updateEstimate(id), "patch", billing);
    if (status === 200 && response && response.success) {
      setBilling(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to update billing"
      );
    }
    setLoading(false);
  };

  const getLeads = async () => {
    setLoading(true);
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Lead>>(
      endpoints.lead.getLeads,
      "get"
    );
    if (status === 200 && response && response.success) {
      setLeads(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to fetch leads"
      );
    }
    setLoading(false);
  };

  const deleteBilling = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.deleteEstimate(id), "delete");
      if (status === 200 && response && response.success) {
        await getBillings(); // Recargar la lista después de eliminar
        return true;
      } else {
        setError(
          errorLogs?.message || response?.message || "Failed to delete billing"
        );
        return false;
      }
    } catch (error) {
      setError("Error deleting billing");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLeadById = async (id: number) => {
    setLoading(true);
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Lead>>(
      endpoints.lead.getLead(id),
      "get"
    );
    if (status === 200 && response && response.success) {
      setLead(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to fetch lead"
      );
    }
    setLoading(false);
  };

  const getPlans = async () => {
    setLoading(true);
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Plan>>(
      endpoints.plan.getPlans,
      "get"
    );
    if (status === 200 && response && response.success) {
      setPlans(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to fetch plans"
      );
    }
    setLoading(false);
  };

  const createCost = async (cost: CreateCostData) => {
    setLoading(true);
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Cost>>(
      endpoints.cost.createCost,
      "post",
      cost
    );
    if (status === 201 && response && response.success) {
      setCost(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to create cost"
      );
    }
    setLoading(false);
  };

  const deleteCost = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Cost>
      >(endpoints.cost.deleteCost(id), "delete");
      if (status === 200 && response && response.success) {
        toast.success("Costo eliminado"); // No funciona
      } else {
        setError(
          errorLogs?.message || response?.message || "Failed to delete Cost"
        );
        return false;
      }
    } catch (error) {
      setError("Error deleting cost");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCost = async (id: number, PatchCost: PatchCost) => {
    try {
      setLoading(true);
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<PatchCost>
      >(endpoints.cost.updateCost(id), "patch", PatchCost);
      if (status === 200) {
        console.log("Cost patched successfully"); //Cambiar luego por un toast
      } else {
        setError(
          errorLogs?.message || response?.message || "Failed to delete Cost"
        );
        return false;
      }
    } catch (error) {
      setError("error un updateCost BillingViewModel");
    } finally {
      setLoading(false);
    }
  };

  // ===== PAYMENT FUNCTIONS =====
  const createPayment = async (payment: CreatePaymentData) => {
    setLoading(true);
    setError(null);

    try {
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Payment>
      >(endpoints.payment.createPayment, "post", payment);

      if (status === 201 && response && response.success) {
        setPayment(response.data);
        toast.success("Payment created successfully");
        return { success: true, data: response.data };
      } else {
        // Si la API falla, usar el servicio mock
        console.warn("API failed for createPayment, using mock service");
        const mockResponse = await PaymentManagementService.createPayment(
          payment
        );
        if (mockResponse.success) {
          toast.success("Payment created successfully (mock)");
          return mockResponse;
        } else {
          setError(mockResponse.message || "Failed to create payment");
          return mockResponse;
        }
      }
    } catch (error) {
      console.warn("API request failed for createPayment, using mock service");
      // Si hay error de red, usar el servicio mock
      const mockResponse = await PaymentManagementService.createPayment(
        payment
      );
      if (mockResponse.success) {
        toast.success("Payment created successfully (mock)");
        return mockResponse;
      } else {
        setError("Error creating payment");
        return {
          success: false,
          data: [],
          message: "Error creating payment",
          errors: [error instanceof Error ? error.message : "Unknown error"],
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      try {
        const { response, status, errorLogs } = await fetchData<
          apiResponse<Payment>
        >(endpoints.payment.deletePayment(id), "delete");

        if (status === 200 && response && response.success) {
          toast.success("Payment deleted successfully");
          return true;
        } else {
          // Si la API falla, usar el servicio mock
          console.warn("API failed for deletePayment, using mock service");
          const success = await PaymentManagementService.deletePayment(id);
          if (success) {
            toast.success("Payment deleted successfully (mock)");
            return true;
          } else {
            setError("Failed to delete Payment");
            return false;
          }
        }
      } catch (apiError) {
        console.warn(
          "API request failed for deletePayment, using mock service"
        );
        // Si hay error de red, usar el servicio mock
        const success = await PaymentManagementService.deletePayment(id);
        if (success) {
          toast.success("Payment deleted successfully (mock)");
          return true;
        } else {
          setError("Error deleting payment");
          return false;
        }
      }
    } catch (error) {
      setError("Error deleting payment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: number, PatchPayment: PatchPaymentData) => {
    try {
      setLoading(true);
      setError(null);

      try {
        const { response, status, errorLogs } = await fetchData<
          apiResponse<PatchPaymentData>
        >(endpoints.payment.updatePayment(id), "patch", PatchPayment);

        if (status === 200) {
          toast.success("Payment updated successfully");
          return { success: true };
        } else {
          // Si la API falla, usar el servicio mock
          console.warn("API failed for updatePayment, using mock service");
          const mockResponse = await PaymentManagementService.updatePayment(
            id,
            PatchPayment
          );
          if (mockResponse.success) {
            toast.success("Payment updated successfully (mock)");
            return mockResponse;
          } else {
            setError(mockResponse.message || "Failed to update Payment");
            return mockResponse;
          }
        }
      } catch (apiError) {
        console.warn(
          "API request failed for updatePayment, using mock service"
        );
        // Si hay error de red, usar el servicio mock
        const mockResponse = await PaymentManagementService.updatePayment(
          id,
          PatchPayment
        );
        if (mockResponse.success) {
          toast.success("Payment updated successfully (mock)");
          return mockResponse;
        } else {
          setError("Error updating payment");
          return {
            success: false,
            data: [],
            message: "Error updating payment",
            errors: ["Network error"],
          };
        }
      }
    } catch (error) {
      setError("Error updating payment");
      return {
        success: false,
        data: [],
        message: "Error updating payment",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    } finally {
      setLoading(false);
    }
  };

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
    updateCost,
    // Payment functions
    createPayment,
    deletePayment,
    updatePayment,
  };
}
