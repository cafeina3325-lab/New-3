/**
 * 어드민-스태프 공통 채팅 인터페이스 컴포넌트
 * 
 * - 프리미엄 디자인 (글래스모피즘, 그라데이션)
 * - 실시간 메시지 폴링 (2초 주기로 단축)
 * - 스마트 스크롤 제어
 * - 발신자 권한(Role)별 색상 구분
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    senderId: string;
    username: string;
    role: string;
    content: string;
    createdAt: string;
}

export default function ChatInterface() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentUser = session?.user as any;

    const fetchMessages = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const res = await fetch("/api/chat");
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // 초기 로딩 및 주기적 폴링 (2초)
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, []);

    // 스크롤 최하단 이동
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const chatInput = input.trim();
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: chatInput }),
            });

            if (res.ok) {
                await fetchMessages();
                setTimeout(scrollToBottom, 50);
            } else {
                setInput(chatInput);
                alert("메시지 전송에 실패했습니다.");
            }
        } catch (error) {
            setInput(chatInput);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="flex flex-col h-[75vh] w-full max-w-5xl mx-auto bg-[#0F1218]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* 상단바 */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                            {currentUser?.role === 'admin' ? 'A' : 'S'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F1218] rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#F3EBE1] text-lg">Flying Internal Chat</h3>
                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Online Now</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-white/70 font-medium">{currentUser?.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${currentUser?.role === 'admin' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                        {currentUser?.role || 'Guest'}
                    </span>
                </div>
            </div>

            {/* 채팅 영역 */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
            >
                {messages.length > 0 ? (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === currentUser?.id;
                        const showName = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group transition-all`}>
                                {showName && !isMe && (
                                    <div className="flex items-center space-x-2 mb-1.5 ml-1">
                                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${msg.role === 'admin' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {msg.role}
                                        </span>
                                        <span className="text-xs text-gray-400 font-semibold">{msg.username}</span>
                                    </div>
                                )}
                                <div className={`flex items-end space-x-2 transition-all ${isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                    <div
                                        className={`relative group px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] sm:max-w-md break-words ${isMe
                                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-[0_4px_15px_rgba(37,99,235,0.3)]'
                                                : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none hover:bg-white/[0.07]'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-medium mb-1 whitespace-nowrap">
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                        <div className="text-5xl">📫</div>
                        <p className="text-gray-400 font-medium text-center">대화 내역이 없습니다.<br />동료들과 실시간으로 소통해 보세요.</p>
                    </div>
                )}
            </div>

            {/* 입력 영역 */}
            <div className="p-6 bg-gradient-to-t from-black/20 to-transparent border-t border-white/5">
                <form onSubmit={handleSend} className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-24 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all shadow-inner"
                    />
                    <div className="absolute right-2 top-2 bottom-2">
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="h-full px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <span>{loading ? "전송 중" : "전송"}</span>
                            {!loading && <span className="transform rotate-12">🚀</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
