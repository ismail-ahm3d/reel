import { Alert } from 'react-native';

export type ConfirmRequest = {
  readonly title: string;
  readonly message?: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
};

/** The system alert for a destructive step; resolves true when the user goes ahead. */
export const confirmDestructive = ({ title, message, confirmLabel, cancelLabel }: ConfirmRequest) =>
  new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelLabel,
          style: 'cancel',
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: confirmLabel,
          style: 'destructive',
          onPress: () => {
            resolve(true);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          resolve(false);
        },
      },
    );
  });
