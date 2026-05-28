import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Share2, Globe, Send, Sparkles, RefreshCw, Bookmark } from "lucide-react";
import { Platform, PostItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";
import { motion } from "motion/react";

interface Props {
  posts: PostItem[];
  stats: PlatformStats;
  onAddPost: (post: Omit<PostItem, "id">) => void;
}

export default function FbFanpageView({ posts, stats, onAddPost }: Props) {
  const fbPosts = posts.filter((p) => p.platform === Platform.FB_FANPAGE);

  const [postTitle, setPostTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("勵志管理心法");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const goals = [
    { label: "🌱 勵志管理心法", value: "以啟發人性的正向觀點探討企業文化，給予基層及中階主管信心與啟迪的貼文" },
    { label: "💡 乾貨知識彙整", value: "管理學經典或實用工具分享（例如OKR、當責流程），用條列式或表格符號呈現精華" },
    { label: "📢 活動宣傳推廣", value: "宣傳老闆最新實體管理講堂或線上諮詢課程，建立急迫性與極高的吸引力" },
    { label: "🍟 員工日常福利", value: "分享好老闆和同仁有趣的下午茶或辦公室搞笑日常，顯現良善、充滿笑聲的幸福企業風格" },
  ];

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    setAiResult(null);

    const goalDetails = goals.find(g => g.label.includes(selectedGoal))?.value || selectedGoal;
    const prompt = `您是「好老闆」FB 品牌專頁的小編。請為粉絲專頁撰寫一篇極具「故事張力、專業觀點、高分享率」的主題貼文。
目標定位：${goalDetails}。
${keywordInput ? `融合關鍵字或真實背景：${keywordInput}` : ""}

請按照以下格式和規範撰寫：
1. 【吸睛標題】：開頭要有一個抓人眼球的【主標題】（例如：【為什麼對員工越寬容，業績反而越好？】）。
2. 【引言故事】：用 2-3 句點出主管或老闆日常的痛點，以引發共鳴。
3. 【核心洞察】：條列式分享 2-3 個精準的實踐方法或轉變心法，使用醒目的符號（例如：✅、❤️、🎯）。
4. 【溫暖結尾】：強調「好老闆不是天生的，而是一起學習的過程」。
5. 【熱門標籤】：合適且不冗長的 #Hashtag（不超過 4 個，例如：#正向領導 #幸福企業 #團隊當責 #好老闆）。
6. 請使用台灣繁體中文，语气溫暖、中肯、知性且富有教育內涵。
7. 不要輸出任何 Markdown 標題（#）或引導語，直接返回文章內文。`;

    const systemInstruction = "你是一位備受敬重、文字深具感染力與啟發性的台灣社群經營經理人。";

    const result = await generateContent(prompt, systemInstruction, 0.7);

    setIsGenerating(false);
    if (result.success) {
      setAiResult(result.text);
      setEditorContent(result.text);

      // Try to extract a title from the generated text (e.g. line with 【】 or top line)
      const lines = result.text.split("\n");
      const titleLine = lines.find(l => l.includes("【") && l.includes("】")) || lines[0] || "";
      setPostTitle(titleLine.replace(/【|】/g, "").substring(0, 30));
    } else {
      setAiResult(result.text || result.error || "生成失敗。");
      if (result.error === "NO_API_KEY") {
        setPostTitle("用信任代替猜忌的領導力");
        setEditorContent("【預載的高擬真 FB 熱門貼文：】\n\n【信任，是組織運作最低成本的燃料】🚀\n\n你常覺得每天花在監控同仁「有沒有認真工作」的時間，比指導工作還多嗎？\n\n一個好的企業領袖，比起建立森嚴的規則，更專注於打造彈性的信任磁場。\n以下分享 3 個建立信任感的主管說話術：\n\n✅ 『這次專案由你全權負責，中途如果卡關，隨時來找我理清優先順序。』\n✅ 『我看到你為這個提案付出的努力，即使結果有落差，我們一起扛起優化。』\n\n當你給予同仁伸展的雙翼，他們就會飛出超乎你想像的精采！\n\n#好老闆心法 #當責團隊 #信任管理 #職場文化");
      }
    }
  };

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.FB_FANPAGE,
      title: postTitle || "未命名 FB 貼文",
      content: editorContent,
      status: "PUBLISHED",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      shares: 0
    });
    setPostTitle("");
    setEditorContent("");
    setKeywordInput("");
    setAiResult(null);
  };

  const handleSaveDraft = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.FB_FANPAGE,
      title: postTitle || "未命名 FB 草稿",
      content: editorContent,
      status: "DRAFT",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      shares: 0
    });
    setPostTitle("");
    setEditorContent("");
    setKeywordInput("");
    setAiResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans" id="fb-view-root">
      {/* Configuration column (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2" id="fb-controls-container">
        {/* Performance indicators */}
        <div className="grid grid-cols-3 gap-3" id="fb-metrics-grid">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-col justify-between" id="fb-metric-followers">
            <span className="text-xs text-blue-800 font-medium">👥 粉專追蹤者</span>
            <span className="text-xl font-bold text-blue-900 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-blue-600 mt-1">▲ 本月 +{stats.latestGrowth} 高速增長</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-col justify-between" id="fb-metric-reach">
            <span className="text-xs text-blue-800 font-medium">🌐 粉專觸及人數</span>
            <span className="text-xl font-bold text-blue-900 mt-1 font-mono">{(stats.reach).toLocaleString()} 人</span>
            <span className="text-[10px] text-blue-600 mt-1">粉絲黏著度極高</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-col justify-between" id="fb-metric-rate">
            <span className="text-xs text-blue-800 font-medium font-sans">🎯 平均互動率</span>
            <span className="text-xl font-bold text-blue-900 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-blue-600 mt-1">遠超同業 4% 平均值</span>
          </div>
        </div>

        {/* AI Post Writer Container */}
        <div className="border border-blue-200 rounded-xl bg-white p-4 shadow-xs" id="fb-ai-editor-card">
          <div className="flex items-center gap-2 mb-3" id="fb-ai-title">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700" id="fb-sparkle-icon">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">FB 粉專 AI 金牌寫手</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3" id="fb-ai-theme-grid">
            {goals.map((g) => (
              <button
                key={g.label}
                onClick={() => setSelectedGoal(g.label)}
                className={`text-left text-xs p-2 rounded-lg border transition ${
                  selectedGoal === g.label
                    ? "bg-blue-50 border-blue-500 text-blue-900 font-medium"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
                id={`fb-goal-${g.label.slice(0, 3)}`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4" id="fb-ai-brief-inputs">
            <label className="text-xs text-zinc-500 font-medium">補充文章背景或核心要點（例如：講述我帶領 5 人小團隊的真實反省）</label>
            <textarea
              rows={2}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="輸入想要強調的老闆理念、真實故事，能讓產出的貼文更加自然生動喔！"
              className="border border-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-zinc-50/50 leading-relaxed font-sans"
              id="fb-keyword-input"
            />
          </div>

          <button
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="fb-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在醞釀爆紅文案（估計 10 秒）...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                立即由 AI 撰寫高分享率貼文✨
              </>
            )}
          </button>
        </div>

        {/* Editor for FB Post */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="fb-editor-card">
          <div className="flex flex-col gap-1.5" id="fb-composer-title-section">
            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              貼文識別主題 (僅內部歸檔使用)
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="例如：如何與新員工建立信任關係"
              className="border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="fb-composer-title-input"
            />
          </div>

          <div className="flex justify-between items-center" id="fb-editor-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
              編輯與確認 FB 貼文內容
            </span>
            {editorContent && (
              <button 
                onClick={() => setEditorContent("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
                id="fb-clear-editor"
              >
                清空重寫
              </button>
            )}
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="在這邊輸入或修改貼文內容，右手邊將能即時以 FB 網頁版動態型式預覽..."
            rows={10}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans leading-relaxed resize-none"
            id="fb-editor-textarea"
          />

          <div className="flex gap-2 justify-end" id="fb-action-buttons">
            <button
              onClick={handleSaveDraft}
              disabled={!editorContent.trim()}
              className="border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 font-medium text-xs px-4 py-2 rounded-lg transition cursor-pointer"
              id="fb-save-draft-btn"
            >
              儲存草稿櫃
            </button>
            <button
              onClick={handlePublish}
              disabled={!editorContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition cursor-pointer"
              id="fb-publish-btn"
            >
              <Send className="w-3.5 h-3.5" />
              排程/正式發布至 FB
            </button>
          </div>
        </div>

        {/* Existing posts history */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="fb-history-card">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            近期粉專經營歷史記錄
          </h4>
          <div className="divide-y divide-zinc-100 max-h-[170px] overflow-y-auto pr-1" id="fb-history-list">
            {fbPosts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">尚無發布記錄。</p>
            ) : (
              fbPosts.map((post) => (
                <div key={post.id} className="py-2.5 text-xs flex flex-col gap-1" id={`fb-post-${post.id}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-800">{post.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{post.publishDate}</span>
                  </div>
                  <p className="text-zinc-500 truncate leading-relaxed bg-zinc-50 p-2 rounded-md">{post.content}</p>
                  {post.status === "PUBLISHED" && (
                    <div className="flex gap-4 text-[10px] text-zinc-400 mt-1" id={`fb-post-${post.id}-stats`}>
                      <span>👍 按讚數：{post.likes}</span>
                      <span>💬 留言討論：{post.comments}</span>
                      <span>🔄 分享熱度：{post.shares}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Simulator column (5 columns) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="fb-simulator-panel">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">💻 FB 電腦網頁版發布預覽</span>

        {/* Mock Facebook Post Frame */}
        <div className="w-full max-w-[360px] bg-white border border-zinc-200 rounded-xl shadow-md p-3.5 flex flex-col gap-3 font-sans" id="fb-post-preview-card">
          {/* Post Header */}
          <div className="flex justify-between items-start" id="fb-post-header">
            <div className="flex gap-2.5 items-center">
              {/* Profile image with wooden style border */}
              <div className="w-10 h-10 rounded-full bg-amber-900/10 border-2 border-amber-600/40 p-0.5 flex-shrink-0" id="fb-avatar">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-[10px] text-amber-200 font-bold">
                  👑
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold font-sans hover:underline cursor-pointer text-zinc-900 leading-tight">好老闆「領導力學苑」</span>
                  <span className="bg-blue-500 text-white rounded-full p-[2px] leading-none text-[6px]" title="官方驗證">✓</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-0.5 font-sans leading-none">
                  <span>主辦管理論壇</span>
                  <span>·</span>
                  <span title="剛剛">1分鐘前</span>
                  <span>·</span>
                  <Globe className="w-3 h-3 text-zinc-400" />
                </div>
              </div>
            </div>
            <span className="text-zinc-400 hover:text-zinc-600 cursor-pointer">···</span>
          </div>

          {/* Post Text content */}
          <div className="text-xs text-zinc-800 font-normal leading-relaxed overflow-y-auto max-h-[300px] border-b border-zinc-100 pb-3" id="fb-post-body">
            {editorContent ? (
              <p className="whitespace-pre-line text-[11.5px]">{editorContent}</p>
            ) : (
              <div className="text-zinc-400 italic text-[11px] py-4 bg-zinc-50 rounded-lg px-3 border border-dashed border-zinc-200">
                <p className="font-bold mb-1">【即時預報區】</p>
                請在左側填入貼文內容，或按下「讓 AI 撰寫貼文」按鈕。您為好老闆精心策劃的行銷文案與觀點分享，將會以百分之百高擬真的 FB 貼文架構呈現在這裡！
              </div>
            )}
          </div>

          {/* Simulated stats bar */}
          <div className="flex justify-between items-center text-[10px] text-zinc-500 px-1" id="fb-post-stats">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-500 text-white text-[8px] font-sans">👍</span>
              <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[8px] font-sans -ml-2.5">❤️</span>
              <span className="font-sans ml-1 text-zinc-700">{editorContent ? "342" : "0"} 人讚好與共鳴</span>
            </div>
            <div className="flex gap-2">
              <span>{editorContent ? "48" : "0"} 留言</span>
              <span>·</span>
              <span>{editorContent ? "56" : "0"} 次分享</span>
            </div>
          </div>

          {/* Simulated Action bars */}
          <div className="flex justify-between border-t border-b border-zinc-100 py-1.5 text-zinc-500 text-xs font-medium" id="fb-action-tabs animate-fade-in">
            <button className="flex-1 hover:bg-zinc-50 py-1 rounded flex justify-center items-center gap-1.5 cursor-pointer hover:text-blue-600 transition" id="fb-like-action">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>讚</span>
            </button>
            <button className="flex-1 hover:bg-zinc-50 py-1 rounded flex justify-center items-center gap-1.5 cursor-pointer hover:text-blue-600 transition" id="fb-comment-action">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>留言</span>
            </button>
            <button className="flex-1 hover:bg-zinc-50 py-1 rounded flex justify-center items-center gap-1.5 cursor-pointer hover:text-blue-600 transition" id="fb-share-action">
              <Share2 className="w-3.5 h-3.5" />
              <span>分享</span>
            </button>
          </div>

          {/* Mock comment field */}
          <div className="flex gap-2 items-center text-xs mt-1" id="fb-comment-box">
            <div className="w-6 h-6 rounded-full bg-zinc-200 text-[8px] flex items-center justify-center font-bold text-zinc-600">我</div>
            <div className="flex-1 bg-zinc-100 rounded-full px-3 py-1.5 text-zinc-400 text-[10px] select-none">
              撰寫留言...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
