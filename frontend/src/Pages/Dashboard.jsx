import { Plus } from "lucide-react";
import React from "react";

export const Dashboard = () => {
  return (
    <>
      <section className="bg-neutral-50 space-y-4">
        <div className="max-w-360 mx-auto ">
          <div className="flex justify-between items-center ">
            <div>
              <h1 className="text-3xl font-bold ">Consignments</h1>
              <p className="text-neutral-600">
                Manage and track all your consignment records
              </p>
            </div>
            <div>
              <button className="flex gap-1 border bg-blue-600 text-white px-3 py-3 rounded-md cursor-pointer hover:bg-blue-500">
                <Plus /> Create Consignment
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
