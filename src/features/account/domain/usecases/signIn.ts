import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { Account } from '@features/account/domain/model/account';
import { AccountError } from '@features/account/domain/model/accountError';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import type { Authorizer } from '@features/account/domain/repositories/authorizer';

/** TMDB's three steps: a request token, the user's approval on TMDB, then a session for it. */
export type SignIn = () => Promise<Outcome<Account>>;

export const makeSignIn =
  ({
    account,
    sessions,
    authorizer,
    redirectUrl,
  }: {
    account: AccountRepository;
    sessions: SessionRepository;
    authorizer: Authorizer;
    redirectUrl: string;
  }): SignIn =>
  () =>
    outcome(async () => {
      const { requestToken, approveUrl } = await account.requestApproval(redirectUrl);
      if (!(await authorizer(approveUrl, redirectUrl))) throw new AccountError({ kind: 'notApproved' });
      const session = await account.createSession(requestToken);
      await sessions.save(session);
      return account.account(session);
    });
