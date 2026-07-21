import ChatHistory from '../models/ChatHistory.js';
import User from '../models/User.js';
import { chatSchema } from '../utils/validators.js';
import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

export const chatWithAI = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { message } = chatSchema.parse(req.body);
    const user = await User.findById(userId);
    const history = await ChatHistory.findOne({ user: userId }) || await ChatHistory.create({ user: userId, messages: [] });

    const prompt = await loadPrompt('chat_assistant.txt');
    // Include the incoming user message as the last item in the history sent to the model
    const augmentedHistory = Array.isArray(history.messages) ? [...history.messages, { role: 'user', text: message }] : [{ role: 'user', text: message }];
    const aiRaw = await generateAIResponse(prompt, { profile: user.aiProfile || {}, message, history: augmentedHistory });

    // Normalize AI output: try to parse structured JSON if present
    const tryParseJson = (raw) => {
      if (!raw) return null;
      const trimmed = (typeof raw === 'string') ? raw.trim() : raw;
      if (typeof trimmed !== 'string') return trimmed;
      const jsonMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i) || trimmed.match(/```([\s\S]*?)```/i);
      const candidate = jsonMatch ? jsonMatch[1] : trimmed;
      try {
        return JSON.parse(candidate);
      } catch (err) {
        try {
          const start = candidate.indexOf('{');
          const end = candidate.lastIndexOf('}');
          if (start >= 0 && end > start) {
            return JSON.parse(candidate.slice(start, end + 1));
          }
        } catch (e) {
          return null;
        }
        return null;
      }
    };

    const parsedAI = tryParseJson(aiRaw) || null;

    const formatAI = (raw) => {
      if (!raw) return '';
      if (typeof raw === 'string') return raw;
      return JSON.stringify(raw, null, 2);
    };

    // Try to extract a concise human answer from structured JSON or from stringified JSON using heuristics
    const extractAnswer = (objOrString) => {
      if (!objOrString) return null;

      // If we have an object, search for common keys and message-like strings
      const searchObject = (obj) => {
        if (!obj || typeof obj !== 'object') return null;

        const keyCandidates = ['message', 'reply', 'text', 'answer', 'content', 'reason', 'messageText'];

        const tryFromObject = (o) => {
          if (!o || typeof o !== 'object') return null;
          for (const k of Object.keys(o)) {
            const kl = k.toLowerCase();
            if (keyCandidates.includes(kl) && typeof o[k] === 'string' && o[k].trim()) {
              return o[k].trim();
            }
          }
          return null;
        };

        // Breadth-first search for a candidate
        const seen = new Set();
        const queue = [obj];
        while (queue.length) {
          const cur = queue.shift();
          if (!cur || typeof cur !== 'object') continue;
          if (seen.has(cur)) continue;
          seen.add(cur);
          const direct = tryFromObject(cur);
          if (direct) return direct;
          // inspect child values
          for (const v of Object.values(cur)) {
            if (typeof v === 'string') {
              if (v.trim().length > 20) return v.trim();
            } else if (v && typeof v === 'object') {
              queue.push(v);
            }
          }
        }
        return null;
      };

      // If input is object
      if (typeof objOrString === 'object') {
        const res = searchObject(objOrString);
        if (res) return res;
      }

      // If input is string, attempt to pull message-like fields via regex (covers JSON-in-strings)
      if (typeof objOrString === 'string') {
        const s = objOrString;
        // Common pattern: "message": "..."
        const regexes = [
          /"message"\s*:\s*"([\s\S]{10,2000}?)"/i,
          /'message'\s*:\s*'([\s\S]{10,2000}?)'/i,
          /"reason"\s*:\s*"([\s\S]{10,2000}?)"/i,
          /"reply"\s*:\s*"([\s\S]{10,2000}?)"/i,
          /"message"\s*:\s*`([\s\S]{10,2000}?)`/i,
          /Resume Analyzer Agent"\s*:\s*\{[\s\S]*?"message"\s*:\s*"([\s\S]{10,2000}?)"/i
        ];
        for (const r of regexes) {
          const m = s.match(r);
          if (m && m[1]) {
            return m[1].trim();
          }
        }

        // fallback: strip outer braces and try to parse roughly
        const start = s.indexOf('{');
        const end = s.lastIndexOf('}');
        if (start >= 0 && end > start) {
          const inner = s.slice(start, end + 1);
          try {
            const parsed = JSON.parse(inner);
            const res = searchObject(parsed);
            if (res) return res;
          } catch (e) {
            // ignore
          }
        }
      }

      return null;
    };

    const extracted = extractAnswer(parsedAI || aiRaw);
    let aiText = extracted || formatAI(parsedAI || aiRaw);

    // Do not override AI output with hard-coded replies; prefer the AI-generated plain text from the chat assistant prompt.
    history.messages.push({ role: 'user', text: message, createdAt: new Date() });
    // store both structured raw JSON (if any) and a human-readable text
    history.messages.push({ role: 'ai', text: aiText, raw: parsedAI || null, createdAt: new Date() });
    await history.save();

    res.json({ success: true, data: { message: aiText, raw: parsedAI || null, history } });
  } catch (error) {
    next(error);
  }
};
