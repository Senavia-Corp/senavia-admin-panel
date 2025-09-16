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

export function useUserDropdownData(autoLoad: boolean = true) {
  const [users, setUsers] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

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
      setHasLoaded(true);
    } catch (err) {
      setError("Error loading users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadUsers();
    }
  }, [autoLoad]);

  return {
    options: users,
    isLoading,
    error,
    refetch: loadUsers,
    hasLoaded,
  };
}

export function useLeadDropdownData(autoLoad: boolean = true) {
  const [leads, setLeads] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

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
      setHasLoaded(true);
    } catch (err) {
      setError("Error loading leads");
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadLeads();
    }
  }, [autoLoad]);

  return {
    options: leads,
    isLoading,
    error,
    refetch: loadLeads,
    hasLoaded,
  };
}
