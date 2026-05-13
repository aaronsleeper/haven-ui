// Prop schema for MealDeliveryCard. Mirror of
// packages/design-system/pattern-library/components/meal-delivery-card.html.

export type MealDeliveryTagVariant =
  | 'info'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'primary';

export interface MealDeliveryTag {
  label: string;
  /** Badge color variant — defaults to 'info'. Maps to badge-{variant} CSS. */
  variant?: MealDeliveryTagVariant;
}

export interface MealDeliveryCardProps {
  /** Image URL. When missing/empty, the card shows a sand-100 placeholder. */
  imgSrc?: string;
  /** Image alt text. Required when imgSrc is set; ignored on placeholder. */
  imgAlt?: string;
  /** Meal name — Body/02 medium. */
  name: string;
  /** Day label — Body/04 muted (e.g., "Monday"). */
  day: string;
  /** Diet/dietary tag badges. 2-3 recommended max per wireframe. */
  tags?: MealDeliveryTag[];
  /** Swap callback. When undefined, the Swap button is not rendered (use this
   *  in bottom-sheet contexts where the card represents a substitute candidate). */
  onSwap?: () => void;
  /** When true, applies .is-swapped: hides Swap button, shows "Swapped" pill. */
  isSwapped?: boolean;
  /** Swap-button text. Consumer overrides for i18n. Defaults to "Swap meal". */
  swapLabel?: string;
  /** Swapped-pill text. Consumer overrides for i18n. Defaults to "Swapped". */
  swappedLabel?: string;
}
