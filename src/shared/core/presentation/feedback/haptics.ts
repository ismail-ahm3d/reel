import * as Haptics from 'expo-haptics';

/** The system's selection tick, for toggles and pickers. */
export const selectionFeedback = (): void => {
  void Haptics.selectionAsync();
};

/** The system's success tap, for a completed action such as saving. */
export const successFeedback = (): void => {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
