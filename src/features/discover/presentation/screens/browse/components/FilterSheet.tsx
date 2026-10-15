import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppSheet } from '@shared/core/presentation/components/AppSheet';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { Genre } from '@shared/domain/model/genre';
import { languageName } from '@shared/presentation/mappers/mediaText';
import {
  decades,
  filterLanguages,
  minimumRatings,
  runtimeRanges,
  type BrowseFilters,
  type RuntimeRange,
  type SortOrder,
} from '@features/discover/domain/model/browseFilters';
import type { StreamingService } from '@features/discover/domain/model/watchProvider';
import { sortKey } from '@features/discover/presentation/mappers/discoverText';

export type FilterSheetProps = {
  readonly visible: boolean;
  readonly type: 'movie' | 'tv';
  readonly filters: BrowseFilters;
  readonly sortOrders: readonly SortOrder[];
  readonly genres: readonly Genre[];
  readonly services: readonly StreamingService[];
  readonly onClose: () => void;
  readonly onReset: () => void;
  readonly onSort: (sort: SortOrder) => void;
  readonly onToggleGenre: (genreId: number) => void;
  readonly onToggleService: (serviceId: number) => void;
  readonly onDecade: (decade: number) => void;
  readonly onMinRating: (rating: number) => void;
  readonly onLanguage: (language: string) => void;
  readonly onRuntime: (runtime: RuntimeRange) => void;
};

const Section = ({ title, children }: { readonly title: string; readonly children: ReactNode }) => (
  <View style={styles.section}>
    <AppText role="title" scale="small" color="onSurfaceVariant" accessibilityRole="header">
      {title.toUpperCase()}
    </AppText>
    <View style={styles.wrap}>{children}</View>
  </View>
);

/** A service's logo tile; a ring marks the selected ones. */
const ServiceTile = ({
  service,
  selected,
  onPress,
}: {
  readonly service: StreamingService;
  readonly selected: boolean;
  readonly onPress: () => void;
}) => (
  <AppPressable accessibilityLabel={service.name} selected={selected} onPress={onPress}>
    <View style={styles.service(selected)}>
      <AppImage uri={service.logo?.medium ?? null} shape="m" style={{ width: 48, height: 48 }} />
    </View>
  </AppPressable>
);

/** Every discover filter in one sheet; changes apply live behind it. */
export const FilterSheet = (props: FilterSheetProps) => {
  const t = useTranslate();
  const locale = useLocale();
  const { filters } = props;
  return (
    <AppSheet
      visible={props.visible}
      title={t({ key: 'discover.filters' })}
      doneLabel={t({ key: 'common.done' })}
      onDone={props.onClose}
      secondaryLabel={t({ key: 'discover.reset' })}
      onSecondary={props.onReset}
    >
      <Section title={t({ key: 'discover.sortBy' })}>
        {props.sortOrders.map((sort) => (
          <AppChip
            key={sort}
            label={t({ key: sortKey(sort) })}
            selected={filters.sort === sort}
            onPress={() => {
              props.onSort(sort);
            }}
          />
        ))}
      </Section>
      {props.services.length > 0 && (
        <Section title={t({ key: 'discover.streamingOn' })}>
          {props.services.map((service) => (
            <ServiceTile
              key={service.id}
              service={service}
              selected={filters.providerIds.includes(service.id)}
              onPress={() => {
                props.onToggleService(service.id);
              }}
            />
          ))}
        </Section>
      )}
      <Section title={t({ key: 'discover.genres' })}>
        {props.genres.map((genre) => (
          <AppChip
            key={genre.id}
            label={genre.name}
            selected={filters.genreIds.includes(genre.id)}
            onPress={() => {
              props.onToggleGenre(genre.id);
            }}
          />
        ))}
      </Section>
      <Section title={t({ key: 'discover.decade' })}>
        {decades.map((decade) => (
          <AppChip
            key={decade}
            label={t({ key: 'discover.decadeLabel', params: { decade } })}
            selected={filters.decade === decade}
            onPress={() => {
              props.onDecade(decade);
            }}
          />
        ))}
      </Section>
      <Section title={t({ key: 'discover.minRating' })}>
        {minimumRatings.map((rating) => (
          <AppChip
            key={rating}
            label={t({ key: 'discover.ratingLabel', params: { rating } })}
            icon={{ ios: 'star.fill', android: 'star' }}
            selected={filters.minRating === rating}
            onPress={() => {
              props.onMinRating(rating);
            }}
          />
        ))}
      </Section>
      <Section title={t({ key: props.type === 'movie' ? 'discover.runtime' : 'discover.episodeRuntime' })}>
        {runtimeRanges.map((range) => (
          <AppChip
            key={range}
            label={t({ key: `discover.runtime.${props.type}.${range}` })}
            selected={filters.runtime === range}
            onPress={() => {
              props.onRuntime(range);
            }}
          />
        ))}
      </Section>
      <Section title={t({ key: 'discover.originalLanguage' })}>
        {filterLanguages.map((language) => (
          <AppChip
            key={language}
            label={languageName(language, locale)}
            selected={filters.language === language}
            onPress={() => {
              props.onLanguage(language);
            }}
          />
        ))}
      </Section>
    </AppSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: theme.spacing.m,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
  },
  service: (selected: boolean) => ({
    padding: theme.spacing.xxs,
    borderRadius: theme.shape.l,
    borderWidth: theme.border.medium,
    borderColor: selected ? theme.colors.primary : 'transparent',
  }),
}));
