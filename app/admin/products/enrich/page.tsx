"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Sparkles,
  Server,
  Activity,
  ArrowRightCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/toast";

interface DatabaseStats {
  totalProducts: number;
  productsWithImages: number;
  pendingEnrichment: number;
  failedEnrichment: number;
  processingEnrichment: number;
  productsMissingImages: number;
}

interface EnrichmentResult {
  productId: string;
  name: string;
  status: "completed" | "failed";
  imageUrl?: string;
  source?: string;
  reason?: string;
}

export default function ImageEnrichmentPage() {
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEnriching, setIsEnriching] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const [batchSize, setBatchSize] = useState(20);
  const [results, setResults] = useState<EnrichmentResult[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDbStats = async () => {
    try {
      const response = await axios.get("/api/admin/products/enrich-images");
      if (response.data?.success) {
        setDbStats(response.data.stats);
      }
    } catch (err: any) {
      console.error("Failed to fetch database stats:", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await fetchDbStats();
    setLoading(false);
  };

  // Start polling when jobs are active or waiting to show real-time progress
  useEffect(() => {
    loadAllData();
    
    // Poll stats every 4 seconds
    pollingRef.current = setInterval(() => {
      fetchDbStats();
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleTriggerEnrichment = async () => {
    try {
      setIsEnriching(true);
      setResults(null);
      setMessage(null);

      const response = await axios.post("/api/admin/products/enrich-images", {
        batchSize,
      });

      if (response.data?.success) {
        setResults(response.data.results || []);
        setMessage(response.data.message);
        await fetchDbStats();
      }
    } catch (err: any) {
      console.error("Enrichment run failed:", err);
      showErrorToast(err.response?.data?.message || "Failed to trigger enrichment batch.");
    } finally {
      setIsEnriching(false);
    }
  };

  const handleRetryFailed = async () => {
    try {
      setIsRetrying(true);
      setMessage(null);
      setResults(null);

      const response = await axios.post("/api/admin/products/enrich-images/retry");
      if (response.data?.success) {
        setMessage(response.data.message);
        await fetchDbStats();
      }
    } catch (err: any) {
      console.error("Retry trigger failed:", err);
      showErrorToast(err.response?.data?.message || "Failed to requeue failed jobs.");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#005AA9] fill-[#005AA9]/10" />
            <span>Image Enrichment Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage your background image enrichment scheduler integrated with MongoDB.
          </p>
        </div>
      </div>

      {/* Database Inventory Metrics */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5" />
          <span>MongoDB Database Status</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">
                {loading ? "..." : dbStats?.totalProducts}
              </h3>
            </div>
            <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Images</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-2">
                {loading ? "..." : dbStats?.productsWithImages}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Images</p>
              <h3 className="text-2xl font-black text-amber-500 mt-2">
                {loading ? "..." : dbStats?.pendingEnrichment}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing Images</p>
              <h3 className="text-2xl font-black text-sky-600 mt-2">
                {loading ? "..." : dbStats?.processingEnrichment}
              </h3>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failed Images</p>
              <h3 className="text-2xl font-black text-rose-600 mt-2">
                {loading ? "..." : dbStats?.failedEnrichment}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trigger Batch Enrichment */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-800">Trigger Batch Enrichment</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Select a batch size to manually trigger image enrichment checks. This extracts products currently labeled as pending or failed, and runs them synchronously.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batch Size:</label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                disabled={isEnriching}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <option value={10}>10 Products</option>
                <option value={20}>20 Products</option>
                <option value={30}>30 Products</option>
                <option value={50}>50 Products</option>
              </select>
            </div>

            <Button
              onClick={handleTriggerEnrichment}
              disabled={isEnriching || isRetrying || !dbStats || (dbStats.pendingEnrichment === 0 && dbStats.failedEnrichment === 0)}
              className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isEnriching ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Enriching Batch...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enrich Next Batch</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Retry Failed Enrichments */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-800">Retry Failed Image Tasks</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
              Reset all failed enrichments back to "pending" to allow the server-side background scheduler to re-process them.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleRetryFailed}
              disabled={isEnriching || isRetrying || !dbStats || dbStats.failedEnrichment === 0}
              className="h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Re-queueing Jobs...</span>
                </>
              ) : (
                <>
                  <ArrowRightCircle className="w-4 h-4" />
                  <span>Retry Failed Images</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Feedback */}
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-150 rounded-2xl text-sm font-semibold text-blue-700">
          {message}
        </div>
      )}

      {/* Table Results */}
      {results && results.length > 0 && !isEnriching && (
        <div className="bg-white border border-slate-150 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Run Results</h4>
            <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
              {results.length} Processed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Resolved Image</th>
                  <th className="px-6 py-3">Source / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {results.map((res, index) => (
                  <tr key={index} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4 font-bold text-slate-900">{res.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black capitalize ${
                          res.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {res.imageUrl ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={res.imageUrl} alt={res.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <span className="text-xs text-slate-400 truncate max-w-[150px] select-all font-mono">
                            {res.imageUrl}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-350 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {res.status === "completed" ? (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                          {res.source}
                        </span>
                      ) : (
                        <span className="text-xs text-rose-500 font-semibold">{res.reason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
