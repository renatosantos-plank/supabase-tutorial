'use server';

import { revalidatePath } from  'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server';
import posthog from 'posthog-js';

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  const { data: user } = await supabase.auth.getUser()
  console.log(user)
  if (user) {
    posthog.identify(user?.user?.id, { email: user.user?.email })
    posthog.capture('user_logged_in', { email: user?.user?.email })
  }
  revalidatePath('/', 'layout')
  redirect('/account')

  


}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}