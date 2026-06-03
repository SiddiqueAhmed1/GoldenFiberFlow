import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { getSingleConsignment } from "../Services/consignmentService";
import LoadingSpinner from "../Components/LoadingSpinner";
import { consignmentId } from "../utils/consignmentId";

const Pdf = () => {
  const boxRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedConsignment, setSelectedConsignment] = useState(null);

  useEffect(() => {
    const handleViewConsignment = async () => {
      try {
        const data = await getSingleConsignment(id);
        setSelectedConsignment(data);
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    handleViewConsignment();
  }, [id]);

  const handleDownloadPdf = async () => {
    const element = boxRef.current;
    if (!element) return;
    try {
      setLoader(true);
      const canvas = await toPng(element, {
        quality: 1.0,
        pixelRatio: 1,
        skipFonts: false,
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const imgProps = pdf.getImageProperties(canvas);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(canvas, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${consignmentId(selectedConsignment._id)}.pdf`);
      toast.success("PDF downloaded successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(error?.message, { position: "bottom-right" });
    } finally {
      setLoader(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: boxRef,
    documentTitle: "Consignment",
    pageStyle: `
      @page { margin: 0; }
      @media print {
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  // resolve driver & vehicle — populated objects or plain strings (backwards compat)
  const driverName =
    selectedConsignment?.transportation_details?.driverId?.name ||
    selectedConsignment?.transportation_details?.driverName ||
    "—";
  const vehiclePlate =
    selectedConsignment?.transportation_details?.vehicleId?.plateNumber ||
    selectedConsignment?.transportation_details?.trackDetails ||
    "—";
  const vehicleType =
    selectedConsignment?.transportation_details?.vehicleId?.type || "";

  return (
    <section className="bg-neutral-700 min-h-screen">
      {/* Buttons */}
      <div className="flex justify-between gap-3 py-4 w-full max-w-4xl mx-auto px-4">
        <button
          onClick={() => window.history.back()}
          title="Back"
          className="bg-neutral-600 hover:bg-neutral-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-3">
          <button
            title="Download PDF"
            onClick={handleDownloadPdf}
            className="bg-neutral-600 hover:bg-neutral-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {loader ? (
              <span className="text-sm">Downloading...</span>
            ) : (
              <Download size={18} />
            )}
          </button>
          <button
            title="Print"
            onClick={handlePrint}
            className="bg-neutral-600 hover:bg-neutral-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* A4 Page */}
      <div className="flex justify-center pb-10">
        <div
          ref={boxRef}
          style={{ width: "794px", minHeight: "1115px" }}
          className="bg-white px-20 pt-16 text-center"
        >
          {loading ? (
            <LoadingSpinner border="gray" color="gray" />
          ) : (
            <>
              {/* Header */}
              <header className="border-b-2 border-neutral-400 pb-3">
                <h2 className="text-xl">Consignment</h2>
                <h1 className="text-xl">Pro: M/S Kobir Enterprise</h1>
                <h5 className="text-xl">Md. Jahangir Kabir</h5>
                <p
                  className="bg-gray-200 rounded py-2 text-lg inline-block px-5"
                  style={{
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
                >
                  General Businessman
                </p>
                <p>মোকাম : সিমলা বাজার, সরিষাবাড়ী, জামালপুর</p>
                <span className="text-lg">Mobile: 01986949894</span>
              </header>

              {/* Consignment meta */}
              <div className="mt-5 mb-7 flex flex-col gap-5">
                <div className="flex justify-between mx-5">
                  <p className="flex flex-1">
                    Consignment no : {consignmentId(selectedConsignment._id)}
                  </p>
                  <div className="flex items-start gap-2">
                    <span>Date: </span>
                    <div>
                      {new Date(
                        selectedConsignment?.createdAt,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="mx-5 flex flex-col gap-5">
                  <div className="flex items-start gap-2">
                    <span className="whitespace-nowrap">Receiver :</span>
                    <span className="font-semibold">
                      {selectedConsignment?.receiver_details?.name}
                    </span>
                    <div className="flex-1 border-t border-gray-800"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="whitespace-nowrap">Address :</span>
                    <span className="font-semibold">
                      {selectedConsignment?.receiver_details?.address}
                    </span>
                    <div className="flex-1 border-b border-gray-800"></div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="border-collapse border border-gray-400 w-full mt-3">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="border w-[16%] border-black text-sm p-3"
                    >
                      Vehicle / Plate No.
                    </th>
                    <th
                      rowSpan={2}
                      className="border w-[12%] border-black text-sm p-3"
                    >
                      Driver Name
                    </th>
                    <th
                      colSpan={2}
                      className="border w-[12%] border-black text-sm p-3"
                    >
                      Goods Description & Grade
                    </th>
                    <th
                      colSpan={2}
                      className="border w-[12%] border-black text-sm p-3"
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black text-sm w-[12%] p-3">
                      Description
                    </th>
                    <th className="border border-black text-sm w-[12%] p-3">
                      Grade
                    </th>
                    <th className="border border-black text-sm w-[12%] p-3">
                      KG
                    </th>
                    <th className="border border-black text-sm w-[12%] p-3">
                      Mon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedConsignment?.items?.map((item, index) => (
                    <tr key={index}>
                      {index === 0 && (
                        <>
                          <td
                            rowSpan={selectedConsignment.items.length}
                            className="border border-black text-sm p-3"
                          >
                            {vehiclePlate}
                            {vehicleType ? ` (${vehicleType})` : ""}
                          </td>
                          <td
                            rowSpan={selectedConsignment.items.length}
                            className="border border-black text-sm p-3"
                          >
                            {driverName}
                          </td>
                        </>
                      )}
                      <td className="border border-black text-sm p-3">
                        {item.description}
                      </td>
                      <td className="border border-black text-sm p-3">
                        {item.grade}
                      </td>
                      <td className="border border-black text-sm p-3">
                        {item.weight}
                      </td>
                      <td className="border border-black text-sm p-3">
                        {(item.weight / 40).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 border-transparent border border-r-black"></td>
                    <td colSpan={3} className="border border-black text-sm p-3">
                      <strong>Total:</strong> kg/Mon
                    </td>
                    <td className="border border-black text-sm p-3">
                      {selectedConsignment?.items?.reduce(
                        (acc, cur) => acc + Number(cur.weight),
                        0,
                      )}
                    </td>
                    <td className="border border-black text-sm p-3">
                      {(
                        selectedConsignment?.items?.reduce(
                          (acc, cur) => acc + Number(cur.weight),
                          0,
                        ) / 40
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div className="flex flex-col mx-5 mt-16 gap-8">
                <div className="flex flex-col gap-5 text-start">
                  <p>Seal</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Recipient :</p>
                  <h1>Sender Signature..............................</h1>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pdf;
