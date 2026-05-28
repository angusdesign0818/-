/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Platform, 
  PostItem, 
  EmailItem, 
  WebsiteNews, 
  PlatformStats 
} from "./types";
import { 
  initialPosts, 
  initialEmails, 
  initialNews, 
  initialPlatformStats 
} from "./initialData";

// Platform Sub-Views
import LineCommunityView from "./components/platforms/LineCommunityView";
import FbFanpageView from "./components/platforms/FbFanpageView";
import InstagramView from "./components/platforms/InstagramView";
import YoutubeChannelView from "./components/platforms/YoutubeChannelView";
import ThreadsView from "./components/platforms/ThreadsView";
import OfficialWebsiteView from "./components/platforms/OfficialWebsiteView";
import OfficialMailboxView from "./components/platforms/OfficialMailboxView";
import LoginScreen from "./components/LoginScreen";

import { 
  Compass, 
  Layers, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  HelpCircle, 
  FileText,
  LogOut
} from "lucide-react";

export default function App() {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("boss_auth_token"));

  // Global React States
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.LINE_COMMUNITY);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [news, setNews] = useState<WebsiteNews[]>(initialNews);
  const [stats, setStats] = useState<Record<Platform, PlatformStats>>(initialPlatformStats);

  // Quick State Updates handlers
  const handleAddPost = (newPost: Omit<PostItem, "id">) => {
    const post: PostItem = {
      ...newPost,
      id: `${newPost.platform.toLowerCase()}-${Date.now()}`
    };
    setPosts((prev) => [post, ...prev]);

    // Update simulation stats for feel
    if (newPost.status === "PUBLISHED") {
      setStats((prev) => {
        const currentPlatformStats = prev[newPost.platform];
        return {
          ...prev,
          [newPost.platform]: {
            ...currentPlatformStats,
            reach: currentPlatformStats.reach + 100,
            latestGrowth: currentPlatformStats.latestGrowth + 5,
          }
        };
      });
    }
  };

  const handleAddNews = (newNews: Omit<WebsiteNews, "id">) => {
    const freshNews: WebsiteNews = {
      ...newNews,
      id: `news-${Date.now()}`
    };
    setNews((prev) => [freshNews, ...prev]);
    setStats((prev) => {
      const currentStats = prev[Platform.OFFICIAL_WEB];
      return {
        ...prev,
        [Platform.OFFICIAL_WEB]: {
          ...currentStats,
          reach: currentStats.reach + 150,
          latestGrowth: currentStats.latestGrowth + 8,
        }
      };
    });
  };

  const handleToggleNewsActive = (id: string) => {
    setNews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleSendEmailReply = (emailId: string, replyContent: string) => {
    setEmails((prev) =>
      prev.map((mail) => {
        if (mail.id === emailId) {
          return {
            ...mail,
            isUnread: false,
            replies: [
              ...mail.replies,
              {
                id: `reply-${Date.now()}`,
                sender: "USER",
                content: replyContent,
                date: new Date().toISOString().replace("T", " ").substring(0, 16)
              }
            ]
          };
        }
        return mail;
      })
    );
    // Increment answered rates
    setStats((prev) => {
      const currentStats = prev[Platform.OFFICIAL_EMAIL];
      return {
        ...prev,
        [Platform.OFFICIAL_EMAIL]: {
          ...currentStats,
          engagementRate: Math.min(100, currentStats.engagementRate + 2.5)
        }
      };
    });
  };

  const handleMarkEmailRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((mail) =>
        mail.id === emailId ? { ...mail, isUnread: false } : mail
      )
    );
  };

  // Platform list matching user drawing structure
  const platforms = [
    { id: Platform.LINE_COMMUNITY, label: "LINE社群" },
    { id: Platform.FB_FANPAGE, label: "FB粉專" },
    { id: Platform.IG, label: "IG" },
    { id: Platform.YT_CHANNEL, label: "YT頻道" },
    { id: Platform.THREADS, label: "threads" },
    { id: Platform.OFFICIAL_WEB, label: "官網" },
    { id: Platform.OFFICIAL_EMAIL, label: "公司官方信箱" },
  ];

  // Helper title for active display frame
  const getPlatformLabel = (id: Platform) => {
    return platforms.find(p => p.id === id)?.label || "社群平台";
  };

  // Render correct sub-viewport inside Display container
  const renderViewport = () => {
    switch (activePlatform) {
      case Platform.LINE_COMMUNITY:
        return (
          <LineCommunityView 
            posts={posts} 
            stats={stats[Platform.LINE_COMMUNITY]} 
            onAddPost={handleAddPost} 
          />
        );
      case Platform.FB_FANPAGE:
        return (
          <FbFanpageView 
            posts={posts} 
            stats={stats[Platform.FB_FANPAGE]} 
            onAddPost={handleAddPost} 
          />
        );
      case Platform.IG:
        return (
          <InstagramView 
            posts={posts} 
            stats={stats[Platform.IG]} 
            onAddPost={handleAddPost} 
          />
        );
      case Platform.YT_CHANNEL:
        return (
          <YoutubeChannelView 
            posts={posts} 
            stats={stats[Platform.YT_CHANNEL]} 
            onAddPost={handleAddPost} 
          />
        );
      case Platform.THREADS:
        return (
          <ThreadsView 
            posts={posts} 
            stats={stats[Platform.THREADS]} 
            onAddPost={handleAddPost} 
          />
        );
      case Platform.OFFICIAL_WEB:
        return (
          <OfficialWebsiteView 
            newsList={news} 
            stats={stats[Platform.OFFICIAL_WEB]} 
            onAddNews={handleAddNews} 
            onToggleActive={handleToggleNewsActive} 
          />
        );
      case Platform.OFFICIAL_EMAIL:
        return (
          <OfficialMailboxView 
            emails={emails} 
            stats={stats[Platform.OFFICIAL_EMAIL]} 
            onSendReply={handleSendEmailReply} 
            onMarkRead={handleMarkEmailRead} 
          />
        );
      default:
        return null;
    }
  };

  if (!token) {
    return <LoginScreen onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans text-neutral-900 p-4 sm:p-6 lg:p-8 select-none leading-relaxed" id="app-root">
      {/* Top Universal Indicator Panel */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200/80 pb-5 mb-6 gap-4" id="app-header">
        <div className="flex items-center gap-3.5" id="app-brand-group">
          <div className="bg-neutral-900 text-amber-400 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider shadow-sm select-none">
            HQ WEB
          </div>
          <div id="app-brand-titles">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 font-sans">「好老闆」社群系統整合管理端</h1>
            <p className="text-xs text-neutral-500 mt-0.5 font-medium">營運總理：旗下 LINE、Facebook、Instagram、YouTube、Threads、官網與信箱雲端控制</p>
          </div>
        </div>

        {/* Global Live Statistics counters */}
        <div className="flex gap-5 flex-wrap bg-white border border-neutral-200/85 rounded-xl p-3.5 shadow-xs" id="global-stats-board">
          <div className="flex items-center gap-2.5" id="global-metric-total">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold leading-none uppercase tracking-wider">全網累計學員</span>
              <span className="text-sm font-semibold text-neutral-800 mt-1 font-mono">
                {(stats[Platform.LINE_COMMUNITY].followers + stats[Platform.FB_FANPAGE].followers + stats[Platform.IG].followers).toLocaleString()} 人
              </span>
            </div>
          </div>
          <div className="h-7 w-[1px] bg-neutral-200 self-center hidden sm:block"></div>
          <div className="flex items-center gap-2.5" id="global-metric-growth">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold leading-none uppercase tracking-wider">本期爆發觸及</span>
              <span className="text-sm font-semibold text-neutral-800 mt-1 font-mono">
                {(stats[Platform.LINE_COMMUNITY].reach + stats[Platform.FB_FANPAGE].reach + stats[Platform.IG].reach).toLocaleString()} 次
              </span>
            </div>
          </div>
          <div className="h-7 w-[1px] bg-neutral-200 self-center hidden sm:block"></div>
          <div className="flex items-center gap-2.5" id="global-metric-tasks">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-bold leading-none uppercase tracking-wider">草稿＆公開檔案</span>
              <span className="text-sm font-semibold text-neutral-800 mt-1 font-mono">{posts.length + news.length} 件</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main split layout container */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in" id="app-main-grid">
        
        {/* Left Sidebar Panel (3 columns, houses crown wood logo and platform actions) */}
        <aside className="xl:col-span-3 flex flex-col items-center md:items-start xl:items-center bg-white border border-neutral-200/80 p-6 shadow-xs rounded-2xl text-center xl:text-center md:text-left gap-6 self-stretch" id="app-sidebar">
          
          {/* Circular Wooden & Glowing crown avatar logo (Exactly matches user mockup image) */}
          <div className="flex flex-col items-center gap-4 select-none" id="sidebar-avatar-logo">
            {/* Glossy wood concentric ring design */}
            <div className="w-26 h-26 rounded-full bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 p-[3px] shadow-md flex items-center justify-center relative overflow-hidden ring-4 ring-amber-600/15 transform hover:scale-105 transition-all" id="wood-coin-badge">
              {/* Inner concentric copper bands */}
              <div className="absolute inset-[3px] rounded-full border border-amber-600/50 opacity-45"></div>
              <div className="absolute inset-[6px] rounded-full border border-amber-500/20 opacity-30"></div>
              {/* Wood gloss specular reflection */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
              {/* Central crown graphics */}
              <div className="relative flex flex-col items-center justify-center text-center">
                <span className="text-4xl filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.6)]">👑</span>
                <span className="text-white text-[11px] font-bold tracking-widest mt-1.5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] font-sans">「好老闆」</span>
              </div>
            </div>
            
            <div className="text-center md:text-left xl:text-center shrink-0">
              <h3 className="font-bold text-neutral-900 text-sm tracking-wide">「好老闆」品牌主理端</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1 font-medium">選定平台即時進入管理框</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-neutral-100"></div>

          {/* Platforms lists stacked vertically matching draft layout */}
          <div className="w-full flex flex-col gap-2.5" id="sidebar-platform-buttons">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center md:text-left xl:text-center block mb-2">
              平台快速切換
            </span>
            {platforms.map((plat) => {
              const isActive = activePlatform === plat.id;
              return (
                <button
                  key={plat.id}
                  onClick={() => setActivePlatform(plat.id)}
                  className={`w-full font-sans font-bold text-center text-xs py-2.5 px-4 tracking-wide rounded-xl select-none cursor-pointer duration-200 transition-all ${
                    isActive 
                      ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10 scale-[1.015]" 
                      : "bg-neutral-50 hover:bg-neutral-100/90 text-neutral-600 border border-neutral-100 hover:border-neutral-200/60 hover:text-neutral-900"
                  }`}
                  id={`btn-${plat.id.toLowerCase()}`}
                >
                  {plat.label}
                </button>
              );
            })}
          </div>

          {/* Secure Logout Action */}
          <button
            onClick={() => {
              localStorage.removeItem("boss_auth_token");
              setToken(null);
            }}
            className="w-full font-sans font-bold text-center text-xs py-2.5 px-4 tracking-wide rounded-xl select-none cursor-pointer duration-200 transition-all text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
            id="logout-button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>安全登出系統</span>
          </button>

          <div className="w-full h-[1px] bg-neutral-100 mt-auto hidden xl:block"></div>

          {/* Quick instructions indicator */}
          <div className="hidden xl:flex flex-col gap-2.5 bg-neutral-50/50 p-4 border border-neutral-200/50 rounded-xl text-left text-[11px] text-neutral-500 leading-normal" id="sidebar-tips">
            <h5 className="font-bold text-neutral-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              如何使用 AI 自動撰寫？
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 pl-0.5 text-neutral-500 font-medium">
              <li>點擊左欄任一社群平台</li>
              <li>點選期望的文案主題範本</li>
              <li>點選「讓 AI 自動撰文」生成</li>
              <li>右手邊模擬器將「即時同步預覽」！</li>
            </ol>
          </div>
        </aside>

        {/* Right Execution & Display screen frame */}
        <main className="xl:col-span-9 flex flex-col bg-white border border-neutral-200/80 shadow-xs rounded-2xl h-full min-h-[600px] overflow-hidden" id="app-display-frame">
          
          {/* Heavy frame header mimicking premium dashboards */}
          <div className="bg-white border-b border-neutral-100 py-4 px-6 flex justify-between items-center" id="display-frame-header">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-xs select-none">🖥️ 作業監控框：</span>
              <span className="text-neutral-900 font-bold text-sm font-sans tracking-wide">
                【{getPlatformLabel(activePlatform)}】執行與模擬面板
              </span>
            </div>
            <div className="flex items-center gap-1.5" id="display-frame-status">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-600 font-bold font-mono tracking-wider">ONLINE LIVE</span>
            </div>
          </div>

          {/* Actual Active Workspace component viewport content */}
          <div className="flex-1 p-6 bg-neutral-50/10" id="display-frame-viewport">
            {renderViewport()}
          </div>
        </main>
      </div>

      {/* Footer credits and information */}
      <footer className="border-t border-neutral-200/60 pt-5 mt-10 text-center text-xs text-neutral-400 flex flex-col md:flex-row justify-between items-center gap-3" id="app-footer">
        <p className="font-medium">好老闆（領袖思維與正向組織管理）・全平台雲端一站式控制中心 © 2026</p>
        <div className="flex gap-4 font-bold text-[10.5px] text-neutral-450" id="footer-links">
          <span className="hover:text-neutral-700 cursor-pointer">隱私政策</span>
          <span>·</span>
          <span className="hover:text-neutral-700 cursor-pointer">使用者協定</span>
          <span>·</span>
          <span className="hover:text-neutral-700 cursor-pointer">技術支援</span>
        </div>
      </footer>
    </div>
  );
}
