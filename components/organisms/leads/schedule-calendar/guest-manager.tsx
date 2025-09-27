"use client";

import { useState } from "react";
import { Plus, X, User, Mail, Phone, UserCheck } from "lucide-react";
import { Guest } from "@/types/lead-management";

interface GuestManagerProps {
  guests: Guest[];
  onGuestsChange: (guests: Guest[]) => void;
  disabled?: boolean;
}

const ROLE_OPTIONS = [
  { value: "Client", label: "Cliente" },
  { value: "Team Member", label: "Miembro del Equipo" },
  { value: "Stakeholder", label: "Stakeholder" },
  { value: "Other", label: "Otro" },
];

export function GuestManager({
  guests,
  onGuestsChange,
  disabled,
}: GuestManagerProps) {
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuest, setNewGuest] = useState<Guest>({
    name: "",
    email: "",
    phone: "",
    role: "Client",
  });

  const handleAddGuest = () => {
    if (newGuest.name.trim() && newGuest.email.trim()) {
      // Verificar emails duplicados
      const emailExists = guests.some(
        (guest) => guest.email.toLowerCase() === newGuest.email.toLowerCase()
      );

      if (emailExists) {
        alert("Este email ya está agregado como invitado");
        return;
      }

      onGuestsChange([...guests, { ...newGuest }]);
      setNewGuest({ name: "", email: "", phone: "", role: "Client" });
      setIsAddingGuest(false);
    }
  };

  const handleRemoveGuest = (index: number) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    onGuestsChange(updatedGuests);
  };

  const handleUpdateGuest = (index: number, updatedGuest: Guest) => {
    const updatedGuests = guests.map((guest, i) =>
      i === index ? updatedGuest : guest
    );
    onGuestsChange(updatedGuests);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Invitados ({guests.length})
        </h4>
        {!isAddingGuest && (
          <button
            type="button"
            onClick={() => setIsAddingGuest(true)}
            disabled={disabled}
            className="text-sm text-[#99CC33] hover:text-[#8bb82e] font-medium flex items-center gap-1 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Agregar Invitado
          </button>
        )}
      </div>

      {/* Lista de invitados existentes */}
      {guests.length > 0 && (
        <div className="space-y-2">
          {guests.map((guest, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-sm truncate">
                    {guest.name}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {guest.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  {guest.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{guest.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveGuest(index)}
                disabled={disabled}
                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nuevo invitado */}
      {isAddingGuest && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#99CC33] focus:border-transparent"
                placeholder="Nombre del invitado"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newGuest.email}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#99CC33] focus:border-transparent"
                placeholder="email@ejemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={newGuest.phone}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#99CC33] focus:border-transparent"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={newGuest.role}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#99CC33] focus:border-transparent"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingGuest(false);
                setNewGuest({ name: "", email: "", phone: "", role: "Client" });
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddGuest}
              disabled={!newGuest.name.trim() || !newGuest.email.trim()}
              className="px-4 py-2 bg-[#99CC33] hover:bg-[#8bb82e] text-white text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {guests.length === 0 && !isAddingGuest && (
        <div className="text-center py-6 text-gray-500 text-sm">
          <UserCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          No hay invitados agregados
        </div>
      )}
    </div>
  );
}
