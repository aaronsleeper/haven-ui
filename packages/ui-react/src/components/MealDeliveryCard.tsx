import type { MealDeliveryCardProps } from './MealDeliveryCard.props';

export type {
  MealDeliveryCardProps,
  MealDeliveryTag,
  MealDeliveryTagVariant,
} from './MealDeliveryCard.props';

// Mirror of packages/design-system/pattern-library/components/meal-delivery-card.html.
// Horizontal card: photo left, name + day + tag badges + Swap button right.
// Used in /meals weekly list (MEALS-01). Omit onSwap in bottom-sheet contexts
// where the card represents a substitute candidate. Add isSwapped to hide the
// swap button and show a Swapped pill after substitution.
//
// Distinct from MealOptionCard (agentic browse + select for the chat-pane;
// carries a quantity-stepper + price + recommendation/warning state).

export function MealDeliveryCard({
  imgSrc,
  imgAlt = '',
  name,
  day,
  tags,
  onSwap,
  isSwapped = false,
  swapLabel = 'Swap meal',
  swappedLabel = 'Swapped',
}: MealDeliveryCardProps) {
  return (
    <div className={`meal-delivery-card${isSwapped ? ' is-swapped' : ''}`}>
      {imgSrc ? (
        <img className="meal-delivery-card-img" src={imgSrc} alt={imgAlt} />
      ) : (
        <div className="meal-delivery-card-img" aria-hidden="true" />
      )}
      <div className="meal-delivery-card-body">
        <p className="meal-delivery-card-name">
          {name}
          {isSwapped && (
            <span className="badge badge-success badge-pill ms-1">{swappedLabel}</span>
          )}
        </p>
        <p className="meal-delivery-card-day">{day}</p>
        {tags && tags.length > 0 && (
          <div className="meal-delivery-card-tags">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`badge badge-${tag.variant ?? 'info'} badge-pill`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        {onSwap && !isSwapped && (
          <button
            type="button"
            className="meal-delivery-card-swap"
            aria-label={`${swapLabel} — ${name}`}
            onClick={onSwap}
          >
            <span className="material-symbols-outlined" aria-hidden="true">swap_horiz</span>
          </button>
        )}
      </div>
    </div>
  );
}
