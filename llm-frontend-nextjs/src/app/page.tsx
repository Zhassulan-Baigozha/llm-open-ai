// frontend/app/page.tsx
"use client";
import styles from "./page.module.css";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { joinClasses } from "~/utils/joinClasses";

type Msg = { role: "user" | "assistant"; content: string };

const API_BASE = "http://localhost:3001"; // поменяй на свой порт/домен при необходимости

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const send = async () => {
    const text = prompt.trim();
    if (!text || pending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setPrompt("");
    setPending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      const answer = (data?.answer as string) ?? "Не удалось получить ответ.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка запроса к бэкенду." },
      ]);
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={styles.chatRoot}>
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.length === 0 && (
            <div className={styles.chatWelcome}>
              <h1>Привет 👋</h1>
              <p>
                Задай вопрос ниже. Enter — отправка, Shift+Enter — новая строка.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={joinClasses(
                styles.chatBubble,
                m.role === "user" ? styles.right : styles.left
              )}
            >
              <div className={styles.chatBubbleInner}>{m.content}</div>
            </div>
          ))}

          {pending && (
            <div className={joinClasses(styles.chatBubble, styles.left)}>
              <div
                className={joinClasses(styles.chatBubbleInner, styles.typing)}
              >
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        <div className={styles.chatComposer}>
          <div className={styles.composerInner}>
            <textarea
              ref={textareaRef}
              className={styles.composerTextarea}
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Напишите сообщение…"
            />
            <button
              className={styles.composerSend}
              onClick={send}
              disabled={pending || !prompt.trim()}
              aria-label="Отправить"
              title="Отправить (Enter)"
            >
              {/* Бумажный самолётик — inline SVG */}
              <svg
                className={styles.sendIcon}
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div className={styles.composerHint}>
            Enter — отправить • Shift+Enter — перенос строки
          </div>
        </div>
      </div>
    </div>
  );
}
