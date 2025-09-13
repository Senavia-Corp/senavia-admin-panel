"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

import type { Product } from "../pages/product/product";
import type { Service, ServiceApiResponse } from "../pages/service/service";
import ProductViewModel from "../pages/product/ProductViewModel";
import ServiceViewModel from "../pages/service/ServiceViewModel";

interface ProductEditorProps {
  productId?: number;
  onBack: () => void;
  onSave: () => void;
}

export function ProductEditor({
  productId,
  onBack,
  onSave,
}: ProductEditorProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { saveProduct, error, loading } = ProductViewModel();
  const { services, getAllServices, error: serviceError, loading: serviceLoading } = ServiceViewModel();


  
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    siteUrl: "",
    serviceId: "",
    imageUrl: null as File | null,
  });


  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
    getAllServices();
  }, [productId]);

  const loadProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/product?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        setFormData({
          name: data.data.name,
          description: data.data.description,
          siteUrl: data.data.siteUrl,
          serviceId: String(data.data.serviceId),
          imageUrl: null,
        });
      }
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  

  const handleSave = async () => {
    const form_data = new FormData();

    form_data.append("name", formData.name);
    form_data.append("description", formData.description);
    form_data.append("siteUrl", formData.siteUrl);
    form_data.append("serviceId", formData.serviceId);
    if (formData.imageUrl instanceof File) {
      form_data.append("imageUrl", formData.imageUrl);
    }

    setIsLoading(true);

    const success = await saveProduct(form_data, productId ?? undefined);
    if (success) {
      console.log("✅ Producto guardado correctamente");
      onSave();
    } else {
      console.error("❌ Error guardando producto:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {productId ? "Edit Product" : "Create Product"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full">
        {/* Left Column */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6">
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Name
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter product name..."
              className="text-2xl font-bold"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description..."
              rows={6}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Website URL
            </Label>
            <Input
              value={formData.siteUrl}
              onChange={(e) =>
                setFormData({ ...formData, siteUrl: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-96 bg-white rounded-lg space-y-6 flex-shrink-0 p-4">
          {/* Service */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Service</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.serviceId}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s:Service) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Image */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">
                  Drag and drop an image here or
                </p>
                <label className="cursor-pointer rounded-full bg-[#99CC33] text-white font-bold text-xs py-2 px-4 inline-block">
                  Upload from my Computer
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        
                        setFormData({ ...formData, imageUrl: files[0] });
                      }
                    }}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center my-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
            >
              {isLoading
                ? "Saving..."
                : productId
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
