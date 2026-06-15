"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ContactUsPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24">
      {/* ─── HERO HEADER SECTION ─── */}
      
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Contact us banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Contact us banner"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
              Contact Us
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Contact Us</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTACT FORM & INFO CARDS SECTION ─── */}
      <section className="container mx-auto px-6 max-w-6xl py-10 relative ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Info Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {/* Location Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex gap-4"
            >
              <div className="p-3 bg-[#EBF7FF] text-[#005AA9] rounded-2xl shrink-0 h-fit">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002244] mb-1">
                  Our Store Address
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  601 S Grady Way Suite M, <br />
                  Renton, WA 98057
                </p>
                <a
                  href="https://maps.app.goo.gl/48Q7dQBbespuFhX27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#005AA9] font-bold text-xs hover:underline"
                >
                  Get Directions <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* Direct Contact Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex gap-4"
            >
              <div className="p-3 bg-orange-50 text-[#FF6B35] rounded-2xl shrink-0 h-fit">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002244] mb-1">
                  Direct Contact
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-1 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Phone:</span>
                  <a
                    href="tel:4252263215"
                    className="hover:text-[#005AA9] transition-colors"
                  >
                    425-226-3215
                  </a>
                </p>
                <p className="text-slate-600 text-sm leading-relaxed flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Email:</span>
                  <a
                    href="mailto:info@sierrafishandpets.com"
                    className="hover:text-[#005AA9] transition-colors"
                  >
                    info@sierrafishandpets.com
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Store Hours Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex gap-4"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0 h-fit">
                <Clock className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h3 className="text-lg font-bold text-[#002244] mb-1">
                  Operating Hours
                </h3>
                <div className="space-y-1.5 text-slate-600 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Monday – Friday</span>
                    <span className="font-semibold text-[#002244]">
                      11:00 AM – 7:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Saturday</span>
                    <span className="font-semibold text-[#002244]">
                      11:00 AM – 7:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-[#002244]">
                      11:00 AM – 5:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-2xl relative overflow-hidden">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#005AA9]" />
                Send Us a Message
              </h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Got a question or feedback? Complete this form and our support
                coordinators will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@example.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write details about your question..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md shadow-blue-500/10 disabled:opacity-75 disabled:hover:scale-100 disabled:pointer-events-none cursor-pointer text-sm uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* SUCCESS MODAL POPUP OVERLAY */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#002244]/95 flex flex-col items-center justify-center p-8 text-center text-white z-30"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="max-w-md flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-[#00aaff]/10 border border-[#00aaff]/20 text-[#00aaff] rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <h3 className="text-3xl font-extrabold mb-3">
                        Thank You!
                      </h3>
                      <p className="text-blue-100/90 leading-relaxed text-sm mb-8 font-light">
                        Your message has been safely delivered to our inbox. An
                        expert coordinator will reach out to you within 24
                        business hours.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── GOOGLE MAP INTEGRATION SECTION ─── */}
      <section className="container mx-auto px-6 max-w-6xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl p-4"
        >
          <div className="h-[450px] w-full rounded-2xl overflow-hidden relative shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2698.371343761358!2d-122.22238472332613!3d47.46313197119301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54905cd19a64f509%3A0x7d02ff607d72c1c6!2s601%20S%20Grady%20Way%20Suite%20M%2C%20Renton%2C%20WA%2098057!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sierra Fish & Pets Store Locator Map"
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
