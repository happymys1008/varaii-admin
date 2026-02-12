import jsPDF from "jspdf";

import { formatOrderDate } from "../common/dateFormat";
export function downloadInvoice(data) {
  const bill = data.bill || data; // 🔥 NORMALIZE
  const doc = new jsPDF();

  // ===== LOGO =====
  const logo = new Image();
  logo.src = "/logo.png";

logo.onload = () => {

  // ✅ SINGLE SOURCE OF TRUTH (PASTE HERE)
  const address = bill.deliveryAddress;

  // LOGO
  doc.addImage(logo, "PNG", 10, 8, 30, 18);

    // SHOP NAME
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("HAPPY MOBILES", 105, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "NO 35 HUNSUR MAIN ROAD HOOTAGALLI MYSORE 570018",
      105,
      21,
      { align: "center" }
    );
    doc.text("GSTIN: 29AUMPN8689A1ZY", 105, 26, { align: "center" });
    doc.text("Mobile: 8904847395", 105, 31, { align: "center" });

    doc.line(10, 35, 200, 35);

    // 🟥 CANCELLED WATERMARK
    if (bill.status === "CANCELLED") {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      doc.text("CANCELLED", 105, 140, {
        align: "center",
        angle: 45,
      });
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    }

// TAX INVOICE
doc.setFont("helvetica", "bold");
doc.text("TAX INVOICE", 10, 42);

doc.setFont("helvetica", "normal");

// ✅ ADD THIS JUST ABOVE
const invoiceNumber =
  bill.invoiceNo ||
  bill.invoiceNumber ||
  "N/A";


// ✅ REPLACE THIS LINE
doc.text(`Invoice No: ${invoiceNumber}`, 150, 42);

doc.text(
  `Date: ${formatOrderDate(bill.createdAt)}`,
  150,
  48
);



    // CUSTOMER
doc.text(
  `Customer: ${bill.customerName || "Walk-in Customer"}`,
  10,
  48
);

doc.text(
  `Mobile: ${bill.customerMobile || "-"}`,
  10,
  54
);

doc.text(`Status: ${bill.status}`, 10, 60);


    let y = 68;


    doc.setFont("helvetica", "normal");
// ✅ DELIVERY ADDRESS (BILL-BASED)
// ================= DELIVERY ADDRESS =================
doc.setFont("helvetica", "bold");
doc.text("Delivery Address:", 10, y);
y += 6;

doc.setFont("helvetica", "normal");

if (address?.name) {
  doc.text(address.name, 10, y);
  y += 6;
}

if (address?.phone) {
  doc.text(address.phone, 10, y);
  y += 6;
}

if (address?.line1) {
  doc.text(address.line1, 10, y);
  y += 6;
}

if (address?.line2) {
  doc.text(address.line2, 10, y);
  y += 6;
}

if (address?.city || address?.state || address?.pincode) {
  doc.text(
    `${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`,
    10,
    y
  );
  y += 6;
}

y += 8;

    // TABLE HEADER
    doc.setFont("helvetica", "bold");
    doc.rect(10, y, 15, 10);
    doc.rect(25, y, 95, 10);
    doc.rect(120, y, 25, 10);
    doc.rect(145, y, 45, 10);

    doc.text("No", 17, y + 7);
    doc.text("Item", 30, y + 7);
    doc.text("Qty", 128, y + 7);
    doc.text("Amount", 155, y + 7);

    y += 10;

    // =========================
    // ITEMS (PROFESSIONAL STYLE)
    // =========================
    doc.setFont("helvetica", "normal");

    bill.items.forEach((item, i) => {
      const baseRowHeight = 10;

      let imeiText = "";
      if (item.imeis && item.imeis.length > 0) {
        imeiText =
          "\nIMEI:\n" +
          item.imeis
            .slice(0, item.qty)
            .map(im => "• " + im)
            .join("\n");
      }

      const itemLines = doc.splitTextToSize(
        item.name + imeiText,
        90
      );

      const rowHeight = Math.max(
        baseRowHeight,
        itemLines.length * 5
      );

      doc.rect(10, y, 15, rowHeight);
      doc.rect(25, y, 95, rowHeight);
      doc.rect(120, y, 25, rowHeight);
      doc.rect(145, y, 45, rowHeight);

      doc.text(String(i + 1), 17, y + 7);
      doc.text(itemLines, 30, y + 7);
      doc.text(String(item.qty), 128, y + 7);
      doc.text(`Rs. ${item.qty * item.price}`, 150, y + 7);

      y += rowHeight;
    });

    // =====================
    // GST BREAKUP (SMART)
    // =====================
    const SHOP_STATE = "Karnataka";
    const customerState = address?.state || SHOP_STATE;
    const isIntraState =
      customerState.toLowerCase() === SHOP_STATE.toLowerCase();

    const GST_RATE = 18;
    const HALF_GST = 9;

    const totalAmount = bill.total;
    const taxableAmount = +(
      totalAmount / (1 + GST_RATE / 100)
    ).toFixed(2);

    let cgst = 0, sgst = 0, igst = 0;

    if (isIntraState) {
      cgst = +(taxableAmount * (HALF_GST / 100)).toFixed(2);
      sgst = +(taxableAmount * (HALF_GST / 100)).toFixed(2);
    } else {
      igst = +(taxableAmount * (GST_RATE / 100)).toFixed(2);
    }

    // GST DISPLAY
    y += 5;
    doc.setFont("helvetica", "normal");

    doc.rect(120, y, 70, 8);
    doc.text("Taxable Amount", 122, y + 6);
    doc.text(`Rs. ${taxableAmount}`, 160, y + 6);
    y += 8;

    if (isIntraState) {
      doc.rect(120, y, 70, 8);
      doc.text("CGST @ 9%", 122, y + 6);
      doc.text(`Rs. ${cgst}`, 160, y + 6);
      y += 8;

      doc.rect(120, y, 70, 8);
      doc.text("SGST @ 9%", 122, y + 6);
      doc.text(`Rs. ${sgst}`, 160, y + 6);
      y += 8;
    } else {
      doc.rect(120, y, 70, 8);
      doc.text("IGST @ 18%", 122, y + 6);
      doc.text(`Rs. ${igst}`, 160, y + 6);
      y += 8;
    }

    // TOTAL
    doc.setFont("helvetica", "bold");
    doc.rect(120, y, 70, 10);
    doc.text("TOTAL", 122, y + 7);
    doc.text(`Rs. ${totalAmount}`, 160, y + 7);

    // FOOTER
    y += 25;
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for shopping with HAPPY IVAN", 105, y, {
      align: "center",
    });

    y += 15;
    doc.text("Authorized Signature", 150, y);
    doc.line(140, y - 2, 195, y - 2);

    doc.save(`Invoice-${invoiceNumber}.pdf`);
  };
}
