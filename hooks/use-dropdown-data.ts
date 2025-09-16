import { useState, useEffect } from "react";
import { UserManagementService } from "@/services/user-management-service";
import { LeadManagementService } from "@/services/lead-management-service";
import type { User } from "@/types/user-management";
import type { Lead } from "@/types/lead-management";

interface DropdownOption {
  id: number;
  name: string;
  subtitle?: string;
  phone?: string;
  address?: string;
}

export function useUserDropdownData() {
  const [users, setUsers] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedUsers = await UserManagementService.getUsers();
      const userOptions: DropdownOption[] = fetchedUsers.map((user: User) => ({
        id: parseInt(user.id),
        name: user.name,
        subtitle: user.email,
        phone: user.phone,
        address: user.address,
      }));
      setUsers(userOptions);
    } catch (err) {
      setError("Error loading users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    options: users,
    isLoading,
    error,
    refetch: loadUsers,
  };
}

export function useLeadDropdownData() {
  const [leads, setLeads] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedLeads = await LeadManagementService.getLeads();
      const leadOptions: DropdownOption[] = fetchedLeads.map((lead: Lead) => ({
        id: lead.id,
        name: lead.clientName,
        subtitle: lead.description,
      }));
      setLeads(leadOptions);
    } catch (err) {
      setError("Error loading leads");
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return {
    options: leads,
    isLoading,
    error,
    refetch: loadLeads,
  };
}
