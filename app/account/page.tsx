import AccountForm from './account-form'
import AccountAnalytics from './account-analytics'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <AccountAnalytics user={user} />
      <AccountForm user={user} />
    </>
  )
}