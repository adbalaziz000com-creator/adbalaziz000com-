import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.AI_API_KEY;

app.post("/ai", async (req, res) => {
  const msg = req.body.message;

  if (!msg) {
    return res.json({ reply: "✍️ اكتب سؤالك عن Minecraft" });
  }

  if (!/minecraft|mod|mods|forge|fabric|redstone/i.test(msg)) {
    return res.json({
      reply: "❌ هذا الشات مخصص لماينكرافت فقط."
    });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "أنت مساعد خبير في Minecraft فقط. أجب بدقة وبأسلوب واضح."
            },
            { role: "user", content: msg }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
});

// التعديل هنا: استخدام المنفذ الذي تحدده المنصة تلقائياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
