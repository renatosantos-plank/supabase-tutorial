'use client'

import { useEffect } from "react"
import posthog from "posthog-js"
import { type User } from "@supabase/supabase-js"

export default function AccountAnalytics({ user } : { user: User | null }) {
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, { email: user.email })
      posthog.capture('user_logged_in', { email: user.email })
    }
  }, [user])

  return null
}