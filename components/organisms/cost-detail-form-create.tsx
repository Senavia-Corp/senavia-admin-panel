import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { CreateCostData } from "@/types/cost-management";
import { Cost } from "@/types/cost-management";
import { useToast } from "@/hooks/use-toast";

export function CostDetailFormCreate({
  estimateId, 
  totalValue,
  onBack,
  onCreateSuccess,
}: {
  estimateId: number;
  totalValue: number;
  onBack?: () => void;
  onCreateSuccess?: (newCost: Cost) => void;
}) {
  const { createCost, PatchBilling } = BillingViewModel();
  const [loadingPost, setLoadingPost] = useState(false)
  const { toast } = useToast();
  const handleCreateCost = async () => {
    try {
      setLoadingPost(true);
      const costData: CreateCostData = {
        name: Name,
        description: description,
        type: type,
        value: value,
        estimateId: estimateId
      };
      const response =await createCost(costData);

      const newTotalValue = totalValue + value;
      await PatchBilling(estimateId, {
        totalValue: newTotalValue
      });
      
      // Crear objeto de costo local para la UI
      const newCost: Cost = {
        ...costData,
        // Puedes generar un número aleatorio para el ID así:
        id: response.data?.[0]?.id || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      toast({
        title: 'Cost created successfully',
        description: 'The cost has been created successfully.',
        duration: 3000,
      });

      // Notificar al componente padre
      onCreateSuccess?.(newCost);
      onBack?.();
    } catch (error) {
      console.error('Error creating cost:', error);
      toast({
        title: 'Failed to create cost',
        description: 'The cost has not been created.',
        duration: 3000,
        variant: "destructive",

      });
    } finally {
      setLoadingPost(false);
    }
  };


  
  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState(0);

  const Types = ["LICENSE", "MANPOWER", "TECHNOLOGIES","OTHERS"]
  
  const isFormValid =
    Name.trim().length > 0 &&
    description.trim().length > 0 &&
    type.trim().length > 0 &&
    value > 0;
  
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4 items-center">
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
          <div className="max-w-7xl  space-y-3 text-[#393939] text-base/4 mx-auto xl:mx-44">
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
                maxLength={10000}
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
              placeholder="$0"
              className="w-full h-7"
              type="text"
              value={value ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value) : ''}
              onChange={(e) => {
                // Eliminar todo excepto números
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                if (rawValue === '') {
                  setValue(0);
                  return;
                }
                setValue(parseInt(rawValue));
              }}
            />
            <hr className="border-[#EBEDF2]" />
            <Button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={handleCreateCost}
              disabled={loadingPost || !isFormValid}
            >
              {loadingPost ? 'Updating...' : 'Add Cost'}  
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}