// api/auth-poll.js
globalThis._SESSIONS = globalThis._SESSIONS || {};

export default function handler(req, res) {
  try {
    const { token } = req.query;
    const s = _SESSIONS[token];
    if (!s) return res.status(404).json({ ok:false, status:'NOT_FOUND' });

    // Auto-confirm demo ke liye: 5 sec baad CONFIRMED
    if (Date.now() - s.createdAt > 5000 && s.status === 'PENDING') {
      s.status = 'CONFIRMED';
      s.password = Math.random().toString(36).slice(2, 14); // 12 chars
    }
    return res.status(200).json({ ok:true, status: s.status });
  } catch (e) {
    return res.status(500).json({ ok:false, status:'ERR' });
  }
}
