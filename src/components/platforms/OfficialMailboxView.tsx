import React, { useState } from "react";
import { Mail, Sparkles, RefreshCw, Send, CheckSquare, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { Platform, EmailItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";

interface Props {
  emails: EmailItem[];
  stats: PlatformStats;
  onSendReply: (emailId: string, replyContent: string) => void;
  onMarkRead: (emailId: string) => void;
}

export default function OfficialMailboxView({ emails, stats, onSendReply, onMarkRead }: Props) {
  const [selectedMailId, setSelectedMailId] = useState<string>(emails[0]?.id || "");
  const [replyDraft, setReplyDraft] = useState("");
  const [selectedTone, setSelectedTone] = useState("答應合作邀請");
  const [isGenerating, setIsGenerating] = useState(false);

  const responseTones = [
    { label: "🤝 答應合作與行程約會", value: "代表「好老闆學苑」創辦人熱情答應合作邀請，並提供下週在線會面的幾個時間段" },
    { label: "🙏 致歉與售後安排解決", value: "針對客戶的反饋或投訴表示十二萬分的歉意、感謝，承諾立刻升級處理管道，並安排資深合夥人與之約會對話" },
    { label: "📍 婉言回絕合作或提案", value: "非常感恩和客氣地婉謝此次邀請（因為近期課程排程爆滿），並說明希望未來依然保持溫暖聯繫，保留合作可能性" }
  ];

  const activeEmail = emails.find((m) => m.id === selectedMailId) || emails[0];

  const handleGenerateReply = async () => {
    if (!activeEmail) return;
    setIsGenerating(true);

    const toneDetails = responseTones.find(t => t.label.includes(selectedTone))?.value || selectedTone;
    const prompt = `您是「好老闆」商務合作處兼客戶滿意度公關經理。
現在要針對客戶寄來的以下這封電子郵件，撰寫一篇極具「同理心、專業度、禮儀周全」的正式商務回信。

【寄件人】：${activeEmail.senderName} (${activeEmail.senderEmail})
【信件主題】：${activeEmail.subject}
【信件本文】：
${activeEmail.body}

【回信之期望立場與语气】：
${toneDetails}

請遵照以下規格和商務禮儀撰寫回信：
1. 信件開頭要稱呼對方的姓名與公司職稱（例如：『宛晴總監您好：』、『禹希負責人您好：』）。
2. 使用台灣繁體中文，且口吻必須極具商務誠意、修辭文雅得體。
3. 如果是致歉，必須有實質的解決措施（安排資深特使聯絡），切忌敷衍；如果是拒絕，必須感謝對方看重，把姿態放低，暖心收尾。
4. 信末要加上合適的商務敬語（例如：『祝 順心如意』、『好老闆學苑營運團隊 敬上』）。
5. 直接返回回信內容本身，不要加入任何 Markdown 標題或額外的註解文字，以方便我們系統一鍵複製或直接發送。`;

    const systemInstruction = "你是一位精通台灣頂級商務禮儀、極具公關應對與品牌誠信度的客戶滿意度總監。";

    const result = await generateContent(prompt, systemInstruction, 0.7);

    setIsGenerating(false);
    if (result.success) {
      setReplyDraft(result.text);
    } else {
      if (result.error === "NO_API_KEY") {
        if (selectedTone.includes("致歉")) {
          setReplyDraft(`${activeEmail.senderName}您好：\n\n非常感謝您的反饋，本學苑極其重視您的意見。對於近期顧問預約出現的耽擱，我與整個主管顧問團隊在此跟您表達正式歉意。\n\n我們已經召開紧急會議，將在今天下半天為 EliteCorp 設立「專屬 VIP 溝通綠色通道」，保證 24 小時內有金牌講師答覆。我已將此安排派請我們的學務主任李經理，將在今天下午 15:00 親自撥電話給您說明詳情。\n\n期待我們繼續攜手，祝 順心健康。\n\n好老闆領導學苑營運團隊 敬上`);
        } else {
          setReplyDraft(`${activeEmail.senderName}您好：\n\n我是好老闆學苑的營運負責人。非常榮幸收到您的合作邀約！得知您的計畫後，我們團隊深表期待。\n\n關於您提到的合作大綱，我們意願極高，並期待在下半年度進行深入合作。在此提供兩個我們方便進行 15 分鐘線上確認對焦的時段：\n1. 下週二 (6/2) 下午 14:00 - 15:30\n2. 下週三 (6/3) 上午 10:00 - 11:30\n\n不知您那邊是否方便？期待您的正面聯絡，順祝工作愉快！\n\n好老闆領導學苑 敬上`);
        }
      } else {
        setReplyDraft(result.text || result.error || "生成失敗。");
      }
    }
  };

  const handleSend = () => {
    if (!replyDraft.trim() || !activeEmail) return;
    onSendReply(activeEmail.id, replyDraft);
    setReplyDraft("");
  };

  const selectAndReadMail = (id: string) => {
    setSelectedMailId(id);
    onMarkRead(id);
    setReplyDraft("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans animate-fade-in" id="mailbox-view-root">
      {/* 4 columns: mail tree lists */}
      <div className="lg:col-span-4 flex flex-col gap-3 max-h-[700px] overflow-y-auto border-r border-zinc-200/60 pr-4" id="mailbox-sidebar">
        
        {/* Metric dashboard */}
        <div className="grid grid-cols-2 gap-2" id="mailbox-quick-metrics">
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-between" id="mail-metric-unread">
            <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">📬 收件箱未讀</span>
            <span className="text-lg font-bold text-slate-900 font-mono mt-1">
              {emails.filter(e => e.isUnread).length} 封信
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-between" id="mail-metric-rate">
            <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">⏱ 24hr內回覆</span>
            <span className="text-lg font-bold text-slate-900 mt-1 font-mono">{stats.engagementRate}%</span>
          </div>
        </div>

        <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-2">📥 專屬收件箱清單</span>
        
        <div className="flex flex-col gap-2" id="mailbox-threads-list-grid">
          {emails.map((mail) => {
            const isSelected = mail.id === selectedMailId;
            return (
              <div
                key={mail.id}
                onClick={() => selectAndReadMail(mail.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 ${
                  isSelected 
                    ? "bg-slate-900 border-slate-950 text-white shadow-md transform scale-[1.01]" 
                    : "bg-white border-zinc-200 hover:bg-zinc-50"
                }`}
                id={`mail-thread-item-${mail.id}`}
              >
                <div className="flex justify-between items-start" id={`mail-thread-item-${mail.id}-header`}>
                  <span className={`text-[11.5px] font-bold ${isSelected ? "text-slate-100" : "text-zinc-900"} truncate max-w-[75%]`}>
                    {mail.senderName}
                  </span>
                  {mail.isUnread && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 text-[8.5px] font-bold uppercase tracking-wider leading-none">
                      UNREAD
                    </span>
                  )}
                </div>
                <h5 className={`text-xs font-semibold ${isSelected ? "text-slate-200" : "text-zinc-700"} truncate`}>
                  {mail.subject}
                </h5>
                <div className="flex justify-between items-center text-[9.5px]" id={`mail-thread-item-${mail.id}-footer`}>
                  <span className={`${isSelected ? "text-zinc-400" : "text-zinc-400"} font-mono`}>{mail.date}</span>
                  {mail.replies.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded ${isSelected ? "bg-slate-800 text-slate-300" : "bg-emerald-50 text-emerald-800 border border-emerald-250"} text-[8.5px] font-bold leading-none`}>
                      已回復 {mail.replies.length} 次
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 columns: email reading and AI actions */}
      <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto max-h-[700px] h-full" id="mailbox-main-reader">
        {activeEmail ? (
          <>
            {/* Email Title Block */}
            <div className="border border-zinc-200 rounded-xl bg-white p-4 shadow-xs flex flex-col gap-2" id="mail-reader-item-headline">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">📨 COMPANY MAIL DISPATCHER</span>
              <h3 className="text-sm font-black text-zinc-900 leading-snug">{activeEmail.subject}</h3>
              
              <div className="flex justify-between items-center border-t border-zinc-100 pt-2.5 text-xs text-zinc-500" id="mail-header-info">
                <div className="flex flex-col gap-0.5" id="mail-sender-meta">
                  <p>寄件人：<span className="font-bold text-zinc-800">{activeEmail.senderName}</span></p>
                  <p>信箱：<span className="font-mono text-zinc-450">{activeEmail.senderEmail}</span></p>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono align-top">{activeEmail.date}</p>
              </div>

              {/* Mail body text content */}
              <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-150 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap font-sans mt-2" id="mail-canvas-body">
                {activeEmail.body}
              </div>
            </div>

            {/* Conversation Flow (Replies list) */}
            {activeEmail.replies.length > 0 && (
              <div className="flex flex-col gap-3" id="mail-replies-timeline">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono pl-1">💬 回信和交談歷史記錄</span>
                {activeEmail.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-xl text-xs flex flex-col gap-1.5 shadow-sm leading-relaxed border ${
                      rep.sender === "USER"
                        ? "bg-slate-900 text-white border-slate-950 ml-12"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200 mr-12"
                    }`}
                    id={`mail-reply-${rep.id}`}
                  >
                    <div className="flex justify-between items-center text-[9.5px]">
                      <span className={`font-bold ${rep.sender === "USER" ? "text-yellow-400" : "text-zinc-600"}`}>
                        {rep.sender === "USER" ? "「好老闆」官方營運部答覆" : "客服小秘書 (自動應答)"}
                      </span>
                      <span className="opacity-60 font-mono">{rep.date}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-[11px] leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* AI drafting assistance panel */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-xs" id="mail-ai-panel">
              <div className="flex items-center gap-2 mb-3" id="mail-ai-panel-header">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-zinc-900 text-sm">AI 商務信件文雅擬信小組</h4>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-3" id="mail-reply-tones">
                {responseTones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setSelectedTone(tone.label)}
                    className={`text-left text-xs p-2.5 rounded-lg border transition ${
                      selectedTone === tone.label
                        ? "bg-slate-900 border-slate-950 text-white font-bold"
                        : "border-zinc-200 hover:bg-zinc-50 text-zinc-650"
                    }`}
                    id={`mail-tone-${tone.label.slice(2, 5)}`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateReply}
                disabled={isGenerating}
                className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-slate-400 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                id="mail-generate-reply-btn"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    正在為您撰寫得體的商務信件回信（請稍候）...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    讓 AI 生成「得體」商務回信✨
                  </>
                )}
              </button>
            </div>

            {/* Response writing composer */}
            <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="mail-reply-editor-card">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-450" />
                回覆郵件撰寫框
              </span>
              <textarea
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="在此編輯您的回覆內容。若是使用 AI 商務信件小組功能生成的文案，可以直接進行修改微調，再按發送哦..."
                rows={8}
                className="border border-zinc-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans leading-relaxed resize-none"
                id="mail-reply-textarea"
              />
              <div className="flex justify-end gap-2" id="mail-reply-actions">
                {replyDraft && (
                  <button
                    onClick={() => setReplyDraft("")}
                    className="text-xs text-red-500 hover:underline px-2 cursor-pointer"
                    id="mail-clear-reply-btn"
                  >
                    清空
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!replyDraft.trim()}
                  className="bg-slate-900 hover:bg-slate-950 disabled:bg-zinc-300 text-white font-medium text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  id="mail-send-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  送出此回信並歸檔
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="border border-zinc-200 rounded-xl bg-white p-8 text-center text-zinc-400 text-xs italic my-auto" id="mail-no-active-placeholder">
            無選定的郵件 thread。請在左側點選以展開閱讀。
          </div>
        )}
      </div>
    </div>
  );
}
