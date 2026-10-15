import { View } from 'react-native';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import type { AppError } from '@shared/core/domain/appError';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppSheet } from '@shared/core/presentation/components/AppSheet';
import { AppTextInput } from '@shared/core/presentation/components/AppTextInput';
import { accountErrorText } from '@features/account/presentation/mappers/accountErrorText';

export type CreateListSheetProps = {
  readonly visible: boolean;
  readonly name: string;
  readonly description: string;
  readonly canCreate: boolean;
  readonly isCreating: boolean;
  readonly error: AppError | null;
  readonly onChangeName: (name: string) => void;
  readonly onChangeDescription: (description: string) => void;
  readonly onCreate: () => void;
  readonly onClose: () => void;
};

export const CreateListSheet = (props: CreateListSheetProps) => {
  const t = useTranslate();
  return (
    <AppSheet
      visible={props.visible}
      title={t({ key: 'account.newList' })}
      doneLabel={t({ key: 'common.cancel' })}
      onDone={props.onClose}
    >
      {props.error !== null && (
        <AppErrorBanner text={accountErrorText(props.error)} onDismiss={props.onClose} />
      )}
      <AppTextInput
        label={t({ key: 'account.listName' })}
        value={props.name}
        onChangeText={props.onChangeName}
        placeholder={t({ key: 'account.listNamePlaceholder' })}
        maxLength={100}
        autoFocus
      />
      <AppTextInput
        label={t({ key: 'account.listDescription' })}
        value={props.description}
        onChangeText={props.onChangeDescription}
        multiline
      />
      <View>
        <AppButton
          label={t({ key: props.isCreating ? 'account.creating' : 'account.createList' })}
          onPress={props.onCreate}
          disabled={!props.canCreate}
        />
      </View>
    </AppSheet>
  );
};
