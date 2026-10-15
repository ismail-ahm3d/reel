import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import { isValidListName } from '@features/account/domain/model/account';
import { AccountError } from '@features/account/domain/model/accountError';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

/** Creates a public list and returns its id. */
export type CreateList = (name: string, description: string) => Promise<Outcome<number>>;

export const makeCreateList =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): CreateList =>
  (name, description) =>
    outcome(async () => {
      if (!isValidListName(name)) throw new AccountError({ kind: 'invalidListName' });
      return account.createList(await requireSession(sessions), name.trim(), description.trim());
    });
