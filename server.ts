import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '30mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Extract structural components from paper
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, fileData, titleHint } = req.body;

    if (!text && !fileData?.base64) {
      return res.status(400).json({ error: 'Please provide either paper text or an uploaded document.' });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];

    if (fileData?.base64) {
      parts.push({
        inlineData: {
          mimeType: fileData.mimeType || 'application/pdf',
          data: fileData.base64,
        },
      });
      parts.push({
        text: `Analyze the uploaded academic paper document thoroughly. ${titleHint ? `Title/Context hint: "${titleHint}".` : ''}`
      });
    } else {
      parts.push({
        text: `Analyze the following academic paper text thoroughly:
\n--- BEGIN RESEARCH PAPER TEXT ---
${text}
--- END RESEARCH PAPER TEXT ---`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        systemInstruction: `You are an expert academic paper analyzer. Your task is to extract structural components from research text accurately and concisely.
Analyze the provided research text and extract the following 5 components:
Objective
Methodology
Findings
Limitations
Key Takeaways

Formatting Constraints:
- Use clean Markdown with headers for the markdown field.
- Do NOT invent or infer facts not present in the input text. Strict zero-hallucination policy.
- If a section (such as Limitations) is absent in the text, write: "Not explicitly mentioned in the text." and set limitations.isMentioned to false.
- Keep descriptions clear, objective, and dense with key technical details.

The "markdown" property MUST follow this exact template structure:
# Research Paper Analysis

## 🎯 Objective
[State the primary research goal, hypothesis, or problem being solved]

## ⚙️ Methodology
[List the core techniques, models, datasets, or experimental setups used]

## 📊 Findings
[List the primary empirical results, metrics, or key discoveries]

## ⚠️️ Limitations
[List constraints, missing evaluations, or edge cases, or "Not explicitly mentioned in the text."]

## 💡 Key Takeaways
[List 2-3 main takeaways and practical implications]`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Title of the research paper' },
            authors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Authors list if present' },
            year: { type: Type.STRING, description: 'Publication year if stated, or "N/A"' },
            venue: { type: Type.STRING, description: 'Conference or journal name if present, or "Preprint"' },
            objective: { type: Type.STRING, description: 'State the primary research goal, hypothesis, or problem being solved' },
            methodology: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: 'Comprehensive summary of methodology' },
                coreTechniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key techniques, formulations, and architectures' },
                datasets: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Datasets and benchmarks utilized' },
                hardwareOrCompute: { type: Type.STRING, description: 'Hardware, GPUs, or compute specs if mentioned' },
              },
              required: ['summary', 'coreTechniques', 'datasets'],
            },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metricOrDiscovery: { type: Type.STRING, description: 'The exact quantitative metric or key discovery' },
                  detail: { type: Type.STRING, description: 'Context and comparison detail from the paper' },
                },
                required: ['metricOrDiscovery', 'detail'],
              },
            },
            limitations: {
              type: Type.OBJECT,
              properties: {
                isMentioned: { type: Type.BOOLEAN, description: 'False if not explicitly mentioned in the text' },
                text: { type: Type.STRING, description: 'Explicit limitations or "Not explicitly mentioned in the text."' },
              },
              required: ['isMentioned', 'text'],
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 3 main takeaways and practical implications',
            },
            citation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                year: { type: Type.STRING },
                venue: { type: Type.STRING },
                bibtex: { type: Type.STRING },
                apa: { type: Type.STRING },
              },
              required: ['title', 'authors', 'year', 'bibtex', 'apa'],
            },
            markdown: { type: Type.STRING, description: 'Strict clean markdown adhering to output template' },
          },
          required: [
            'title',
            'authors',
            'year',
            'objective',
            'methodology',
            'findings',
            'limitations',
            'keyTakeaways',
            'citation',
            'markdown',
          ],
        },
      },
    });

    const rawText = response.text?.trim() || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      return res.status(500).json({ error: 'Failed to parse Gemini response as JSON.', rawText });
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred during paper analysis. Please check your API key and input text.',
    });
  }
});

// API Route: Cross-Paper Comparative Analysis
app.post('/api/compare', async (req, res) => {
  try {
    const { paperA, paperB } = req.body;
    if (!paperA || !paperB) {
      return res.status(400).json({ error: 'Both paperA and paperB are required for comparison.' });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Compare these two academic papers across their core structural components:

Paper A: "${paperA.title}"
Objective: ${paperA.objective}
Methodology: ${paperA.methodology?.summary || ''} (Techniques: ${paperA.methodology?.coreTechniques?.join(', ') || ''})
Findings: ${paperA.findings?.map((f: any) => `${f.metricOrDiscovery}: ${f.detail}`).join('; ') || ''}
Limitations: ${paperA.limitations?.text || ''}

Paper B: "${paperB.title}"
Objective: ${paperB.objective}
Methodology: ${paperB.methodology?.summary || ''} (Techniques: ${paperB.methodology?.coreTechniques?.join(', ') || ''})
Findings: ${paperB.findings?.map((f: any) => `${f.metricOrDiscovery}: ${f.detail}`).join('; ') || ''}
Limitations: ${paperB.limitations?.text || ''}

Provide a rigorous comparative breakdown strictly grounded in the provided details.`,
      config: {
        systemInstruction: `You are an academic synthesis expert. Provide an objective, dense comparative analysis comparing two research papers. Do not hallucinate.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectiveComparison: { type: Type.STRING, description: 'Comparison of research objectives, problem formulations, and targets' },
            methodologicalDivergence: { type: Type.STRING, description: 'How their architectures, algorithms, and pipelines differ' },
            empiricalTradeoffs: { type: Type.STRING, description: 'Speed vs accuracy, memory, parameter count, and benchmark gains' },
            keyLimitationsContrast: { type: Type.STRING, description: 'Comparative constraints, edge cases, and failure modes' },
            recommendation: { type: Type.STRING, description: 'When to choose which method in research or production' },
          },
          required: [
            'objectiveComparison',
            'methodologicalDivergence',
            'empiricalTradeoffs',
            'keyLimitationsContrast',
            'recommendation',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Comparison error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred during paper comparison.',
    });
  }
});

// Setup Vite in Dev or Static Files in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ScholarExtract server running at http://0.0.0.0:${port}`);
  });
}

startServer();
