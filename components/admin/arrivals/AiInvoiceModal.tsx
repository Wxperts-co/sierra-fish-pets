"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Sparkles,
  Upload,
  FileText,
  X,
  Check,
  Trash2,
  Image as ImageIcon,
  Edit2,
  AlertCircle,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface ParsedItem {
  id?: string;
  name: string;
  scientificName?: string;
  breed: string;
  size: string;
  quantity: number;
  price: number;
  category: string;
  location: string;
  arrivalDate: string;
  image: string;
  imageSource?: string;
  selected?: boolean;
}

interface AiInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_INVOICE_TEXT = `Seagrest Farms Wholesale Live Fish Invoice #89201
Date: 2026-09-03
Ship To: Sierra Fish & Pets - Renton

50  Neon Tetra (Paracheirodon innesi) Small/Med  $1.45
25  Cardinal Tetra (Paracheirodon axelrodi) Med  $2.20
15  Yellow Tang (Zebrasoma flavescens) Medium    $45.00
20  Ocellaris Clownfish Tank-Raised Small        $14.50
30  Assorted Male Fancy Guppy Medium             $1.85
12  Panda Corydoras (Corydoras panda) 1.25"      $3.25
10  Red Turquoise Discus (Symphysodon) 2.5"      $32.00
40  Red Cherry Shrimp (Neocaridina davidi)       $1.10
6   Bearded Dragon Juvenile 6-8"                 $38.00
15  Green Tree Frog (Hyla cinerea) Adult         $7.50`;

export default function AiInvoiceModal({ isOpen, onClose, onSuccess }: AiInvoiceModalProps) {
  const [step, setStep] = useState<"input" | "review">("input");
  const [invoiceText, setInvoiceText] = useState("");
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

  // Editing individual item image modal / state
  const [activeImageRowIdx, setActiveImageRowIdx] = useState<number | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const rowFileInputRef = useRef<HTMLInputElement>(null);
  const invoiceFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // If text file, preview text directly
      if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setInvoiceText(String(ev.target.result));
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleParse = async () => {
    if (!invoiceText.trim() && !selectedFile) {
      showErrorToast("Please paste invoice text or upload an invoice file.");
      return;
    }

    try {
      setParsing(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("text", invoiceText);
      formData.append("arrivalDate", arrivalDate);

      const res = await axios.post("/api/admin/new-arrivals/ai-invoice-parse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.items?.length > 0) {
        const formatted = res.data.items.map((item: any, idx: number) => ({
          ...item,
          id: `item-${idx}-${Date.now()}`,
          selected: true,
        }));
        setParsedItems(formatted);
        setStep("review");
        showSuccessToast(`AI recognized ${formatted.length} fish & pet line-items!`);
      } else {
        showErrorToast(res.data?.message || "No items could be extracted.");
      }
    } catch (err: any) {
      console.error("Parse invoice error:", err);
      showErrorToast(err.response?.data?.message || "Failed to parse invoice.");
    } finally {
      setParsing(false);
    }
  };

  const handleRowChange = (index: number, field: keyof ParsedItem, value: any) => {
    setParsedItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteRow = (index: number) => {
    setParsedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setParsedItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const handleRowPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeImageRowIdx === null) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "arrivals");

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.url) {
        handleRowChange(activeImageRowIdx, "image", res.data.url);
        handleRowChange(activeImageRowIdx, "imageSource", "custom_upload");
        setActiveImageRowIdx(null);
        showSuccessToast("Custom tank photo updated!");
      }
    } catch (err) {
      showErrorToast("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    const selected = parsedItems.filter((i) => i.selected);
    if (selected.length === 0) {
      showErrorToast("Please select at least one item to publish.");
      return;
    }

    try {
      setPublishing(true);
      const res = await axios.post("/api/admin/new-arrivals/ai-invoice-batch-create", {
        items: selected,
      });

      if (res.data?.success) {
        showSuccessToast(`Published ${res.data.count} new live arrivals to website!`);
        onSuccess();
        onClose();
      } else {
        showErrorToast(res.data?.message || "Failed to publish arrivals.");
      }
    } catch (err: any) {
      console.error("Batch publish error:", err);
      showErrorToast(err.response?.data?.message || "Failed to publish arrivals.");
    } finally {
      setPublishing(false);
    }
  };

  const selectedCount = parsedItems.filter((i) => i.selected).length;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[linear-gradient(135deg,#003B73_0%,#005AA9_100%)] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  AI Invoice Fish & Livestock Scanner
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
                  Self-Contained
                </span>
              </div>
              <p className="text-xs text-blue-100">
                {step === "input"
                  ? "Scan supplier invoices (Seagrest, APET, etc.) to auto-populate fish arrivals with matched photos."
                  : `Reviewing recognized items (${selectedCount} selected for publishing).`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === "input" ? (
            <div className="space-y-5">
              {/* Top Controls: Date & Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Shipment / Arrival Date
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005AA9]"
                  />
                </div>

                <div className="flex items-end justify-between sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceText(SAMPLE_INVOICE_TEXT)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-[#005AA9] hover:bg-blue-100 transition cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Load Sample Distributor Invoice
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => invoiceFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 hover:border-[#005AA9] bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-[#005AA9]">
                  <Upload className="h-6 w-6" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-emerald-700">✓ {selectedFile.name}</p>
                    <p className="text-xs text-slate-400">Click to choose a different file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload Invoice file (PDF, TXT, CSV, or Image)
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Or paste the text lines directly in the box below
                    </p>
                  </div>
                )}
                <input
                  ref={invoiceFileInputRef}
                  type="file"
                  accept=".pdf,.txt,.csv,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Paste Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Invoice Line-Items (Paste from Email / Distributor Sheet)
                  </label>
                  {invoiceText && (
                    <button
                      type="button"
                      onClick={() => setInvoiceText("")}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  rows={8}
                  placeholder={`Example:\n50x Neon Tetra (Paracheirodon innesi) Small $1.45\n15x Yellow Tang (Zebrasoma flavescens) Medium $45.00\n20x Ocellaris Clownfish Small $14.50`}
                  value={invoiceText}
                  onChange={(e) => setInvoiceText(e.target.value)}
                  className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9]"
                />
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={handleParse}
                  disabled={parsing}
                  className="bg-[#005AA9] hover:bg-[#003B73] text-white rounded-2xl px-6 py-2.5 font-bold shadow-md shadow-blue-900/15 transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {parsing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Scanning & Matching Species Photos...
                    </>
                  ) : (
                    <>
                     
                      Extract & Match Species Photos
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: REVIEW & IMAGE EDIT TABLE */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCount === parsedItems.length && parsedItems.length > 0}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="rounded text-[#005AA9] focus:ring-[#005AA9]"
                    />
                    Select All ({parsedItems.length} items)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back to Invoice Input
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-[460px] overflow-y-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-10 text-center">✓</th>
                        <th className="p-3 w-20">Photo</th>
                        <th className="p-3">Fish / Pet Name</th>
                        <th className="p-3 w-28">Category</th>
                        <th className="p-3 w-24">Size</th>
                        <th className="p-3 w-20">Qty</th>
                        <th className="p-3 w-24">Price ($)</th>
                        <th className="p-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedItems.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          className={`hover:bg-slate-50/80 transition ${
                            !item.selected ? "opacity-50 bg-slate-50/40" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!item.selected}
                              onChange={(e) => handleRowChange(idx, "selected", e.target.checked)}
                              className="rounded text-[#005AA9]"
                            />
                          </td>

                          {/* Image with 1-click Change Button */}
                          <td className="p-3">
                            <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveImageRowIdx(idx);
                                  rowFileInputRef.current?.click();
                                }}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                                title="Click to upload custom tank photo"
                              >
                                <Edit2 className="h-3 w-3 mb-0.5" />
                                Change
                              </button>
                            </div>
                          </td>

                          {/* Name + Scientific Name */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleRowChange(idx, "name", e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#005AA9] rounded-lg transition"
                            />
                            {item.scientificName && (
                              <span className="text-[11px] text-slate-400 italic block px-2">
                                {item.scientificName}
                              </span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-3">
                            <select
                              value={item.category}
                              onChange={(e) => handleRowChange(idx, "category", e.target.value)}
                              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                            >
                              <option value="fish">Fish</option>
                              <option value="aquatic">Aquatic</option>
                              <option value="reptiles">Reptiles</option>
                              <option value="birds">Birds</option>
                              <option value="small animals">Small Animals</option>
                              <option value="dogs">Dogs</option>
                              <option value="cats">Cats</option>
                            </select>
                          </td>

                          {/* Size */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.size}
                              onChange={(e) => handleRowChange(idx, "size", e.target.value)}
                              className="w-full text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                            />
                          </td>

                          {/* Quantity */}
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleRowChange(idx, "quantity", parseInt(e.target.value, 10) || 1)}
                              className="w-full font-bold text-slate-800 text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                            />
                          </td>

                          {/* Price */}
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleRowChange(idx, "price", parseFloat(e.target.value) || 0)}
                              className="w-full font-bold text-slate-800 text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                            />
                          </td>

                          {/* Delete */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hidden file input for single row image replace */}
              <input
                ref={rowFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleRowPhotoUpload}
                className="hidden"
              />

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCount} of {parsedItems.length} items will be published live to the website.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishing || selectedCount === 0}
                    className="bg-[#005AA9] hover:bg-[#003B73] text-white rounded-2xl px-6 py-2.5 font-bold shadow-md shadow-blue-900/15 transition active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Publishing to Website...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Publish {selectedCount} Arrivals
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
