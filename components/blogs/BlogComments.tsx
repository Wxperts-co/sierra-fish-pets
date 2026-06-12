"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, CornerDownRight } from "lucide-react";
import commentsData from "@/data/comments.json";

interface CommentReply {
  id: string;
  name: string;
  role?: string;
  date: string;
  avatar: string;
  text: string;
}

interface CommentItem {
  id: string;
  name: string;
  date: string;
  avatar: string;
  text: string;
  replies: CommentReply[];
}

interface BlogCommentsProps {
  postCategory: string;
}

const commentsDict = commentsData as Record<string, CommentItem[]>;

const getDefaultComments = (category: string): CommentItem[] => {
  const normalized = category.toLowerCase();
  return commentsDict[normalized] || commentsDict["default"] || [];
};

export default function BlogComments({ postCategory }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>(() => getDefaultComments(postCategory));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const totalCommentsCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commentText) return;

    const newComment: CommentItem = {
      id: `c-user-${Date.now()}`,
      name,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      avatar: "/images/team/sierra-team.jpg",
      text: commentText,
      replies: [],
    };

    setComments((prev) => [...prev, newComment]);
    setName("");
    setEmail("");
    setCommentText("");
    setSuccessMsg("Thank you! Your comment has been posted.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="mt-14 pt-10 border-t border-slate-200/80">
      {/* Comments Count Header */}
      <h3 className="text-xl font-bold text-slate-900 text-center mb-10">
        {totalCommentsCount} Comments
      </h3>

      {/* Comments List */}
      <div className="space-y-8 mb-14">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-6">
            
            {/* Parent Comment */}
            <div className="flex gap-4 items-start group">
              <div className="relative w-12 h-12 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-slate-50 shadow-sm">
                <Image
                  src={comment.avatar}
                  alt={comment.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      {comment.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {comment.date}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-[#005AA9] transition-colors cursor-pointer" aria-label="Reply">
                    <CornerDownRight size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </div>

            {/* Replies List */}
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-4 items-start ml-12 md:ml-16">
                <div className="relative w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-slate-50 shadow-sm">
                  <Image
                    src={reply.avatar}
                    alt={reply.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 bg-[#005AA9]/5 border border-[#005AA9]/10 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        {reply.name}
                        {reply.role && (
                          <span className="bg-[#005AA9] text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest leading-none">
                            {reply.role}
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {reply.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {reply.text}
                  </p>
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>

      {/* Leave a Reply Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 mb-6 pb-2 border-b border-slate-100">
          Leave a Reply
        </h3>
        
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-xs font-bold text-green-700 animate-fade-in">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="commentText" className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Comment
            </label>
            <textarea
              id="commentText"
              rows={5}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Your comment here..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
            />
          </div>

          

          <div className="pt-2">
            <button
              type="submit"
              className="bg-black hover:bg-[#005AA9] text-white text-[10px] font-bold tracking-widest px-8 py-3.5 uppercase transition-all duration-300 rounded-none shadow active:scale-95 cursor-pointer"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
