import { useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa";

const Pdf = () => {
  const boxRef = useRef(null);
  const [loader, setLoader] = useState(false);

  // download pdf
  const handleDownloadPdf = async () => {
    const element = boxRef.current;
    if (!element) {
      return;
    }

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
      const downloadPdf = pdf.save(`consignment.pdf`);

      if (downloadPdf) {
        return toast.success("pdf download succesfull", {
          autoClose: 1500,
          position: "bottom-right",
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: "bottom-right",
        autoClose: 1500,
      });
    } finally {
      setLoader(false);
    }
  };

  // print pdf
  const handlePrint = useReactToPrint({
    contentRef: boxRef,
    documentTitle: "Consignment",
  });

  return (
    <>
      <section className="text-center border-b border-neutral-400 bg-neutral-700">
        <div className="flex justify-center ">
          <div
            ref={boxRef}
            className="mx-5 md:mx-0 p-6 w-148.75 min-h-210.5 my-5 bg-white text-center"
          >
            <header className="border-b-2 border-neutral-400 pb-3">
              <h2 className="text-xl">Consignment</h2>
              <h1 className="text-2xl"> M/S Kobir Enterprise</h1>
              <h5 className="text-xl">Md. Jahangir Kabir</h5>
              <p className="bg-gray-200 rouned py-3 text-xl">
                General Businessman
              </p>
              <span className="text-lg">Mobile: 01986949894</span>
            </header>
            <table className="border-collapse border border-gray-400 w-full mt-3 ">
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

        <div className="flex justify-center">
          <button
            title="Download pdf"
            id="downloadPdfButton"
            onClick={handleDownloadPdf}
            className="absolute top-33 right-7 md:top-33 md:right-138  px-3 py-2 font-semibold rounded cursor-pointer"
          >
            {loader ? (
              <p className="text-sm">Downloading...</p>
            ) : (
              <Download size={18} />
            )}
          </button>
          <button
            title="Print"
            id="downloadPdfButton"
            onClick={handlePrint}
            className="absolute top-33 right-15 md:top-33 md:right-147  px-3 py-2 font-semibold rounded cursor-pointer"
          >
            <Printer size={18} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Pdf;
