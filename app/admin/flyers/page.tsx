"use client";

import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileImage, Eye, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

export default function AdminFlyersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
      } else {
        showErrorToast("Please select an image file only.");
      }
    }
  };

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        showErrorToast("Please select an image file only.");
      }
    }
  };

  // Handle Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/admin/upload-flyer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        showSuccessToast("Weekly flyer updated successfully!");
        setFile(null);
        setPreviewUrl(null);
        // Force update the live preview image component
        setCacheBuster(Date.now());
      } else {
        showErrorToast(data.message || "Failed to upload flyer.");
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.response?.data?.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800">
          Manage Weekly Flyer
        </h1>
        <p className="text-sm text-slate-500 font-light max-w-2xl">
          Upload and replace the store's weekly promotional flyer. Updates will apply instantly to the public view of the site.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Current Flyer Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#005AA9]" />
              <span>Current Active Flyer</span>
            </h2>
            
            <div className="relative w-full aspect-[3/4.2] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/flyers.png?t=${cacheBuster}`}
                alt="Active Flyer"
                className="max-w-full max-h-full object-contain rounded-xl transition-all duration-300"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end text-xs text-slate-400 font-medium">
            
            <a
              href={`/images/flyers.png?t=${cacheBuster}`}
              download="weekly-flyer.png"
              className="text-[#005AA9] hover:underline flex items-center gap-1 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Current
            </a>
          </div>
        </div>

        {/* RIGHT: Upload Form Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#005AA9]" />
              <span>Upload New Flyer</span>
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-[#005AA9] bg-blue-50/20"
                    : "border-slate-200 hover:border-[#005AA9]/50 hover:bg-slate-50/30"
                }`}
              >
                <input
                  type="file"
                  id="flyer-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <FileImage className="w-10 h-10 text-slate-400 mb-3" />
                
                <p className="text-sm font-bold text-slate-700">
                  Drag and drop your image here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  or click to browse from your device
                </p>
                <p className="text-[10px] text-slate-400 mt-4 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                  PNG, JPG, or WEBP formats accepted
                </p>
              </div>

              {/* Selected File Details & Preview */}
              {file && (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Selected File</p>
                      <p className="text-sm font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                      <p className="text-xs text-slate-500 font-light mt-0.5">{formatSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreviewUrl(null); }}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer focus:outline-none"
                    >
                      Clear
                    </button>
                  </div>

                  {previewUrl && (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Selection Preview"
                        className="w-full h-full object-contain p-1.5"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full bg-[#005AA9] hover:bg-[#004b8d] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide uppercase py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading & Replacing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Weekly Flyer
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Quick Notice Info Card */}
          <div className="bg-blue-50/50 rounded-3xl border border-blue-100 p-6 space-y-3">
            <h3 className="text-xs font-black text-[#005AA9] uppercase tracking-wider leading-none">
              Publishing Notice
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              This upload replaces the core flyer asset directly. Once uploaded, customers visiting the weekly flyer page will immediately view the updated image. Make sure the content, pricing, and active dates listed on the flyer are verified before publishing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
