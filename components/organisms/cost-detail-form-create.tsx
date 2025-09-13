import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { CreateCostData } from "@/types/cost-management";

import { toast } from "sonner";
import { Cost } from "@/types/cost-management";

export function CostDetailFormCreate({
  estimateId, 
  onBack,
  onCreateSuccess
}: {
  estimateId: number;
  onBack?: () => void;
  onCreateSuccess?: (newCost: Cost) => void;
}) {
  const { createCost } = BillingViewModel();
  const [loadingPost, setLoadingPost] = useState(false)

  const handleCreateCost = async () => {
    const toastId = toast.loading('Creating cost...');
    try {
      setLoadingPost(true);
      const costData: CreateCostData = {
        name: Name,
        description: description,
        type: type,
        value: value,
        estimateId: estimateId
      };
      await createCost(costData);
      
      toast.success('Cost created successfully', {
        id: toastId,
        description: `The cost "${costData.name}" has been created.`
      });

      // Crear objeto de costo local para actualizar la UI
      const newCost: Cost = {
        ...costData,
        id: Date.now(), // ID temporal hasta que se recargue la página
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Notificar al componente padre del nuevo costo
      onCreateSuccess?.(newCost);
      onBack?.(); // Regresar a la lista después de crear exitosamente
    } catch (error) {
      console.error('Error creating cost:', error);
    } finally {
      setLoadingPost(false);
    }
  };

  
  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState(0);

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
           Create Cost
          </h1>
        </div>
      </div>
      <div className="bg-black rounded-lg  p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto ">
          <div className="max-w-7xl  space-y-3 text-[#393939] text-base/4 mx-52">
            <p>Name</p>
            <Input
              placeholder="Name"
              className="w-full h-7"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
            <hr className="border-[#EBEDF2]" />
            <p>Description</p>
            <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the description of the Cost"
                rows={6}
                maxLength={200}
                className="w-full h-28 resize-none text-xs"
              />
            <hr className="border-[#EBEDF2]" />
            <p>Type</p>
            <Select value={type} onValueChange={setType}>
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
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              type="number"
            />
            <hr className="border-[#EBEDF2]" />
            <Button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={handleCreateCost}
              disabled={loadingPost}
            >
              {loadingPost ? 'Updating...' : 'Add Cost'}  
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}