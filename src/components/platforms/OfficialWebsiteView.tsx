import React, { useState } from "react";
import { Sparkles, RefreshCw, Send, Globe, Layout, Plus, CheckCircle, Search } from "lucide-react";
import { Platform, WebsiteNews, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";

interface Props {
  newsList: WebsiteNews[];
  stats: PlatformStats;
  onAddNews: (news: Omit<WebsiteNews, "id">) => void;
  onToggleActive: (id: string) => void;
}

export default function OfficialWebsiteView({ newsList, stats, onAddNews, onToggleActive }: Props) {
  const [newsTitle, setNewsTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"最新消息" | "產品動態" | "特別活動" | "人才招募">("最新消息");
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(newsList[0]?.id || null);

  const handleGenerateNews = async () => {
    setIsGenerating(true);

    const prompt = `您是「好老闆官網」總編輯與 SEO 專家。請為官網的最新消息與部落格寫一篇高權威、專業可靠、排版嚴整的官方公告。
公告主題分組：${selectedCategory}。
${keywordInput ? `公告討論或強調重點：${keywordInput}` : "宣布年度大型企業領袖課程計劃"}

請遵照以下規格撰寫：
1. 【SEO 部落格公告內文】：
   - 包含一條標題（例如：【智慧轉型】好老闆推出中高階主管『OKR目標引導實戰班』，限時早鳥報名中！）。
   - 條理分明，層次清晰，多用數字符號（例如：1.、2.、3.）來切分段落說明。
   - 語氣必須正式、誠信、具有高知名企業公信力、溫和體貼。
2. 【SEO META DESCRIPTION (網站描述)】：
   - 寫出一段不含引號、長度約在 100-150 字的中文字句，專為 Google 搜尋引擎摘要設計。
3. 【SEO 搜尋關鍵字建議】：
   - 給出 4-5 個關聯度極高的逗號分隔關鍵字（例如：好老闆學苑, 主管教育訓練, OKR實戰, 組織管理）。
4. 請使用台灣繁體中文，遵守法律條款公告及高水準商務書信原則。不要輸出額外的 Markdown 等 meta 文字。`;

    const systemInstruction = "你是一位精通 SEO 排名優化、擅長撰寫高品質企業公告與教育訓練宣傳的台灣官網總編輯。";

    const result = await generateContent(prompt, systemInstruction, 0.7);

    setIsGenerating(false);
    if (result.success) {
      const text = result.text;
      setEditorContent(text);

      // Auto parse components if returned in clear structure
      const lines = text.split("\n");
      const titleLine = lines.find(l => l.includes("【") && l.includes("】")) || lines[0] || "";
      setNewsTitle(titleLine.replace(/【|】/g, "").substring(0, 40));

      const seoDescLine = lines.find(l => l.toLowerCase().includes("seo") || l.includes("描述") || l.includes("meta")) || "本站提供優質的管理心法與主管培訓工具。";
      setSeoDescription(seoDescLine.replace(/.*:|.*：/g, "").trim().substring(0, 150));

      setSeoKeywords("好老闆課程, 企業教育訓練, 經理人論壇");
    } else {
      if (result.error === "NO_API_KEY") {
        setNewsTitle("好老闆推動全新『中高階當責團隊工作坊』");
        setEditorContent("【預載的高擬真 官網最新公告：】\n\n【領導力特訓】好老闆即日起開放『高效當責主管工作坊』預約諮詢！\n\n我們深知，企業要突破，中階主管的「當責心態」是最大的樞紐。\n本次工作坊將由好老闆創辦人親自帶領，深入解構：\n1. 如何共同訂立指標，打破部門之間的本位主義？\n2. 面對變革，主管如何進行向上與雙向溝通？\n\n凡是好老闆社群學員，享有前 50 組早鳥學費 8 折優惠，點選下方諮詢報名！");
        setSeoDescription("好老闆官網推出中高階主管當責工作坊，提煉企業績效突破。");
        setSeoKeywords("好老闆工作坊, 主管培訓, 組織溝通");
      } else {
        setEditorContent(result.text || result.error || "生成失敗。");
      }
    }
  };

  const handleSaveAndAdd = () => {
    if (!editorContent.trim() || !newsTitle.trim()) return;
    onAddNews({
      title: newsTitle,
      content: editorContent,
      category: selectedCategory,
      date: new Date().toISOString().substring(0, 10),
      isActive: true,
      author: "官網編輯部"
    });
    setNewsTitle("");
    setEditorContent("");
    setKeywordInput("");
    setSeoDescription("");
    setSeoKeywords("");
  };

  const activeNewsDetails = newsList.find(n => n.id === selectedNewsId) || newsList[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans animate-fade-in" id="website-view-root">
      {/* 7 Columns: News Config */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2" id="website-controls">
        {/* Metric dashboard widgets */}
        <div className="grid grid-cols-3 gap-3" id="website-metrics-grid">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between" id="web-metric-uv">
            <span className="text-xs text-slate-800 font-medium">🌐 官網單月訪客數</span>
            <span className="text-xl font-bold text-slate-900 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-slate-500 mt-1">▲ 比上月飆升 +{stats.latestGrowth} 名</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between" id="web-metric-pv">
            <span className="text-xs text-slate-800 font-medium font-sans">📈 單月累計瀏覽量</span>
            <span className="text-xl font-bold text-slate-900 mt-1 font-mono">{(stats.reach).toLocaleString()} 次</span>
            <span className="text-[10px] text-slate-500 mt-1">SEO 排名穩定名列前茅</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between" id="web-metric-cr">
            <span className="text-xs text-slate-800 font-medium">💬 課程諮詢轉化率</span>
            <span className="text-xl font-bold text-slate-900 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-slate-500 mt-1">行銷與內容佈局精準</span>
          </div>
        </div>

        {/* AI Writer Panel */}
        <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-xs" id="web-ai-card">
          <div className="flex items-center gap-2 mb-3" id="web-ai-header">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">官網公告 & SEO 關鍵字優化師</h3>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3" id="web-categories">
            {(["最新消息", "產品動態", "特別活動", "人才招募"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-center text-[10.5px] py-1.5 px-2 rounded-lg border transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 border-slate-950 text-white font-bold"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
                id={`web-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4" id="web-brief-box">
            <label className="text-xs text-zinc-500 font-medium">公告或新訓大綱簡要背景（選填）</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="例如：推出早鳥優惠課、社會企業募款捐贈、尋找優資企劃專人..."
              className="border border-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 bg-zinc-50/50"
              id="web-keyword-input"
            />
          </div>

          <button
            onClick={handleGenerateNews}
            disabled={isGenerating}
            className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-slate-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="web-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在精確佈局 SEO 置頂公告...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                立即由 AI 撰寫官網極致文案✨
              </>
            )}
          </button>
        </div>

        {/* CMS Editor */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="web-composer">
          <div className="flex flex-col gap-1.5" id="web-composer-title">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              官網公告與文章標題
            </label>
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="例如：【品牌動態】「好老闆學苑」全方位雲端實習計劃啟動！"
              className="border border-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
              id="web-composer-title-input"
            />
          </div>

          <div className="flex justify-between items-center" id="web-editor-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              編輯官網公告正文內容
            </span>
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="請在這邊撰寫官方公告之正文。右手邊將會即時模擬展示該文章呈現在官網 2.0 正式頁面的效果哦！"
            rows={8}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans leading-relaxed resize-none"
            id="web-editor-textarea"
          />

          {/* SEO helper inputs */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-lg text-xs" id="web-seo-group">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-bold">SEO META DESCRIPTION 描述</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Google 搜尋顯示摘要..."
                className="border border-zinc-200 rounded bg-white p-1 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-slate-900"
                id="web-meta-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-bold">逗號分隔核心關鍵詞</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="好老闆, 管理培訓..."
                className="border border-zinc-200 rounded bg-white p-1 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-slate-900"
                id="web-keywords-input"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end" id="web-controls-actions">
            <button
              onClick={handleSaveAndAdd}
              disabled={!editorContent.trim() || !newsTitle.trim()}
              className="bg-slate-900 hover:bg-slate-950 disabled:bg-zinc-300 text-white font-medium text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              id="web-add-btn"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              儲存並公開至官網
            </button>
          </div>
        </div>

        {/* Existing announcements directory list */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="web-directory-card">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">官網所有在線文章歷史</h4>
          <div className="divide-y divide-zinc-100 max-h-[150px] overflow-y-auto pr-1" id="web-directory-list">
            {newsList.map((news) => (
              <div
                key={news.id}
                onClick={() => setSelectedNewsId(news.id)}
                className={`py-2 text-xs flex justify-between items-center cursor-pointer hover:bg-zinc-50 rounded px-1 transition ${
                  selectedNewsId === news.id ? "bg-slate-50 font-medium" : ""
                }`}
                id={`web-item-${news.id}`}
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]" id={`web-item-${news.id}-details`}>
                  <span className="font-semibold text-zinc-800 truncate">{news.title}</span>
                  <div className="flex gap-2 text-[10px] text-zinc-400 mt-1">
                    <span className="text-slate-700 font-semibold">{news.category}</span>
                    <span>·</span>
                    <span>{news.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleActive(news.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                      news.isActive 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-zinc-100 text-zinc-500 border-zinc-300 hover:bg-zinc-200"
                    }`}
                    id={`web-toggle-${news.id}`}
                  >
                    {news.isActive ? "已上架在線" : "已下架關閉"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator: Browser Preview (5 Columns) */}
      <div className="lg:col-span-15 lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="web-simulator">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">💻 官網 2.0 桌機瀏覽器預覽</span>

        {/* Mock Browser Frame */}
        <div className="w-full max-w-[360px] bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden flex flex-col font-sans" id="web-browser-frame">
          {/* Top Address Bar area */}
          <div className="bg-zinc-100 p-2.5 flex items-center gap-2 border-b border-zinc-200" id="web-browser-top">
            {/* Dot buttons */}
            <div className="flex gap-1" id="web-browser-dots">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            {/* Address Bar URL */}
            <div className="flex-1 bg-white border border-zinc-200 rounded-md py-0.5 px-2 text-[9px] text-zinc-500 font-mono flex items-center justify-between" id="web-browser-address">
              <span className="truncate">https://www.goodboss-academy.com/news</span>
              <span className="opacity-40">🔄</span>
            </div>
          </div>

          {/* Website Canvas Area */}
          <div className="flex-1 bg-zinc-50 flex flex-col min-h-[460px] max-h-[500px] overflow-y-auto" id="web-browser-canvas">
            {/* Header branding */}
            <header className="bg-slate-900 text-white py-3 px-4 flex justify-between items-center" id="web-preview-header">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider text-yellow-500 uppercase leading-none font-sans">★ 好老闆學苑 2.0</span>
              </div>
              <nav className="text-[8px] flex gap-2.5 text-zinc-300 font-medium" id="web-preview-nav">
                <span className="hover:text-white cursor-pointer">核心觀點</span>
                <span className="hover:text-white cursor-pointer underline text-yellow-400">最新消息</span>
                <span className="hover:text-white cursor-pointer">顧問培訓</span>
              </nav>
            </header>

            {/* Core view active news announcement container */}
            {activeNewsDetails ? (
              <main className="flex-1 p-3.5 flex flex-col gap-3 leading-relaxed" id="web-preview-main">
                {/* News category & date tag */}
                <div className="flex justify-between items-center" id="web-preview-tags">
                  <span className="text-[8px] font-bold uppercase py-0.5 px-1.5 bg-yellow-400 text-slate-950 rounded">
                    {activeNewsDetails.category}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-450">{activeNewsDetails.date}</span>
                </div>

                {/* News Headline */}
                <h3 className="text-xs font-black text-slate-900 leading-snug font-sans tracking-tight">
                  {activeNewsDetails.title}
                </h3>

                {/* News body text */}
                <div className="text-[10px] text-zinc-600 space-y-2 border-t border-zinc-200/60 pt-2.5 whitespace-pre-wrap font-sans leading-relaxed" id="web-preview-body">
                  <p>{activeNewsDetails.content}</p>
                </div>

                {/* Mock CTA trigger form */}
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200/60 flex flex-col gap-2 mt-2 items-center text-center shadow-xs" id="web-preview-cta">
                  <p className="text-[10px] font-black text-slate-900 font-sans leading-relaxed">對此企業公告或培訓有興趣與疑問嗎？</p>
                  <p className="text-[8.5px] text-zinc-500 leading-normal">請留下您的電子信箱，我們的專業講師將在 24 小時內寄發專案規劃書給您！</p>
                  <div className="flex w-full gap-1.5" id="web-preview-cta-form">
                    <input type="email" placeholder="輸入常用電子信箱..." className="flex-1 bg-white border border-zinc-250 p-1 rounded text-[8.5px] focus:outline-none" disabled />
                    <button className="bg-slate-900 text-white rounded px-2.5 text-[8.5px] font-bold cursor-not-allowed" disabled>
                      送出
                    </button>
                  </div>
                </div>
              </main>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-400 italic text-[10px] p-6 text-center">
                尚未建立任何熱門公告。請點選左側填入大綱進行 AI 生成！
              </div>
            )}

            {/* Simulated Web Footer */}
            <footer className="mt-auto bg-slate-955 text-[8px] text-zinc-500 py-3 text-center border-t border-zinc-100" id="web-preview-footer">
              <p>© 2026 好老闆領導力管顧公司 版權所有</p>
              <p className="mt-0.5 opacity-60">地址：台北市信義區頂尖大樓 12 樓</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
