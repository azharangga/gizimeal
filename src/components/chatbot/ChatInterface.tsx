"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, Copy, Maximize2, Minimize2, Pencil, RefreshCw, Send, Square, ThumbsDown, ThumbsUp, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  streaming?: boolean;
  liked?: boolean | null;
}

interface Suggestion {
  label: string;
  message: string;
}

type BotStatus = "online" | "typing" | "offline";

const QUICK_PROMPTS = [
  "Apa itu BMR dan TDEE?",
  "Cara mengurangi kalori harian?",
  "menu gizi seimbang dari ayam & kentang?",
  "Tips menyusun menu harian",
  "Jelaskan panduan Isi Piringku",
];

function getTimeString(): string {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

async function fetchChatbotReply(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<{ reply: string; suggestions?: Suggestion[] }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  try {
    const res = await fetch("/api/chatbot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Gagal mendapatkan respons");
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Server terlalu lama merespons. Kemungkinan sedang cold-start, coba kirim ulang pesan.",
      );
    }
    throw error;
  }
}

export function ChatInterface({ compact = false, showControls = false, onClose, onToggleFullscreen, isFullscreen }: {
  compact?: boolean;
  showControls?: boolean;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<BotStatus>("online");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const streamRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (status === "online") {
      const t = setTimeout(() => setStatus("offline"), 120000);
      return () => clearTimeout(t);
    }
  }, [status, messages]);

  const streamReply = (id: string, fullText: string) => {
    let charIndex = 0;
    setStatus("typing");

    // Pre-compute ranges of blocks that should not be split during streaming
    // (tables and LaTeX block formulas)
    const skipRanges: { start: number; end: number }[] = [];

    // Detect markdown tables: header | separator | rows
    const tableRegex = /(?:^|\n)(\|[^\n]+\|\n\|[-| :]+\|\n(?:\|[^\n]+\|\n?)+)/g;
    let match;
    while ((match = tableRegex.exec(fullText)) !== null) {
      const start = match.index + (fullText[match.index] === "\n" ? 1 : 0);
      const end = start + match[1].length;
      skipRanges.push({ start, end });
    }

    // Detect LaTeX block formulas: $$...$$
    const latexBlockRegex = /\$\$[\s\S]*?\$\$/g;
    while ((match = latexBlockRegex.exec(fullText)) !== null) {
      skipRanges.push({ start: match.index, end: match.index + match[0].length });
    }

    // Sort by start position
    skipRanges.sort((a, b) => a.start - b.start);

    setMessages((m) => [...m, { id, role: "bot", text: "", time: getTimeString(), streaming: true, liked: null }]);

    const streamNext = () => {
      const chunkSize = 4 + Math.floor(Math.random() * 6);
      charIndex = Math.min(charIndex + chunkSize, fullText.length);

      // If charIndex lands inside a skip range, jump to the end
      for (const range of skipRanges) {
        if (charIndex > range.start && charIndex < range.end) {
          charIndex = range.end;
          break;
        }
      }

      setMessages((m) =>
        m.map((msg) => (msg.id === id ? { ...msg, text: fullText.slice(0, charIndex) } : msg))
      );
      scrollToBottom();

      if (charIndex >= fullText.length) {
        streamRef.current = null;
        setMessages((m) =>
          m.map((msg) => (msg.id === id ? { ...msg, text: fullText, streaming: false } : msg))
        );
        setStatus("online");
        return;
      }

      const currentChar = fullText[charIndex - 1];
      let delay = 8 + Math.random() * 12;
      if (currentChar === "\n") delay = 25 + Math.random() * 35;
      else if (".!?:".includes(currentChar || "")) delay = 18 + Math.random() * 22;

      streamRef.current = setTimeout(streamNext, delay) as unknown as number;
    };

    streamNext();
  };

  const sendMessage = (
    text: string,
    options?: { messageId?: string; baseHistory?: Message[] },
  ) => {
    const trimmed = text.trim();
    if (!trimmed || status === "typing") return;
    const id = options?.messageId ?? Date.now().toString();
    const baseHistory = options?.baseHistory ?? messages;

    setMessages((m) => {
      // If the message already exists (resend after edit), keep it; otherwise append
      if (m.some((msg) => msg.id === id)) {
        return m.map((msg) =>
          msg.id === id ? { ...msg, text: trimmed, time: getTimeString() } : msg,
        );
      }
      return [...m, { id, role: "user", text: trimmed, time: getTimeString() }];
    });
    setInput("");
    setSuggestions([]);
    setStatus("typing");

    // Create abort controller for this request
    const controller = new AbortController();
    abortRef.current = controller;

    // Build history from base messages for API context
    const history: { role: "user" | "assistant"; content: string }[] = baseHistory.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    fetchChatbotReply(trimmed, history)
      .then((data) => {
        if (controller.signal.aborted) return;
        streamReply(id + "-r", data.reply);
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi nanti.";
        streamReply(id + "-r", errorMsg);
      });

    inputRef.current?.focus();
  };

  const send = (text: string) => sendMessage(text);

  const handleCancel = () => {
    // Abort ongoing fetch request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop streaming animation
    if (streamRef.current) {
      clearTimeout(streamRef.current);
      streamRef.current = null;
    }
    // Mark any streaming message as done (keep partial text)
    setMessages((m) =>
      m.map((msg) => (msg.streaming ? { ...msg, streaming: false } : msg))
    );
    setStatus("online");
  };

  const handleStartEdit = (id: string, currentText: string) => {
    if (isTyping) return;
    setEditingId(id);
    setEditText(currentText);
    // Auto-focus the textarea after render
    setTimeout(() => {
      const ta = editTextareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleResendEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed) return;

    // Find the index of the message being edited
    const idx = messages.findIndex((m) => m.id === editingId);
    if (idx === -1) return;

    // Build new messages list: keep everything before the edited message,
    // then update the edited message, drop everything after
    const baseHistory = messages.slice(0, idx);
    const updatedMessage: Message = {
      ...messages[idx],
      text: trimmed,
      time: getTimeString(),
    };
    setMessages([...baseHistory, updatedMessage]);

    // Reset edit state
    setEditingId(null);
    setEditText("");

    // Resend with the truncated history (excluding this message itself)
    sendMessage(trimmed, { messageId: editingId, baseHistory });
  };

  const handleRefresh = () => {
    if (streamRef.current) {
      clearTimeout(streamRef.current);
      streamRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setMessages([]);
    setInput("");
    setSuggestions([]);
    setEditingId(null);
    setEditText("");
    setStatus("online");
    toast.success("Percakapan direset", { duration: 2000 });
  };

  const handleLike = (id: string, liked: boolean) => {
    setMessages((m) =>
      m.map((msg) => (msg.id === id ? { ...msg, liked } : msg))
    );
  };

  const isEmpty = messages.length === 0;
  const isTyping = status === "typing";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className={compact ? "flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-2.5" : "flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3 sm:px-5"}>
        <div className="flex items-center gap-2.5">
          <span className={compact ? "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground" : "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"}>
            <Bot className={compact ? "h-4 w-4" : "h-5 w-5"} />
          </span>
          <div>
            <p className={compact ? "text-[13px] font-semibold" : "text-sm font-semibold"}>GiziBot</p>
            <StatusText status={status} />
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            aria-label="Reset percakapan"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          {showControls && onToggleFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? "Perkecil" : "Perbesar"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          )}
          {showControls && onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Tutup"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={compact ? "flex-1 overflow-y-auto px-3 py-3" : "flex-1 overflow-y-auto px-4 py-4 sm:px-5"}>
        {isEmpty ? (
          <EmptyChat onPromptClick={send} compact={compact} />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={m.role === "user" ? "flex justify-end gap-2" : "flex justify-start gap-2"}
                >
                  {m.role === "bot" && (
                    <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-3 w-3" />
                    </span>
                  )}
                  <div className={m.role === "user" ? "max-w-[78%]" : "max-w-[82%]"}>
                    {m.role === "user" && editingId === m.id ? (
                      // Edit mode for user message
                      <div className="rounded-2xl rounded-br-sm border border-primary/40 bg-background p-2 shadow-sm">
                        <textarea
                          ref={editTextareaRef}
                          value={editText}
                          onChange={(e) => {
                            setEditText(e.target.value);
                            // Auto-resize
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleResendEdit();
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              handleCancelEdit();
                            }
                          }}
                          rows={1}
                          className="w-full resize-none bg-transparent px-2 py-1.5 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
                          placeholder="Ubah pesan..."
                        />
                        <div className="mt-1 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="rounded-md px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleResendEdit}
                            disabled={!editText.trim()}
                            className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
                          >
                            Kirim ulang
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={[
                          "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          m.role === "user"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm border border-border-soft bg-secondary/50 text-foreground",
                        ].join(" ")}
                      >
                        <MessageContent text={m.text} />
                        {/* Timestamp inside bubble like WhatsApp */}
                        <p className={[
                          "mt-1 text-right text-[10px]",
                          m.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground",
                        ].join(" ")}>
                          {m.time}
                        </p>
                      </div>
                    )}
                    {/* User message actions: edit */}
                    {m.role === "user" && editingId !== m.id && !isTyping && (
                      <div className="mt-1 mr-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(m.id, m.text)}
                          className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Edit pesan"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {/* Bot message actions: copy, like/dislike */}
                    {m.role === "bot" && !m.streaming && m.text && (
                      <div className="mt-1 ml-1 flex items-center gap-2">
                        <CopyButton text={m.text} />
                        <button
                          onClick={() => handleLike(m.id, true)}
                          className={[
                            "inline-flex items-center text-[11px] transition-colors",
                            m.liked === true ? "text-primary" : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                          aria-label="Suka"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleLike(m.id, false)}
                          className={[
                            "inline-flex items-center text-[11px] transition-colors",
                            m.liked === false ? "text-destructive" : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                          aria-label="Tidak suka"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground/8 text-foreground/60">
                      <User className="h-3 w-3" />
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={compact ? "border-t border-border bg-background p-2.5" : "border-t border-border bg-background p-3 sm:p-4"}>
        {/* Suggestions */}
        {suggestions.length > 0 && !isTyping && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => send(s.message)}
                className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px] text-foreground/80 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-0 rounded-xl border border-border bg-secondary/30 pr-1 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            aria-label="Pesan"
            disabled={isTyping}
            className={compact ? "flex-1 bg-transparent px-3 py-2.5 text-[13px] placeholder:text-muted-foreground focus:outline-none disabled:opacity-50" : "flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"}
          />
          {isTyping ? (
            <button
              type="button"
              onClick={handleCancel}
              className={compact ? "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90" : "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90"}
              aria-label="Hentikan"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={compact ? "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50" : "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"}
              aria-label="Kirim"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function StatusText({ status }: { status: BotStatus }) {
  if (status === "typing") {
    return <p className="text-[11px] font-semibold text-emerald-600">mengetik...</p>;
  }
  if (status === "offline") {
    return (
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        Offline
      </p>
    );
  }
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Online
    </p>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const plain = text.replace(/\*\*(.+?)\*\*/g, "$1");
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={[
        "inline-flex items-center gap-0.5 text-[11px] transition-colors",
        copied ? "text-primary" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
      aria-label="Salin pesan"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function EmptyChat({ onPromptClick, compact = false }: { onPromptClick: (text: string) => void; compact?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <span className={compact ? "mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground" : "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"}>
          <Bot className={compact ? "h-5 w-5" : "h-7 w-7"} />
        </span>
        <h2 className={compact ? "mt-3 text-[13px] font-semibold" : "mt-4 text-lg font-semibold"}>Halo! Saya GiziBot</h2>
        <p className={compact ? "mt-0.5 text-xs text-muted-foreground" : "mt-1 text-sm text-muted-foreground"}>Tanyakan seputar gizi & menu gizi seimbang</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={compact ? "mt-4 w-full max-w-xs space-y-1.5 px-2" : "mt-6 w-full max-w-sm space-y-2"}
      >
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPromptClick(p)}
            className={compact
              ? "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-left text-xs text-foreground/80 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              : "w-full rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground/80 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            }
          >
            {p}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

function MessageContent({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="chat-math-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-[12px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/60">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border last:border-b-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-2.5 py-1.5 text-left font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-2.5 py-1.5 text-foreground/80">{children}</td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
