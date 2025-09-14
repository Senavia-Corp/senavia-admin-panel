"use client";

import { useState, useEffect } from "react";
import { CreateBlogDialog } from "@/components/organisms/create-blog-dialog"; // cambiar por Project Editor
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Project } from "./project/project";
import type { Product } from "./product/product";

import { ProductEditor } from "../organisms/product-editor";
import { GeneralTable } from "@/components/organisms/tables/general-table";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProjectEditor } from "../organisms/project-editor";
import type { Service, ServiceApiResponse } from "../pages/service/service";
import { ImageSelector } from "@/components/atoms/image-selector";

import ProductViewModel from "./product/ProductViewModel";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceViewModel from "../pages/service/ServiceViewModel";

export function PortfolioPage() {
  const [dataProducts, setDataProducts] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const {
    services,
    getAllServices,
    error: serviceError,
    loading: serviceLoading,
  } = ServiceViewModel();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    siteUrl: "",
    serviceId: 1,
    imageUrl: null as File | string|null,
  });
  const {
    products,
    loading,
    pageInfo,
    productId,
    getProductById,
    deleteProduct,
  } = ProductViewModel({
    isPaginated: true,
    offset,
    itemsPerPage,
  });

  const [newProject, setNewProject] = useState({
    name: "",
    resume: "",
    description: "",
    publicationDate: "",
    startDate: "",
    endDate: "",
    imagePreviewUrl: null as File | null,
    workTeam_id: "",
    estimate_id: "",
    userId: "",
  });

  useEffect(() => {
    if (productId) {
      console.log("selectedProject actualizado:", productId);
    }
  }, [productId]);

  /*useEffect(() => {
    loadProjects()
    loadThemes()
  }, [searchTerm, themeFilter])*/

  /*const loadProjects = async () => {
    try {
      const projectsData = await BlogManagementService.getBlogs(searchTerm, themeFilter)
      //setBlogs(blogsData)      
    } catch (error) {
      console.error("Error loading blogs:", error)
    }
  }*/

  /*const loadThemes = async () => {
    try {
      const themesData = await BlogManagementService.getBlogThemes()
      setThemes(themesData)
    } catch (error) {
      console.error("Error loading themes:", error)
    }
  }*/

  /*const handleDeleteBlog = async (blog: Blog) => {
    try {
      await BlogManagementService.deleteBlog(blog.id)
      setBlogToDelete(null)
      loadBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }*/
  const handleImageChange = (file: File | null) => {
    setProfileImage(file);
    setFormData({...formData,imageUrl:file})
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        console.log(`✅ Producto ${id} eliminado correctamente`);
        setDataProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error(`❌ No se pudo eliminar el producto ${id}`);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  const handleViewProject = async (product: Product) => {
    setEditingProductId(product.id);
    const res = await getProductById(product.id);
    console.log("soy respuesta: " + res?.name);
    if (res) {
      setFormData({
        name: res.name,
        description: res.description,
        siteUrl: res.siteUrl,
        serviceId: Number(res.serviceId),
        imageUrl: res.imageUrl??null,
      });
    }
    //setShowEditor(true);
  };

  const handleCreateProject = () => {
    setEditingProductId(null);
    setShowEditor(true);
  };
  const handleFilterChange = () => {};
  const handlers = {
    onCreate: handleCreateProject,
    onView: handleViewProject,
    onDelete: (product: Product) => setProductToDelete(product),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };
  const [isLoading, setIsLoading] = useState(false);
  const { saveProduct, error } = ProductViewModel();
  const handleSave = async () => {
    const form_data = new FormData();

    form_data.append("name", formData.name);
    form_data.append("description", formData.description);
    form_data.append("siteUrl", formData.siteUrl);
    form_data.append("serviceId", String(formData.serviceId));
    if (formData.imageUrl instanceof File) {
      form_data.append("imageUrl", formData.imageUrl);
    }

    setIsLoading(true);
    if (productId) {
      console.log("hola estoy funcionando");
      const success = await saveProduct(form_data, productId.id);
      if (success) {
        console.log("✅ Producto guardado correctamente");
      } else {
        console.error("❌ Error guardando producto:", error);
      }
    }
  };

  if (showEditor) {
    return (
      <div>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <ProductEditor
              productId={editingProductId ?? undefined}
              onBack={() => setShowEditor(false)}
              onSave={() => {
                setShowEditor(false);
                //loadBlogs()
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Portfolio Posts
            </h1>
            <div className="flex flex-row gap-4 h-full w-full">
              <div className="flex-1 min-h-0">
                {GeneralTable(
                  "portfolio-page",
                  "Add Product",
                  "Description",
                  "All Products",
                  "Description",
                  ["Product ID", "Name", "Actions"],
                  products,
                  handlers
                )}
              </div>

              <div className="w-96 bg-white rounded-lg space-y-8 flex-shrink-0 p-6">
                {/* Blog Title */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mt-1">Product Name</p>
                  <Input
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    value={formData.name ?? productId?.name ?? ""}
                    placeholder="Digite el titulo de su blog"
                    className="text-2xl font-bold "
                  />
                  <p className="text-sm text-gray-500 mt-1">Site Url</p>
                  <Input
                    onChange={(e) =>
                      setFormData({ ...formData, siteUrl: e.target.value })
                    }
                    value={formData.siteUrl ?? productId?.siteUrl ?? ""}
                    placeholder="Digite el titulo de su blog"
                    className="text-2xl font-bold "
                  />
                  {/* Service */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={String(formData.serviceId)}
                        onValueChange={(value) =>
                          setFormData({ ...formData, serviceId: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s: Service) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        value={
                          formData.description ?? productId?.description ?? ""
                        }
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                        rows={4}
                        maxLength={200}
                      />
                      <div className="text-right text-sm text-gray-500 mt-2">
                        {formData.description?.length ??
                          productId?.description?.length ??
                          0}
                        /200
                      </div>
                    </CardContent>
                  </Card>
                 
                  {/* Images */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Main Image */}
                      <div>
                        <label className="block text-sm font-medium mb-1 mt-4">
                    Profile Picture
                  </label>
                  <ImageSelector
                    value={profileImage}
                    onChange={handleImageChange}
                    placeholder="No image selected"
                    disabled={isLoading}
                    previewSize="medium"
                    uploadButtonText="Upload new image"
                    showUploadButton={true}
                    showRemoveButton={true}
                    showPreview={true}
                    showFileName={true}
                  /> 

                      
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-center">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="cursor-pointer rounded-full bg-[#99CC33] text-white font-bold text-xs py-2 px-4 inline-block disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : "Update Product"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*<CreateBlogDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadBlogs}
        themes={themes}
      />*/}

      {/*<DeleteConfirmDialog
        open={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => projectToDelete && handleDeleteBlog(blogToDelete)}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
      />*/}
      {/* Controles de paginación */}
      <DeleteConfirmDialog
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            handleDelete(productToDelete.id).then(() => {
              setProductToDelete(null);
              // 🔄 refrescar proyectos
              // getAllProjects(); <-- si lo expones desde ProjectViewModel
            });
          }
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setOffset((prev) => Math.max(prev - itemsPerPage, 0))}
          disabled={offset === 0 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅️ Anterior
        </button>

        <span>Página {Math.floor(offset / itemsPerPage) + 1}</span>

        <button
          onClick={() => {
            console.log("deberia fun: " + pageInfo.totalProducts);
            if (!pageInfo || offset + itemsPerPage < pageInfo.totalProducts) {
              console.log("deberia fun2");
              const lastItemId = products[products.length - 1].id;
              setOffset(lastItemId);
            }
          }}
          disabled={
            loading ||
            (pageInfo && offset + itemsPerPage >= pageInfo.totalProducts)
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
