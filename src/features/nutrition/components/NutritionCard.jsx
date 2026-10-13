import { formatNumber, macroFields } from '../nutritionUtils';
export default function NutritionCard({ entry, children }) {
  return (
    <article className="nutrition-card">
      <div className="nutrition-card-top">
        <div>
          <p className="eyebrow">{entry.mealType || 'Nutrition facts'}</p>
          <h3>{entry.name}</h3>
        </div>
        <span className="entry-symbol" aria-hidden="true">
          N/
        </span>
      </div>
      <div className="entry-calories">
        <strong>{formatNumber(entry.calories)}</strong>
        <span>KCAL</span>
      </div>
      <dl className="macro-list">
        {macroFields.map((field) => (
          <div key={field.key}>
            <dt>{field.label}</dt>
            <dd>
              {formatNumber(entry[field.key])}
              <small> {field.unit}</small>
            </dd>
          </div>
        ))}
      </dl>
      {entry.barcode && <p className="muted">Barcode: {entry.barcode}</p>}
      {entry.aiImage && (
        <img
          className="entry-image"
          src={entry.aiImage}
          alt={`${entry.name} attachment`}
          loading="lazy"
        />
      )}
      {children && <div className="card-actions">{children}</div>}
    </article>
  );
}
