import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Lazy-loaded GoogleGenAI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy_key_to_prevent_fatal_crash",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
const getAdminCredentials = () => {
  const username = process.env.ADMIN_USERNAME || "boss";
  const password = process.env.ADMIN_PASSWORD || "boss1234";
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return { username, password, token };
};

// Login API Endpoint
app.post("/api/login", (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const creds = getAdminCredentials();
    if (username === creds.username && password === creds.password) {
      return res.json({
        success: true,
        token: creds.token,
        message: "登入成功！歡迎回到好老闆整合系統。"
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "帳號或密碼不正確，請確認後再試。"
      });
    }
  } catch (err: any) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, error: "伺服器內部發生錯誤。" });
  }
});

app.post("/api/gemini/generate", async (req: any, res: any) => {
  try {
    const { prompt, systemInstruction, temperature } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Verify authentication token from client
    const authHeader = req.headers.authorization;
    const creds = getAdminCredentials();
    const expectedAuth = `Bearer ${creds.token}`;
    if (!authHeader || authHeader !== expectedAuth) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        text: "【安全警示：權限不足】請先登入管理系統，才能安全存取 AI 產生模組。"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.json({
        success: false,
        error: "NO_API_KEY",
        text: "【⚠️ 貼心提示：尚未設定 API 金鑰】\n\n因為此系統在伺服器端執行 AI 的文案撰寫，請在畫面右上角的「Settings (設定齒輪)」->「Secrets」中，新增 `GEMINI_API_KEY` 並填入您的金鑰，即可享受流暢無限制的 AI 生成功能！\n\n（目前已載入我們專為您準備的高擬真範例文案，您可以先行點選查看！設定好金鑰後，更可以讓 AI 幫您量身打造無限文案喔！）"
      });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a professional social media manager and assistant.",
        temperature: temperature !== undefined ? temperature : 0.7,
      },
    });

    return res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "AI 產生發生未知錯誤，請檢視金鑰或稍後再試。"
    });
  }
});

// Serve Frontend (Vite / Production)
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from dist.");
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Vite server initialization failed:", err);
});
