import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// المفتاح مخفي ويأخذ من Environment Variable
const AI_API_KEY = process.env.AI_API_KEY;

// فلترة Minecraft فقط
function isMinecraftRelated(text) {
  return /minecraft|mod|mods|forge|fabric|redstone|creeper|ender/i.test(text);
}

app.post("/ai", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "✍️ اكتب سؤالك عن Minecraft" });
  }

  if (!isMinecraftRelated(message)) {
    return res.json({ reply: "❌ هذا الشات مخصص لماينكرافت فقط." });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "أنت مساعد Minecraft فقط، أجب بدقة عن المودات، الميكانيكيات، والاقتراحات."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ حدث خطأ في السيرفر" });
  }
});

// استخدام المنفذ من Render أو 3000 محليًا
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server Running on port ${PORT}`));