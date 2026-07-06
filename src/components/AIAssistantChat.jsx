import { useState, useRef, useEffect } from 'react';
import { Robot, PaperPlaneTilt, X, Sparkle, CircleNotch } from '@phosphor-icons/react';
import { useDraftWithAI } from '../hooks/useAgreements';

export function AIAssistantChat({ onDraftComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your escrow assistant. Tell me about your agreement in plain English , what's being delivered, by when, and for how much , and I'll structure it into milestones.",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const draftWithAI = useDraftWithAI();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    const hasAmount = /\d/.test(userMsg);
    if (hasAmount && onDraftComplete) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I can see some agreement details. To draft the full agreement with structured milestones, fill in the form and use the 'Draft with AI' button.",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "To create an escrow agreement, I'll need: (1) what's being delivered, (2) the deadline, (3) the amount, and (4) the seller's email.",
        },
      ]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#111] dark:bg-white rounded-[12px] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 z-50"
        aria-label="Open AI assistant chat"
      >
        <Sparkle className="w-5 h-5 text-white dark:text-[#111]" weight="fill" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="AI Escrow Assistant"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[min(520px,calc(100vh-6rem))] bg-surface border border-[var(--border-default)] rounded-[12px] flex flex-col z-50 animate-scale-in"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-alt rounded-[8px] flex items-center justify-center flex-shrink-0 border border-[var(--border-default)]">
            <Robot className="w-4 h-4 text-primary" weight="fill" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Escrow Assistant</p>
            <p className="text-xs text-tertiary">AI-powered drafting</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-secondary hover:text-primary transition-colors p-1 rounded-[6px] flex-shrink-0"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" weight="bold" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-[12px] ${msg.role === 'user'
                  ? 'bg-[#111] text-white dark:bg-white dark:text-[#111] rounded-br-[4px]'
                  : 'bg-surface-alt text-secondary border border-[var(--border-default)] rounded-bl-[4px]'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {draftWithAI.isPending && (
          <div className="flex justify-start">
            <div className="bg-surface-alt border border-[var(--border-default)] px-3.5 py-2.5 rounded-[12px] rounded-bl-[4px] flex items-center gap-2">
              <CircleNotch className="w-3.5 h-3.5 text-secondary animate-spin" weight="bold" />
              <span className="text-secondary text-sm">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--border-default)] flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Describe your agreement…"
            className="flex-1 text-sm px-3 py-2"
            aria-label="Type your message"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 bg-[#111] hover:bg-[#333] dark:bg-white dark:hover:bg-[#EAEAEA] rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Send message"
          >
            <PaperPlaneTilt className="w-4 h-4 text-white dark:text-[#111]" weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
