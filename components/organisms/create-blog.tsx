import { Button } from "@/components/ui/button"

interface CreateBlog {
  onClose: () => void
}

export function CreateBlog({ onClose }: CreateBlog) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Crear nuevo blog</h2>
        {/* Aquí va tu formulario */}
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
