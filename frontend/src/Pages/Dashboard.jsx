import { Plus } from "lucide-react";
import { useState } from "react";
import ConsignmentModal from "../Components/ConsignmentModal";
import ConsignmentTable from "../Components/ConsignmentTable";

export const Dashboard = () => {
  const [isCreateConModal, setIsCreateConModal] = useState(false);

  return (
    <>
      <section className="bg-neutral-50 min-h-213.25">
        <div className="max-w-360 mx-auto">
          <div className="flex justify-between items-center py-5 md:py-10 mx-3">
            <div className=" flex flex-col gap-1">
              <h1 className="md:text-4xl text-xl font-bold">Consignments</h1>
              <p className="text-neutral-600 text-sm md:text-lg">
                Manage and track all your consignment records
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsCreateConModal((prev) => !prev)}
                className="flex items-center md:gap-1 border bg-blue-600 text-white text-sm md:text-lg px-2 md:px-3 py-1 md:py-3 rounded-md cursor-pointer hover:bg-blue-700"
              >
                <Plus /> Create Consignment
              </button>
            </div>
          </div>
          <ConsignmentTable setIsCreateConModal={setIsCreateConModal} />
        </div>

        {isCreateConModal && (
          <ConsignmentModal setIsCreateConModal={setIsCreateConModal} />
        )}
      </section>
    </>
  );
};
