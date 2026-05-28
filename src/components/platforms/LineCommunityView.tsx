import React, { useState } from "react";
import { MessageSquare, Shield, Megaphone, Send, Sparkles, RefreshCw, Layers } from "lucide-react";
import { Platform, PostItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";
import { motion } from "motion/react";

interface Props {
  posts: PostItem[];
  stats: PlatformStats;
  onAddPost: (post: Omit<PostItem, "id">) => void;
}

export default function LineCommunityView({ posts, stats, onAddPost }: Props) {
  const linePosts = posts.filter((p) => p.platform === Platform.LINE_COMMUNITY);
  
  const [editorContent, setEditorContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("週一正能量早安問候");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const templates = [
    { label: "🌅 週一早安問候", value: "週一正能量早安問候，鼓勵老闆與團隊要多讚美同仁，附帶溫馨的招呼" },
    { label: "📚 管理文章導讀", value: "本週精選管理文章導讀，主題是『僕人式領導』的心得分享與討論引導" },
    { label: "🤝 實體小聚公告", value: "宣布舉辦「好老闆社群下半年度創辦人實體小聚交流會」，說明名額有限，報名詳情諮詢小幫手" },
    { label: "💡 每日管理金句", value: "分享一個暖心的管理金句，並用好老闆幽默體面的口氣解釋給學員聽" },
  ];

  const handleGenerateNotice = async () => {
    setIsGenerating(true);
    setAiNotice(null);
    
    const templateDetails = templates.find(t => t.label.includes(selectedTemplate))?.value || selectedTemplate;
    const prompt = `您是「好老闆」社群管理專家。現在要為好老闆社群的 LINE 官方社群群組撰寫一篇精美、富有溫度、高互動性的社群公告或問候。
主題或類型：${templateDetails}。
${keywordInput ? `在此基礎上，請務必融合以下關鍵字或重點：${keywordInput}` : ""}

請遵照以下規格撰寫：
1. 開頭要熱情溫暖（例如：『各位好老闆群的家人早安！』）。
2. 使用台灣繁體中文，且口吻要像一位貼心、成功、有智慧、不擺架子的傑出經理人（好老闆）。
3. 版面要利用換行、 emoji（多使用圖示例如 📢、✨、📈、☕️ 等）使之在手機 LINE 上極易閱讀、排版工整。
4. 結尾必須設計一個「互動問答」或者是「呼籲行動(CTA)」，邀請群友在下面按貼圖或分享看法。
5. 不要包含引號、Markdown 標題或其他 meta 文字，直接返回可以複製發佈的文字內容。`;

    const systemInstruction = "你是一位專門經營高互動社群、口吻親切有溫度的台灣企業顧問與領導力教練。";
    
    const result = await generateContent(prompt, systemInstruction, 0.85);
    
    setIsGenerating(false);
    if (result.success) {
      setAiNotice(result.text);
      setEditorContent(result.text);
    } else {
      // Show error notice in UI
      setAiNotice(result.text || result.error || "生成失敗。");
      if (result.error === "NO_API_KEY") {
        setEditorContent("【預載的高擬真範例公告：】\n\n📢 各位好老闆群的家人早安！✨\n\n新的一週開始了！這幾天跟幾位資深主管朋友聊到：「什麼是團隊最頂級的福利？」\n有些人說是點心吧，有些人說是彈性工時，但聊到最後，大家一致同意——是「一位懂傾聽的老闆和安心的氣氛」☕️\n\n本週我們推薦讀書會精選《信任帶心學》，探討如何建立犯錯不被怪罪的安全性。大家最近在同仁身上，有發現什麼暖心的轉變嗎？歡迎在社群裡點選貼圖或留言交流喔！👇\n\n#好老闆心法 #當責團隊");
      }
    }
  };

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.LINE_COMMUNITY,
      content: editorContent,
      status: "PUBLISHED",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0
    });
    setEditorContent("");
    setKeywordInput("");
    setAiNotice(null);
  };

  const handleSaveDraft = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.LINE_COMMUNITY,
      content: editorContent,
      status: "DRAFT",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0
    });
    setEditorContent("");
    setKeywordInput("");
    setAiNotice(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800" id="line-view-root">
      {/* Input controls (7 Columns) */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2" id="line-controls-container">
        {/* Metric widgets */}
        <div className="grid grid-cols-3 gap-3" id="line-metrics-grid">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-col justify-between" id="line-metric-followers">
            <span className="text-xs text-emerald-800 font-medium">✨ 社群群友</span>
            <span className="text-xl font-bold text-emerald-900 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-emerald-600 mt-1">▲ 本月 +{stats.latestGrowth} 名成員</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-col justify-between" id="line-metric-views">
            <span className="text-xs text-emerald-800 font-medium font-sans">📈 本月觸及</span>
            <span className="text-xl font-bold text-emerald-900 mt-1 font-mono">{(stats.reach).toLocaleString()} 次</span>
            <span className="text-[10px] text-emerald-600 mt-1">活躍度穩步攀升中</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-col justify-between" id="line-metric-engagement">
            <span className="text-xs text-emerald-800 font-medium">💬 平均互動率</span>
            <span className="text-xl font-bold text-emerald-900 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-emerald-600 mt-1">互動良好的高產社群</span>
          </div>
        </div>

        {/* AI post writer pane */}
        <div className="border border-emerald-200 rounded-xl bg-white p-4 shadow-xs" id="line-ai-editor-card">
          <div className="flex items-center gap-2 mb-3" id="line-ai-title">
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700" id="line-sparkle-icon">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">LINE AI 溫暖文案助理</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3" id="line-ai-template-selector">
            {templates.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTemplate(t.label)}
                className={`text-left text-xs p-2 rounded-lg border transition ${
                  selectedTemplate === t.label
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-medium"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
                id={`line-tpl-${t.value.slice(0, 5)}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4" id="line-ai-prompt-inputs">
            <label className="text-xs text-zinc-500 font-medium">融合關鍵理念 / 補充細節說明 (選填)</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="例如：讚美員工、放手授權、別太晚開會..."
              className="border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-zinc-50/50"
              id="line-keyword-input"
            />
          </div>

          <button
            onClick={handleGenerateNotice}
            disabled={isGenerating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="line-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在大腦激盪中（請稍候）...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                讓 AI 生成「好老闆」專屬 LINE 公告✨
              </>
            )}
          </button>
        </div>

        {/* Manual notice writer editor */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="line-editor-card">
          <div className="flex justify-between items-center" id="line-editor-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5 text-zinc-400" />
              編輯與確認 LINE 發布文案
            </span>
            {editorContent && (
              <button 
                onClick={() => setEditorContent("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
                id="line-clear-editor"
              >
                清空重寫
              </button>
            )}
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="在這邊輸入或粘貼您要發布的 LINE 社群訊息，右手邊將能即時看見手機螢幕預覽哦..."
            rows={8}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed resize-none"
            id="line-editor-textarea"
          />

          <div className="flex gap-2 justify-end" id="line-action-buttons">
            <button
              onClick={handleSaveDraft}
              disabled={!editorContent.trim()}
              className="border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 font-medium text-xs px-4 py-2 rounded-lg transition cursor-pointer"
              id="line-save-draft-btn"
            >
              儲存草稿箱
            </button>
            <button
              onClick={handlePublish}
              disabled={!editorContent.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition cursor-pointer"
              id="line-publish-btn"
            >
              <Send className="w-3.5 h-3.5" />
              正式發佈社群
            </button>
          </div>
        </div>

        {/* History of published community updates */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="line-history-card">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            最近發布與草稿歷史
          </h4>
          <div className="divide-y divide-zinc-100 max-h-[220px] overflow-y-auto pr-1" id="line-history-list">
            {linePosts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">尚無發布記錄，快試試 AI 自動編寫發布第一篇！</p>
            ) : (
              linePosts.map((post) => (
                <div key={post.id} className="py-2.5 text-xs flex flex-col gap-1.5" id={`line-post-${post.id}`}>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      post.status === "PUBLISHED" 
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {post.status === "PUBLISHED" ? "已送出發佈" : "草稿中"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{post.publishDate}</span>
                  </div>
                  <p className="text-zinc-600 line-clamp-2 leading-relaxed bg-zinc-50 p-2 rounded-md">{post.content}</p>
                  {post.status === "PUBLISHED" && (
                    <div className="flex gap-4 text-[10px] text-zinc-400" id={`line-post-${post.id}-stats`}>
                      <span>❤️ 已讀讚意：{post.likes}</span>
                      <span>💬 留言討論：{post.comments} 則</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Simulator view (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="line-simulator-panel">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">📱 LINE 社群手機模擬預覽</span>

        {/* Custom Mobile Frame */}
        <div className="relative w-full max-w-[320px] h-[550px] bg-[#7591b5] rounded-[36px] border-[10px] border-zinc-800/90 shadow-2xl overflow-hidden flex flex-col" id="line-phone-frame">
          {/* Phone Top Notch / Speaker & Camera */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[20px] w-[130px] bg-zinc-800 rounded-b-xl z-20 flex justify-center items-center gap-1" id="line-notch">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
            <div className="w-12 h-1 bg-zinc-700 rounded-full"></div>
          </div>

          {/* LINE Chat Header */}
          <div className="pt-6 pb-2.5 px-3 bg-[#243042] text-white flex justify-between items-center border-b border-zinc-800/20" id="line-chat-header">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hover:text-white cursor-pointer">◀</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-sans">⭐ 好老闆經理人社群 (86)</span>
                <span className="text-[9px] text-[#2ebd59] flex items-center gap-0.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#2ebd59] animate-pulse"></span>
                  成員在線討論中...
                </span>
              </div>
            </div>
            <div className="text-xs flex gap-2 text-zinc-300">
              <Megaphone className="w-3.5 h-3.5" />
              <span>☰</span>
            </div>
          </div>

          {/* LINE Chat content body */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-4 font-sans text-xs scroll-smooth leading-normal" id="line-chat-body">
            
            {/* System pinned announcement box inside chat */}
            <div className="bg-[#1f2937]/90 border-l-4 border-emerald-500 rounded p-2 text-white flex gap-2 items-start" id="line-pinned-notice">
              <Megaphone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 overflow-hidden" id="line-pinned-text">
                <p className="text-[10px] font-bold text-emerald-400">群組公告置頂</p>
                <p className="text-[10px] truncate">{editorContent || "好老闆今日溫暖叮嚀：點擊左側產出您的管理問候與公告！"}</p>
              </div>
            </div>

            {/* Time Stamp */}
            <div className="self-center bg-[#243042]/20 text-white rounded-full px-2 py-0.5 text-[9px]" id="line-chat-time">
              今天 08:30
            </div>

            {/* Simulated Chat Message - Other (Manager Assistant) */}
            <div className="flex gap-2 items-start" id="line-other-msg">
              <div className="w-7 h-7 rounded-full bg-amber-700/10 border border-amber-600/30 font-bold text-[9px] flex items-center justify-center text-amber-700 flex-shrink-0">
                助
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-zinc-200">社群小幫手</span>
                <div className="bg-white rounded-r-xl rounded-bl-xl p-2.5 max-w-[210px] shadow-sm text-zinc-800">
                  大家早安！在此提醒：本群只提供主管、創辦人在良善環境下探討正向管理。禁止廣告或未經授權推銷喔！🙏🙏
                </div>
              </div>
            </div>

            {/* Simulated User "好老闆" Message Preview */}
            <div className="flex flex-row-reverse gap-2 items-start" id="line-user-msg-preview-container">
              {/* Creator Crown Icon */}
              <div className="w-7 h-7 rounded-full bg-[#dfb350] border border-amber-500 shadow-xs flex items-center justify-center flex-shrink-0 z-10 text-zinc-950 font-bold text-[10px]">
                👑
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] text-zinc-300">「好老闆」創辦人</span>
                <div className="bg-[#8be089] rounded-l-xl rounded-br-xl p-2.5 max-w-[210px] text-zinc-800 shadow-xs relative">
                  {/* Realtime updating content */}
                  {editorContent ? (
                    <p className="whitespace-pre-wrap leading-relaxed break-all text-[11px]">{editorContent}</p>
                  ) : (
                    <p className="text-zinc-600 italic text-[11px]">【預覽文字】現在點選左手邊「讓 AI 生成好老闆公告」，生成的精美內容將會即時生動呈現在本綠色對話框中！</p>
                  )}
                </div>
                <span className="text-[8px] text-zinc-300 font-mono mt-0.5 self-end">已讀 86・08:42</span>
              </div>
            </div>

            {/* Bubble response simulated */}
            {editorContent && (
              <div className="flex gap-2 items-start animate-fade-in" id="line-reply-bubble">
                <div className="w-7 h-7 rounded-full bg-sky-700/10 border border-sky-600/30 text-[9px] flex items-center justify-center text-sky-700 font-sans font-bold flex-shrink-0">
                  學
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-[#243042]/70">創業學員 佳穎</span>
                  <div className="bg-white rounded-r-xl rounded-bl-xl p-2.5 max-w-[210px] shadow-xs text-zinc-800">
                    收到！這篇公告好暖，太感謝老闆分享！這真的是我遇過最有信任感的地方了✨✨❤️
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom input area simulated */}
          <div className="p-2 bg-[#f4f7f6] border-t border-zinc-200 flex items-center gap-2 z-10" id="line-input-bar">
            <span className="text-base text-zinc-400 hover:text-zinc-600 cursor-pointer">⨁</span>
            <span className="text-base text-zinc-400 hover:text-zinc-600 cursor-pointer">📷</span>
            <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-2 py-1 text-[11px] text-zinc-300 select-none">
              鍵入訊息...
            </div>
            <span className="text-base text-zinc-400 hover:text-zinc-600 cursor-pointer">😃</span>
          </div>
        </div>
      </div>
    </div>
  );
}
