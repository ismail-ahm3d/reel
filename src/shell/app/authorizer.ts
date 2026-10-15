import * as WebBrowser from 'expo-web-browser';
import type { Authorizer } from '@features/account/domain/repositories/authorizer';

/**
 * TMDB's approval page in the system authentication browser (ASWebAuthenticationSession on
 * iOS, a Custom Tab on Android), which returns when TMDB redirects to the app's URL.
 */
export const systemAuthorizer: Authorizer = async (approveUrl, redirectUrl) => {
  const result = await WebBrowser.openAuthSessionAsync(approveUrl, redirectUrl);
  return result.type === 'success';
};

/** Where TMDB sends the user back; app/auth.tsx catches it when the system hands it to the app. */
export const authRedirectUrl = 'reel://auth';
