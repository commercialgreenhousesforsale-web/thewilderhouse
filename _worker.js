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

    return env.ASSETS.fetch(request);
  }
};
