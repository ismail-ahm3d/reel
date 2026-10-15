import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppSheet } from '@shared/core/presentation/components/AppSheet';
import { AppText } from '@shared/core/presentation/components/AppText';
import { formatRating } from '@shared/presentation/mappers/mediaText';
import { ListPickerSheet } from '@features/account/presentation/components/ListPickerSheet';
import { accountErrorText } from '@features/account/presentation/mappers/accountErrorText';
import {
  useTitleAccountBar,
  type TitleAccountBarProps,
} from '@features/account/presentation/screens/titleBar/useTitleAccountBar';

const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const TitleAccountBar = (props: TitleAccountBarProps) => {
  const view = useTitleAccountBar(props);
  const t = useTranslate();
  const { states } = view;
  if (states === null) return null;
  return (
    <View style={styles.bar}>
      {view.actionError !== null && (
        <AppErrorBanner text={accountErrorText(view.actionError)} onDismiss={view.dismissActionError} />
      )}
      <View style={styles.buttons}>
        <AppButton
          label={t({ key: states.favorite ? 'account.favorited' : 'account.favorite' })}
          icon={
            states.favorite
              ? { ios: 'heart.fill', android: 'favorite' }
              : { ios: 'heart', android: 'favorite_border' }
          }
          variant="secondary"
          onPress={view.toggleFavorite}
          style={{ flex: 1 }}
        />
        <AppButton
          label={states.rating === null ? t({ key: 'account.rate' }) : formatRating(states.rating)}
          icon={
            states.rating === null
              ? { ios: 'star', android: 'star_border' }
              : { ios: 'star.fill', android: 'star' }
          }
          variant="secondary"
          onPress={view.openRating}
          style={{ flex: 1 }}
        />
        <AppButton
          label={t({ key: 'account.addToList' })}
          icon={{ ios: 'text.badge.plus', android: 'playlist_add' }}
          variant="secondary"
          onPress={view.openLists}
          style={{ flex: 1 }}
        />
      </View>

      <AppSheet
        visible={view.isRatingSheetOpen}
        title={t({ key: 'account.rateTitle', params: { title: view.title } })}
        doneLabel={t({ key: 'common.cancel' })}
        onDone={view.closeRating}
        {...(states.rating === null
          ? {}
          : {
              secondaryLabel: t({ key: 'account.removeRating' }),
              onSecondary: () => {
                view.rate(null);
              },
            })}
      >
        <AppText role="body" scale="medium" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
          {t({ key: 'account.rateHint' })}
        </AppText>
        <View style={styles.stars}>
          {stars.map((value) => {
            const filled = states.rating !== null && value <= states.rating;
            return (
              <AppPressable
                key={value}
                onPress={() => {
                  view.rate(value);
                }}
                accessibilityLabel={t({ key: 'account.starsLabel', params: { count: value } })}
                selected={filled}
              >
                <View style={styles.star}>
                  <AppIcon
                    name={
                      filled ? { ios: 'star.fill', android: 'star' } : { ios: 'star', android: 'star_border' }
                    }
                    size="l"
                    color={filled ? 'warning' : 'onSurfaceVariant'}
                  />
                  <AppText role="label" scale="medium" color="onSurfaceVariant">
                    {value}
                  </AppText>
                </View>
              </AppPressable>
            );
          })}
        </View>
      </AppSheet>

      <ListPickerSheet
        visible={view.isListSheetOpen}
        title={t({ key: 'account.addToList' })}
        lists={view.lists}
        isLoading={view.isListsLoading}
        addedTo={view.addedTo}
        onPick={view.addToList}
        onDone={view.closeLists}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  bar: {
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  stars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.s,
  },
  star: {
    alignItems: 'center',
    gap: theme.spacing.xxs,
    padding: theme.spacing.xs,
  },
}));
