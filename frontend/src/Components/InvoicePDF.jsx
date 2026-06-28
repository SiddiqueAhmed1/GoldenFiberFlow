import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Printer, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─────────────────────────────────────────────
   Printable Invoice (shown on screen + printed)
───────────────────────────────────────────── */
const PrintableInvoice = ({ inv }) => {
  const date = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const statusColor = {
    Paid: "#16a34a",
    Partial: "#d97706",
    Unpaid: "#dc2626",
  };

  const items = inv?.salesOrder?.items || [];

  return (
    <div
      id="invoice-print-area"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#1a1a1a",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          borderBottom: "3px solid #f59e0b",
          paddingBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#b45309",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            GoldenFiberFlow
          </h1>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0" }}>
            Jute Fiber Manufacturing & Trading
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#1f2937",
              letterSpacing: "1px",
            }}
          >
            INVOICE
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#f59e0b",
              marginTop: "4px",
            }}
          >
            {inv?.invoiceNumber}
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: "6px",
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "700",
              color: "#fff",
              background: statusColor[inv?.status] || "#6b7280",
            }}
          >
            {inv?.status?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Customer + Order Info */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#92400e",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            BILL TO
          </div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>
            {inv?.customer?.name || "—"}
          </div>
          {inv?.customer?.businessName && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              {inv.customer.businessName}
            </div>
          )}
          {inv?.customer?.mobile && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              📞 {inv.customer.mobile}
            </div>
          )}
          {inv?.customer?.address && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              📍 {inv.customer.address}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#374151",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            INVOICE DETAILS
          </div>
          {[
            ["Sales Order", inv?.salesOrder?.orderNumber || "—"],
            ["Invoice Date", date(inv?.createdAt)],
            ["Due Date", date(inv?.dueDate)],
            ["Status", inv?.status || "—"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#6b7280" }}>{label}</span>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "24px",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ background: "#f59e0b", color: "#fff" }}>
            {["#", "Description", "Grade", "Qty", "Unit Price (৳)", "Total (৳)"].map(
              (h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: i > 2 ? "right" : "left",
                    fontWeight: "700",
                    fontSize: "11px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#fff" : "#fffbeb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{idx + 1}</td>
                <td style={{ padding: "10px 12px", fontWeight: "600" }}>
                  {item.description || item.product?.name || "—"}
                </td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{item.grade || "—"}</td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>
                  {item.quantity?.toLocaleString()}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>
                  ৳ {item.unitPrice?.toLocaleString()}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: "700" }}>
                  ৳ {item.totalPrice?.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}
              >
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "28px" }}>
        <div style={{ minWidth: "260px" }}>
          {[
            ["Subtotal", `৳ ${inv?.totalAmount?.toLocaleString() || 0}`, false],
            ["Advance Paid", `৳ ${inv?.advanceAmount?.toLocaleString() || 0}`, false],
            ["Amount Due", `৳ ${inv?.dueAmount?.toLocaleString() || 0}`, true],
          ].map(([label, value, highlight]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: highlight ? "12px 14px" : "8px 14px",
                background: highlight ? "#f59e0b" : "transparent",
                borderRadius: highlight ? "8px" : "0",
                color: highlight ? "#fff" : "#374151",
                fontWeight: highlight ? "800" : "400",
                fontSize: highlight ? "15px" : "13px",
                marginTop: highlight ? "6px" : "0",
              }}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Info */}
      {(inv?.salesOrder?.dispatchDetails?.driver || inv?.salesOrder?.dispatchDetails?.vehicle || inv?.salesOrder?.dispatchDetails?.warehouse) && (
        <div
          style={{
            background: "#f5f3ff",
            border: "1px solid #ddd6fe",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: "700", color: "#5b21b6", marginBottom: "6px", fontSize: "10px", letterSpacing: "1px" }}>
            DISPATCH INFO
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {inv.salesOrder.dispatchDetails.driver && (
              <div><span style={{ color: "#7c3aed" }}>Driver: </span><strong>{inv.salesOrder.dispatchDetails.driver.name}</strong>{inv.salesOrder.dispatchDetails.driver.mobile ? ` (${inv.salesOrder.dispatchDetails.driver.mobile})` : ""}</div>
            )}
            {inv.salesOrder.dispatchDetails.vehicle && (
              <div><span style={{ color: "#7c3aed" }}>Vehicle: </span><strong>{inv.salesOrder.dispatchDetails.vehicle.plateNumber}</strong>{inv.salesOrder.dispatchDetails.vehicle.type ? ` · ${inv.salesOrder.dispatchDetails.vehicle.type}` : ""}</div>
            )}
            {inv.salesOrder.dispatchDetails.warehouse && (
              <div><span style={{ color: "#7c3aed" }}>Warehouse: </span><strong>{inv.salesOrder.dispatchDetails.warehouse.name}</strong>{inv.salesOrder.dispatchDetails.warehouse.location ? ` · ${inv.salesOrder.dispatchDetails.warehouse.location}` : ""}</div>
            )}
          </div>
        </div>
      )}

      {/* Note */}
      {inv?.note && (
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "24px",
          }}
        >
          <strong style={{ color: "#374151" }}>Note: </strong>
          {inv.note}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: "2px dashed #e5e7eb",
          paddingTop: "16px",
          textAlign: "center",
          fontSize: "11px",
          color: "#9ca3af",
        }}
      >
        <p style={{ margin: 0 }}>
          Thank you for your business! — GoldenFiberFlow · Jute Fiber Manufacturing & Trading
        </p>
        <p style={{ margin: "4px 0 0" }}>
          Generated on {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────── */
const InvoicePDF = ({ inv, handleClose }) => {
  const printRef = useRef();

  // Print using react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${inv?.invoiceNumber || ""}`,
  });

  // Download as PDF using jspdf + autotable
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text("GoldenFiberFlow", 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Jute Fiber Manufacturing & Trading", 14, 27);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("INVOICE", 196, 20, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(245, 158, 11);
    doc.text(inv?.invoiceNumber || "", 196, 28, { align: "right" });

    // Separator line
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1);
    doc.line(14, 33, 196, 33);

    // Customer + Details
    let y = 42;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(146, 64, 14);
    doc.text("BILL TO", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    y += 5;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(inv?.customer?.name || "—", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    if (inv?.customer?.businessName) { y += 4; doc.text(inv.customer.businessName, 14, y); }
    if (inv?.customer?.mobile) { y += 4; doc.text(`Tel: ${inv.customer.mobile}`, 14, y); }
    if (inv?.customer?.address) { y += 4; doc.text(inv.customer.address, 14, y); }

    const infoY = 42;
    const rightX = 196;
    const lineH = 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text("INVOICE DETAILS", rightX, infoY, { align: "right" });
    const details = [
      ["Sales Order:", inv?.salesOrder?.orderNumber || "—"],
      ["Invoice Date:", inv?.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-GB") : "—"],
      ["Due Date:", inv?.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-GB") : "—"],
      ["Status:", inv?.status || "—"],
    ];
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    details.forEach(([label, value], i) => {
      const ly = infoY + (i + 1) * lineH + 2;
      doc.text(label, rightX - 30, ly, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(value, rightX, ly, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
    });

    // Items table
    const items = inv?.salesOrder?.items || [];
    const tableY = Math.max(y, infoY + details.length * lineH + 10) + 6;

    autoTable(doc, {
      startY: tableY,
      head: [["#", "Description", "Grade", "Quantity", "Unit Price (BDT)", "Total (BDT)"]],
      body: items.map((item, idx) => [
        idx + 1,
        item.description || item.product?.name || "—",
        item.grade || "—",
        item.quantity?.toLocaleString() || 0,
        `${item.unitPrice?.toLocaleString() || 0}`,
        `${item.totalPrice?.toLocaleString() || 0}`,
      ]),
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [31, 41, 55] },
      alternateRowStyles: { fillColor: [255, 251, 235] },
      columnStyles: { 0: { cellWidth: 10 }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right", fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 6;
    const totals = [
      ["Subtotal:", `BDT ${inv?.totalAmount?.toLocaleString() || 0}`],
      ["Advance Paid:", `BDT ${inv?.advanceAmount?.toLocaleString() || 0}`],
      ["Amount Due:", `BDT ${inv?.dueAmount?.toLocaleString() || 0}`],
    ];
    totals.forEach(([label, value], i) => {
      const ty = finalY + i * 7;
      const isLast = i === totals.length - 1;
      if (isLast) {
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(120, ty - 4, 76, 8, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
      } else {
        doc.setTextColor(55, 65, 81);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
      }
      doc.text(label, 140, ty, { align: "right" });
      doc.text(value, 196, ty, { align: "right" });
    });

    // Note
    if (inv?.note) {
      const noteY = finalY + totals.length * 7 + 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(`Note: ${inv.note}`, 14, noteY);
    }

    // Footer
    const pageH = doc.internal.pageSize.height;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(14, pageH - 20, 196, pageH - 20);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Thank you for your business! — GoldenFiberFlow · Jute Fiber Manufacturing & Trading",
      105,
      pageH - 13,
      { align: "center" }
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
      105,
      pageH - 8,
      { align: "center" }
    );

    doc.save(`Invoice-${inv?.invoiceNumber || "download"}.pdf`);
  };

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto py-6">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-3xl rounded-2xl mx-4 shadow-2xl">
        {/* Toolbar */}
        <div className="sticky top-0 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 z-10 rounded-t-2xl">
          <div>
            <h1 className="text-base font-bold text-neutral-800 dark:text-white">
              Invoice Preview
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {inv?.invoiceNumber} · {inv?.customer?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer transition font-medium"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer transition font-medium"
            >
              <Download size={15} /> Download PDF
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 cursor-pointer transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-b-2xl">
          <div
            ref={printRef}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <PrintableInvoice inv={inv} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoicePDF;
