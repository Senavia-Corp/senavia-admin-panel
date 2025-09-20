import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { Cost, PatchCost } from "@/types/cost-management";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface CostDetailFormProps {
  billingId: number;
  costId: number;
  totalValue: number;
  cost: Cost;
  onBack?: () => void;
  onUpdate?: (updatedCost: Cost) => void;
}

export function CostDetailForm({ billingId, costId, totalValue, cost, onBack, onUpdate }: CostDetailFormProps) {
  const { updateCost, PatchBilling } = BillingViewModel();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localCost, setLocalCost] = useState(cost);
  const { toast } = useToast();
  const handleUpdateCost = async () => {
    try {
      setIsUpdating(true);
      const costData: PatchCost = {
        name: localCost.name,
        description: localCost.description,
        type: localCost.type,
        value: localCost.value,
      };

      // Primero actualizamos el costo
      await updateCost(costId, costData);
      console.log("Cost updated successfully");

      // Después actualizamos el billing con el nuevo total
      // Restamos el valor anterior y sumamos el nuevo valor
      const newTotalValue = Number(totalValue) - Number(cost.value) + Number(costData.value);
      console.log("Updating billing with new total:", newTotalValue);
      
      await PatchBilling(billingId, {
        totalValue: newTotalValue
      });
      
      // Actualizamos localmente
      const updatedCost: Cost = {
        ...cost,
        ...costData,
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar estado local y notificar al padre
      setLocalCost(updatedCost);
      onUpdate?.(updatedCost);
      
      toast({
        title: 'Cost updated successfully',
        description: `The cost "${costData.name}" has been updated.`
      });
    } catch (error) {
      console.error('Error updating cost:', error);
      // En caso de error, revertimos los cambios locales
      setLocalCost(cost);
      toast({
        title: 'Failed to update cost',
        description: 'The cost has not been updated.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldChange = (field: keyof typeof localCost, value: any) => {
    setLocalCost(prev => ({
      ...prev,
      [field]: value
    }))
  };

  const Types = ["LICENSE"]
  
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
           Edit Cost
          </h1>
        </div>
      </div>
      <div className="bg-black rounded-lg  p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl space-y-3 text-[#393939] text-base/4 mx-auto xl:mx-44">
            <p>Name</p>
            <Input
              placeholder="Name"
              className="w-full h-7"
              value={localCost.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              type="text"
            />
            <hr className="border-[#EBEDF2]" />
            <p>Description</p>
            <Textarea
                id="description"
                value={localCost.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Enter the description of the Cost"
                rows={6}
                maxLength={200}
                className="w-full h-28 resize-none text-xs"
              />
            <hr className="border-[#EBEDF2]" />
            <p>Type</p>
            <Select value={localCost.type} onValueChange={(value) => handleFieldChange('type', value)}>
              <SelectTrigger className="w-full h-7">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Types.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             
            <hr className="border-[#EBEDF2]" />
            <p>Value</p>
            <Input
              placeholder="$0"
              className="w-full h-7"
              type="text"
              value={localCost.value ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(localCost.value) : ''}
              onChange={(e) => {
                // Eliminar todo excepto números
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                if (rawValue === '') {
                  handleFieldChange('value', 0);
                  return;
                }
                handleFieldChange('value', parseInt(rawValue));
              }}
            />
            <hr className="border-[#EBEDF2]" />
            <Button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={handleUpdateCost}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Cost'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}