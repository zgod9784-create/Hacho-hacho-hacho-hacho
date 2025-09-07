// api/auth-start.js
// In-memory store (per lambda instance). Demo/recording ke liye enough.
globalThis._SESSIONS = globalThis._SESSIONS || {};

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'METHOD' });
    const { username } = req.body || {};
    if (!/^[a-z0-9_]{3,20}$/i.test(username || '')) {
      return res.status(400).json({ ok:false, error:'BAD_USERNAME' });
    }
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    _SESSIONS[token] = { username, status: 'PENDING', createdAt: Date.now() };
    const botLink = `https://t.me/your_bot_username?start=${encodeURIComponent(token)}`; // demo link
    return res.status(200).json({ ok:true, sessionToken: token, botLink });
  } catch (e) {
    return res.status(500).json({ ok:false, error:'SRV' });
  }
}
