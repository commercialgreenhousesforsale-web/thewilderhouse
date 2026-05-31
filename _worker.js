export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/ical-proxy') {
      const target = url.searchParams.get('url');
      if (!target || !target.startsWith('https://www.airbnb.com/calendar/ical/')) {
        return new Response('Forbidden', { status: 403 });
      }
      try {
        const resp = await fetch(target, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/calendar, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        if (!resp.ok) return new Response('Upstream ' + resp.status, { status: 502 });
        const text = await resp.text();
        return new Response(text, {
          headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (e) {
        return new Response('Fetch error: ' + e.message, { status: 502 });
      }
    }

    if (url.pathname === '/tts-proxy') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      // Server-side admin gate — the key is never exposed to the browser.
      const token = request.headers.get('x-admin-token');
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response('Forbidden', { status: 403 });
      }
      if (!env.ELEVENLABS_KEY) {
        return new Response('TTS not configured', { status: 503 });
      }
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response('Bad request', { status: 400 });
      }
      const text = ((body && body.text) || '').toString().slice(0, 2500);
      const voiceId = ((body && body.voiceId) || '').toString();
      // Allowlist the known tour voices so the endpoint can't be abused for arbitrary TTS.
      const ALLOWED_VOICES = ['0rEo3eAjssGDUCXHYENf', 'dtVZnErhiiosqofxDzSH'];
      if (!text || !ALLOWED_VOICES.includes(voiceId)) {
        return new Response('Invalid text or voice', { status: 400 });
      }
      try {
        const resp = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
          method: 'POST',
          headers: {
            'xi-api-key': env.ELEVENLABS_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({ text: text, model_id: 'eleven_monolingual_v1' })
        });
        if (!resp.ok) {
          const msg = await resp.text();
          return new Response('Upstream ' + resp.status + ': ' + msg.slice(0, 200), { status: 502 });
        }
        return new Response(resp.body, {
          headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }
        });
      } catch (e) {
        return new Response('TTS error: ' + e.message, { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
