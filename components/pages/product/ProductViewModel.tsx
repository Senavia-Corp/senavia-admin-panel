import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import { Product, ProductApiResponse, ApiResponse } from "./product";

export interface ProductViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
}

export const ProductViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
}: ProductViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [productId, setProductId] = useState<Product | null>(null);

  const saveProduct = async (
  formData: FormData,
  productId?: number
): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const url = productId
      ? endpoints.product.update(productId)
      : endpoints.product.create;    
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const { response, status, errorLogs } = await fetchData<any>(
      url,
      productId ? "patch" : "post",
      formData,
      "form"
    );

    console.log("Respuesta cruda:", response);

    if (status === 200 && response?.success) {
      if (!productId) {
        setProducts((prev) => [...prev, response.data]);
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === response.data.id ? response.data : p))
        );
      }
      return true;
    } else {
      const errorMessage =
        errorLogs?.message ||
        response?.message ||
        `Failed to save Product (Status: ${status})`;
      setError(errorMessage);
      console.error("Error saving product:", errorMessage);
      return false;
    }
  } catch (err: any) {
    const errorMessage =
      err.errorMessage || "An unexpected error occurred while saving Product.";
    setError(errorMessage);
    console.error("Error saving product:", err);
    return false;
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const getProducts = async () => {
      const { response, status, errorLogs } = await fetchData<any>(
        endpoints.product.getAll,
        "get"
      );
    };
    getProducts();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [isPaginated, offset, itemsPerPage]);

  const getAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());
      const url = `${endpoints.product.getAll}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      if (isPaginated) {
        const { response, status, errorLogs } =
          await fetchData<ProductApiResponse>(url, "get");
        if (status === 200 && response && response?.success) {
          setProducts(response.data);
          setPageInfo(response.page);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Product posts (Status: ${status})`;
          setError(errorMessage);
          setProducts([]);
          setPageInfo(null);
        }
      } else {
        const { response, status, errorLogs } = await fetchData<
          ApiResponse<Product>
        >(url, "get");
        if (status === 200 && response && response.success) {
          setProducts(response.data);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Product (Status: ${status})`;
          setError(errorMessage);
          setProducts([]);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        "An unexpected error occurred while fetching Product.";
      setError(errorMessage);
      setProducts([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: number): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.product.getById(id);
      console.log("Soy url:", url);

      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Product>
      >(url, "get");
      console.log("Respuesta completa: ", response);

      if (status === 200 && response?.success) {
        const product = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setProductId(product);
        return product;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch Product with ID ${id} (Status: ${status})`;

        setError(errorMessage);
        setProductId(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while fetching Product with ID ${id}.`;

      setError(errorMessage);
      setProductId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const deleteProduct = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.product.delete(id);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<null>
      >(url, "delete");
      if (status === 200 && response?.success) {
        // Eliminar el producto de la lista local
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to delete Product with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while deleting Product with ID ${id}.`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { products, loading, error, pageInfo, productId, getProductById, deleteProduct,saveProduct    };
};
export default ProductViewModel;


