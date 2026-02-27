// Netlify serverless function — proxies Gemini API
// The GEMINI_API_KEY env var is stored in Netlify dashboard, never in source code.

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are the judge and cryptic commentator for "Reel Masala" — a daily film guessing game featuring iconic 90s and 00s Hollywood, Bollywood, UK, and animated films/shows.

When asked to evaluate a guess, you must:
1. Accept common abbreviations (DDLJ, KKHH, DCH, K3G, LOTR, HP), typos, alternate titles, translations, and partial matches.
2. If the user typed something close but not quite (e.g. "kuch kuch" for "Kuch Kuch Hota Hai") treat it as CORRECT.
3. If the user guessed a completely different film, return correct=false.
4. Generate a short, cryptic, cinematic hint (MAX 2 sentences) that:
   - Has personality — like a witty film critic dropping clues
   - Does NOT mention: the film title, director name, or lead actor names
   - References: the mood, a visual motif, a famous scene's feeling, the era, or an iconic line/sound paraphrased
   - Is slightly different each time, even for the same film
   - Ends with a teasing question or ellipsis to create suspense

Always respond with valid JSON only, no markdown, no extra text.`;

export default async function handler(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers });
  }

  const { filmTitle, userGuess, cluesSeen, year, origin, genre, wrongGuessCount } = body;

  if (!filmTitle || !userGuess) {
    return new Response(JSON.stringify({ error: 'Missing filmTitle or userGuess' }), { status: 400, headers });
  }

  const prompt = `${SYSTEM_PROMPT}

SECRET FILM: "${filmTitle}" (${year}, ${origin}, ${genre})
PLAYER'S GUESS: "${userGuess}"
EMOJI CLUES SEEN SO FAR: ${cluesSeen}
WRONG GUESSES SO FAR: ${wrongGuessCount}

Evaluate the guess and — if wrong — generate a cryptic hint appropriate for someone who has seen ${cluesSeen} emoji clue(s) and made ${wrongGuessCount} wrong guess(es). Make the hint progressively more revealing as wrong guesses increase, but never give it away.

Respond with this JSON schema:
{
  "correct": boolean,
  "hint": string | null
}

If correct=true, set hint=null. If correct=false, hint must be non-null (1-2 sentences, cryptic, cinematic, teasing).`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.85,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('Gemini error:', err);
      return new Response(
        JSON.stringify({ error: 'Gemini API error', fallback: true }),
        { status: 502, headers }
      );
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from the text
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { correct: false, hint: null };
    }

    return new Response(JSON.stringify(parsed), { status: 200, headers });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error', fallback: true }),
      { status: 500, headers }
    );
  }
}
