export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Never serve internal/dev files publicly, even if they get uploaded by
    // `wrangler pages deploy .`. Markdown notes, Python/PowerShell scripts, and
    // dot-directories (config/tooling, version control) are never legitimate
    // public assets on this static site.
    if (/\.(md|py|ps1|local\.md)$/i.test(url.pathname) ||
        /(^|\/)\.(?!well-known\/)[^/]+/.test(url.pathname) ||
        /^\/tour-engine-template(\.html)?$/i.test(url.pathname)) {
      return new Response('Not found', { status: 404 });
    }

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

    if (url.pathname === '/wx-proxy') {
      // Ground-truth current conditions from the NWS Savannah station (KSAV).
      // open-meteo's model 'current' can report 0mm while it's actually raining;
      // this observed feed is used to override the rain state on the day planner.
      try {
        const resp = await fetch('https://api.weather.gov/stations/KSAV/observations/latest', {
          headers: {
            'User-Agent': 'forsythparkvacationrentals.com (commercialgreenhousesforsale@gmail.com)',
            'Accept': 'application/geo+json'
          }
        });
        if (!resp.ok) {
          return new Response('Upstream ' + resp.status, { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } });
        }
        const data = await resp.json();
        const p = (data && data.properties) || {};
        const text = (p.textDescription || '').toLowerCase();
        const precip = (p.precipitationLastHour && p.precipitationLastHour.value != null) ? p.precipitationLastHour.value : 0;
        const present = Array.isArray(p.presentWeather)
          ? p.presentWeather.map(function (w) { return (w.weather || '').toLowerCase(); }).join(',')
          : '';
        const rainWords = /rain|drizzle|shower|thunder/;
        const active = rainWords.test(text) || rainWords.test(present);
        const raining = active || precip >= 0.2;
        return new Response(JSON.stringify({
          raining: raining, active: active, precipLastHour: precip,
          text: p.textDescription || '', present: present, ts: p.timestamp || ''
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
          }
        });
      } catch (e) {
        return new Response('wx error: ' + e.message, { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } });
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
      const ALLOWED_VOICES = ['0rEo3eAjssGDUCXHYENf', 'dtVZnErhiiosqofxDzSH', 'a4BsmeT8RITKlxlCY9PO'];
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
          body: JSON.stringify({ text: text, model_id: 'eleven_v3' })
        });
        if (!resp.ok) {
          const msg = await resp.text();
          return new Response('Upstream ' + resp.status + ': ' + msg.slice(0, 300), { status: 502 });
        }
        // Buffer the audio rather than streaming resp.body: a streamed upstream
        // body that errors mid-flight surfaces as an opaque Cloudflare 502 that
        // bypasses this try/catch. Buffering keeps errors catchable here.
        const audio = await resp.arrayBuffer();
        return new Response(audio, {
          headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }
        });
      } catch (e) {
        return new Response('TTS error: ' + e.message, { status: 502 });
      }
    }

    if (url.pathname === '/wx-forecast') {
      // NWS hourly forecast for Savannah — sharper precip *timing* than
      // open-meteo's model. Fetched server-side so no browser CSP change is
      // needed. Two hops (points -> forecastHourly); cached 30 min.
      const UA = 'forsythparkvacationrentals.com (commercialgreenhousesforsale@gmail.com)';
      const ok = (obj, age) => new Response(JSON.stringify(obj), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=' + (age || 300) }
      });
      try {
        const pts = await fetch('https://api.weather.gov/points/32.0809,-81.0912', { headers: { 'User-Agent': UA, 'Accept': 'application/geo+json' } });
        if (!pts.ok) return ok({ periods: [] }, 300);
        const pd = await pts.json();
        const hourlyUrl = pd && pd.properties && pd.properties.forecastHourly;
        if (!hourlyUrl) return ok({ periods: [] }, 300);
        const hr = await fetch(hourlyUrl, { headers: { 'User-Agent': UA, 'Accept': 'application/geo+json' } });
        if (!hr.ok) return ok({ periods: [] }, 300);
        const hd = await hr.json();
        const periods = ((hd && hd.properties && hd.properties.periods) || []).slice(0, 18).map(function (p) {
          return { t: p.startTime, pop: (p.probabilityOfPrecipitation && p.probabilityOfPrecipitation.value) || 0, short: p.shortForecast || '' };
        });
        return ok({ periods: periods }, 1800);
      } catch (e) {
        return ok({ periods: [] }, 300);
      }
    }

    if (url.pathname === '/events-proxy') {
      // Live local events via the Ticketmaster Discovery API. Lights up only when
      // a TICKETMASTER_KEY secret is configured; otherwise returns an empty list
      // and the page falls back to its curated recurring-events calendar.
      const ok = (obj, age) => new Response(JSON.stringify(obj), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=' + (age || 300) }
      });
      // trim(): secrets piped in from Windows PowerShell can carry a trailing CR/LF,
      // which silently corrupts the apikey param upstream.
      const tmKey = (env.TICKETMASTER_KEY || '').trim();
      if (!tmKey) return ok({ events: [], source: 'unconfigured' }, 300);
      try {
        const api = 'https://app.ticketmaster.com/discovery/v2/events.json?city=Savannah&stateCode=GA&radius=20&unit=miles&size=25&sort=date,asc&apikey=' + tmKey;
        // Ticketmaster rejects UA-less requests (Workers fetch sends no User-Agent by default)
        const r = await fetch(api, { headers: { 'User-Agent': 'forsythparkvacationrentals.com (commercialgreenhousesforsale@gmail.com)', 'Accept': 'application/json' } });
        if (!r.ok) return ok({ events: [], source: 'error', status: r.status }, 300);
        const d = await r.json();
        const raw = (d && d._embedded && d._embedded.events) || [];
        const events = raw.map(function (e) {
          const dt = (e.dates && e.dates.start) || {};
          const ven = (e._embedded && e._embedded.venues && e._embedded.venues[0]) || {};
          const cls = (e.classifications && e.classifications[0]) || {};
          const seg = (cls.segment && cls.segment.name) || '';
          const g = /Music/i.test(seg) ? '🎵' : /Sports/i.test(seg) ? '🏟' : /Arts|Theatre|Theater/i.test(seg) ? '🎭' : '🎟';
          return {
            name: e.name || 'Event', g: g,
            place: ven.name || 'Savannah', date: dt.localDate || '', time: dt.localTime || '',
            url: e.url || '', price: 'Tickets', live: true
          };
        }).filter(function (e) { return e.date; });
        return ok({ events: events, source: 'ticketmaster' }, 1800);
      } catch (e) {
        return ok({ events: [], source: 'error' }, 300);
      }
    }

    if (url.pathname === '/meteo-proxy') {
      // Same-origin proxy for Open-Meteo. The live CSP connect-src does not
      // include api.open-meteo.com, so the day planner's direct fetch is
      // blocked in production — this keeps the weather genuinely live.
      try {
        const resp = await fetch('https://api.open-meteo.com/v1/forecast' + url.search);
        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=600'
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/tide-proxy') {
      // Same-origin proxy for NOAA CO-OPS tide predictions (Fort Pulaski
      // station) — api.tidesandcurrents.noaa.gov is also CSP-blocked client-side.
      try {
        const resp = await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter' + url.search);
        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/nara-proxy') {
      // Server-side proxy for the National Archives Catalog API (v2).
      // Keeps the API key off the client — the page calls same-origin /nara-proxy,
      // so it also satisfies connect-src 'self' with no CSP change needed.
      const target = 'https://catalog.archives.gov/api/v2/records/search' + url.search;
      try {
        const resp = await fetch(target, {
          headers: {
            'Accept': 'application/json',
            'x-api-key': env.NARA_API_KEY || 'i7WeD8TGJi2i03zuvDo1I3v07TEDlfZm5gA3dX2H'
          }
        });
        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
