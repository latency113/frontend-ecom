"use client";

import React, { useRef } from "react";
import { Order } from "@/types/order";
import { Printer, X } from "lucide-react";

interface BillModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const BillModal: React.FC<BillModalProps> = ({ order, isOpen, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const windowUrl = window.location.href;
      const uniqueName = new Date().getTime();
      const printWindow = window.open("", "_blank", `width=800,height=900`);
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${order.id}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body class="bg-white p-8">
              ${printContent.innerHTML}
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">ใบเสร็จรับเงิน / ใบแจ้งหนี้</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8" ref={printRef}>
          {/* Bill Content */}
          <div className="border p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-1">ใบเสร็จรับเงิน</h1>
                <p className="text-gray-500">หมายเลข: {order.id}</p>
                <p className="text-gray-500">วันที่สั่งซื้อ: {orderDate}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">IT Life Store</h2>
                <p className="text-gray-500">194, 30-31 ถนน ราชวิถี ตำบลพระปฐมเจดีย์</p>
                <p className="text-gray-500">อำเภอเมืองนครปฐม นครปฐม 73000</p>
                <p className="text-gray-500">เบอร์โทร: 062-969-9399</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold border-b pb-2 mb-3 uppercase text-xs text-gray-400">ส่งไปที่</h3>
                <p className="font-semibold">{order.user?.fullName || 'ลูกค้า'}</p>
                <p className="text-gray-600 whitespace-pre-line">{order.address}</p>
                <p className="text-gray-600">อีเมล: {order.user?.email}</p>
              </div>
              <div>
                <h3 className="font-bold border-b pb-2 mb-3 uppercase text-xs text-gray-400">รายละเอียดการชำระเงิน</h3>
                <p className="text-gray-600">
                  <span className="font-medium">วิธีการชำระเงิน:</span>{' '}
                  {order.paymentMethod === "COD" ? "เก็บเงินปลายทาง" : 
                   order.paymentMethod === "QR" ? "พร้อมเพย์ / QR Code" : 
                   "บัตรเครดิต/เดบิต"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">สถานะ:</span>{' '}
                  {order.status === "DELIVERED" ? "ชำระเงินแล้ว" : "รอดำเนินการ"}
                </p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-bold text-sm uppercase text-gray-600">สินค้า</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase text-gray-600 text-center">จำนวน</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase text-gray-600 text-right truncate">ราคาต่อหน่วย</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase text-gray-600 text-right">รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">ID: {item.product.id.substring(0, 8)}</p>
                    </td>
                    <td className="py-4 px-4 text-center">{item.quantity}</td>
                    <td className="py-4 px-4 text-right">
                      {item.price.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {(item.price * item.quantity).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ยอดรวม</span>
                  <span className="font-medium">
                    {order.totalAmount.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {/* <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ค่าจัดส่ง</span>
                  <span className="font-medium">฿0.00</span>
                </div> */}
                <div className="flex justify-between py-4 bg-gray-50 px-2 rounded mt-2">
                  <span className="font-bold text-lg">ยอดชำระทั้งสิ้น</span>
                  <span className="font-bold text-lg text-blue-600">
                    {order.totalAmount.toLocaleString("th-TH", {
                      style: "currency",
                      currency: "thb",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-gray-400 text-sm">
              <p>ขอบคุณที่ไว้วางใจใช้บริการเรา</p>
              <p>นี่เป็นเอกสารที่สร้างขึ้นจากระบบคอมพิวเตอร์</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
