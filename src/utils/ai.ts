/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AiResponse {
  success: boolean;
  text: string;
  error?: string;
}

export async function generateContent(
  prompt: string,
  systemInstruction?: string,
  temperature?: number
): Promise<AiResponse> {
  try {
    const token = localStorage.getItem("boss_auth_token") || "";
    const response = await fetch("/api/gemini/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error("生成 AI 文案出錯:", err);
    return {
      success: false,
      text: "",
      error: err.message || "無法連線至伺服器，請稍後再試。",
    };
  }
}
