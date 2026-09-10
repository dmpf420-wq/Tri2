// GET /api/intervals?type=wellness   -> last 45 days of wellness (CTL/ATL/TSB/HRV/etc)
// GET /api/intervals?type=activities -> last 30 activities
//
// Reads INTERVALS_API_KEY and INTERVALS_ATHLETE_ID from Vercel
// environment variables, so your key never touches the browser.

export default async function handler(req, res) {
  const apiKey = process.env.INTERVALS_API_KEY;
  const athleteId = process.env.INTERVALS_ATHLETE_ID; // e.g. "i123456"
  if (!apiKey || !athleteId) {
    return res.status(500).json({ error: 'Missing INTERVALS_API_KEY or INTERVALS_ATHLETE_ID env vars' });
  }

  const type = req.query.type || 'wellness';
  const auth = 'Basic ' + Buffer.from('API_KEY:' + apiKey).toString('base64');

  let url;
  if (type === 'wellness') {
    const oldest = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const newest = new Date().toISOString().slice(0, 10);
    url = `https://intervals.icu/api/v1/athlete/${athleteId}/wellness.json?oldest=${oldest}&newest=${newest}`;
  } else if (type === 'activities') {
    const oldest = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    url = `https://intervals.icu/api/v1/athlete/${athleteId}/activities.json?oldest=${oldest}`;
  } else {
    return res.status(400).json({ error: 'Unknown type. Use wellness or activities.' });
  }

  try {
    const r = await fetch(url, { headers: { Authorization: auth } });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: 'intervals.icu error', detail: text });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // 5 min edge cache
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
