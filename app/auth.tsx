import { useEffect } from 'react';
import { router } from 'expo-router';

/**
 * TMDB's sign-in redirect (reel://auth). The authentication browser normally consumes it; when
 * the system delivers it to the app instead (some Android browsers), this returns to where the
 * user was.
 */
export default function AuthRedirectRoute() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);
  return null;
}
