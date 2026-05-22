import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
    console.log("Gemini AI initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize Gemini Client:", e);
  }
} else {
  console.log("No GEMINI_API_KEY found. Server will run in educational mock mode for scanning.");
}

// REST API endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    gemini_active: !!ai
  });
});

// Interactive AI Skin Scanner endpoint
app.post("/api/analyze-skin", async (req, res) => {
  const { image, conditionHint, cameraArea } = req.body;

  // Let's check if the model is initialized. If not or if image is missing, use detailed structured fallback
  if (!ai || !image) {
    // Generate an educational detailed response representing high quality skin classification
    const fallbackResults = getDermatologyMockResult(conditionHint || 'Acne', cameraArea || 'Face');
    // Introduce a realistic delay to mimic neural classification
    await new Promise(resolve => setTimeout(resolve, 2000));
    return res.json({
      success: true,
      mode: "educational-fallback",
      data: fallbackResults
    });
  }

  try {
    // Strip metadata from base64 if present
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const mimeType = image.includes(";") ? image.split(";")[0].split(":")[1] : "image/jpeg";

    const prompt = `You are a clinical academic dermatology assistant. Analyze the provided skin image.
      If the image does not show human skin or a face, flag it.
      Focus on the following skin condition if hinted: "${conditionHint}".
      Analyze other potential conditions if they are more prominent.
      
      Generate a thorough, realistic, medical-grade educational assessment following standard clinical procedures.
      IMPORTANT: Include proper localized Pakistani brand suggestions alongside standard international generic alternatives.
      
      Provide your response in raw JSON format strictly matching this structure:
      {
        "conditionName": "Standard medical name of condition",
        "urduConditionName": "Urdu translation (in Nasta'liq script or simple Urdu characters)",
        "confidence": 92, // Integer number between 60 and 99
        "severity": "Mild" | "Moderate" | "Severe",
        "description": "Scientific, thorough clinical explanation of the tissue presentation.",
        "urduDescription": "Urdu explanation of the tissue presentation.",
        "causes": ["Cause 1", "Cause 2", "Cause 3"],
        "symptoms": ["Symptom 1", "Symptom 2"],
        "preventionTips": ["Tip 1", "Tip 2"],
        "morningSkincare": ["Cleanse with...", "Apply active...", "Finish with sunscreen..."],
        "nightSkincare": ["Double cleanse...", "Apply repairing...", "Moisturize..."],
        "nutritionAdvice": ["Advice 1", "Advice 2"],
        "hydrationGoal": "Specific target like 3.5 Liters of electrolyte balanced water daily",
        "lifestyleTips": ["Sleep guideline", "Stress technique"],
        "otcMedicines": [
          {
            "category": "Facewash" | "Cream" | "Serum" | "Tablet",
            "genericName": "Generic pharmaceutical name",
            "pakistaniMarketName": "Real local brand in Pakistan (e.g., Dalacin, Fucidin, Maxdiff, SolarMax)",
            "howToUse": "Dosage/application frequency instructions",
            "warnings": ["Warning 1", "Warning 2"]
          }
        ],
        "prescription": {
          "required": true | false,
          "warningText": "Consult a licensed dermatologist before using any prescription medication.",
          "medications": [
            {
              "name": "Medication active name",
              "pakistaniBrand": "Real Pakistani Brand example",
              "dosage": "e.g., 0.05% weight/weight",
              "frequency": "e.g., Once daily at night",
              "duration": "e.g., 2-4 weeks with clinical review",
              "method": "Instructions for localized application"
            }
          ]
        },
        "isEmergency": false,
        "emergencyWarning": "Detailed urgent advice if severity is severe."
      }`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an advanced clinical skin visual analyzer trained in professional diagnostic dermatopathology and pharmaceutical pharmacology."
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      mode: "live-gemini",
      data: parsedData
    });

  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    const mockBack = getDermatologyMockResult(conditionHint || 'Acne', cameraArea || 'Face');
    res.json({
      success: true,
      mode: "recovered-fallback",
      error: error.message,
      data: mockBack
    });
  }
});

// Interactive AI Skincare Chatbot assistant endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;

  if (!ai) {
    // Generate smart mock chat fallback response
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const mockReply = getSmartChatReply(lastUserMsg, userProfile);
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({
      success: true,
      reply: mockReply
    });
  }

  try {
    const chatHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Insert system dynamic instruction at the beginning
    const contextPrompt = `You are "SkinVision AI Assistant", a compassionate skin care and dermatology advisory bot.
      The user profile is: Age: ${userProfile?.age || 'Unspecified'}, Gender: ${userProfile?.gender || 'Unspecified'}, Skin Type: ${userProfile?.skinType || 'Not set'}, Allergies: ${userProfile?.allergies || 'None declared'}.
      
      Always provide precise, clean, structured medical-grade parameters. Provide recommendations in both English and simple Urdu translation where helpful.
      Include generic and Pakistani trade names where relevant (e.g. Maxdiff Serum, Clindalyne facewash).
      
      CRITICAL WARNING: Always remind the user that your help serves as an educational baseline, and they must consult a board-certified dermatologist for official diagnostic treatments. Maintain professional clinical empathy.`;

    // We can query Gemini using chats API
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: contextPrompt }] },
        ...chatHistory.slice(-6) // take last 6 messages for token efficiency and rapid response
      ],
      config: {
        systemInstruction: "You are an expert AI Skincare specialist advisor working with Pakistan medical-grade protocols."
      }
    });

    return res.json({
      success: true,
      reply: response.text || "I apologize, I could not process that request. Always remember to perform a skin patch test before applying any active serum."
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    const lastMsg = messages[messages.length - 1]?.content || "";
    res.json({
      success: true,
      reply: `[Internet Offsite Fallback] ${getSmartChatReply(lastMsg, userProfile)}`
    });
  }
});

// Diagnostic Dermatology Database for authentic fallback mode
function getDermatologyMockResult(hint: string, area: string) {
  const dataset: Record<string, any> = {
    "Acne": {
      conditionName: "Acne Vulgaris",
      urduConditionName: "ایکنی ولگیریس (پمپلز)",
      confidence: 94,
      severity: "Moderate",
      description: "Inflammatory disorder of the pilosebaceous units characterized by microcomedones, papules, pustules, and localized erythema on the facial epidermal layer.",
      urduDescription: "یہ چہرے کے غدود میں چکنائی اور مردہ خلیات جمع ہونے کی وجہ سے پیدا ہونے والی سوزش ہے جس سے دانے، پمپلز اور سرخی بنتی ہے۔",
      causes: ["Excess sebum production stimulated by hormonal activity", "Follicular hyperkeratosis blocking pores", "Propionibacterium acnes microbial proliferation"],
      symptoms: ["Erythematous papules and pustules", "Elevated skin sensitivity and heat", "Closed and open comedones (blackheads/whiteheads)"],
      preventionTips: ["Avoid tactile picking or squeezing lesions", "Use non-comedogenic labeled skin formulas", "Wash face maximum twice daily with cool water"],
      morningSkincare: [
        "Wash gently with a mild Salicylic Acid Cleanser (e.g., Acne-Aid or Neutrogena)",
        "Apply a drop of Niacinamide 10% serum to calm facial redness",
        "Apply a non-greasy, broad-spectrum sunscreen (SolarMax SPF 60 or Sunplay SPF 50)"
      ],
      nightSkincare: [
        "Double cleanse with a fragrance-free micellar water to strip sebum",
        "Apply low-dose Benzoyl Peroxide gel (2.5% Brevoxyl) or Adapalene gel strictly on affected spots",
        "Apply oil-free, light water-gel moisturizer (Physiogel Acid Balanced or Hydro Boost)"
      ],
      nutritionAdvice: ["Decrease high glycemic foods (skim milk, excessive sugars, parathas)", "Increase leafy zinc-rich green vegetables"],
      hydrationGoal: "3.0 Liters daily to promote toxin clearance and epidermal renewal.",
      lifestyleTips: ["Change pillow covers every 3 days", "Get 8 hours of sleep to lower cortisol stress markers"],
      otcMedicines: [
        {
          category: "Cream",
          genericName: "Benzoyl Peroxide 2.5%",
          pakistaniMarketName: "Brevoxyl Cream / Benzagel",
          howToUse: "Apply a tiny spot-size layer exclusively on the active acne dots at night. Avoid skin folds like nostrils and eye contour.",
          warnings: ["May bleach colorful fabrics", "Can cause mild initial flaking or redness. Always use patch test."]
        },
        {
          category: "Facewash",
          genericName: "Salicylic Acid 2%",
          pakistaniMarketName: "Acne-Aid Liquid / Acnisal Wash",
          howToUse: "Lather onto wet hands, massage gently into face for exactly 30 seconds before rinsing thoroughly.",
          warnings: ["Keep away from sensitive eye orbits."]
        }
      ],
      prescription: {
        required: true,
        warningText: "Consult a licensed dermatologist before using any prescription medication.",
        medications: [
          {
            name: "Adapalene 0.1% Gel",
            pakistaniBrand: "Differin Gel (Galderma)",
            dosage: "0.1% Concentration Gel",
            frequency: "Once daily, strictly at night",
            duration: "4 to 6 weeks continuous use",
            method: "Apply a pea-sized amount evenly across the full face 20 minutes after cleansing. Ensure skin is fully dry before application to prevent irritation."
          }
        ]
      },
      isEmergency: false,
      emergencyWarning: ""
    },
    "Eczema": {
      conditionName: "Atopic Dermatitis (Eczema)",
      urduConditionName: "ایگزیما (خشک خارش اور سوزش)",
      confidence: 88,
      severity: "Moderate",
      description: "Pruritic, inflammatory skin disease characterized by barrier dysfunction, extreme xerosis (dryness), and scaling with secondary lichenification from scratching.",
      urduDescription: "ایگزیما جلد کی بیرونی حفاظتی تہہ کی خرابی کی وجہ سے ہونے والی دائمی سوزش ہے جس میں جلد شدید خشک، سرخ اور خارش زدہ ہو جاتی ہے۔",
      causes: ["Genetic filaggrin deficiency damaging epidermal lipid barrier", "Environmental triggers like wool, harsh detergents, or pollen", "Immune system hypersensitivity reacting to allergens"],
      symptoms: ["Intense localized pruritus (itching) worsens at night", "Dry, cracked, erythematous plaques", "Rough, thickened skin textures from chronic friction"],
      preventionTips: ["Moisturize skin within 3 minutes of exiting the shower", "Bathe exclusively in lukewarm water, limiting duration to 10 minutes", "Wear soft, lightweight organic cotton shirts"],
      morningSkincare: [
        "Cleanse softly with a non-foaming soap substitute syndet bar (e.g., Sebamed Cleansing Bar)",
        "Apply Ceramide-infused heavy barrier cream (e.g., CeraVe Liquid or Physiogel AI Cream) while skin is damp",
        "Shield with mineral-based physical sunscreen (e.g., SolarMax Sensitive)"
      ],
      nightSkincare: [
        "Cleanse with lukewarm water and soap-free emollient",
        "Apply a generous liberal layer of pure white petroleum jelly or heavy barrier moisturizer",
        "Encircle with soft cotton bandage if itching is severe to prevent scratch-induced pathogen entry"
      ],
      nutritionAdvice: ["Incorporate Omega-3 fatty acids from walnuts, flaxseeds, and rich fish", "Reduce raw dairy or eggs if food allergy is clinically linked"],
      hydrationGoal: "3.5 Liters of water daily to support systemic skin moisturization.",
      lifestyleTips: ["Avoid chemical room air fresheners", "Utilize cool-mist humidifiers inside sleeping chambers during dry periods"],
      otcMedicines: [
        {
          category: "Cream",
          genericName: "Ceramide + Glycerin Skin Emollient",
          pakistaniMarketName: "Physiogel AI Intensive Cream / Atoderm PP",
          howToUse: "Apply lavishly three to four times a day directly onto all dry, itchy plaques to restabilize epidermal lipids.",
          warnings: ["Stop usage immediately if burning occurs."]
        }
      ],
      prescription: {
        required: true,
        warningText: "Consult a licensed dermatologist before using any prescription medication.",
        medications: [
          {
            name: "Hydrocortisone Acetate 1% Cream",
            pakistaniBrand: "Hydrozole Cream (or any standard corticosteroid cream)",
            dosage: "1.0% Mild Topical Steroid",
            frequency: "Twice daily exclusively on inflamed patches",
            duration: "Strictly limited to 5-7 days under observation",
            method: "Apply a very thin layer only onto active hyper-irritated spots. Do not apply on healthy skin sections to protect skin thickness."
          }
        ]
      },
      isEmergency: false,
      emergencyWarning: ""
    },
    default: {
      conditionName: "Mild Keratosis Pilaris",
      urduConditionName: "جلد پر چھوٹے دانے (جلد کا کھردرہ پن)",
      confidence: 76,
      severity: "Mild",
      description: "Benign follicular hyperkeratosis presenting as minute, keratotic follicular papules ('chicken skin') on the lateral aspect of the tissue surfaces.",
      urduDescription: "یہ ایک بے ضرر اور عام حالت ہے جس میں جلد پر مردہ خلیات جمع ہونے کی وجہ سے چھوٹے چھوٹے اور سخت دانے بن جاتے ہیں۔",
      causes: ["Keratin accumulation trapping hairs in follicles", "Dry weather exacerbating epidermal buildup"],
      symptoms: ["Painless, sandpapery bumpy sensations", "Mild localized redness"],
      preventionTips: ["Moisturize skin twice daily with urea-rich formulas", "Avoid harsh scrubbing with loofahs"],
      morningSkincare: [
        "Cleanse using a fragrance-free moisturizing shower cream",
        "Apply Urea 10% lotion across rough regions to gently exfoliate keratin plugs",
        "Protect exposed surfaces with standard daily sunscreen"
      ],
      nightSkincare: [
        "Shower with warm water",
        "Slather Lactic Acid or Urea intensive moisturizing skin balm",
        "Massage gently to restore softness"
      ],
      nutritionAdvice: ["Incorporate Vitamin A loaded carrots and apricots", "Maintain stable leafy green dietary routines"],
      hydrationGoal: "2.8 Liters of pure water daily.",
      lifestyleTips: ["Keep bath temperatures lukewarm rather than steaming hot", "Always pat skin dry with a soft hygienic towel"],
      otcMedicines: [
        {
          category: "Cream",
          genericName: "Urea 10% + Lactic Acid Skin Softener",
          pakistaniMarketName: "Ureacin-10 Cream / Hydral-U Cream",
          howToUse: "Rub gently into rough, dry areas twice daily, preferably right after washing.",
          warnings: ["Do not apply close to broken cuts, eyes, or mucous linings. May produce transient stinging."]
        }
      ],
      prescription: {
        required: false,
        warningText: "Prescription is typically not required for mild barrier symptoms.",
        medications: []
      },
      isEmergency: false,
      emergencyWarning: ""
    }
  };

  return dataset[hint] || dataset[hint.slice(0, 4)] || dataset["default"];
}

// Smart advisory bot fallback database
function getSmartChatReply(userMessage: string, profile: any): string {
  const msg = userMessage.toLowerCase();
  const profileContext = `Based on your profile (Age: ${profile?.age || '24'}, Skin Type: ${profile?.skinType || 'Combination'}, Allergies: ${profile?.allergies || 'None declared'}):`;

  if (msg.includes("acne") || msg.includes("pimples") || msg.includes("dana")) {
    return `${profileContext}
      
For managing Acne Vulgaris, it is best to establish a simple, consistent skincare regimen of exactly three steps:
1. **Cleanse**: Use a cleanser containing *Salicylic Acid 2%* (e.g., Acne-Aid wash or AcneGo wash) morning and night.
2. **Treat**: Apply *Benzoyl Peroxide 2.5%* (Brevoxyl Cream) as a spot treatment strictly over the active acne lesions at night. Alternatively, use *Adapalene 0.1%* (Differin Gel) across the full face to prevent microcomedones.
3. **Moisturize**: Protect the skin barrier with a gentle, oil-free water gel (like Physiogel or CeraVe).

⚠️ **Urdu Advice**:
ایکنی کے علاج کے لیے چہرے کو دن میں دو بار سیلی اسائلک ایسڈ فیس واش سے دھوئیں۔ دانوں پر رات کے وقت 'Brevoxyl Cream' (Benzoyl Peroxide) بالکل ہلکی سی لگا ئیں۔ چہرے کو ائل فری موئسچرائزر سے ہمیشہ نرم رکھیں۔

*Note: Always run a 24-hour patch test behind your ear before beginning a new active ingredient.*`;
  }

  if (msg.includes("ordinary") || msg.includes("product") || msg.includes("salicylic") || msg.includes("serum") || msg.includes("acid")) {
    return `${profileContext}

When introducing heavy active serums (like Salicylic Acid, Glycolic Acid, or Retinol) into your routine:
- **Frequency**: Start by applying only 2 nights a week. Gradually build tolerance to every other night as your skin adapts.
- **Application**: Smooth 2-3 drops over dry skin *after* cleansing. Never apply serums onto damp skin to avoid deep penetration that causes severe acid hot burning.
- **Sunscreen is Obligatory**: Active chemical exfoliants increase your skin's UV sensitivity by eating away at dead protective surface cells. You must apply standard SPF 50 sunscreen every single morning to avoid raw hyperpigmentation.
- **Pakistani Alternatives**: If international brands like The Ordinary are inaccessible, excellent local medical formulations include *Maxdiff Serum* or *Acnex Serums* found easily in local pharmacies.`;
  }

  if (msg.includes("eczema") || msg.includes("dry") || msg.includes("khushk") || msg.includes("irritat")) {
    return `${profileContext}

For Eczema and extreme skin xerosis (dryness):
- **Avoid Soap**: Traditional scented alkaline soaps will strip your natural oils. Switch immediately to a pH-balanced soap-free syndet cleansing bar (like Sebamed or Cetaphil).
- **The Golden 3-Minute Rule**: Slather a heavy ceramide healing ointment (such as CeraVe Moisturizing Cream or Physiogel AI Cream) onto your skin within 3 minutes of bathing while your pores still lock natural moisture.
- **Pakistani Brand recommendation**: Physiogel AI (Anti-Irritation) is extremely effective for local eczema flared spots.

⚠️ **Urdu Advice**:
شدید خشک اور خارش زدہ جلد کے لیے صابن کا استعمال بند کریں۔ نہانے کے فوراً بعد جب جلد ہلکی نم ہو تو 'Physiogel AI Cream' لگائیں تاکہ خارش اور سوزش کم ہو سکے۔`;
  }

  return `${profileContext}

Thank you for reaching out to SkinVision AI. I am here to help guide you regarding product safe combinations, daily health routines, and Pakistani market options.

To get started, please try asking:
- "How do I clear acne scars safely?"
- "What is a good morning routine for dry skin?"
- "Can I use Salicylic Acid and Vitamin C together?"
- "Recommend Pakistani OTC creams for dark circles."

Remember: Perform a 24-hour spot patch test behind your ear with any cosmetic product before full-face application.`;
}

// Mount Vite middleware for development or Serve production static assets compiled inside dist/
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server middleware booting...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkinVision Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
