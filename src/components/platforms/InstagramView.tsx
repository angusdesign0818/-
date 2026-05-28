import React, { useState } from "react";
import { Sparkles, RefreshCw, Send, Layers, Heart, MessageCircle, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { Platform, PostItem, PlatformStats } from "../../types";
import { generateContent } from "../../utils/ai";

interface Props {
  posts: PostItem[];
  stats: PlatformStats;
  onAddPost: (post: Omit<PostItem, "id">) => void;
}

interface CarouselSlide {
  number: number;
  title: string;
  detail: string;
}

export default function InstagramView({ posts, stats, onAddPost }: Props) {
  const igPosts = posts.filter((p) => p.platform === Platform.IG);

  const [editorContent, setEditorContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("創業者自我成長");
  const [isGenerating, setIsGenerating] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([
    { number: 1, title: "3個好老闆必懂的信任說話術", detail: "帶領高級團隊，信任是最高效的燃料" },
    { number: 2, title: "01. 用「全權授權」代替緊密監督", detail: "給同仁試錯的勇氣與舞台" },
    { number: 3, title: "02. 肯定他的局部貢獻", detail: "看見小進步，才是最扎實的肯定" }
  ]);
  const [activeSlide, setActiveSlide] = useState(1);

  const topics = [
    { label: "🧘‍♂️ 創業者自我成長", value: "如何克服團隊瓶頸，維持心靈平靜與高格局智慧" },
    { label: "🤝 新世代溝通法", value: "用對等的視角與 95/00 後同仁建立良好默契的實用技巧" },
    { label: "🥇 頂尖團隊建立", value: "打造擁有自驅力、主動當責組織的秘辛與目標管理" },
    { label: "🎂 暖心辦公室故事", value: "透過一段好主管在日常瑣事中默默護航同事的溫馨故事" }
  ];

  // Auto-extract slides from generated AI text if it follows Slide 1/2/3 format
  const parseSlides = (text: string) => {
    try {
      const slidesList: CarouselSlide[] = [];
      const lines = text.split("\n");
      let currentSlideNum = 0;
      let currentTitle = "";
      let currentDetail = "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (
          trimmed.toLowerCase().includes("slide") || 
          trimmed.includes("投影片") || 
          trimmed.includes("第") && trimmed.includes("頁") ||
          trimmed.match(/^[0-9]\./)
        ) {
          const match = trimmed.match(/\d+/);
          if (match) {
            if (currentSlideNum > 0 && currentTitle) {
              slidesList.push({ number: currentSlideNum, title: currentTitle, detail: currentDetail || "點選看完整說明" });
            }
            currentSlideNum = parseInt(match[0]);
            currentTitle = trimmed.substring(trimmed.indexOf(":") + 1 || trimmed.indexOf("：") + 1 || 0).trim();
            currentDetail = "";
          }
        } else if (currentSlideNum > 0) {
          if (trimmed !== "") {
            if (!currentTitle) {
              currentTitle = trimmed;
            } else {
              currentDetail += (currentDetail ? "\n" : "") + trimmed;
            }
          }
        }
      }

      if (currentSlideNum > 0 && currentTitle) {
        slidesList.push({ number: currentSlideNum, title: currentTitle, detail: currentDetail || "點選看完整說明" });
      }

      if (slidesList.length >= 2) {
        setCarouselSlides(slidesList);
        setActiveSlide(1);
      }
    } catch (e) {
      console.warn("解析輪播圖失敗，使用默認排版。", e);
    }
  };

  const handleGenerateIg = async () => {
    setIsGenerating(true);

    const topicDetails = topics.find(t => t.label.includes(selectedTopic))?.value || selectedTopic;
    const prompt = `您是「好老闆」IG 視覺主理人。請為官方 Instagram 撰寫一篇兼具「精美知性、排版潔淨、利於吸粉」的貼文文案，並且搭配一套多頁輪播圖的文案大綱。
主題：${topicDetails}
${keywordInput ? `特色需求或融合要點：${keywordInput}` : ""}

請按照以下規格撰寫：
1. 【IG 精選文案】：
   - 開頭要有一句發人深省的「金句 hook」吸睛。
   - 使用多行空行（IG 排版），不要擠在一起，每 2-3 句換行使視覺通透。
   - 融合富質感與設計感的 emoji。
   - 結尾包含適量標籤（3-4個，例如：#好老闆 #經理人社群 #領導力 #職場日常）。

2. 【Carousel 輪播圖分頁大綱 (限3張投影片)】：
   - 請明確使用以下標記返回投影片，以便我們系統和預覽元件解析：
     Slide 1: [第一張的主標題]
     [一兩句話介紹該頁背景或大意]
     
     Slide 2: [第二張的主標題（技巧 1）]
     [簡潔的做法或重點闡述]
     
     Slide 3: [第三張的主標題（技巧 2 或金句結尾）]
     [核心收尾與呼籲行動]

3. 請使用台灣繁體中文，文風高雅、簡潔、富視覺感知、有高級品味。
4. 不要輸出 Markdown 等冗長註釋。`;

    const systemInstruction = "你是一位專門設計簡約美感、精通 Instagram 年輕族群管理心法推廣的台灣行銷顧問。";

    const result = await generateContent(prompt, systemInstruction, 0.75);

    setIsGenerating(false);
    if (result.success) {
      setEditorContent(result.text);
      parseSlides(result.text);
    } else {
      if (result.error === "NO_API_KEY") {
        setEditorContent("【預載的高擬真 IG 設計款文案：】\n\n主管的底線，是別在下班前「指派」緊急任務。\n\n給同仁真正的尊重，從尊重他們的私人時間開始。☕\n\n真正的管理不是佔用同仁生命，\n而是彼此在工作時間內高當責、高效率的合作模式。\n工作以外，讓生活回歸生活。🌱\n\n支持這項理念的老闆們，歡迎收藏，一併分享給你的主管夥伴！\n\n#好老闆日常 #幸福組織 #當責領導 #工作生活平衡");
        setCarouselSlides([
          { number: 1, title: "好主管不做的 3 個「隱形職場傷害」", detail: "建立幸福而健康的職場管理環境，從細節著手" },
          { number: 2, title: "01. 避免下班前召開臨時短會", detail: "尊重每位夥伴的私人與家庭休假時間，避免燃盡熱情" },
          { number: 3, title: "02. 避免將「即時回覆」和敬業度掛鉤", detail: "專注產出，而非下班後的通訊軟體回信速度" }
        ]);
        setActiveSlide(1);
      } else {
        setEditorContent(result.text || result.error || "生成失敗。");
      }
    }
  };

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.IG,
      content: editorContent,
      status: "PUBLISHED",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
    });
    setEditorContent("");
    setKeywordInput("");
  };

  const handleSaveDraft = () => {
    if (!editorContent.trim()) return;
    onAddPost({
      platform: Platform.IG,
      content: editorContent,
      status: "DRAFT",
      publishDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      comments: 0,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
    });
    setEditorContent("");
    setKeywordInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-zinc-800 font-sans" id="ig-view-root">
      {/* Configuration columns (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2 font-sans text-xs leading-relaxed" id="ig-controls">
        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-3" id="ig-metrics">
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex flex-col justify-between" id="ig-metric-followers">
            <span className="text-xs text-rose-800 font-semibold font-sans">✨ IG 追蹤者數</span>
            <span className="text-xl font-bold text-rose-900 mt-1 font-mono">{(stats.followers).toLocaleString()} 人</span>
            <span className="text-[10px] text-rose-600 mt-1">▲ 本月新增 +{stats.latestGrowth}成員</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex flex-col justify-between" id="ig-metric-reach">
            <span className="text-xs text-rose-800 font-semibold font-sans">📈 動態觸及人數</span>
            <span className="text-xl font-bold text-rose-900 mt-1 font-mono">{(stats.reach).toLocaleString()} 人</span>
            <span className="text-[10px] text-rose-600 mt-1 font-sans">精緻圖文帶來高轉發</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex flex-col justify-between" id="ig-metric-rate">
            <span className="text-xs text-rose-800 font-semibold font-sans">💬 平均互動比率</span>
            <span className="text-xl font-bold text-rose-900 mt-1 font-mono">{stats.engagementRate}%</span>
            <span className="text-[10px] text-rose-600 mt-1 font-sans">深受新世代經理人喜愛</span>
          </div>
        </div>

        {/* AI Generator */}
        <div className="border border-rose-200 rounded-xl bg-white p-4 shadow-xs" id="ig-ai-card">
          <div className="flex items-center gap-2 mb-3" id="ig-ai-title">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm">IG 圖卡文案＆排版助理</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3" id="ig-ai-topic-grid">
            {topics.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTopic(t.label)}
                className={`text-left text-xs p-2 rounded-lg border transition ${
                  selectedTopic === t.label
                    ? "bg-rose-50 border-rose-500 text-rose-900 font-bold"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
                id={`ig-topic-${t.label.slice(0, 3)}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4" id="ig-ai-prompt-inputs">
            <label className="text-xs text-zinc-500 font-medium">融合細部痛點 / 期待內容（選填）</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="例如：提早下班、不隨便責備、尊重同仁的生活底線..."
              className="border border-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-zinc-50/50"
              id="ig-keyword-input"
            />
          </div>

          <button
            onClick={handleGenerateIg}
            disabled={isGenerating}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            id="ig-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                正在大腦激盪高質感文案與大綱...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成 IG 貼文與輪播圖大綱✨
              </>
            )}
          </button>
        </div>

        {/* Text editor */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4 flex flex-col gap-3 shadow-xs" id="ig-editor-card">
          <div className="flex justify-between items-center" id="ig-editor-header">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              編輯與確認 IG 貼文及說明文
            </span>
            {editorContent && (
              <button 
                onClick={() => setEditorContent("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
                id="ig-clear-editor"
              >
                清空重寫
              </button>
            )}
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="請在這邊輸入或修改 IG 說明文，產生的對應輪播頁卡片也會在右手邊模擬卡片即時顯示說明哦..."
            rows={10}
            className="border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans leading-relaxed resize-none"
            id="ig-editor-textarea"
          />

          <div className="flex gap-2 justify-end" id="ig-action-buttons">
            <button
              onClick={handleSaveDraft}
              disabled={!editorContent.trim()}
              className="border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 font-medium text-xs px-4 py-2 rounded-lg transition"
              id="ig-save-draft-btn"
            >
              儲存草稿箱
            </button>
            <button
              onClick={handlePublish}
              disabled={!editorContent.trim()}
              className="bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-300 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              id="ig-publish-btn"
            >
              <Send className="w-3.5 h-3.5" />
              正式發佈 IG 圖卡
            </button>
          </div>
        </div>

        {/* Visual snaphots */}
        <div className="border border-zinc-200 rounded-xl bg-white p-4" id="ig-snapshot-card">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">已發佈圖文牆快照</h4>
          <div className="grid grid-cols-4 gap-2" id="ig-visual-snapshot-grid">
            <div className="relative aspect-square ring-1 ring-zinc-100 rounded-md overflow-hidden bg-zinc-200" id="ig-snapshot-1">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=150" alt="post snapshot" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-square ring-1 ring-zinc-100 rounded-md overflow-hidden bg-zinc-200" id="ig-snapshot-2">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=150" alt="post snapshot" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-square ring-1 ring-zinc-100 rounded-md overflow-hidden bg-zinc-200" id="ig-snapshot-3">
              <img src="https://images.unsplash.com/photo-1531535934027-667f687cede5?auto=format&fit=crop&q=80&w=150" alt="post snapshot" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-square ring-1 ring-zinc-100 rounded-md overflow-hidden bg-zinc-200" id="ig-snapshot-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150" alt="post snapshot" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator view */}
      <div className="lg:col-span-5 flex flex-col items-center justify-start bg-zinc-100/50 p-4 border border-zinc-200/80 rounded-xl" id="ig-simulator-panel">
        <span className="text-xs text-zinc-400 font-semibold tracking-widest mb-3 uppercase">📱 IG 輪播貼文手機預覽</span>

        {/* Mock Phone Card */}
        <div className="w-full max-w-[320px] bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-xl flex flex-col relative" id="ig-phone-frame">
          
          {/* Header */}
          <div className="pt-4 pb-2 px-3 border-b border-zinc-100 flex justify-between items-center bg-white" id="ig-phone-header">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[8px] text-amber-300 font-bold border border-white">
                  👑
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-900 leading-tight">goodboss_official</span>
                <span className="text-[8px] text-zinc-500 leading-none">台灣，台北</span>
              </div>
            </div>
            <span className="text-zinc-400 text-xs cursor-pointer">···</span>
          </div>

          {/* Color Card carousel */}
          <div className="relative aspect-square bg-gradient-to-tr from-[#9a3412] to-zinc-900 flex flex-col justify-between p-6 overflow-hidden text-white" id="ig-phone-carousel">
            
            {/* Top Tag */}
            <div className="flex justify-between items-center" id="ig-carousel-top-tag">
              <span className="text-[8px] uppercase tracking-widest font-semibold bg-white/20 px-2 py-0.5 rounded-full">🎓 好老闆領導學</span>
              <span className="text-[8px] opacity-75 font-mono">{activeSlide} / {carouselSlides.length}</span>
            </div>

            {/* Central Text Card */}
            <div className="my-auto flex flex-col gap-2.5 text-center px-1" id="ig-carousel-central-card">
              <h4 className="text-lg font-extrabold tracking-tight leading-relaxed text-yellow-100">
                {carouselSlides[activeSlide - 1]?.title || "優質管理心法圖卡"}
              </h4>
              <p className="text-[10px] opacity-90 leading-relaxed text-zinc-200 whitespace-pre-line px-1">
                {carouselSlides[activeSlide - 1]?.detail || "點擊右下角小鍵頭，滑動查看下一個大綱規劃！"}
              </p>
            </div>

            {/* Bottom Cta */}
            <div className="flex justify-between items-center text-[7px]" id="ig-carousel-bottom">
              <span className="opacity-60 text-zinc-450 text-[7px]">© 閱讀說明文取得完整資源</span>
              <span className="bg-amber-500 text-zinc-900 font-bold px-2 py-0.5 rounded">SWIPE ▶</span>
            </div>

            {/* Arrow keys inside phone preview */}
            {activeSlide > 1 && (
              <button
                onClick={() => setActiveSlide(prev => Math.max(1, prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/45 text-white hover:bg-black/60 cursor-pointer"
                id="ig-carousel-prev"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {activeSlide < carouselSlides.length && (
              <button
                onClick={() => setActiveSlide(prev => Math.min(carouselSlides.length, prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/45 text-white hover:bg-black/60 cursor-pointer"
                id="ig-carousel-next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Social Feedback Bar */}
          <div className="flex justify-between items-center px-3 py-2 bg-white" id="ig-phone-actions-bar">
            <div className="flex gap-3 text-zinc-700">
              <Heart className="w-4.5 h-4.5 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-4.5 h-4.5 hover:text-blue-500 cursor-pointer transition-colors" />
              <Navigation className="w-4.5 h-4.5 hover:text-slate-900 cursor-pointer transition-colors" />
            </div>
            {/* Dots */}
            <div className="flex gap-1">
              {carouselSlides.map((s, idx) => (
                <div
                  key={s.number}
                  className={`w-1.5 h-1.5 rounded-full transition ${activeSlide === idx + 1 ? "bg-amber-500 scale-125" : "bg-zinc-200"}`}
                />
              ))}
            </div>
          </div>

          {/* Social Comment feed */}
          <div className="px-3 pb-4 bg-white text-[10px] text-zinc-800 leading-normal border-t border-zinc-50 pt-2 h-[120px] overflow-y-auto" id="ig-comments-display">
            <p className="font-bold mb-1">
              goodboss_official <span className="font-normal text-zinc-700">對這篇點選紅心表示喜愛</span>
            </p>
            {editorContent ? (
              <p className="whitespace-pre-line text-zinc-650 mt-1 leading-relaxed text-[10.5px] font-sans">{editorContent}</p>
            ) : (
              <p className="text-zinc-400 italic mt-1 text-[10.5px]">未撰寫 IG 貼文內文說明，此區會展示您在左側設定的文字資訊與 hashtags...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
