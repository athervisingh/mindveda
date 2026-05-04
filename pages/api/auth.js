// Minimal mock auth endpoints (signup/login) — integrate Supabase auth later.
export default function handler(req, res){
  if(req.method === 'POST'){
    const { action } = req.query
    if(action === 'signup'){
      // return success (mock)
      return res.status(200).json({ ok: true, user: { id: 'user_123', email: req.body.email } })
    }
    if(action === 'login'){
      return res.status(200).json({ ok: true, user: { id: 'user_123', email: req.body.email } })
    }
  }
  res.status(400).json({ ok:false })
}
