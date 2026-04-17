import { Plus } from "lucide-react";
import React, { useState } from "react";
import ConsignmentModal from "../Components/ConsignmentModal";

export const Dashboard = () => {
  const [isCreateConModal, setIsCreateConModal] = useState(false);

  return (
    <>
      <section>
        <div className="max-w-360 mx-auto ">
          <div className="flex justify-between items-center my-10">
            <div>
              <h1 className="text-4xl font-extrabold ">Consignments</h1>
              <p className="text-neutral-600">
                Manage and track all your consignment records
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsCreateConModal((prev) => !prev)}
                className="flex gap-1 border bg-blue-600 text-white px-3 py-3 rounded-md cursor-pointer hover:bg-blue-500"
              >
                <Plus /> Create Consignment
              </button>
            </div>
          </div>
        </div>
        {isCreateConModal && (
          <ConsignmentModal setIsCreateConModal={setIsCreateConModal} />
        )}
      </section>
    </>
  );
};
