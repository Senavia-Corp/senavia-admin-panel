"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogTableRow } from "@/components/molecules/blog-table-row";
import { Plus, Search, Filter } from "lucide-react";
import type { Blog, BlogTheme } from "@/types/blog-management";

import { useFetch } from "@/lib/services/endpoints";
import { endpoints } from "@/lib/services/endpoints";
import BlogViewModel from "../pages/blog/BlogViewModel";
 import { useEffect } from "react"; // Asegúrate que esté importado

interface BlogsTableProps {
  blogs: Blog[];
  themes: BlogTheme[];
  onAddBlog: () => void;
  onViewBlog: (blog: Blog) => void;
  onDeleteBlog: (blog: Blog) => void;
  onSearch: (search: string) => void;
  onThemeFilter: (themeId: string) => void;
}

export function BlogsTable({
  blogs,
  themes,
  onAddBlog,
  onViewBlog,
  onDeleteBlog,
  onSearch,
  onThemeFilter,
}: BlogsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleThemeFilter = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeFilter(themeId);
  };


  //  --------------------------------------------------------
  const [simpleBlogsPerPage, setSimpleBlogsPerPage] = useState(3);
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { posts, loading, pageInfo } = BlogViewModel({
    simpleBlog: true,
    offset,
    simpleBlogsPerPage,
  });
 

useEffect(() => {
  if (posts && posts.length > 0) {
    if (offset === 0) {
      setAllPosts(posts);
      console.log("Contenido desde 0 de allPosts:", allPosts);
    } else {
       console.log("Contenido exitoso allPosts:", allPosts);
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = posts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    }
  }
    console.log("No estoy entrando Contenido de Posts:", posts);
}, [posts, offset]);

useEffect(() => {
  console.log("Contenido de allPosts:", allPosts);
}, [allPosts]);


  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Post Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add Post</h2>
            <p className="text-gray-400">Description</p>
          </div>
          <Button
            onClick={onAddBlog}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* All Posts Section - Takes remaining space */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Posts</h2>
              <p className="text-gray-400">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={selectedTheme} onValueChange={handleThemeFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Themes</SelectItem>
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.name}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-8 pb-8">
          <div className="bg-white rounded-lg flex-1 flex flex-col w-full min-h-0">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-24 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post ID
                  </th>
                  <th className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {allPosts.map((blog) => (
                    <BlogTableRow
                      key={blog.id}
                      blog={blog}
                      onView={onViewBlog}
                      onDelete={onDeleteBlog}
                    />
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
