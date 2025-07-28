import { useEffect, useState } from "react";
import { endpoints,useFetch } from "@/lib/services/endpoints";
//Importo las interfaces
import {ApiResponse,Blog,SimpleBlog, SimpleBlogApiResponse,} from "./blog";

export interface BlogViewModelParams {
  simpleBlog?: boolean;
  offset?: number;
  simpleBlogsPerPage?: number;
}

export const BlogViewModel = ({simpleBlog = false,offset = 0,simpleBlogsPerPage = 10,
}: BlogViewModelParams = {}) => 
  {
  const { fetchData } = useFetch();
  const [posts, setPosts] = useState<Blog[] | SimpleBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);

  

  useEffect(() => {
    const getBlogs = async () => {
      const { response, status, errorLogs } = await fetchData<any>(
        endpoints.blog.getPosts,
        "get"
      );
    };

    getBlogs();
  }, []);

  useEffect(() => {
    getAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleBlog, offset, simpleBlogsPerPage]);

  const getAllPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir query params
      const params = new URLSearchParams();
      if (simpleBlog) params.append("simpleBlog", "true");
      if (offset) params.append("offset", offset.toString());
      if (simpleBlog && simpleBlogsPerPage)
        params.append("simpleBlogsPerPage", simpleBlogsPerPage.toString());
      //const url = `${endpoints.blog.getPosts}${params.toString() ? `?${params.toString()}` : ""}`;
      const  url = "http://localhost:3000/api/blog"

      
      if (simpleBlog) {
        
        const { response, status, errorLogs } = await fetchData<SimpleBlogApiResponse>(url, "get");
        if (status === 200 && response && response.success) {
        
          setPosts(response.data);
        
          setPageInfo(response.page);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch blog posts (Status: ${status})`;
          setError(errorMessage);
          setPosts([]);
          setPageInfo(null);
        }
      } else {
        
        const { response, status, errorLogs } = await fetchData<ApiResponse<Blog>>(url, "get");
        if (status === 200 && response && response.success) {
          setPosts(response.data);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch blog posts (Status: ${status})`;
          setError(errorMessage);
          setPosts([]);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred while fetching blog posts.";
      setError(errorMessage);
      setPosts([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    pageInfo,
  };
};

export default BlogViewModel;
