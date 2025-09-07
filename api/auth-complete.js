// api/auth-complete.js
globalThis._SESSIONS = globalThis._SESSIONS || {};

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'METHOD' });
    const { token } = req.body || {};
    const s = _SESSIONS[token];
    if (!s) return res.status(404).json({ ok:false, error:'NOT_FOUND' });
    if (s.status !== 'CONFIRMED') return res.status(409).json({ ok:false, error:'NOT_CONFIRMED' });

    // Return demo “account”
    return res.status(200).json({
      ok: true,
      username: s.username,
      password: s.password,   // demo generated password
      msg: 'Registration complete',
    });
  } catch (e) {
    return res.status(500).json({ ok:false, error:'SRV' });
  }
}
