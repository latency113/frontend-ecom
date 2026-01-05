"use client";

import React, { useEffect, useState } from "react";
import {
  getAddressesByUserId,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/api/address";
import { Address, CreateAddressPayload, UpdateAddressPayload } from "@/types/address";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import Swal from "sweetalert2";
import { useUser } from "@/lib/context/UserContext"; // Assuming user context is needed for userId
import { MapPin, PlusCircle, Trash2, Edit2, CheckCircle } from "lucide-react"; // Icons

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<string | null>(null); // Stores ID of address being edited
  const [newAddress, setNewAddress] = useState<CreateAddressPayload>({
    street: "",
    city: "",
    postalCode: "",
    country: "",
    label: "",
    stateProvince: "",
    isDefault: false,
  });
  const [editAddress, setEditAddress] = useState<UpdateAddressPayload & {id: string | null}>({
    id: null,
    street: "",
    city: "",
    postalCode: "",
    country: "",
    label: "",
    stateProvince: "",
    isDefault: false,
  });

  const { showToast } = useToast();
  const { user, loading: userLoading } = useUser(); // Get user from context and userLoading state

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      // Backend API /addresses already filters by authenticated user, so no need to pass userId explicitly
      const data = await getAddressesByUserId();
      setAddresses(data);
    } catch (err: any) {
      setError(err.toString());
      showToast(`Error fetching addresses: ${err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) { // Only proceed after user context has finished loading
      if (user) { // Only fetch if user is logged in
        fetchAddresses();
      } else {
        setLoading(false);
        setError("Please log in to manage your addresses.");
      }
    }
  }, [user, userLoading]); // Add userLoading to dependency array

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdAddress = await createAddress(newAddress);
      setAddresses((prev) => [...prev, createdAddress]);
      setNewAddress({
        street: "",
        city: "",
        postalCode: "",
        country: "",
        label: "",
        stateProvince: "",
        isDefault: false,
      });
      setShowAddForm(false);
      showToast("Address added successfully!", "success");
      fetchAddresses(); // Re-fetch to ensure default status is correct
    } catch (err: any) {
      showToast(`Error adding address: ${err.toString()}`, "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAddress.id) return;

    try {
      const updatedAddress = await updateAddress(editAddress.id, editAddress);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
      );
      setShowEditForm(null);
      showToast("Address updated successfully!", "success");
      fetchAddresses(); // Re-fetch to ensure default status is correct
    } catch (err: any) {
      showToast(`Error updating address: ${err.toString()}`, "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(id);
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        showToast("Address deleted successfully!", "success");
      } catch (err: any) {
        showToast(`Error deleting address: ${err.toString()}`, "error");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const addressToUpdate = addresses.find(addr => addr.id === id);
      if (addressToUpdate) {
        await updateAddress(id, { isDefault: true });
        showToast("Default address updated!", "success");
        fetchAddresses(); // Re-fetch to update all default statuses
      }
    } catch (err: any) {
      showToast(`Error setting default address: ${err.toString()}`, "error");
    }
  };

  if (loading || userLoading) { // Check both component loading and user context loading
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading addresses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        ที่อยู่สำหรับจัดส่ง
      </h1>

      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            จัดการที่อยู่ของคุณ
          </h2>
          <button
            onClick={() => {
                setShowAddForm(!showAddForm);
                setNewAddress({ // Reset form when toggling
                    street: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    label: "",
                    stateProvince: "",
                    isDefault: false,
                });
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            เพิ่มที่อยู่ใหม่
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="space-y-4 mb-8 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">เพิ่มที่อยู่ใหม่</h3>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                ชื่อที่อยู่ (เช่น บ้าน, ที่ทำงาน)
              </label>
              <input
                type="text"
                id="label"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={newAddress.label || ""}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                ที่อยู่ (เลขที่, ถนน) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  อำเภอ/เขต <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="stateProvince" className="block text-sm font-medium text-gray-700">
                  จังหวัด
                </label>
                <input
                  type="text"
                  id="stateProvince"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newAddress.stateProvince || ""}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, stateProvince: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  รหัสไปรษณีย์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  ประเทศ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="isDefaultAdd"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
              />
              <label htmlFor="isDefaultAdd" className="ml-2 block text-sm text-gray-900">
                ตั้งเป็นค่าเริ่มต้น
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-green-700 transition-colors"
            >
              บันทึกที่อยู่
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-full mt-2 bg-gray-400 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-gray-500 transition-colors"
            >
              ยกเลิก
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          !showAddForm && ( // Only show this if add form is not open
            <p className="text-gray-600 mb-4 text-center">
              คุณยังไม่มีที่อยู่จัดส่ง โปรดเพิ่มที่อยู่ใหม่
            </p>
          )
        ) : (
          <div className="space-y-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border p-6 rounded-lg shadow-sm bg-white relative"
              >
                {address.isDefault && (
                  <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> ที่อยู่เริ่มต้น
                  </span>
                )}
                {showEditForm === address.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">แก้ไขที่อยู่</h3>
                    <div>
                      <label htmlFor={`label-${address.id}`} className="block text-sm font-medium text-gray-700">
                        ชื่อที่อยู่
                      </label>
                      <input
                        type="text"
                        id={`label-${address.id}`}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={editAddress.label || ""}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`street-${address.id}`} className="block text-sm font-medium text-gray-700">
                        ที่อยู่ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`street-${address.id}`}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={editAddress.street}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, street: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`city-${address.id}`} className="block text-sm font-medium text-gray-700">
                          อำเภอ/เขต <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id={`city-${address.id}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          value={editAddress.city}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, city: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`stateProvince-${address.id}`} className="block text-sm font-medium text-gray-700">
                          จังหวัด
                        </label>
                        <input
                          type="text"
                          id={`stateProvince-${address.id}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          value={editAddress.stateProvince || ""}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, stateProvince: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`postalCode-${address.id}`} className="block text-sm font-medium text-gray-700">
                          รหัสไปรษณีย์ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id={`postalCode-${address.id}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          value={editAddress.postalCode}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, postalCode: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`country-${address.id}`} className="block text-sm font-medium text-gray-700">
                          ประเทศ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id={`country-${address.id}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          value={editAddress.country}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, country: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        id={`isDefaultEdit-${address.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={editAddress.isDefault}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, isDefault: e.target.checked })
                        }
                      />
                      <label htmlFor={`isDefaultEdit-${address.id}`} className="ml-2 block text-sm text-gray-900">
                        ตั้งเป็นค่าเริ่มต้น
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      บันทึกการแก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditForm(null)}
                      className="w-full mt-2 bg-gray-400 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-gray-500 transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-grow">
                      <p className="text-lg font-medium text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                        {address.label && <span className="mr-2">{address.label} - </span>}
                        {address.street}, {address.city}
                      </p>
                      <p className="text-gray-700 ml-7">
                        {address.stateProvince && `${address.stateProvince}, `}
                        {address.postalCode}, {address.country}
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          title="ตั้งเป็นที่อยู่เริ่มต้น"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowEditForm(address.id);
                          setEditAddress({
                            id: address.id,
                            label: address.label || "",
                            street: address.street,
                            city: address.city,
                            stateProvince: address.stateProvince || "",
                            postalCode: address.postalCode,
                            country: address.country,
                            isDefault: address.isDefault,
                          });
                        }}
                        className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center"
                        title="แก้ไขที่อยู่"
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-900 text-sm flex items-center"
                        title="ลบที่อยู่"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
