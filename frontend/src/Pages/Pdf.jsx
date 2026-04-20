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
      {/* Buttons FIXME:*/}
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

      {/* A4 Page TODO:*/}
      <div className="flex justify-center pb-10">
        <div
          ref={boxRef}
          style={{ width: "794px", minHeight: "1115px" }}
          className="bg-white p-6 text-center"
        >
          <header className="border-b-2 border-neutral-400 pb-3">
            <h2 className="text-xl">Consignment</h2>
            <h1 className="text-xl">Pro: M/S Kobir Enterprise</h1>
            <h5 className="text-xl">Md. Jahangir Kabir</h5>
            <p className="bg-gray-200 rounded py-2 text-lg inline-block px-5">
              General Businessman
            </p>
            <p>মোকাম : সিমলা বাজার, সরিষাবাড়ী, জামালপুর</p>
            <span className="text-lg">Mobile: 01986949894</span>
          </header>
          {/* receiver details FIXME:*/}
          <div className="mt-5 mb-7 flex flex-col gap-5 ">
            <div className="flex justify-between mx-5">
              <p className="flex flex-1">Consignment no : </p>
              <div className="flex items-start gap-2 ">
                <span className="">Date: </span>
                <div className="">..........................</div>
              </div>
            </div>
            <div className="mx-5 flex flex-col gap-5">
              <div className="flex items-start gap-2 ">
                <span className="whitespace-nowrap">Receiver :</span>
                <div className="flex-1 border-t border-gray-800 mt-2"></div>
              </div>

              <div className="flex items-start gap-2">
                <span className="whitespace-nowrap">Address :</span>
                <div className="flex-1 border-b border-gray-800 mt-2"></div>
              </div>
            </div>
          </div>
          {/* table TODO: */}
          <table className="border-collapse border border-gray-400 w-full mt-3">
            <thead>
              <tr className="w-full">
                <th rowSpan={2} className="border w-[16%] border-black p-3">
                  Vehicles Description / Track no.
                </th>
                <th rowSpan={2} className="border w-[12%] border-black p-3">
                  Driver Signature
                </th>
                <th colSpan={2} className="border w-[12%] border-black p-3">
                  Goods Des & Grade
                </th>
                <th colSpan={2} className="border w-[12%] border-black p-3">
                  Amount
                </th>
              </tr>
              <tr>
                <th className="border border-black w-[12%] p-3">Description</th>
                <th className="border border-black w-[12%] p-3">Grade</th>
                <th className="border border-black w-[12%] p-3">KG</th>
                <th className="border border-black w-[12%] p-3">Mon </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={4} className="border border-black p-3">
                  D.M.T-20 <br />
                  8672
                </td>
                <td rowSpan={4} className="border border-black p-3"></td>
                <td className="border border-black p-3">Kenaf</td>
                <td className="border border-black p-3">1 </td>
                <td className="border border-black p-3">2 </td>
                <td className="border border-black p-3">3</td>
              </tr>
              <tr>
                <td className="border border-black p-3">White </td>
                <td className="border border-black p-3">4 </td>
                <td className="border border-black p-3">5 </td>
                <td className="border border-black p-3">6 </td>
              </tr>
              <tr>
                <td className="border border-black p-3">Tossa</td>
                <td className="border border-black p-3">7 </td>
                <td className="border border-black p-3"> 8</td>
                <td className="border border-black p-3">9 </td>
              </tr>
              <tr>
                <td className="border border-black p-3">Meshta</td>
                <td className="border border-black p-3">Cutting </td>
                <td className="border border-black p-3">120 </td>
                <td className="border border-black p-3">3 </td>
              </tr>
              <tr>
                <td className=" p-3 border-transparent border border-r-black"></td>
                <td colSpan={3} className="border border-black p-3">
                  <strong>Total:</strong> kg/Mon
                </td>

                <td className="border border-black p-3"></td>
                <td className="border border-black p-3">254/=</td>
              </tr>
            </tbody>
          </table>
          {/* table footer FIXME:*/}
          <div className="flex flex-col mx-5 mt-15 gap-8">
            <div className="flex flex-col gap-5  text-start">
              <p>Seal</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Recipent :</p>
              <h1>Sender Signature..............................</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pdf;
