import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Analyze product description & URL to generate ad angles & copy
app.post('/api/analyze-product', async (req, res) => {
  try {
    const { url, description, title, ctaIntent, stylePreset } = req.body;

    if (!description && !url && !title) {
      return res.status(400).json({ error: 'Please provide at least a product title, description, or URL.' });
    }

    const prompt = `
You are an award-winning creative advertising director and conversion copywriter.
Analyze this product and craft high-impact banner ad concepts, compelling copywriting, and visual art direction.

Product Information:
- Product Title/Name: ${title || 'Not specified'}
- Product URL: ${url || 'Not specified'}
- Product Description & Features: ${description || 'Not specified'}
- Desired Call-To-Action Intent: ${ctaIntent || 'Shop Now / Get Offer'}
- Creative Style Aesthetic: ${stylePreset || 'Modern Luxury'}

Provide your response in JSON format matching this schema:
{
  "brandName": "Brand or product brand name",
  "productTitle": "Refined punchy product title (under 30 characters)",
  "tagline": "A high-converting value proposition or subheadline (under 60 characters)",
  "badgeText": "Short promotional hook badge, e.g., '50% OFF TODAY', 'FREE SHIPPING', 'LIMITED EDITION', or 'TOP RATED' (under 20 characters)",
  "ctaText": "Compelling button action verb phrase, e.g., 'Claim Your 50% Off', 'Shop Collection', 'Explore Now' (under 24 characters)",
  "keyBenefit": "One crisp sentence explaining the transformation or biggest benefit",
  "imagePrompt": "A highly detailed, cinematic commercial studio photograph prompt of the product on a luxury minimalist background with dramatic lighting, 8k resolution, photorealistic commercial advertising aesthetic, no text or typography in the image",
  "suggestedColors": {
    "primary": "#hex color",
    "secondary": "#hex color",
    "background": "#hex dark or clean color",
    "accent": "#hex vibrant accent color"
  },
  "headlinesBySize": {
    "compact": "Ultra punchy headline for small rectangles & mobile (under 25 chars)",
    "horizontal": "Wide banner headline for leaderboards (under 45 chars)",
    "vertical": "Vertical skyscraper headline (under 30 chars)",
    "social": "Dynamic headline for social story & square feed (under 40 chars)"
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Fallback extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /api/analyze-product:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze product. Please try again.',
    });
  }
});

// Endpoint: Generate image using Gemini image models
// Supports user directives:
// - Model: gemini-3-pro-image-preview or gemini-nano-banana-2.1
// - Image Size: 1K, 2K, 4K
// - Aspect Ratio: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      model = 'gemini-3-pro-image-preview',
      imageSize = '2K',
      aspectRatio = '1:1',
      stylePreset,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image generation.' });
    }

    // Enhance prompt with studio lighting and high-end advertising photography keywords
    let enrichedPrompt = prompt;
    if (stylePreset) {
      enrichedPrompt = `${prompt}, styled in ${stylePreset} aesthetic, commercial product advertising shoot, clean studio lighting, 8k resolution, crisp details, hyperrealistic`;
    }

    // Validate model selection
    const chosenModel = model === 'gemini-nano-banana-2.1' ? 'gemini-nano-banana-2.1' : 'gemini-3-pro-image-preview';

    console.log(`Generating image with model: ${chosenModel}, size: ${imageSize}, ratio: ${aspectRatio}`);

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: {
        parts: [{ text: enrichedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let captionText = '';

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image data returned from image generation model.',
        details: captionText || 'Check model permissions and prompt.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      model: chosenModel,
      aspectRatio,
      imageSize,
      caption: captionText,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    return res.status(500).json({
      error: err.message || 'Image generation failed',
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AdCraft Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
