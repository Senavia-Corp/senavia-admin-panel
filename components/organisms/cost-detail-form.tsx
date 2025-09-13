import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { Cost, PatchCost } from "@/types/cost-management";
import { toast } from "sonner";

interface CostDetailFormProps {
  costId: number;
  cost: Cost;
  onBack?: () => void;
  onUpdate?: (updatedCost: Cost) => void;
}

export function CostDetailForm({ costId, cost, onBack, onUpdate }: CostDetailFormProps) {
  const { updateCost } = BillingViewModel();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localCost, setLocalCost] = useState(cost);

  const handleUpdateCost = async () => {
    const toastId = toast.loading('Updating cost...');
    try {
      setIsUpdating(true);
      const costData: PatchCost = {
        name: localCost.name,
        description: localCost.description,
        type: localCost.type,
        value: localCost.value,
      };
      await updateCost(costId, costData);
      
      // Actualizar el costo local con los nuevos datos
      const updatedCost: Cost = {
        ...cost,
        ...costData,
        updatedAt: new Date().toISOString()
      };
      
      setLocalCost(updatedCost);
      onUpdate?.(updatedCost);
      
      toast.success('Cost updated successfully', {
        id: toastId,
        description: `The cost "${costData.name}" has been updated.`
      });
    } catch (error) {
      console.error('Error updating cost:', error);
      toast.error('Failed to update cost', {
        id: toastId,
        description: 'There was an error updating the cost. Please try again.'
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
          <div className="max-w-7xl space-y-3 text-[#393939] text-base/4 mx-52">
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
              placeholder="Value"
              className="w-full h-7"
              value={localCost.value}
              onChange={(e) => handleFieldChange('value', Number(e.target.value))}
              type="number"
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