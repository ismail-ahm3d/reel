/**
 * Shows TMDB's approval page and resolves true once TMDB redirects back to `redirectUrl`, false
 * when the user closes it. The shell implements it with the system's authentication browser.
 */
export type Authorizer = (approveUrl: string, redirectUrl: string) => Promise<boolean>;
