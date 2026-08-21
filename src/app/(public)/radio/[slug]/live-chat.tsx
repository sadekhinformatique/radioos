"use client";

import { useState, useRef, useEffect } from "react";
import { useRealtimeChat, type ChatMessage } from "@/hooks/use-realtime-chat";
import { Send, Users, MessageCircle, Wifi, WifiOff } from "lucide-react";

interface LiveChatProps {
  radioId: string;
  radioName: string;
}

export function LiveChat({ radioId, radioName }: LiveChatProps) {
  const { messages, sendMessage, isConnected, onlineCount } = useRealtimeChat({ radioId });
  const [input, setInput] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !senderName.trim()) return;
    sendMessage(senderName, input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isNameSet) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Chat en direct</span>
          </div>
          <p className="text-sm text-blue-100 mt-1">
            Interagissez en temps réel avec {radioName}
          </p>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Entrez votre pseudo pour rejoindre le chat :
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Votre pseudo"
              maxLength={20}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && senderName.trim()) {
                  setIsNameSet(true);
                }
              }}
            />
            <button
              onClick={() => senderName.trim() && setIsNameSet(true)}
              disabled={!senderName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Rejoindre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "400px" }}>
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat en direct</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{onlineCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-300" />
                <span className="text-green-200">Connecté</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-300" />
                <span className="text-red-200">Déconnecté</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun message pour le moment</p>
            <p className="text-xs mt-1">Soyez le premier à écrire !</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isOwn={msg.sender === senderName} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrire en tant que ${senderName}...`}
            maxLength={500}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  if (message.isSystem) {
    return (
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        {!isOwn && (
          <div className="text-xs font-medium text-blue-600 mb-1">{message.sender}</div>
        )}
        <div className="text-sm">{message.content}</div>
        <div
          className={`text-xs mt-1 ${isOwn ? "text-blue-200" : "text-gray-400"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
