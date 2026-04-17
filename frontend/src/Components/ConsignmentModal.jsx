import { X } from "lucide-react";
import React from "react";

const ConsignmentModal = ({ setIsCreateConModal }) => {
  return (
    <>
      <section className="fixed bg-neutral-800/60 transition top-0 left-0 bottom-0 right-0 flex justify-center items-center ">
        <div className="bg-white w-120 mx-4 p-4 rounded-md">
          <div>
            <h1>Create Consignment</h1>
            <p>Fill in the details to create a new consignment</p>
          </div>
          <button onClick={() => setIsCreateConModal(false)}>
            <X />
          </button>
        </div>
      </section>
    </>
  );
};

export default ConsignmentModal;
