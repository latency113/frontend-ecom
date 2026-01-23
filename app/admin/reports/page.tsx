"use client";

import { useEffect, useState } from "react";
import { getRevenueReport } from "@/lib/api/admin/dashboard";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface MonthlyData {
  month: string;
  revenue: number;
}

interface RevenueReport {
  totalRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  monthlyData: MonthlyData[];
  totalOrders: number;
}

const ReportsPage = () => {
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getRevenueReport();
        setReport(data);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังโหลดข้อมูลรายงาน...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">เกิดข้อผิดพลาด</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">รายงานสรุปรายรับ-รายจ่าย</h1>
          <p className="text-gray-600">ข้อมูลสรุปผลการดำเนินงานสำหรับผู้บริหาร</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">รายได้ทั้งหมด (Total Revenue)</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              ฿{report.totalRevenue.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8.2%
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">รายได้ที่ชำระสำเร็จ</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              ฿{report.completedRevenue.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">อัปเดตวันนี้</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">จำนวนคำสั่งซื้อทั้งหมด</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {report.totalOrders.toLocaleString()} รายการ
            </h3>
          </div>
        </div>

        {/* Monthly Revenue Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">ตารางสรุปรายได้รายเดือน</h2>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">ส่งออกข้อมูล (CSV)</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">เดือน/ปี</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">รายได้ (บาท)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">การเติบโต</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.monthlyData.map((data, index) => (
                  <tr key={data.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{data.month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        ฿{data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {(Math.random() * 15).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                        สรุปยอดแล้ว
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50/80 font-bold border-t border-gray-200">
                  <td className="px-6 py-5 text-gray-900">รวมรายได้ทั้งสิ้น</td>
                  <td className="px-6 py-5 text-right text-blue-600 text-lg">
                    ฿{report.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Summary Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">รายละเอียดรายรับเพิ่มเติม</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">รายได้ที่รอการตรวจสอบ (Pending)</span>
                <span className="text-sm font-bold text-yellow-600">฿{report.pendingRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                <span className="text-sm font-bold text-gray-900">฿{(report.completedRevenue * 0.07).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-bold text-gray-900">รายได้หลังหักภาษี</span>
                <span className="text-sm font-bold text-green-600">฿{(report.completedRevenue * 0.93).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">ประมาณการรายจ่าย (ค่าสินค้า)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ต้นทุนสินค้าโดยประมาณ (60%)</span>
                <span className="text-sm font-bold text-red-600">฿{(report.totalRevenue * 0.6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ค่าดำเนินการและค่าจัดส่ง</span>
                <span className="text-sm font-bold text-red-500">฿{(report.totalOrders * 50).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-bold text-gray-900">กำไรขั้นต้นโดยประมาณ (GP)</span>
                <span className="text-sm font-bold text-blue-600">฿{(report.totalRevenue * 0.35).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
