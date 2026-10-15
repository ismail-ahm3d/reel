/** A signed-in TMDB user: the v4 token for lists, the v3 session for ratings, favorites and the watchlist. */
export type Session = {
  readonly accessToken: string;
  /** The v4 account id, a string. */
  readonly accountObjectId: string;
  readonly sessionId: string;
  /** The v3 account id, a number. */
  readonly accountId: number;
};
