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
  if (user) {
    // THIS BLOCK WILL FAIL ON THE SERVER
    try {
      console.log('Attempting to run posthog-js on the server...');
      posthog.identify(user.id, { email: user.email });
      posthog.capture('user_logged_in', { email: user.email });
      console.log('This message will likely never appear.');
    } catch (e) {
      // Check your server terminal/logs for this error!
      console.error('ERROR: posthog-js failed to run in a Server Action:', e);
    }
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