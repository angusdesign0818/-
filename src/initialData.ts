import { Platform, PostItem, EmailItem, WebsiteNews, PlatformStats } from "./types";

export const initialPosts: PostItem[] = [
  {
    id: "line-1",
    platform: Platform.LINE_COMMUNITY,
    content: "📢 各位「好老闆」社群家人早安！本週的主題是『員工彈性工時的心理學』。我們發現在實施彈性上下班後，團隊的整體滿意度提升了 23%，且核心業務進度不退反進。大家目前在公司內有嘗試過彈性工時嗎？歡迎分享你們遇到的挑戰或心得！👇",
    status: "PUBLISHED",
    publishDate: "2026-05-26 09:30",
    likes: 88,
    comments: 24,
  },
  {
    id: "line-2",
    platform: Platform.LINE_COMMUNITY,
    content: "💡【老闆小幫手：感謝語範本】老闆不經意的一句讚美，能點燃同仁一整週的熱情。分享這段超好用萬能感謝詞：『很感謝這次專案有你的細心協助，你提的 A 觀點非常棒，讓我們避開了重要風險。真的辛苦了，有你在真好！』大家快儲存起來給同仁驚喜吧！✨",
    status: "DRAFT",
    publishDate: "2026-05-27 15:00",
  },
  {
    id: "fb-1",
    platform: Platform.FB_FANPAGE,
    title: "當一個懂傾聽的「好老闆」",
    content: "【別用權力管人，要用「當責」帶心】❤️\n\n你曾遇過老闆開會時問「大家有沒有意見？」，卻在隔秒自己把問題答完嗎？\n\n一個好的企業領袖，比起表達自己的卓越，更注重激勵團隊的潛力。傾聽同仁聲音的核心，是願意給予犯錯空間。讓同仁知道：只要出發點是為了公司好，嘗試新觀點就算失敗了，老闆也會為你擔起責任。\n\n當我們願意退一步，團隊才能大步向前！\n\n#好老闆心法 #當責領導 #職場心理學 #團隊管理",
    status: "PUBLISHED",
    publishDate: "2026-05-25 10:00",
    likes: 342,
    comments: 48,
    shares: 56,
  },
  {
    id: "fb-2",
    platform: Platform.FB_FANPAGE,
    title: "好老闆推薦書單 03",
    content: "【好老闆推薦書單：本週必讀《高當責團隊》】📚\n\n你常覺得指派任務後，結果總是跟預期有落差嗎？\n這本書深入探討了如何建立「目標一致、流程透明、主動當責」的團隊。\n\n精華重點整理：\n1. 別只交代「做什麼」，要交代「做成的目標是什麼」。\n2. 授權不是不管，而是共同訂立中途查核點。\n\n詳細心得我們整理在官網最新文章，點擊留言連結閱讀！🔗",
    status: "DRAFT",
    publishDate: "2026-05-28 09:00",
  },
  {
    id: "ig-1",
    platform: Platform.IG,
    content: "真正的領導，不是站在指點人的高處，而是俯身為團隊搭建舞台。🌱\n\n今天週一，跟夥伴們說聲：辛苦了，有你們在一起走，路上都變好玩了！🏃‍♂️💨\n\n#好老闆 #辦公室日常 #週一加油 #職場語錄 #領導力 #職場生活",
    status: "PUBLISHED",
    publishDate: "2026-05-24 08:30",
    likes: 512,
    comments: 18,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "ig-2",
    platform: Platform.IG,
    content: "☕️【週五放鬆日常】一杯香醇的拿鐵，加上同仁們發自內心的笑容，這就是老闆最大的收穫！\n下班前，宣布大家今天提早半小時下班！大家週末愉快！🎉✨\n\n#好老闆 #幸福企業 #提早下班 #週五下班快閃 #咖啡日常",
    status: "DRAFT",
    publishDate: "2026-05-29 16:30",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "yt-1",
    platform: Platform.YT_CHANNEL,
    title: "【領導力】如何跟00後員工溝通？打破世代隔閡的 3 個好老闆說話術！",
    content: "大家常說現代年輕人不好帶？其實是我們還沒找到對的溝通『頻道』！本集影片總結「好老闆社群」過往 1,000+ 個企業主管的成功經驗，提煉出與新生代夥伴共事的三大說話術。\n\n💡 影片重點精華：\n00:00 世代溝通難題？\n01:30 祕笈一：用「理由」代替「命令」\n04:15 祕笈二：肯定「局部貢獻」的實質反饋\n07:50 祕笈三：給予自主規劃，而不是管死過程\n\n看完影片別忘了訂閱、按讚、分享，並留言告訴我：你最怕遇到哪種世代對立問題？",
    status: "PUBLISHED",
    publishDate: "2026-05-20 18:00",
    likes: 1250,
    comments: 114,
    views: 18450,
  },
  {
    id: "threads-1",
    platform: Platform.THREADS,
    content: "今天面試了一位履歷非常精采的年輕合夥候選人。\n問到他的期望合作方式時，他說了句很打動我的話：\n「我不求老闆做最聰明的那個，我希望老闆是那個在大家迷茫時，依舊穩穩站在那裡引路的人。」\n\n回想這幾年，帶領公司衝波折時，我也常懷疑自己。但這句話點醒我，對團隊而言，老闆最大的價值，是「安定感」。\n\n你同意嗎？ #求職面試 #好老闆思維",
    status: "PUBLISHED",
    publishDate: "2026-05-26 21:00",
    likes: 245,
    comments: 32,
  },
  {
    id: "threads-2",
    platform: Platform.THREADS,
    content: "主管的價值不是「檢查作業」，而是「清理路障」。\n當員工卡關時，好老闆想的是：我能提供什麼資源幫他破關？\n爛老闆想的是：為什麼到了這個時間你還在卡？\n\n這個差別決定了團隊能走多遠。☕️",
    status: "DRAFT",
    publishDate: "2026-05-27 10:00",
  }
];

export const initialEmails: EmailItem[] = [
  {
    id: "mail-1",
    senderName: "陳禹希 (校園招募負責人)",
    senderEmail: "yu-xi.chen@ntu.edu.tw",
    subject: "【合作邀約】邀請「好老闆」與台灣大學青年創業社舉辦經理人講座",
    body: "好老闆營運團隊您好：\n\n我是台大青年創業社的輔導長禹希。我們一直非常關注貴品牌在線上分享的老闆心法與領導思維，也深受啟發。\n\n我們預計在今年 10 月舉辦「青年領袖沙龍」，旨在縮短大學生與實際職場管理的資訊鴻溝，邀請各大品牌指標性創辦人與會。希望有幸能邀請您來分享「新型態組織的信任管理」這個主題（時長約 60 分鐘，含與青年創投家 QA 對話）。\n\n我們願意提供全額講師車馬與演講酬勞，活動地點在台大博雅教學館。\n期待您的正面回音！祝 順心。\n\n台大青年創業社 禹希",
    date: "2026-05-27 08:30",
    isUnread: true,
    replies: [],
  },
  {
    id: "mail-2",
    senderName: "林宛晴 (VIP 客戶關係總監)",
    senderEmail: "sunny.lin@elitecorp.com.tw",
    subject: "【反饋】關於近期諮詢顧問服務速度的改善建議",
    body: "尊敬的好老闆創辦人：\n\n您好，我是 EliteCorp 的宛晴。我們公司已連續兩年訂閱您的「頂尖中階管理顧問套票」。對於您的講師群與諮詢顧問內容在引導我們新升任主管的專業性上，本司一直給予極高評價。\n\n然而，近期由於我們組織擴編，預約週度諮詢的回覆等待時間，從原先的當天回覆，拉長到了 2~3 個工作天。這使得我們有些緊急專案的溝通受到了耽擱。\n\n理解好老闆社群近期拓展迅速，但也希望創辦人能協助優化顧問預約的優先通道，或為長期 VIP 客戶提供專屬回覆窗口。感謝您的重視，並期待您的安排。\n\nEliteCorp 宛晴 敬上",
    date: "2026-05-26 14:15",
    isUnread: false,
    replies: [
      {
        id: "r-1",
        sender: "SYSTEM",
        content: "宛晴您好：非常感謝您的信件。已為您記錄並正在與顧問主管協調。我們會盡快派專家與您確認優化通道事宜。",
        date: "2026-05-26 15:30",
      }
    ],
  },
  {
    id: "mail-3",
    senderName: "郭智偉 (新創孵化中心經理)",
    senderEmail: "jason.kuo@startup-hub.org",
    subject: "【跨界聯名】好老闆 podcast 與新創新星對談提案",
    body: "「好老闆」團隊主管你好：\n\n我是台北育成孵化器 (Startup Hub) 的智偉。我們長期協助硬體新創及環保永續（ESG）青年企業。我們得知好老闆官方 Podcast『好老闆來了！』正在規劃第三季的特別連載，主題是「綠色浪潮下的幸福企業帶心課」。\n\n我們中心目前的孵化企業中，有 2-3 家正在開拓國際市場（且員工平均離職率低於 2%），其企業領袖非常有魅力，也符合「好老闆」形象。非常希望能與貴節目洽談聯名訪談，或者為節目提供場地、行銷資源互換等合作。\n\n不知下週三下午是否方便安排一個 15 分鐘的線上短會，讓我們雙方經理人進行交流？謝謝！\n\n郭智偉 敬上",
    date: "2026-05-25 11:20",
    isUnread: false,
    replies: [],
  }
];

export const initialNews: WebsiteNews[] = [
  {
    id: "news-1",
    title: "【重要公告】「好老闆學苑」全新官網2.0上線！提供中高階主管在線學習最佳體驗",
    content: "為了提供所有熱愛學習管理智慧、落實當責精神的企業家更舒適的互動體驗，好老闆學苑的「雲端學習平台」經過耗時半年的籌組，於今天全新 2.0 隆重上線！現在登入會員，立刻可以享有最新一季『混合辦公下，團隊高效自我當責』課程的搶先試聽！",
    category: "最新消息",
    date: "2026-05-25",
    isActive: true,
    author: "好老闆營運團隊",
  },
  {
    id: "news-2",
    title: "【社會關懷】好老闆攜手勵馨基金會，今年捐助 5% 講師所得關懷青少年職場技能研習",
    content: "好老闆在致力於傳遞溫暖組織文化的同時，也從不停下社會關懷的腳步。我們宣布今年下半年度的大型論壇「正向領導大講堂」，每售出一張門票，將直接提撥 5% 所得投入青少年職場實習技能培育。期望為台灣的下一代，塑造更良善的未來職場環境！",
    category: "特別活動",
    date: "2026-05-20",
    isActive: true,
    author: "創辦人手札",
  },
  {
    id: "news-3",
    title: "【擴大招募】好老闆學苑擴充中！我們正在尋找熱愛教育訓練的「全職顧問專案經理」",
    content: "如果你跟我們一樣，相信透過教育訓練、顧問諮詢能幫助台灣所有企業更關懷人、更高效能，誠摯邀請你加入我們！目前開放招募：專案經理、行銷企劃、Podcast 製作助理，享彈性上下班與年終高額考核獎金！",
    category: "人才招募",
    date: "2026-05-18",
    isActive: true,
    author: "人資部",
  }
];

export const initialPlatformStats: Record<Platform, PlatformStats> = {
  [Platform.LINE_COMMUNITY]: {
    followers: 12500,
    reach: 42000,
    engagementRate: 15.2,
    latestGrowth: 320,
  },
  [Platform.FB_FANPAGE]: {
    followers: 48600,
    reach: 125000,
    engagementRate: 8.4,
    latestGrowth: 1100,
  },
  [Platform.IG]: {
    followers: 24700,
    reach: 64000,
    engagementRate: 12.1,
    latestGrowth: 850,
  },
  [Platform.YT_CHANNEL]: {
    followers: 68100,
    reach: 310000,
    engagementRate: 6.8,
    latestGrowth: 1500,
  },
  [Platform.THREADS]: {
    followers: 8900,
    reach: 22000,
    engagementRate: 18.5,
    latestGrowth: 450,
  },
  [Platform.OFFICIAL_WEB]: {
    followers: 35000, // Monthly Unique Visitors
    reach: 98000, // Page Views
    engagementRate: 24.3, // Conversion Rate/Active study time
    latestGrowth: 2300,
  },
  [Platform.OFFICIAL_EMAIL]: {
    followers: 120, // Received emails / Day
    reach: 98, // Open rate % for sent newsletters
    engagementRate: 92.5, // Responded in 24 hours %
    latestGrowth: 12,
  },
};
