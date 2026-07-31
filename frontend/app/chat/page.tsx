"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import axios from "axios";

let socket: Socket;

export default function ChatPage() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]); 
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  // 🚨 YENİ: Qarşı tərəfin DƏQİQ ID-sini tapan ağıllı funksiya
  const getTargetId = (chatObj: any) => {
    if (!chatObj) return null;
    return chatObj.userId || chatObj.user?.id;
  };

  const fetchContacts = async (role: string, token: string) => {
    try {
      if (role === "TEACHER") {
        const res = await axios.get("https://hazirliqlar-backend.onrender.com/api/message/conversations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(res.data);
      } else {
        const res = await axios.get("https://hazirliqlar-backend.onrender.com/api/teacher");
        setContacts(res.data);
      }
    } catch (error) {
      console.error("Siyahı yüklənmədi");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload);
      
      socket = io("https://hazirliqlar-backend.onrender.com");
      socket.emit("register", payload.userId);

      fetchContacts(payload.role, token);
      
      socket.on("receive_message", (msg) => {
        const currentTargetId = getTargetId(activeChatRef.current);
        if (currentTargetId && msg.senderId === currentTargetId) {
          setMessages((prev) => [...prev, msg]);
          socket.emit("mark_as_read", { senderId: currentTargetId, receiverId: payload.userId });
        }
        fetchContacts(payload.role, token);
      });

      socket.on("message_sent_success", (msg) => {
        setMessages((prev) => prev.map(m => m.id === "temp" ? msg : m));
        fetchContacts(payload.role, token);
      });

      socket.on("user_typing", ({ senderId }) => {
        const currentTargetId = getTargetId(activeChatRef.current);
        if (currentTargetId && senderId === currentTargetId) {
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
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const selectChat = async (contact: any) => {
    setActiveChat(contact);
    const token = localStorage.getItem("token");
    const targetId = getTargetId(contact);
    
    if (!targetId) return;

    try {
      const res = await axios.get(`https://hazirliqlar-backend.onrender.com/api/message/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      socket.emit("mark_as_read", { senderId: targetId, receiverId: currentUser.userId });
      fetchContacts(currentUser.role, token!); 
    } catch (error) {
      console.error("Mesajlar yüklənmədi");
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const targetId = getTargetId(activeChat);
    const msgData = {
      senderId: currentUser.userId,
      receiverId: targetId,
      content: newMessage
    };

    setMessages((prev) => [...prev, { id: "temp", ...msgData, isRead: false, createdAt: new Date() }]);
    socket.emit("send_message", msgData);
    setNewMessage("");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    const targetId = getTargetId(activeChat);
    if (targetId) {
      socket.emit("typing", { senderId: currentUser.userId, receiverId: targetId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;

    const targetId = getTargetId(activeChat);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/message/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      
      const fileUrl = res.data.fileUrl; 
      const msgData = {
        senderId: currentUser.userId,
        receiverId: targetId,
        content: `FILE:${fileUrl}` 
      };
      
      socket.emit("send_message", msgData);
    } catch (error) {
      console.error("Fayl göndərilə bilmədi");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append("file", blob, "voice-message.webm");
        const token = localStorage.getItem("token");
        const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/message/upload", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const targetId = getTargetId(activeChat);
        const msgData = {
          senderId: currentUser.userId,
          receiverId: targetId,
          content: `AUDIO:${res.data.fileUrl}`
        };
        socket.emit("send_message", msgData);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Səs yazmaq üçün mikrofon icazəsi lazımdır!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith("FILE:")) {
      const url = content.replace("FILE:", "");
      return <img src={url} alt="Şəkil" className="max-w-[200px] md:max-w-[250px] rounded-lg cursor-pointer border border-slate-200" onClick={() => window.open(url, "_blank")} />;
    }
    if (content.startsWith("AUDIO:")) {
      const url = content.replace("AUDIO:", "");
      return <audio controls src={url} className="w-48 md:w-64 h-10 outline-none"></audio>;
    }
    return <p className="text-[15px] leading-relaxed break-words">{content}</p>;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 📱 SOL PANEL */}
      <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-[40vh] md:h-screen ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
               <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {currentUser?.role === "TEACHER" ? "Şagirdlərim" : "Müəllimlər"}
            </h2>
          </div>
          <Link href="/" className="text-slate-500 hover:text-blue-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </Link>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              {currentUser?.role === "TEACHER" 
                ? "Hələ heç bir şagird sizə mesaj yazmayıb." 
                : "Hələ heç bir müəllim qeydiyyatdan keçməyib."}
            </div>
          ) : (
            contacts.map((contact, idx) => {
              const user = contact.user;
              const isActive = getTargetId(activeChat) === getTargetId(contact);
              
              const subText = currentUser?.role === "TEACHER" 
                ? (contact.lastMessage?.startsWith("FILE:") ? "📷 Şəkil" : contact.lastMessage?.startsWith("AUDIO:") ? "🎤 Səsli Mesaj" : contact.lastMessage)
                : (contact.subjects?.[0] || "Fənn qeyd edilməyib");

              return (
                <div 
                  key={idx} 
                  onClick={() => selectChat(contact)} 
                  className={`flex items-center gap-4 p-4 border-b border-slate-100 cursor-pointer transition ${isActive ? 'bg-slate-100 border-l-4 border-blue-600 pl-3' : 'hover:bg-slate-50'}`}
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`font-bold truncate ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{user.firstName} {user.lastName}</h3>
                      {contact.isRead === false && contact.senderId !== currentUser?.userId && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm truncate ${contact.isRead === false && contact.senderId !== currentUser?.userId ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                      {subText || "Yeni Söhbət"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 💻 SAĞ PANEL */}
      <div className={`flex-1 flex flex-col h-[60vh] md:h-screen bg-[#efeae2] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat ${!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        
        {!activeChat ? (
          <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12 3 7.582 7.03 4 12 4s9 3.582 9 8z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Hazırlıqlar Web</h2>
            <p className="text-slate-500 mt-2 text-sm">Mesaj göndərmək və səs yazmaq üçün sol paneldən bir şəxs seçin.</p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-slate-50 flex items-center gap-4 shadow-sm z-10 sticky top-0">
              <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {activeChat.user.firstName[0]}{activeChat.user.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 text-[15px]">{activeChat.user.firstName} {activeChat.user.lastName}</h2>
                <p className="text-[12px] text-slate-500 font-medium">
                  {isTyping ? <span className="text-green-500 font-bold">yazır...</span> : "onlayn"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser?.userId;
                const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] md:max-w-[60%] p-2 rounded-xl relative shadow-sm text-sm leading-relaxed ${isMe ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                      
                      {renderMessageContent(msg.content)}
                      
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 font-bold">
                        <span>{time}</span>
                        {isMe && (
                          <span className="text-[13px] flex items-center">
                            {msg.isRead ? <span className="text-blue-500 font-black">✓✓</span> : <span className="text-slate-400 font-bold">✓</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                 <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm flex gap-1 items-center h-8">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-50 flex items-end gap-2">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:bg-slate-200 rounded-full transition flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              </button>
              
              <form onSubmit={handleSendText} className="flex-1 flex gap-2">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Mesaj yazın"
                  className="flex-1 p-3 rounded-full border-none focus:ring-0 outline-none shadow-sm text-sm"
                />
                
                {newMessage.trim() ? (
                  <button type="submit" className="w-11 h-11 bg-[#00a884] text-white rounded-full hover:bg-green-600 transition shadow-md flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 ml-[-2px] mt-[2px] transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onMouseDown={startRecording} 
                    onMouseUp={stopRecording} 
                    onMouseLeave={() => { if(isRecording) stopRecording(); }}
                    className={`w-11 h-11 text-white rounded-full transition shadow-md flex items-center justify-center flex-shrink-0 ${isRecording ? 'bg-red-500 animate-pulse scale-110' : 'bg-[#00a884] hover:bg-green-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}