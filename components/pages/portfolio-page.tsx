"use client";

import { useState, useEffect } from "react";
import { CreateBlogDialog } from "@/components/organisms/create-blog-dialog"; // cambiar por Project Editor
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Project } from "./project/project";
import { BlogEditor } from "@/components/organisms/blog-editor"; // cambiar por Project Editor
import { GeneralTable } from "@/components/organisms/tables/general-table";
import ProjectViewModel from "./project/ProjectViewModel";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function PortfolioPage() {
  const [dataProjects, setDataProjects] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const { projects, loading, pageInfo,selectedProject,getProjectById } = ProjectViewModel({
    isPaginated: true,
    offset,
    itemsPerPage,
  });
  

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

  const handleViewProject = async(project: Project) => {
    //setEditingProjectId(project.id);
    console.log("soy id: "+project.id)
    await getProjectById(project.id)
    //setShowEditor(true);
  };

  const handleCreateProject = () => {
    setEditingProjectId(null);
    setShowEditor(true);
  };
  const handleFilterChange = () => {};
  const handlers = {
    onCreate: handleCreateProject,
    onView: handleViewProject,
    onDelete: (project: Project) => setProjectToDelete(project),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  if (showEditor) {
    return (
      <div>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <BlogEditor
              blogId={editingProjectId ?? undefined}
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
                "Add post",
                "Description",
                "All Posts",
                "Description",
                ["Project ID", "Title", "Actions"],
                projects,
                handlers
              )}              
            </div>
              
            <div className="w-96 bg-white rounded-lg space-y-6 flex-shrink-0 p-4">
               {/* Blog Title */}
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mt-1">Project Title</p>
                          <Input
                            value="hola"
                          
                            placeholder="Digite el titulo de su blog"
                            className="text-2xl font-bold "
                          />

                          <Card className="bg-white">
                                      <CardHeader>
                                        <CardTitle className="text-lg">Description</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Textarea
                                          value="valor"
                                          onChange={(e) => {
                                           
                                          }}
                                          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                                          rows={4}
                                          maxLength={200}
                                        />
                                        <div className="text-right text-sm text-gray-500 mt-2">
                                          {"contenido"}/200
                                        </div>
                                      </CardContent>
                                    </Card>
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
            if (!pageInfo || offset + itemsPerPage < pageInfo.totalBlogs) {
              const lastItemId = projects[projects.length - 1].id;
              setOffset(lastItemId);
            }
          }}
          disabled={
            loading || (pageInfo && offset + itemsPerPage >= pageInfo.total)
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
