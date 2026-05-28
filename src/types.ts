/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Platform {
  LINE_COMMUNITY = "LINE_COMMUNITY",
  FB_FANPAGE = "FB_FANPAGE",
  IG = "IG",
  YT_CHANNEL = "YT_CHANNEL",
  THREADS = "THREADS",
  OFFICIAL_WEB = "OFFICIAL_WEB",
  OFFICIAL_EMAIL = "OFFICIAL_EMAIL",
}

export interface PostItem {
  id: string;
  platform: Platform;
  title?: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  publishDate: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  image?: string;
}

export interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  date: string;
  isUnread: boolean;
  replies: {
    id: string;
    sender: "USER" | "SYSTEM";
    content: string;
    date: string;
  }[];
}

export interface WebsiteNews {
  id: string;
  title: string;
  content: string;
  category: "最新消息" | "產品動態" | "特別活動" | "人才招募";
  date: string;
  isActive: boolean;
  author: string;
}

export interface PlatformStats {
  followers: number;
  reach: number;
  engagementRate: number;
  latestGrowth: number;
}
