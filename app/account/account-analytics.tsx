'use client'

import { useEffect } from "react"
import posthog from "posthog-js"

export default function AccountAnalytics({ user }) {
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, { email: user.email })
      posthog.capture('user_logged_in', { email: user.email })
    }
  }, [user])

  return null
}