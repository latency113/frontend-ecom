"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider";

const ContactsPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showToast(
        "ส่งข้อความของคุณเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด",
        "success"
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          ติดต่อเรา
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          มีคำถามหรือข้อเสนอแนะ? ส่งข้อความหาเราได้เลย
          ทีมงานของเราพร้อมช่วยเหลือคุณเสมอ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">ที่อยู่</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  194, 30-31 ถนน ราชวิถี ตำบลพระปฐมเจดีย์ <br />
                  อำเภอเมืองนครปฐม นครปฐม 73000
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">เบอร์โทรศัพท์</h3>
                <p className="text-gray-600 text-sm">062-969-9399</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">อีเมล</h3>
                <p className="text-gray-600 text-sm">itlife@live.com </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">เวลาทำการ</h3>
                <p className="text-gray-600 text-sm">
                  จันทร์ - ศุกร์: 09:00 - 19:00 น.
                </p>
                <p className="text-gray-600 text-sm">เสาร์ - อาทิตย์: 09:00 - 18:00 น.</p>
                <p className="text-sm text-red-500">
                  หาไม่แน่ใจเวลาทำการ โปรดโทรเพื่อสอบถาม
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ส่งข้อความถึงเรา
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ชื่อของคุณ
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="ระบุชื่อ-นามสกุล"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    อีเมล
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  หัวข้อ
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="เช่น สอบถามเรื่องสินค้า, แจ้งปัญหาการใช้งาน"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ข้อความ
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งเราที่นี่..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "กำลังส่ง..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ส่งข้อความ
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
