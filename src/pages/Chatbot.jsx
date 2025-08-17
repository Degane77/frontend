import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSend, FiSettings, FiMoon, FiSun } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState("cafiye");
  const [showAISelector, setShowAISelector] = useState(false);
  const [user, setUser] = useState(null);
  const bottomRef = useRef(null);

  // THEME
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const aiTypes = [
    { id: "cafiye", name: "Cafiye AI", description: "Mental Health Assistant", icon: "🌿" },
    { id: "codemaster", name: "CodeMaster AI", description: "Programming Assistant", icon: "💻" },
    { id: "designgenius", name: "DesignGenius AI", description: "Design Assistant", icon: "🎨" },
    { id: "edumentor", name: "EduMentor AI", description: "Educational Assistant", icon: "📚" },
    { id: "healthguide", name: "HealthGuide AI", description: "Health Information", icon: "🏥" },
    { id: "businessadvisor", name: "BusinessAdvisor AI", description: "Business Assistant", icon: "💼" },
    { id: "creativewriter", name: "CreativeWriter AI", description: "Writing Assistant", icon: "✍️" },
    { id: "techsupport", name: "TechSupport AI", description: "Technical Support", icon: "🔧" },
    { id: "languagetutor", name: "LanguageTutor AI", description: "Language Learning", icon: "🌍" },
    { id: "personalcoach", name: "PersonalCoach AI", description: "Life Coaching", icon: "🎯" }
  ];
  const currentAI = aiTypes.find(ai => ai.id === selectedAI);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) setUser(JSON.parse(userInfo));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isLoading]);

  const formatTime = (ts) => {
    try {
      const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const now = Date.now();
    const userChat = { role: "user", text: message, timestamp: now };
    setChats(prev => [...prev, userChat]);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message,
        userId: user?.id || "guest",
        aiType: selectedAI,
        language: "en",
      });

      if (response.data?.success) {
        const botChat = { role: "bot", text: response.data.response, timestamp: Date.now() };
        setChats(prev => [...prev, botChat]);
      } else {
        throw new Error(response.data?.response || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChats(prev => [
        ...prev,
        {
          role: "bot",
          text: error?.response?.data?.response || "Cilad farsamo ayaa dhacday. Fadlan isku day mar kale.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setMessage("");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setChats([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <motion.div
          layout
          className="rounded-2xl shadow-xl border border-emerald-100/60 dark:border-slate-800 overflow-hidden bg-white/80 dark:bg-slate-900/70 backdrop-blur-md"
        >
          {/* Header */}
          <div className="relative">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                    <span className="text-2xl select-none">{currentAI.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{currentAI.name}</h2>
                    <p className="text-emerald-100 text-sm">{currentAI.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                  >
                    {theme === "dark" ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
                  </button>
                  <button
                    onClick={() => setShowAISelector(v => !v)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Change AI Assistant"
                  >
                    <FiSettings className="text-xl" />
                  </button>
                  {chats.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {user && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold leading-tight">{user.fullName}</p>
                      <p className="text-xs text-emerald-100">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-emerald-100 mt-2 text-xs">Developed by Garaad Bashiir Hussein</p>
            </div>

            {/* AI Selector Panel */}
            <AnimatePresence>
              {showAISelector && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-x-4 -bottom-12 z-10"
                >
                  <div className="rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md p-3">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Choose AI Assistant</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {aiTypes.map((ai) => (
                        <button
                          key={ai.id}
                          onClick={() => {
                            setSelectedAI(ai.id);
                            setShowAISelector(false);
                            setChats([]);
                          }}
                          className={`group p-3 rounded-lg text-left transition-all border ${
                            selectedAI === ai.id
                              ? "bg-emerald-500 text-white border-emerald-500 shadow"
                              : "bg-white dark:bg-slate-900 border-emerald-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="text-lg mb-1">{ai.icon}</div>
                          <div className="text-sm font-medium">{ai.name}</div>
                          <div className={`text-xs opacity-75 ${selectedAI === ai.id ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"}`}>{ai.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div className="h-[28rem] overflow-y-auto p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-950/40">
            {chats.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center">
                  <span className="text-2xl select-none">{currentAI.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-2">
                  Welcome to {currentAI.name} {currentAI.icon}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{currentAI.description}. How can I help you today?</p>
                {user && (
                  <div className="bg-sky-50 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-sm text-sky-900 dark:text-slate-200">
                      <strong>Welcome back, {user.fullName}!</strong> I'm here to assist you with your questions.
                    </p>
                  </div>
                )}
                <div className="text-xs text-slate-400">
                  💬 Remember: Support only. For emergencies, contact local services.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chats.map((chat, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
                    className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm border text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-sm ${
                        chat.role === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600"
                          : "bg-white/90 dark:bg-slate-900/80 border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      <p>{chat.text}</p>
                      <p className={`text-[10px] mt-2 ${chat.role === "user" ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"}`}>
                        {formatTime(chat.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/90 dark:bg-slate-900/80 border border-emerald-100 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center">
                          <span className="text-xs select-none">{currentAI.icon}</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{currentAI.name} is thinking…</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 sm:p-6 bg-white/80 dark:bg-slate-900/70 border-t border-emerald-100/60 dark:border-slate-800 backdrop-blur">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${currentAI.name} anything…`}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className={`px-5 sm:px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg ${
                  message.trim() && !isLoading
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
                }`}
                title={message.trim() ? "Send" : "Type a message"}
              >
                <FiSend className="text-lg" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <div className="text-[11px] text-center mt-2 text-slate-500 dark:text-slate-400">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Enter</kbd> to send • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Shift</kbd>+<kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Enter</kbd> for newline • Use ⚙️ to switch AI
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
