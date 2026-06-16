"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Edit3,
  Trash2,
  Check,
  CheckCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  Tag,
  Home,
  Briefcase,
  Building,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import AddressCard from "@/components/account/AddressCard";
import AccountHeader from "@/components/account/AccountHeader";

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // local states
  const [formMode, setFormMode] = useState<"view" | "add" | "edit">("view");
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    label: "Home",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const savedAddresses = user?.addresses || [];

  const handleOpenAdd = () => {
    setFormData({
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      label: "Home",
      isDefault: savedAddresses.length === 0,
    });
    setFormMode("add");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleOpenEdit = (addr: any) => {
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      label: addr.label,
      isDefault: addr.isDefault,
    });
    setEditAddressId(addr.id);
    setFormMode("edit");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      let res;
      if (formMode === "add") {
        res = await axios.post("/api/auth/addresses/add", formData);
      } else {
        res = await axios.post("/api/auth/addresses/update", {
          id: editAddressId,
          ...formData,
        });
      }

      if (res.data.success) {
        setSuccessMsg(
          formMode === "add"
            ? "New address added successfully!"
            : "Address updated successfully!"
        );
        dispatch(updateUser(res.data.user));
        setFormMode("view");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while saving the address."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/addresses/delete", { id: addressId });
      if (res.data.success) {
        setSuccessMsg("Address deleted successfully!");
        dispatch(updateUser(res.data.user));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Error deleting address.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/addresses/set-default", { id: addressId });
      if (res.data.success) {
        setSuccessMsg("Default address updated successfully!");
        dispatch(updateUser(res.data.user));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Error setting default address.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="Shipping Addresses"
        description="Manage your saved shipping destinations for speedier checkout."
        icon={<MapPin className="h-6 w-6 text-[#005AA9]" />}
      >
        {formMode === "view" && (
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl bg-[#005AA9] hover:bg-blue-700 text-white font-bold transition-all inline-flex items-center gap-2 text-sm cursor-pointer hover:shadow-md shadow-blue-500/15"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </button>
        )}
      </AccountHeader>

      {/* Status messages */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-4 text-sm font-semibold">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-4 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* VIEW ADDRESSES GRID */}
      {formMode === "view" && (
        <>
          {savedAddresses.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                No addresses saved yet
              </h3>
              <p className="text-slate-500 mb-6 text-sm font-medium">
                Add your primary address to enjoy faster checkout speeds.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2.5 rounded-xl bg-[#005AA9] hover:bg-blue-700 text-white font-bold transition-all inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Address</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedAddresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  addr={addr}
                  savedAddressesCount={savedAddresses.length}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT FORM VIEW */}
      {(formMode === "add" || formMode === "edit") && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <h3 className="font-extrabold text-slate-800 text-lg">
              {formMode === "add" ? "Add New Shipping Address" : "Edit Address Details"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Address Label */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Address Label
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              >
                <option value="Home">Home</option>
                <option value="Work">Work / Office</option>
                <option value="Billing">Billing Address</option>
                <option value="Parent">Parent&apos;s House</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter recipient's name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="For delivery updates"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Apt 4B"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Renton"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="WA"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="98057"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Set as default checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              disabled={formData.isDefault && savedAddresses.length === 0}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#005AA9] focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
            />
            <label htmlFor="isDefault" className="text-sm font-semibold text-slate-700 select-none cursor-pointer">
              Set as my default shipping address
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-transform hover:scale-[1.02] shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{loading ? "Saving..." : "Save Address"}</span>
            </button>
            <button
              type="button"
              onClick={() => setFormMode("view")}
              className="px-8 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
