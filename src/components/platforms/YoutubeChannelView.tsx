import React, { useState } from "react";
import { Youtube, Play, Film, Sparkles, RefreshCw, Send, Radio, ThumbsUp, Eye, Heart } from "lucide-react";
import { Platform, PostItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";

interface Props {
  posts: PostItem[];
  stats: PlatformStats;
  onAddPost: (post: Omit<PostItem, "id">) => void;
}

export default function YoutubeChannelView({ posts, stats, onAddPost }: Props) {
  const ytPosts = posts.filter((p) => p.platform === Platform.YT_CHANNEL);

  const [videoTitle, setVideoTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [videoFormat, setVideoFormat] = useState("Shorts 短影音");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateScript = async () => {
    setIsGenerating(true);

    const prompt = `您是「好老闆」YouTube 頻道首席影音企劃。請為我們的頻道規劃一個備受歡迎的爆火影片劇本大綱。
影片格式：${videoFormat}。
${keywordInput ? `影片期望傳達的核心主題或故事：${keywordInput}` : "影片期望討論現代優質經理人的管理指南"}

請按照以下規格撰寫：
1. 【3 款高點擊率標題建議 (High CTR Titles)】：
   - 給予三個兼具好奇心、痛點、且不誇大實話實說的心智標題範本（例如：『為什麼好員工會突然集體離職？多數老闆都犯了這個錯！』）。
2. 【黃金 15 秒開頭 Hook 逐字稿】：
   - 寫出影片前 15 秒抓住觀眾眼球不讓其滑走的「畫面+旁白腳本二欄或直接逐字稿」。
3. 【結構化段落大綱 (Chapters Outline)】：
   - 如果是長影片，寫出關鍵的章節時戳（例如：01:30 員工的心灰意冷期）與內容大意。
   - 如果是 Shorts 短片，寫出 3 個快節奏且富有乾貨點擊性的字字句句核心。
4. 請使用繁體中文（台灣），語氣節奏快速明朗、富幽默感、真摯且不說教。`;

    const systemInstruction = "你是一位擅長新媒體行銷、精通 YouTube 流量演算法和高質量企業影音編劇的台灣首席影音企劃。";

    const result = await generateContent(prompt, systemInstruction, 0.75);

    setIsGenerating(false);
    if (result.success) {
      setEditorContent(result.text);
      
      const lines = result.text.split("\n");
      const titleLine = lines.find(l => l.includes("1.") || l.includes("標題一") || l.includes("標題")) || lines[1] || "";
      setVideoTitle(titleLine.replace(/\d|\.|#|-|題/g, "").trim().substring(0, 30));
    } else {
      if (result.error === "NO_API_KEY") {
        setVideoTitle("現代主管必修：員工提職職的徵兆");
        setEditorContent("【預載的高擬真 YT 影片企劃案：】\n\n📌 爆火高點閱率標題（CTR 12% 預測）：\n1. 中階主管的兩難：為什麼替員工向公司爭取福利，老闆卻覺得你在叛變？\n2. 面試別再考倒同仁：好老闆面試只看著這 3 個軟實力特質！\n\n🎯 黃金 15 秒 Hook 逐字稿：\n（畫面：穿著襯衫的好老闆無奈嘆氣，隨後切入中字字卡）\n「你有沒有遇過一種主管，開口閉口都是『公司規定』？最新研究發現，凡事只講辦公規定的部門，同仁離職率高達 40%！今天用 3 分鐘，教你不用制度，也能召集主動當責的神隊友！」\n\n📘 影片結構大綱與字卡：\n00:00 為什麼照章行事反而留不住人才？\n02:15 秘訣一：重視目標，而非形式主義\n04:50 秘訣二：建立『雙向回饋機制』，不讓員工心冷\n\n#爆紅企劃 #YouTube領導學 #團隊自驅力");
      } else {
        setEditorContent(result.text || result.error || "生成失敗。");
      }
    }
  };

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.YT_CHANNEL,
      title: videoTitle || "未命名影音企劃",
      content: editorContent,
      status: "PUBLISHED",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      views: 0
    });
    setVideoTitle("");
    setEditorContent("");
    setKeywordInput("");
  };

  const handleSaveDraft = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.YT_CHANNEL,
      title: videoTitle || "未命名影音草稿",
      content: editorContent,
      status: "DRAFT",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      views: 0
    });
    setVideoTitle("");
    setEditorContent("");
    setKeywordInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans" id="yt-view-root">
      {/* 7 Columns: Panel controls */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2" id="yt-controls">
        {/* Metric widgets */}
        <div className="grid grid-cols-3 gap-3" id="yt-metrics">
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col justify-between" id="yt-subscribe-metric">
            <span className="text-xs text-red-800 font-medium">🔴 頻道訂閱數</span>
            <span className="text-xl font-bold text-red-900 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-red-600 mt-1">▲ 本期新增 +{stats.latestGrowth}位優質觀眾</span>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col justify-between" id="yt-view-metric">
            <span className="text-xs text-red-800 font-medium font-sans">📈 本月累計觀看</span>
            <span className="text-xl font-bold text-red-900 mt-1 font-mono">{(stats.reach).toLocaleString()} 次</span>
            <span className="text-[10px] text-red-600 mt-1">影音傳達極具穿透力</span>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col justify-between" id="yt-retention-metric">
            <span className="text-xs text-red-800 font-medium font-sans">⏱ 影片平均續看率</span>
            <span className="text-xl font-bold text-red-900 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-red-600 mt-1">高於 45% 管理類均值</span>
          </div>
        </div>

        {/* AI Scripter */}
        <div className="border border-red-200 bg-white rounded-xl p-4 shadow-xs" id="yt-ai-scripter">
          <div className="flex items-center gap-2 mb-3" id="yt-ai-title">
            <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
              <Youtube className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">YouTube 爆紅影音 AI 編劇</h3>
          </div>

          <div className="flex gap-2 mb-3" id="yt-format-selector">
            <button
              onClick={() => setVideoFormat("Shorts 短影音")}
              className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition ${
                videoFormat === "Shorts 短影音"
                  ? "bg-red-50 border-red-500 text-red-800"
                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
              }`}
              id="yt-shorts-format"
            >
              <Film className="w-3.5 h-3.5 inline mr-1" /> Shorts 短影音 (60s)
            </button>
            <button
              onClick={() => setVideoFormat("YouTube 長影音")}
              className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition ${
                videoFormat === "YouTube 長影音"
                  ? "bg-red-50 border-red-500 text-red-800"
                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
              }`}
              id="yt-long-format"
            >
              <Radio className="w-3.5 h-3.5 inline mr-1" /> 長篇教學片 (5-15m)
            </button>
          </div>

          <div className="flex flex-col gap-2 mb-4" id="yt-ai-prompt-inputs">
            <label className="text-xs text-zinc-500 font-medium">想要探討的經理人主題 / 想破除的管理梗（選填）</label>
            <textarea
              rows={2}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="例如：打破跟下屬的代溝、開會效率提升、下班後別騷擾員工等。AI 會撰寫抓耳引進、高保留率劇本。"
              className="border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 bg-zinc-50/50 leading-relaxed font-sans"
              id="yt-keyword-input"
            />
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="yt-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在設計電影感大綱（請稍候）...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成黃金 CTR 標題與短片劇本✨
              </>
            )}
          </button>
        </div>

        {/* Text Area */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="yt-editor-card">
          <div className="flex flex-col gap-1.5" id="yt-editor-title-container">
            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              劇本標題 (YT影片名稱)
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="例如：3個好主管不做的職場隱性傷害"
              className="border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
              id="yt-editor-title-input"
            />
          </div>

          <div className="flex justify-between items-center" id="yt-editor-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              編輯影片腳本與時戳說明
            </span>
            {editorContent && (
              <button 
                onClick={() => setEditorContent("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
                id="yt-clear-editor"
              >
                清空重寫
              </button>
            )}
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="請在這邊確認影片文案，右手邊為您模擬了頻道上傳發布時的劇院大螢幕與影片詳情..."
            rows={10}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-sans leading-relaxed resize-none"
            id="yt-editor-textarea"
          />

          <div className="flex gap-2 justify-end" id="yt-action-buttons">
            <button
              onClick={handleSaveDraft}
              disabled={!editorContent.trim()}
              className="border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 font-medium text-xs px-4 py-2 rounded-lg transition cursor-pointer"
              id="yt-save-draft"
            >
              儲存草稿箱
            </button>
            <button
              onClick={handlePublish}
              disabled={!editorContent.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition cursor-pointer"
              id="yt-publish"
            >
              <Send className="w-3.5 h-3.5" />
              正式排定發布 
            </button>
          </div>
        </div>

        {/* Uploaded History List */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="yt-history-card">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">已上架影片企劃與草稿歷史目錄</h4>
          <div className="divide-y divide-zinc-100 max-h-[150px] overflow-y-auto pr-1" id="yt-history-list">
            {ytPosts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">尚無上架記錄。</p>
            ) : (
              ytPosts.map((post) => (
                <div key={post.id} className="py-2.5 text-xs flex flex-col gap-1" id={`yt-post-${post.id}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-800">{post.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{post.publishDate}</span>
                  </div>
                  <p className="text-zinc-500 truncate leading-relaxed bg-zinc-50 p-2 rounded-md">{post.content}</p>
                  {post.status === "PUBLISHED" && (
                    <div className="flex gap-4 text-[10px] text-zinc-400 mt-1" id={`yt-post-${post.id}-stats`}>
                      <span>👁 累計觀看：{post.views}</span>
                      <span>❤️ 按讚：{post.likes}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Simulator view (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="yt-simulator">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">💻 YT 電腦劇院預覽</span>

        {/* Mock YouTube Desktop Card */}
        <div className="w-full max-w-[360px] bg-white border border-zinc-200 rounded-xl shadow-md overflow-hidden flex flex-col font-sans" id="yt-player-card">
          {/* Main Video Canvas Screen MOCK */}
          <div className="relative aspect-video bg-zinc-950 flex flex-col justify-between p-4 text-white group overflow-hidden" id="yt-player-visual">
            
            {/* Top Bar inside Player */}
            <div className="flex justify-between items-center z-10" id="yt-player-top">
              <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full font-mono">1080p HD</span>
              <span className="text-[9px] text-red-500 bg-black/45 px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                LIVE PREVIEW
              </span>
            </div>

            {/* Middle Big Play Arrow */}
            <div className="self-center flex flex-col items-center mt-3 cursor-pointer select-none group-hover:scale-110 transition shrink-0" id="yt-big-play-btn">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition">
                <Play className="w-6 h-6 fill-current text-white ml-0.5" />
              </div>
            </div>

            {/* Bottom Progress Controls overlay inside player */}
            <div className="z-10 mt-auto flex flex-col gap-1.5" id="yt-progress-group">
              {/* Timeline Track */}
              <div className="h-1 bg-white/20 w-full rounded-full overflow-hidden relative cursor-pointer" id="yt-timeline">
                <div className="h-full bg-red-600 w-1/3 rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></div>
                </div>
              </div>
              
              {/* Timelabel & controls */}
              <div className="flex justify-between items-center text-[8px] text-zinc-300" id="yt-controls-panel">
                <div className="flex gap-2 font-mono">
                  <span>▶</span>
                  <span>🔊 50%</span>
                  <span>02:15 / 07:45</span>
                </div>
                <span>⚙ 高畫質 📡</span>
              </div>
            </div>

            {/* Ambient Background Gradient for subtitles */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/3 w-full h-full pointer-events-none"></div>
          </div>

          {/* Video detail details below screen */}
          <div className="p-3.5 flex flex-col gap-2 bg-white" id="yt-details-section">
            <h4 className="text-xs font-extrabold text-zinc-900 leading-snug">
              {videoTitle ? videoTitle : "【好老闆領導學】點選左側 AI 寫手自動生成高 CTR 標題影片企劃！"}
            </h4>

            {/* Author and sub indicator */}
            <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg" id="yt-channel-bar">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-900 flex items-center justify-center text-[10px] text-amber-200 font-bold border border-amber-600/30">
                  👑
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-800 leading-none">好老闆學苑 Good Boss YT</span>
                  <span className="text-[8px] text-zinc-500 mt-1">6.8萬 訂閱者</span>
                </div>
              </div>
              <button className="bg-zinc-900 text-white font-semibold text-[9px] px-3 py-1 rounded-full hover:bg-zinc-800 transition">
                訂閱
              </button>
            </div>

            {/* Likes/Views stats */}
            <div className="flex gap-3 text-[9px] text-zinc-500 font-medium" id="yt-stats-summary">
              <span>👁 觀看次數：1.2萬 次</span>
              <span>·</span>
              <span>👍 喜歡：845</span>
              <span>·</span>
              <span>📅 發布：1分鐘前</span>
            </div>

            {/* Simulated scrollable captions Description block */}
            <div className="bg-zinc-100 rounded-lg p-2.5 text-[10px] text-zinc-600 leading-relaxed max-h-[140px] overflow-y-auto" id="yt-video-desc-block">
              <p className="font-semibold text-zinc-800 mb-1">【影片介紹與章節劇本】</p>
              {editorContent ? (
                <p className="whitespace-pre-line text-[10.5px] font-sans text-zinc-600">{editorContent}</p>
              ) : (
                <p className="text-zinc-400 italic text-[10.5px]">未輸入任何劇本或企劃內文。請使用 AI 文案功能在此渲染高擬真 YouTube 影片大綱及章節發佈資訊。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
