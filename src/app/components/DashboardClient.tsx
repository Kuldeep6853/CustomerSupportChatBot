"use client";
import React, { useEffect, useState } from "react";
import {  motion } from "motion/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const DashboardClient = ({ ownerId }: { ownerId: string }) => {
  const navigate = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleSettings = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/settings", {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
      });
      setLoading(false);
      setSaved(true)
      setTimeout(()=>setSaved(false), 3000)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!ownerId) return; // prevent call when ownerId is undefined/null

  const handleGetDetails = async () => {
    try {
      const result = await axios.get("/api/settings/get", {
        params: { ownerId },
      });

      const data = result.data;

      setBusinessName(data.businessName || "");
      setSupportEmail(data.supportEmail || "");
      setKnowledge(data.knowledge || "");
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  handleGetDetails();
}, [ownerId]);


  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate.push("/")}
            className="text-lg font-semibold tracking-tight"
          >
            Support <span className="text-zinc-400">AI</span>
          </div>
          <button
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100
             transition"
             onClick={()=>navigate.push("/embed")}
          >
            Embed ChatBot
          </button>
        </div>
      </motion.div>

      <div className="flex justify-center px-4 py-14 mt-20">
        <motion.div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold">Chatbo Settings</h1>
            <p className="text-zinc-500 mt-1">
              Manage your AI chatbot knowledge and business details
            </p>
          </div>
          <div className="mb-10">
            <h1 className="text-lg font-medium mb-4">Business Details</h1>

            <div className="space-y-4">
              <input
                type="text"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                placeholder="business name"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <input
                type="text "
                onChange={(e) => setSupportEmail(e.target.value)}
                value={supportEmail}
                placeholder="support email"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
          </div>
          <div className="mb-10">
            <h1 className="text-lg font-medium mb-4">Knowledge Base</h1>
            <p className="text-zinc-500 mt-1 mb-1 text-sm">
              Add FAQs, policies ,delivery info , refound info, etc.
            </p>
            <div className="space-y-4">
              <textarea
                onChange={(e) => setKnowledge(e.target.value)}
                value={knowledge}
                placeholder="knowledge base name"
                className="w-full h-54 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.5 }}
              disabled={loading}
              onClick={handleSettings}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition"
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>
          </div>

          {saved && (
           <motion.span 
            initial={{opacity:0,y:6}}
            animate={{opacity:1,y:0}}
            className="text-sm font-medium text-emerald-600"
           >
             ✅ Settings saved
           </motion.span>
        )} 
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardClient;
