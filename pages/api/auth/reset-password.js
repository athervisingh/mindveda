import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, otp, password } = req.body
  if (!email || !otp || !password) return res.status(400).json({ error: 'Missing fields.' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' })

  // Step 1: Verify OTP using anon key (confirms user owns this email)
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error: otpError } = await anonClient.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  })

  if (otpError || !data?.user) {
    return res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' })
  }

  // Step 2: Update password using service role key (no client session needed)
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    data.user.id,
    { password }
  )

  if (updateError) {
    return res.status(400).json({ error: updateError.message })
  }

  return res.status(200).json({ success: true })
}
