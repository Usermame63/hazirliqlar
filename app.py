import os

# 1. Hedef fayl yolu
FAYL_YOLU = "frontend/app/chat/page.tsx"

# 2. Yenilenmis temiz kod (Emojisiz ve sehv yaratmayan versiya)
YENI_KOD = """
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import axios from "axios";

let socket: any;

export default function AdvancedChat() {
  const router = useRouter();
  const [myId, setMyId] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeTeacher, setActiveTeacher] = useState<any>(null);
  const [msgText, setMsgText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      setMyId(userId);

      socket = io("http://localhost:5000");
      socket.emit("register", userId);

      axios.get("http://localhost:5000/api/teacher")
        .then(res => setTeachers(res.data))
        .catch(err => console.error("Muellimler yuklenmedi", err));

      socket.on("receive_message", (msg: any) => {
        if (activeTeacher && msg.senderId === activeTeacher.user.id) {
          setMessages((prev) => [...prev, msg]);
          socket.emit("mark_as_read", { senderId: activeTeacher.user.id, receiverId: userId });
        }
      });

      socket.on("message_sent_success", (msg: any) => {
        setMessages((prev) => prev.map(m => m.id === "temp" ? msg : m));
      });

      socket.on("user_typing", (data: any) => {
        if (activeTeacher && data.senderId === activeTeacher.user.id) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });

      socket.on("messages_read_by_user", () => {
        setMessages((prev) => prev.map(m => ({ ...m, isRead: true })));
      });

    } catch (e) {
      router.push("/login");
    }

    return () => { if (socket) socket.disconnect(); };
  }, [router, activeTeacher]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectTeacher = async (teacher: any) => {
    setActiveTeacher(teacher);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:5000/api/message/${teacher.user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      socket.emit("mark_as_read", { senderId: teacher.user.id, receiverId: myId });
    } catch (error) {
      console.error("Mesajlar yuklenmedi");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !activeTeacher) return;

    const msgData = {
      senderId: myId,
      receiverId: activeTeacher.user.id,
      content: msgText
    };

    setMessages((prev) => [...prev, { id: "temp", ...msgData, isRead: false, createdAt: new Date() }]);
    socket.emit("send_message", msgData);
    setMsgText("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgText(e.target.value);
    if (activeTeacher) {
      socket.emit("typing", { senderId: myId, receiverId: activeTeacher.user.id });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* SOL PANEL */}
      <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-[40vh] md:h-screen ${activeTeacher ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">Muellimler</h2>
          <Link href="/" className="text-slate-400">Geri</Link>
        </div>
        <div className="overflow-y-auto flex-1">
          {teachers.map((t, idx) => (
            <div key={idx} onClick={() => handleSelectTeacher(t)} className={`p-4 border-b cursor-pointer ${activeTeacher?.id === t.id ? 'bg-blue-50' : ''}`}>
              <p className="font-bold">{t.user.firstName} {t.user.lastName}</p>
              <p className="text-xs text-blue-600">{t.subjects[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SAG PANEL */}
      <div className={`flex-1 flex flex-col h-[60vh] md:h-screen bg-white ${!activeTeacher ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!activeTeacher ? (
          <div className="text-center p-10">
            <h2 className="text-2xl font-black text-slate-400">Sohbet baslatmaq ucun muellim secin</h2>
          </div>
        ) : (
          <>
            <div className="p-4 bg-white border-b flex items-center gap-4 shadow-sm">
              <button onClick={() => setActiveTeacher(null)} className="md:hidden">Geri</button>
              <h2 className="font-black">{activeTeacher.user.firstName} {activeTeacher.user.lastName}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === myId;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl shadow-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-white text-slate-800'}`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
              <input value={msgText} onChange={handleInputChange} className="flex-1 p-3 border rounded-full outline-none" placeholder="Yazin..." />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Gonder</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
"""

def yenile():
    os.makedirs(os.path.dirname(FAYL_YOLU), exist_ok=True)
    with open(FAYL_YOLU, 'w', encoding='utf-8') as f:
        f.write(YENI_KOD.strip() + "\\n")
    print(f"✅ Fayl ugurla yenilendi!")

if __name__ == "__main__":
    yenile()