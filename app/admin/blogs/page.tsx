"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, BookOpen, Search, X, Check, FileText, Sparkles, Clock, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  thumbnailAlt?: string;
  author: string;
  authorRole?: string;
  authorImage?: string;
  category: string;
  categorySlug: string;
  tags: string[];
  featured: boolean;
  isArrival: boolean;
  status: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  relatedIds?: string[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  specialistQuote?: {
    quote: string;
    author: string;
  };
  galleryImages?: string[];
}

const CATEGORIES = [
  { id: "dog", label: "Dogs", emoji: "🐶", color: "text-amber-600 bg-amber-50 border-amber-100" },
  { id: "cat", label: "Cats", emoji: "🐱", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { id: "bird", label: "Birds", emoji: "🐦", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { id: "aquatic", label: "Aquatic", emoji: "🐠", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
  { id: "small-animal", label: "Small Animals", emoji: "🐹", color: "text-purple-600 bg-purple-50 border-purple-100" },
  { id: "reptile", label: "Reptiles", emoji: "🦎", color: "text-rose-600 bg-rose-50 border-rose-100" },
];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<AdminBlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("/images/blogs/dog1.jpeg");
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [author, setAuthor] = useState("Sierra Team");
  const [authorRole, setAuthorRole] = useState("Pet Specialist");
  const [authorImage, setAuthorImage] = useState("/images/team/sierra-team.jpg");
  const [category, setCategory] = useState("dog");
  const [tagsInput, setTagsInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isArrival, setIsArrival] = useState(false);
  const [status, setStatus] = useState("draft");
  const [readingTime, setReadingTime] = useState(3);
  const [galleryImagesInput, setGalleryImagesInput] = useState("");

  // Specialist Quote
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("SIERRA TEAM");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/blogs");
      if (response.data?.success) {
        setPosts(response.data.blogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = total - published;
    const arrivals = posts.filter((p) => p.isArrival).length;
    return { total, published, drafts, arrivals };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.categorySlug === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, categoryFilter]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(slugify(val));
    }
  };

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("/images/blogs/dog1.jpeg");
    setThumbnailAlt("");
    setAuthor("Sierra Team");
    setAuthorRole("Pet Specialist");
    setAuthorImage("/images/team/sierra-team.jpg");
    setCategory("dog");
    setTagsInput("");
    setFeatured(false);
    setIsArrival(false);
    setStatus("draft");
    setReadingTime(3);
    setGalleryImagesInput("");
    setQuoteText("");
    setQuoteAuthor("SIERRA TEAM");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: AdminBlogPost) => {
    setEditingPost(post);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setCoverImage(post.coverImage || "/images/blogs/dog1.jpeg");
    setThumbnailAlt(post.thumbnailAlt || "");
    setAuthor(post.author || "Sierra Team");
    setAuthorRole(post.authorRole || "Pet Specialist");
    setAuthorImage(post.authorImage || "/images/team/sierra-team.jpg");
    setCategory(post.categorySlug || post.category?.toLowerCase() || "dog");
    setTagsInput((post.tags || []).join(", "));
    setFeatured(post.featured || false);
    setIsArrival(post.isArrival || false);
    setStatus(post.status || "draft");
    setReadingTime(post.readingTime || 3);
    setGalleryImagesInput((post.galleryImages || []).join(", "));
    setQuoteText(post.specialistQuote?.quote || "");
    setQuoteAuthor(post.specialistQuote?.author || "SIERRA TEAM");
    setSeoTitle(post.seo?.title || "");
    setSeoDescription(post.seo?.description || "");
    setSeoKeywords((post.seo?.keywords || []).join(", "));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/blogs/${id}`);
      if (response.data?.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      showErrorToast("Failed to delete blog post.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !category) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const galleryImages = galleryImagesInput
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const seoKeywordsArr = seoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const categoryObj = CATEGORIES.find((cat) => cat.id === category) || { label: "Dogs", id: "dog" };

    const payload: Partial<AdminBlogPost> = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      thumbnailAlt: thumbnailAlt || title,
      author,
      authorRole,
      authorImage,
      category: categoryObj.label,
      categorySlug: categoryObj.id,
      tags,
      featured,
      isArrival,
      status,
      publishedAt: status === "published" ? (editingPost?.publishedAt || new Date().toISOString()) : "",
      updatedAt: new Date().toISOString(),
      readingTime: Number(readingTime),
      relatedIds: editingPost?.relatedIds || [],
      seo: {
        title: seoTitle || title,
        description: seoDescription || excerpt,
        keywords: seoKeywordsArr,
      },
      specialistQuote: {
        quote: quoteText,
        author: quoteAuthor,
      },
      galleryImages: galleryImages.length > 0 ? galleryImages : [coverImage],
    };

    try {
      if (editingPost) {
        // Edit Mode
        const response = await axios.patch(`/api/blogs/${editingPost.id}`, payload);
        if (response.data?.success) {
          setPosts((prev) =>
            prev.map((p) => (p.id === editingPost.id ? response.data.blog : p))
          );
        }
      } else {
        // Add Mode
        const newPayload = {
          ...payload,
          id: `blog-${String(Date.now()).slice(-3)}`,
        };
        const response = await axios.post("/api/blogs", newPayload);
        if (response.data?.success) {
          setPosts((prev) => [response.data.blog, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save blog post:", error);
      showErrorToast(error.response?.data?.message || "Failed to save blog post. Please check the inputs.");
    }
  };

  const rows = filteredPosts.map((post, index) => ({
    ...post,
    serial: index + 1,
  }));

 const handleAuthorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "authors");

  try {
    const res = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data?.success && res.data?.url) {
      setAuthorImage(res.data.url);
    }
  } catch (err: any) {
    console.error("Failed to upload author image:", err);
    showErrorToast(err.response?.data?.message || "Failed to upload author image");
  }
};

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 70,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Blog Post Details",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 truncate max-w-xs">{row.title}</span>
             
            </div>
           
          </div>
        );
      },
    },
    {
      field: "author",
      headerName: "Author",
      flex: 0.9,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-semibold text-slate-900">{row.author}</span>
            <span className="text-xs text-slate-500 mt-0.5">{row.authorRole || "Specialist"}</span>
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        const catSlug = row.categorySlug || row.category?.toLowerCase();
        const style = CATEGORIES.find((c) => c.id === catSlug) || {
          label: row.category || "General",
          emoji: "📝",
          color: "text-slate-600 bg-slate-50 border-slate-100",
        };
        return (
          <div className="flex items-center h-full">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black select-none ${style.color}`}>
              <span>{style.emoji}</span>
              <span>{style.label}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: "publishedAt",
      headerName: "Published At",
      flex: 0.9,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-semibold text-slate-900">
              {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) : "Not Published"}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              {row.readingTime || 0} min read
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        const isPublished = row.status === "published";
        return (
          <div className="flex items-center justify-start w-full h-full">
            <span
              className={`inline-flex items-center rounded-full p-2 text-[11px] leading-none font-bold ${isPublished
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
                }`}
            >
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<AdminBlogPost>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 py-1.5 h-full">
            <ActionsDropdown
              actions={[
                {
                  label: "View",
                  icon: <Eye className="w-4 h-4 text-slate-500" />,
                  onClick: () => {
                    setViewingPost(row);
                    setIsDetailModalOpen(true);
                  },
                },
                {
                  label: "Edit",
                  icon: <Edit2 className="w-4 h-4 text-blue-500" />,
                  onClick: () => handleOpenEditModal(row),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="w-4 h-4 text-red-500" />,
                  onClick: () => handleDelete(row.id),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Title block ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Blog Posts</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage blog post content, categories, tags, specialist quotes, and SEO configurations.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Blog Post
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Blog Posts</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Posts</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading ? "..." : stats.published}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Draft Posts</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading ? "..." : stats.drafts}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Arrivals</p>
            <h3 className="text-2xl font-black text-amber-500 mt-2">{loading ? "..." : stats.arrivals}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Sparkles className="w-6 h-6 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search blog posts by title, excerpt, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid/Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto" style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': { overflow: 'visible !important' },
            '& .MuiDataGrid-row': { overflow: 'visible !important' },
          }}
        />
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-300" />
                <span>{editingPost ? "Edit Blog Post" : "Create Blog Post"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Caring for your new Kitten"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Blog Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. caring-for-new-kitten"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Author, Role & Author Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Author Image URL
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAuthorImageChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Category, Cover Image & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Cover Image (Upload File)
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("folder", "blogs");
                        try {
                          const res = await axios.post("/api/upload", formData, {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          });
                          if (res.data?.success && res.data?.url) {
                            setCoverImage(res.data.url);
                          }
                        } catch (err: any) {
                          console.error("Failed to upload image:", err);
                          showErrorToast(
                            err.response?.data?.message || "Failed to upload image"
                          );
                        }
                      }}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-[#005AA9] hover:file:bg-sky-100 cursor-pointer border border-slate-200 rounded-2xl bg-white"
                    />
                    {coverImage && (
                      <div className="flex items-center gap-2 border border-slate-100 rounded-2xl p-2 bg-slate-50/50 w-full">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-semibold truncate flex-1">
                          {coverImage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Reading Time (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Thumbnail Alt & Tags & Gallery Images */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Thumbnail Alt text
                  </label>
                  <input
                    type="text"
                    placeholder="Describe image for accessibility"
                    value={thumbnailAlt}
                    onChange={(e) => setThumbnailAlt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. freshwater, arrivals, discus"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Gallery Images (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /img1.jpg, /img2.jpg"
                    value={galleryImagesInput}
                    onChange={(e) => setGalleryImagesInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Short, brief summary of the blog post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Post Content
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write post content. Use double newline to separate paragraphs. Use '# Section Title' or '- Bullet list' for formatting."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-y"
                />
              </div>

              {/* Specialist Quote */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Specialist Quote</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Quote
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acclimation is the critical bridge..."
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Quote Author
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SIERRA TEAM"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>



              {/* Switches: Featured, Arrival, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Featured Post</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Show in featured slider</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">New Arrival</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Mark as new pet arrival</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isArrival}
                      onChange={(e) => setIsArrival(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Status: Published</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Visible on the blog site</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === "published"}
                      onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 rounded-2xl border-slate-200 font-semibold px-6 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold px-8 active:scale-95 transition-all shadow-md"
                >
                  Save Blog Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail View Modal ── */}
      {isDetailModalOpen && viewingPost && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-300" />
                <span>Blog Post Details</span>
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Details Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Cover Image Block */}
              <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                {viewingPost.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={viewingPost.coverImage} alt={viewingPost.thumbnailAlt || viewingPost.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-350 bg-slate-50">
                    <BookOpen className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase shadow-sm ${viewingPost.status === "published" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
                    {viewingPost.status}
                  </span>
                  {viewingPost.featured && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                      Featured
                    </span>
                  )}
                  {viewingPost.isArrival && (
                    <span className="bg-cyan-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                      New Arrival
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-black">{viewingPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {viewingPost.readingTime} min read</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-snug">{viewingPost.title}</h3>
                <p className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-fit">
                  Slug: <span className="text-slate-600 select-all font-mono">{viewingPost.slug}</span>
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 border-t border-b border-slate-100 py-3.5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                  {viewingPost.authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewingPost.authorImage} alt={viewingPost.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 font-bold text-sm">{viewingPost.author?.[0]}</span>
                  )}
                </div>
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Written By</span>
                  <span className="font-bold text-sm text-slate-800 block mt-0.5">{viewingPost.author}</span>
                  <span className="text-xs text-slate-500 font-semibold">{viewingPost.authorRole || "Pet Specialist"}</span>
                </div>
                <div className="ml-auto text-right text-xs font-semibold text-slate-400">
                  {viewingPost.publishedAt ? (
                    <>
                      <span className="block text-[10px] font-black uppercase tracking-widest leading-none">Published</span>
                      <span className="block text-slate-600 mt-0.5">
                        {new Date(viewingPost.publishedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-500 font-bold">Draft</span>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {viewingPost.excerpt && (
                <div className="bg-slate-50/85 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Excerpt</span>
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed italic">"{viewingPost.excerpt}"</p>
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Content</span>
                <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-150 rounded-2xl p-4 bg-white shadow-inner">
                  {viewingPost.content}
                </div>
              </div>

              {/* Gallery Images */}
              {viewingPost.galleryImages && viewingPost.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Gallery Images</span>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5">
                    {viewingPost.galleryImages.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialist Quote */}
              {viewingPost.specialistQuote && viewingPost.specialistQuote.quote && (
                <div className="border-l-4 border-[#005AA9] bg-[#eef6ff]/40 p-4 rounded-r-2xl border-t border-b border-r border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Specialist Quote</span>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">"{viewingPost.specialistQuote.quote}"</p>
                  <span className="block text-xs font-bold text-slate-500 mt-2">— {viewingPost.specialistQuote.author || "SIERRA TEAM"}</span>
                </div>
              )}

              {/* Tags */}
              {viewingPost.tags && viewingPost.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingPost.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-150">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}


            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 p-6 shrink-0 bg-slate-50/50">
              <Button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="h-11 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 active:scale-95 transition-all shadow-md"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
