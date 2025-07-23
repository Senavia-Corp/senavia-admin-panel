import React from "react";
import { useForm } from "react-hook-form";

interface ContractDetailsFormValues {
  title: string;
  signedDate: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  ownerName: string;
  ownerSignedDate: string;
  billName: string;
  billSignedDate: string;
}

export function ContractDetails() {
  const { register, handleSubmit } = useForm<ContractDetailsFormValues>();

  // Puedes reemplazar estos valores por props o datos reales
  const contractId = "0000";
  const userId = "0000";
  const leadId = "0000";

  const onSubmit = (data: ContractDetailsFormValues) => {
    // Aquí puedes manejar el envío del formulario
    console.log(data);
  };

  return (
    <div className="w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto p-8 bg-white rounded-lg shadow-none "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="col-span-1">
            <div className="mb-2">
              <div className="text-gray-800 text-sm">
                Contract ID: {contractId}
              </div>
              <div className="border-b border-gray-200 mt-1" />
            </div>
            <div className="mb-2">
              <div className="text-gray-800 text-sm">User ID: {userId}</div>
              <div className="border-b border-gray-200 mt-1" />
            </div>
            <div className="mb-2">
              <div className="text-gray-800 text-sm">Lead ID: {leadId}</div>
              <div className="border-b border-gray-200 mt-1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 mt-8">
              Company Phone
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="000-000-0000"
              {...register("companyPhone")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Contract Title"
              {...register("title")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Owner Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Owner Name"
              {...register("ownerName")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Signed date
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="MM-DD-YY"
              {...register("signedDate")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Owner Signed date
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="MM-DD-YY"
              {...register("ownerSignedDate")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Email
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="e-mail@company.com"
              {...register("companyEmail")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bill Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Bill Name"
              {...register("billName")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Address
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Company Add"
              {...register("companyAddress")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bill Signed date
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="MM-DD-YY"
              {...register("billSignedDate")}
            />
          </div>
        </div>
        <div className="flex justify-center mt-[50px]">
          <button
            type="submit"
            className="w-full md:w-2/3 bg-[#99CC33] text-white py-2 rounded-full text-lg font-medium"
          >
            Add / Update User
          </button>
        </div>
      </form>
    </div>
  );
}
