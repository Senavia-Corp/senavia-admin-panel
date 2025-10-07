import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import {
  apiResponse,
  Billing,
  Billings,
  Cost,
  CreateBillingData,
  SendToClientData,
  CheckoutSession,
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
import { useToast } from "@/hooks/use-toast";
import { PatchBillingData } from "@/types/billing-management";

export function BillingViewModel() {
  const { fetchData } = useFetch();
  const [billing, setBilling] = useState<Billing[]>([]);
  const [leads, setLeads] = useState<Leads[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [billings, setBillings] = useState<Billings[]>([]);
  const [lead, setLead] = useState<Lead[]>([]);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [plan, setPlan] = useState<Plan[]>([]);
  const [cost, setCost] = useState<CreateCostData[]>([]);
  const [payment, setPayment] = useState<CreatePaymentData[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const { toast } = useToast();

  const getBillings = async () => {
    setError(null);
    const { response, status, errorLogs } = await fetchData<
      apiResponse<Billings>
    >(endpoints.estimate.getEstimates, "get");
    if (status === 200 && response && response.success) {
      setBillings(response.data);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to fetch billings"
      );
    }
  };

  const getBilling = async (id: number) => {
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Billing>>(endpoints.estimate.getEstimate(id), "get");
    if ((status === 200 || status === 201) && response && response.success) {
      const billingData = Array.isArray(response.data) ? response.data : [response.data];
      setBilling(billingData);
    } else {
      setError(
        errorLogs?.message || response?.message || "Failed to fetch billing"
      );
    }
  };

  const createBilling = async (billing: CreateBillingData) => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Validar datos requeridos
      if (!billing.lead_id) {
        throw new Error("Lead ID is required");
      }

      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.createEstimate, "post", billing);

      if ((status === 200 || status === 201) && response?.success) {
        const billingData = Array.isArray(response.data) ? response.data : [response.data];
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
    }
  };

  const createStripeSession = async (
    reference: string,
    amount: number,
    id: number,
    percentagePaid: number,
    estimateId: number
  ) => {
    setError(null);
    setSuccessMessage(null);

    if (!reference || !amount) {
      setError(
        "Reference and amount are required to create a checkout session"
      );
      return null;
    }

    const { response, status, errorLogs } = await fetchData<
      apiResponse<CheckoutSession>
    >(endpoints.stripe.createCheckoutSession, "post", {
      reference,
      amount,
      id,
      percentagePaid,
      estimateId,
    });
    if (status === 200 && response && response.success) {
      const url = response.data;
      return url;
    } else {
      setError(
        errorLogs?.message ||
        response?.message ||
        "Failed to create checkout session"
      );
      return null;
    }
  };

  const PatchBilling = async (
    id: number,
    billing: Partial<CreateBillingData>
  ) => {
    try {
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.updateEstimate(id), "patch", billing);
      if (status === 200 && response && response.success) {
        setBilling(response.data);
        return response.data;
      } else {
        throw new Error(
          errorLogs?.message || response?.message || "Failed to update billing"
        );
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update billing"
      );
      throw error;
    }
  };

  const getLeads = async () => {
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
  };

  const deleteBilling = async (id: number) => {
    try {
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
    }
  };

  const getLeadById = async (id: number) => {
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
  };

  const getPlans = async () => {
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
  };

  const getPlanById = async (id: number) => {
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Plan>>(endpoints.plan.getById(id), "get");
    if (status === 200 && response && response.success) {
      setPlan(response.data);

    } else {
      setError(errorLogs?.message || response?.message || "Failed to fetch plan");
      return null;
    }
  }

  const createCost = async (cost: CreateCostData) => {
    setError(null);
    const { response, status, errorLogs } = await fetchData<apiResponse<Cost>>(
      endpoints.cost.createCost,
      "post",
      cost
    );
    if (status === 201 && response && response.success) {
      setCost(response.data);
      return { success: true, data: response.data };
    } else {
      setError(errorLogs?.message || response?.message || "Failed to create cost");
      return { success: false, error: errorLogs?.message || response?.message || "Failed to create cost" };
    }
  };

  const deleteCost = async (id: number) => {
    try {
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Cost>
      >(endpoints.cost.deleteCost(id), "delete");
      if (status === 200 && response && response.success) {
      } else {
        setError(
          errorLogs?.message || response?.message || "Failed to delete Cost"
        );
        return false;
      }
    } catch (error) {
      setError("Error deleting cost");
      return false;
    }
  };

  const updateCost = async (id: number, PatchCost: PatchCost) => {
    try {
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
    }
  };

  // ===== PAYMENT FUNCTIONS =====
  const getPayments = async () => {
    setError(null);

    try {
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Payment>
      >(endpoints.payment.getPayments, "get");

      if (status === 200 && response && response.success) {
        // Normalizar los datos para asegurar que amount sea número
        const normalizedPayments = response.data.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
        }));
        setPayments(normalizedPayments);
      } else {
        // Si la API falla, usar el servicio mock
        console.warn("API failed for getPayments, using mock service");
        const mockPayments = await PaymentManagementService.getPayments();
        setPayments(mockPayments);
      }
    } catch (error) {
      console.warn("API request failed for getPayments, using mock service");
      // Si hay error de red, usar el servicio mock
      const mockPayments = await PaymentManagementService.getPayments();
      setPayments(mockPayments);
    }
  };

  const createPayment = async (payment: CreatePaymentData) => {
    setError(null);

    try {
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Payment>
      >(endpoints.payment.createPayment, "post", payment);

      if (status === 201 && response && response.success) {
        const rawPayments = Array.isArray(response.data)
          ? response.data
          : [response.data];
        // Normalizar los datos para asegurar que amount sea número
        const newPayments = rawPayments.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
        }));
        // Actualizar la lista de payments agregando el nuevo payment
        setPayments((prevPayments) => [...prevPayments, ...newPayments]);
        setPayment(newPayments[0]);
        //toast.success("Payment created successfully");
        toast({
          title: "Payment created successfully",
          description: "The payment has been created successfully.",
        });

        return { success: true, data: response.data };
      } else {
        // Si la API falla, usar el servicio mock
        console.warn("API failed for createPayment, using mock service");
        const mockResponse = await PaymentManagementService.createPayment(
          payment
        );
        if (mockResponse.success) {
          const newPayments = Array.isArray(mockResponse.data)
            ? mockResponse.data
            : [mockResponse.data];
          // Actualizar la lista de payments agregando el nuevo payment
          setPayments((prevPayments) => [...prevPayments, ...newPayments]);
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
        const newPayments = Array.isArray(mockResponse.data)
          ? mockResponse.data
          : [mockResponse.data];
        // Actualizar la lista de payments agregando el nuevo payment
        setPayments((prevPayments) => [...prevPayments, ...newPayments]);
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
    }
  };

  const deletePayment = async (id: number) => {
    try {
      setError(null);

      try {
        const { response, status, errorLogs } = await fetchData<
          apiResponse<Payment>
        >(endpoints.payment.deletePayment(id), "delete");

        if (status === 200 && response && response.success) {
          // Actualizar el estado local removiendo el payment eliminado
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment.id !== id)
          );
          return true;
        } else {
          // Si la API falla, usar el servicio mock
          console.warn("API failed for deletePayment, using mock service");
          const success = await PaymentManagementService.deletePayment(id);
          if (success) {
            // Actualizar el estado local removiendo el payment eliminado
            setPayments((prevPayments) =>
              prevPayments.filter((payment) => payment.id !== id)
            );
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
          // Actualizar el estado local removiendo el payment eliminado
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment.id !== id)
          );
          return true;
        } else {
          setError("Error deleting payment");
          return false;
        }
      }
    } catch (error) {
      setError("Error deleting payment");
      return false;
    }
  };

  const updatePayment = async (id: number, PatchPayment: PatchPaymentData) => {
    try {
      setError(null);

      try {
        const { response, status, errorLogs } = await fetchData<
          apiResponse<Payment>
        >(endpoints.payment.updatePayment(id), "patch", PatchPayment);

        if (status === 200 && response && response.success) {
          // Actualizar el estado local de payments
          setPayments((prevPayments) =>
            prevPayments.map((payment) =>
              payment.id === id
                ? {
                  ...payment,
                  ...PatchPayment,
                  amount: Number(PatchPayment.amount || payment.amount),
                  updatedAt: new Date().toISOString(),
                }
                : payment
            )
          );
          return { success: true, data: response.data };
        } else {
          // Si la API falla, usar el servicio mock
          console.warn("API failed for updatePayment, using mock service");
          const mockResponse = await PaymentManagementService.updatePayment(
            id,
            PatchPayment
          );
          if (mockResponse.success) {
            // Actualizar el estado local con los datos del mock
            setPayments((prevPayments) =>
              prevPayments.map((payment) =>
                payment.id === id
                  ? {
                    ...payment,
                    ...PatchPayment,
                    amount: Number(PatchPayment.amount || payment.amount),
                    updatedAt: new Date().toISOString(),
                  }
                  : payment
              )
            );
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
          // Actualizar el estado local con los datos del mock
          setPayments((prevPayments) =>
            prevPayments.map((payment) =>
              payment.id === id
                ? {
                  ...payment,
                  ...PatchPayment,
                  amount: Number(PatchPayment.amount || payment.amount),
                  updatedAt: new Date().toISOString(),
                }
                : payment
            )
          );

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
    }
  };
  const sendToClient = async (sendToClientData: SendToClientData) => {
    try {
      setError(null);
      const { response, status, errorLogs } = await fetchData<
        apiResponse<Billing>
      >(endpoints.estimate.sendToClient, "post", sendToClientData);
      console.log(status, response);
      if (status === 200 || status === 201) {
        //toast.success("Billing sent to client successfully");
        toast({
          title: "Billing sent to client successfully",
          description: "The billing has been sent to the client.",
        });
      } else {
        setError(
          errorLogs?.message ||
          response?.message ||
          "Failed to send billing to client"
        );
        //toast.error("Error sending billing to client");
        toast({
          title: "Failed to send billing to client",
          description: errorLogs?.message || response?.message || "Failed to send billing to client",
          duration: 3000,
        });
      }
    } catch (error) {
      const errorMessage = "Error sending billing to client";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    billings,
    billing,
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
    payments,
    getPayments,
    createPayment,
    deletePayment,
    updatePayment,
    sendToClient,
    createStripeSession,
    getPlanById,
    plan,
  };
}
