import {
  Box,
  Download,
  Edit,
  Filter,
  LucideDelete,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const ConsignmentTable = ({ setIsCreateConModal }) => {
  return (
    <>
      <section>
        <div className="border border-neutral-200 shadow bg-white rounded-lg p-6 mx-5 md:mx-0">
          {/* table header */}
          <div className="flex justify-between items-center gap-6">
            <div className="flex flex-1 items-center">
              <Search size={20} color="gray" className="absolute ml-3" />
              <input
                placeholder="Search by consignment number, sender or receiver"
                required={true}
                name="search"
                className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-3 px-10 border-neutral-300 border w-full"
                type="text"
              />
            </div>

            <div className="flex items-center">
              <Filter size={20} color="gray" className="absolute ml-3" />
              <select
                name="status"
                className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-3 px-10 border-neutral-300 border appearance-none w-full"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In transit">In transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {/* table */}
          {/* <div className="my-5">
            <table className="table-auto md:table-fixed border border-collapse border-gray-300 w-full text-center p-4 overflow-x-auto">
              <thead className="bg-gray-50 ">
                <tr className="border border-gray-300 text-sm font-light ">
                  <th className="p-3 py-4 text-center ">COSNIGNMENT NO</th>
                  <th className="p-3 py-4 text-center ">SENDER</th>
                  <th className="p-3 py-4 text-center ">RECEIVER</th>
                  <th className="p-3 py-4 text-center ">ITEMS</th>
                  <th className="p-3 py-4 text-center ">STATUS</th>
                  <th className="p-3 py-4 text-center ">CREATED</th>
                  <th className="p-3 py-4 text-center ">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="w-full ">
                <tr className="border border-gray-300 hover:bg-gray-50">
                  <td className="p-3 py-6 text-center ">CN213</td>
                  <td className="p-3 py-6 text-center ">Siddique</td>
                  <td className="p-3 py-6 text-center ">Lamia</td>
                  <td className="p-3 py-6 text-center ">2 item</td>
                  <td className="p-3 py-6 text-center ">Pending</td>
                  <td className="p-3 py-6 text-center ">18/4/2026</td>
                  <td className="flex justify-center items-center p-3 py-6 gap-5 ">
                    <button title="Download">
                      <Download color="#576574" size={20} />
                    </button>
                    <button title="Edit">
                      <Edit color="#576574" size={20} />
                    </button>
                    <button title="Delete">
                      <Trash2 color="#576574" size={20} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
          {/* no item found section */}
          {/* <div className="text-center flex items-center justify-center flex-col gap-3 py-6 h-100">
            <Box size={80} color="#bdc3c7" />
            <h1 className="text-2xl font-semibold text-black">
              No consignments found
            </h1>
            <p className="text-neutral-500 text-lg mb-2">
              Get started by creating your first consignment
            </p>
            <button
              onClick={() => setIsCreateConModal((prev) => !prev)}
              className="flex items-center gap-1 border bg-blue-600 text-white font-sans text-sm md:text-lg px-3 py-3 rounded-md cursor-pointer hover:bg-blue-700 font-semibold"
            >
              <Plus /> Create Consignment
            </button>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default ConsignmentTable;
