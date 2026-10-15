import { Share } from 'react-native';

/** The system share sheet with a title and a link. */
export const shareLink = (title: string, url: string): void => {
  void Share.share({ title, message: url, url });
};
