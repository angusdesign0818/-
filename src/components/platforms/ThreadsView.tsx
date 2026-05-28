import React, { useState } from "react";
import { MessageSquare, Heart, RefreshCw, Send, Sparkles, Layers } from "lucide-react";
import { Platform, PostItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";

interface Props {
  posts: PostItem[];
  stats: PlatformStats;
  onAddPost: (post: Omit<PostItem, "id">) => void;
}

export default function ThreadsView({ posts, stats, onAddPost }: Props) {
  const threadsPosts = posts.filter((p) => p.platform === Platform.THREADS);

  const [editorContent, setEditorContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedTone, setSelectedTone] = useState("犀利而坦誠的觀點");
  const [isGenerating, setIsGenerating] = useState(false);

  const tones = [
    { label: "🔥 犀利而坦誠的第一線自省", value: "以創業者/老闆第一視角，直接指出目前職場上的形式主義與虛偽，字字句句坦率有力、引起強烈共鳴" },
    { label: "🤝 溫暖的人才留任心法", value: "探討如何給員工多點生活空間、調薪對企業造成的實質正向循環，語氣充滿智慧大度、善意與同理心" },
    { label: "💡 寫給年輕主管的管理筆記", value: "給新任主管或年輕骨幹的一兩條避坑建議。簡潔利落、不囉唆，用 1/x 串聯形式深入淺出" }
  ];

  const handleGenerateThreads = async () => {
    setIsGenerating(true);

    const toneDetails = tones.find(t => t.label.includes(selectedTone))?.value || selectedTone;
    const prompt = `您是「好老闆」品牌主理人。請為目前最新、高流量、注重真實聲音的 Threads 平台規劃一組「串燒貼文 (Thread Storm)」。
文字風格與調性：${toneDetails}。
${keywordInput ? `針對的主題或日常事件：${keywordInput}` : "探討為什麼對同仁好、提供安定感是老闆最大的回報"}

請遵照以下規格與要求撰寫：
1. 【設計為連接式 Thread】：
   請將長篇心得切為 2 篇或 3 篇（每篇不超過 140 字，以配合 Threads 的短小精幹風格）。
   篇章開頭要明確標上：「(1/2)」、「(2/2)」或「(1/3)」、「(2/3)」、「(3/3)」，以方便我們系統和預覽元件解析！
2. 每篇的第一句話必須要是一針見血的小金句（例如：『中階主管最嚴重的內耗，就是討好每個人。』）。
3. 使用繁體中文（台灣），語氣要像一個有血有肉、會在深夜寫筆記碎碎念的真實暖心老闆。不要太嚴肅！
4. 不要輸出額外的註解語或 Markdown 標題，直接輸出這幾段 thread 即可。`;

    const systemInstruction = "你是一位在 Threads 上幽默坦誠、真情流露、同時觀點犀利深受年輕人喜愛尊重的台灣企業領袖。";

    const result = await generateContent(prompt, systemInstruction, 0.8);

    setIsGenerating(false);
    if (result.success) {
      setEditorContent(result.text);
    } else {
      if (result.error === "NO_API_KEY") {
        setEditorContent("【預載的高擬真 Threads 串燒貼文：】\n\n(1/2) 今天面試一位被前東家冠上「沒狼性、太安逸」而遭勸退的主管。\n我看了他的背景，做事細緻周全，下屬對他評價極高。\n其實多數時候，員工不拚，不是因為沒狼性，而是老闆把肉都自己吞了，卻要羊去替你咬人。羊怎麼咬？\n\n(2/2) 優質的老闆，是先讓同仁有足夠的『安全感』，底子站穩了，自然就會想衝高度。信任和狼性，從來都不衝突。大家覺得呢？");
      } else {
        setEditorContent(result.text || result.error || "生成失敗。");
      }
    }
  };

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.THREADS,
      content: editorContent,
      status: "PUBLISHED",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0
    });
    setEditorContent("");
    setKeywordInput("");
  };

  const handleSaveDraft = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.THREADS,
      content: editorContent,
      status: "DRAFT",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0
    });
    setEditorContent("");
    setKeywordInput("");
  };

  // Helper to split text by chunks like (1/2) or (1/3) for nice preview
  const getThreadParts = () => {
    if (!editorContent) return [];
    
    // Split by markers like (1/2), (2/2), (1/3), (2/3) or manually split by double lines if no markers
    const parts: string[] = [];
    const text = editorContent.replace("【預載的高擬真 Threads 串燒貼文：】", "").trim();
    
    const matches = text.match(/\(\d\/\d\)/g);
    if (matches && matches.length >= 2) {
      // Split by the markers
      let tempText = text;
      matches.forEach((m, idx) => {
        const nextMarker = matches[idx + 1];
        const startIndex = tempText.indexOf(m);
        const endIndex = nextMarker ? tempText.indexOf(nextMarker) : tempText.length;
        
        parts.push(tempText.substring(startIndex, endIndex).trim());
      });
    } else {
      // Just split by double line breaks
      const splitLines = text.split("\n\n");
      splitLines.forEach(l => {
        if (l.trim()) parts.push(l.trim());
      });
    }
    
    return parts.length > 0 ? parts : [text];
  };

  const threadParts = getThreadParts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans" id="threads-view-root">
      {/* 7 Columns */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2" id="threads-controls">
        {/* Performance */}
        <div className="grid grid-cols-3 gap-3" id="threads-metrics">
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg flex flex-col justify-between" id="threads-followers-metric">
            <span className="text-xs text-zinc-600 font-medium font-sans">👥 Threads 粉絲數</span>
            <span className="text-xl font-bold text-zinc-950 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-zinc-500 mt-1">▲ 本月爆火 +{stats.latestGrowth} 名</span>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg flex flex-col justify-between" id="threads-reach-metric">
            <span className="text-xs text-zinc-600 font-medium">🌐 本月廣播觸及</span>
            <span className="text-xl font-bold text-zinc-950 mt-1 font-mono">{(stats.reach).toLocaleString()} 人</span>
            <span className="text-[10px] text-zinc-500 mt-1">演算法加權極高</span>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg flex flex-col justify-between" id="threads-engagement-metric">
            <span className="text-xs text-zinc-600 font-medium">💬 主動參與率</span>
            <span className="text-xl font-bold text-zinc-950 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-zinc-500 mt-1">留言串互動非常熱絡</span>
          </div>
        </div>

        {/* AI Generator */}
        <div className="border border-zinc-300 rounded-xl bg-white p-4 shadow-xs" id="threads-ai">
          <div className="flex items-center gap-2 mb-3" id="threads-ai-header">
            <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">Threads 深夜大筆記 AI 撰寫員</h3>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-3" id="threads-tones">
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTone(t.label)}
                className={`text-left text-xs p-2.5 rounded-lg border transition ${
                  selectedTone === t.label
                    ? "bg-zinc-50 border-zinc-900 text-zinc-950 font-bold"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
                id={`threads-tone-${t.label.slice(0, 3)}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4" id="threads-inputs">
            <label className="text-xs text-zinc-500 font-medium">輸入想要探討的管理故事、日常不滿或體悟（選填）</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="例如：看到主管深夜發布工作訊息，我對此的反省和勸導..."
              className="border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-800 bg-zinc-50/50"
              id="threads-keyword-input"
            />
          </div>

          <button
            onClick={handleGenerateThreads}
            disabled={isGenerating}
            className="w-full bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="threads-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在醞釀第一線坦誠觀點（5秒）...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                立即由 AI 生成「好老闆」深度串文✨
              </>
            )}
          </button>
        </div>

        {/* Text Area */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="threads-writer">
          <div className="flex justify-between items-center" id="threads-writer-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              編輯與確認 Threads 連接串文
            </span>
            {editorContent && (
              <button 
                onClick={() => setEditorContent("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
                id="threads-clear-editor"
              >
                清空重寫
              </button>
            )}
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="在這邊輸入或修改貼文內容。若包含 (1/2) (2/2) 等標記，右手邊的手機將會生動模擬出 Threads 對話連結框喔！"
            rows={8}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 font-sans leading-relaxed resize-none"
            id="threads-editor"
          />

          <div className="flex gap-2 justify-end" id="threads-actions">
            <button
              onClick={handleSaveDraft}
              disabled={!editorContent.trim()}
              className="border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 font-medium text-xs px-4 py-2 rounded-lg transition"
              id="threads-save-draft"
            >
              儲存草稿櫃
            </button>
            <button
              onClick={handlePublish}
              disabled={!editorContent.trim()}
              className="bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-300 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              id="threads-publish"
            >
              <Send className="w-3.5 h-3.5" />
              公開發佈至 Threads
            </button>
          </div>
        </div>

        {/* Dynamic history */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="threads-history">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">最近公開發布之碎碎念日記</h4>
          <div className="divide-y divide-zinc-100 max-h-[140px] overflow-y-auto pr-1" id="threads-history-list">
            {threadsPosts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">尚無發布記錄。</p>
            ) : (
              threadsPosts.map((post) => (
                <div key={post.id} className="py-2.5 text-xs flex flex-col gap-1" id={`threads-post-${post.id}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-100 rounded text-zinc-700">Threads 專頁</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{post.publishDate}</span>
                  </div>
                  <p className="text-zinc-600 line-clamp-2 leading-relaxed bg-zinc-50 p-2 rounded-md">{post.content}</p>
                  {post.status === "PUBLISHED" && (
                    <div className="flex gap-4 text-[10px] text-zinc-400 font-mono" id={`threads-post-${post.id}-stats`}>
                      <span>❤️ 熱度評價：{post.likes}</span>
                      <span>💬 回覆串：{post.comments}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Simulator (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="threads-simulator">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">📱 Threads 串燒黑白風預覽</span>

        {/* Simulated Phone Frame */}
        <div className="w-full max-w-[320px] h-[550px] bg-zinc-950 border-[10px] border-zinc-800/90 rounded-[36px] shadow-xl overflow-hidden flex flex-col font-sans" id="threads-phone">
          {/* Header */}
          <div className="pt-6 pb-2 px-3 border-b border-zinc-800 flex justify-between items-center text-white" id="threads-phone-header">
            <span className="text-xs font-black">Threads</span>
            <span className="text-xs opacity-50">👥 點擊放大</span>
          </div>

          {/* Connected timeline feed */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-white" id="threads-phone-body">
            
            {threadParts.length === 0 ? (
              <div className="text-zinc-500 italic text-[11px] text-center my-auto px-4" id="threads-placeholder">
                請在左手邊輸入文字心靈思想，或是按下「AI 生成」按鈕。
                您可以即時看到一整條串連的高擬真 Threads 卡片在手機螢幕上。
              </div>
            ) : (
              threadParts.map((partText, index) => {
                const isLast = index === threadParts.length - 1;
                return (
                  <div key={index} className="flex gap-2.5 items-start relative select-none" id={`threads-bubble-${index}`}>
                    {/* Connection Line */}
                    {!isLast && (
                      <div className="absolute left-3.5 top-8 bottom-[-24px] w-[2px] bg-zinc-800" />
                    )}

                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold z-10">
                      👑
                    </div>

                    <div className="flex-1 flex flex-col gap-1 text-xs">
                      {/* Name Line */}
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-bold text-zinc-200 hover:underline cursor-pointer">goodboss_threads</span>
                        <span className="text-[9px] text-zinc-500">刚刚</span>
                      </div>

                      {/* Msg Body */}
                      <p className="text-[11.5px] leading-relaxed text-zinc-300 whitespace-pre-wrap font-sans mt-0.5">{partText}</p>

                      {/* Small heart/chat icon items */}
                      <div className="flex gap-3 text-zinc-500 text-[10px] mt-2.5" id={`threads-bubble-${index}-metrics`}>
                        <span className="hover:text-red-400 cursor-pointer flex items-center gap-1">❤️ {index === 0 ? "245" : "110"}</span>
                        <span className="hover:text-blue-400 cursor-pointer flex items-center gap-1">💬 {index === 0 ? "32" : "15"}</span>
                        <span className="hover:text-white cursor-pointer">🔄</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* Input bar */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-900 text-slate-400 text-[10px] flex justify-between items-center" id="threads-input-footer">
            <span>正在以 goodboss_threads 發言...</span>
            <span className="text-zinc-600 font-bold font-sans">發送</span>
          </div>

        </div>
      </div>
    </div>
  );
}
