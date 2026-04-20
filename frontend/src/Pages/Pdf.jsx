import { useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const Pdf = () => {
  const boxRef = useRef(null);
  const [loader, setLoader] = useState(false);

  const handleDownloadPdf = async () => {
    const element = boxRef.current;
    if (!element) return;

    try {
      setLoader(true);
      const canvas = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3,
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
      pdf.save("consignment.pdf");
      toast.success("PDF downloaded successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to download PDF", { position: "bottom-right" });
    } finally {
      setLoader(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: boxRef,
    documentTitle: "Consignment",
    pageStyle: `
    @page {
      margin: 0;
    }
    @media print {
      body {
        margin: 0;
      }
    }
  `,
  });

  return (
    <section className="bg-neutral-700 min-h-screen">
      {/* Buttons */}
      <div className="flex justify-center gap-3 py-4">
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

      {/* A4 Page */}
      <div className="flex justify-center pb-10">
        <div
          ref={boxRef}
          style={{ width: "794px", minHeight: "1115px" }}
          className="bg-white p-6 text-center"
        >
          <header className="border-b-2 border-neutral-400 pb-3">
            <h2 className="text-xl">Consignment</h2>
            <h1 className="text-2xl">M/S Kobir Enterprise</h1>
            <h5 className="text-xl">Md. Jahangir Kabir</h5>
            <p className="bg-gray-200 rounded py-3 text-xl">
              General Businessman
            </p>
            <span className="text-lg">Mobile: 01986949894</span>
          </header>
          {/* receiver details */}
          <div className="my-3 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="flex flex-1 ml-5">Consignment no : </p>
              <p className="w-64">Date: </p>
            </div>
            <div className="text-left ml-5 flex flex-col gap-2 ">
              <div className="flex items-end gap-2">
                <span className="whitespace-nowrap">Receiver:</span>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>

              <div className="flex items-end gap-2">
                <span className="whitespace-nowrap">Address:</span>
                <div className="flex-1 border-b border-gray-400"></div>
              </div>
            </div>
          </div>
          <table className="border-collapse border border-gray-400 w-full mt-3">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3">
                  Vehicles Description
                </th>
                <th className="border border-gray-300 p-3">Driver</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">Bus</td>
                <td className="border border-gray-300 p-3">Siddique</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Pdf;
