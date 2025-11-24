import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// typing effect hook
function useTypingEffect(text, isActive) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!isActive) {
      setDisplay(text);
      return;
    }
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [text, isActive]);
  return display;
}

const Conversation = ({ fileUrl }) => {
  const [messages, setMessages] = useState([
    { from: "agent", text: "Upload a dataset to begin — I'll generate insights and charts." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input?.trim() || !fileUrl) return;
    const question = input.trim();
    setMessages((m) => [...m, { from: "user", text: question }]);
    setInput("");
    setIsSending(true);
    setTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: fileUrl, question }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Chat failed: ${res.status}`);
      }

      const data = await res.json();
      // extract reply gracefully
      const rawReply = data?.response?.reply || data?.reply || data;
      // make it a string
      const reply = typeof rawReply === "string" ? rawReply : JSON.stringify(rawReply);

      // typing effect: show progressively
      setTyping(true);
      const typed = useTypingEffect; // placeholder - we'll just implement below
      // push empty agent message to show typing
      setMessages((m) => [...m, { from: "agent", text: "" }]);

      // simulate typing by gradually updating last message text
      let i = 0;
      const intervalId = setInterval(() => {
        i++;
        setMessages((prev) => {
          const copy = [...prev];
          // update last agent message
          copy[copy.length - 1] = { from: "agent", text: reply.slice(0, i) };
          return copy;
        });
        if (i >= reply.length) {
          clearInterval(intervalId);
          setTyping(false);
        }
      }, 15);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [...m, { from: "agent", text: `Error: ${err.message}` }]);
      setTyping(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white rounded shadow-sm flex flex-col h-full"
      style={{ minHeight: 420 }}
    >
      <h3 className="text-lg font-medium mb-3">Conversation</h3>

      <div className="overflow-auto mb-3" style={{ maxHeight: 320 }}>
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.from === "agent" ? "text-left" : "text-right"}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  m.from === "agent"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-600 text-white"
                }`}
                style={{ maxWidth: "85%" }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={fileUrl ? "Ask about the dataset..." : "Upload a dataset first"}
          disabled={!fileUrl || isSending}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={!fileUrl || isSending}
          type="submit"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>
    </motion.div>
  );
};

export default Conversation;
