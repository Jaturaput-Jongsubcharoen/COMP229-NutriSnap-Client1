import { useId, useState } from 'react';
import { emptyEntry, validateEntry } from '../nutritionUtils';
import { saveEntry } from '../services/nutritionService';
import Feedback from '../../../components/feedback/Feedback';
import Icon from '../../../components/ui/Icon';
export default function EntryForm({
  onSaved,
  allowAttachment = false,
  buttonLabel = 'Save entry',
}) {
  const id = useId();
  const [entry, setEntry] = useState({ ...emptyEntry });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const change = (event) =>
    setEntry((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    const validation = validateEntry(entry);
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await saveEntry(entry);
      onSaved?.({ ...entry, attachmentName: attachment?.name });
      setEntry({ ...emptyEntry });
      setAttachment(null);
      event.target.reset();
      setMessage('Entry saved to your history.');
    } catch (err) {
      setError(err.message || 'Unable to save. Your values have been kept.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="entry-form" onSubmit={submit} aria-busy={busy}>
      <label htmlFor={`${id}-name`}>
        Food name
        <input
          id={`${id}-name`}
          name="name"
          placeholder="e.g. Grilled chicken bowl"
          value={entry.name}
          onChange={change}
          required
          maxLength={300}
        />
      </label>
      <div className="form-grid">
        {[
          ['calories', 'Calories', 'kcal'],
          ['protein', 'Protein', 'g'],
          ['carbohydrates', 'Carbohydrates', 'g'],
          ['fat', 'Fat', 'g'],
        ].map(([key, label, unit]) => (
          <label key={key} htmlFor={`${id}-${key}`}>
            {label} <span className="muted">({unit})</span>
            <input
              id={`${id}-${key}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              name={key}
              placeholder="0"
              value={entry[key]}
              onChange={change}
            />
          </label>
        ))}
      </div>
      <label htmlFor={`${id}-meal`}>
        Meal type
        <select
          id={`${id}-meal`}
          name="mealType"
          value={entry.mealType}
          onChange={change}
          required
        >
          <option value="" disabled>
            Select meal type
          </option>
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
            <option key={meal}>{meal}</option>
          ))}
        </select>
      </label>
      {allowAttachment && (
        <label htmlFor={`${id}-attachment`}>
          Barcode image <span className="muted">(optional)</span>
          <input
            id={`${id}-attachment`}
            type="file"
            accept="image/*"
            onChange={(event) => setAttachment(event.target.files?.[0] || null)}
          />
          <small className="muted">
            For this session only. Use Scan barcode to decode an image.
          </small>
        </label>
      )}
      <Feedback error={error} message={message} />
      <button className="button primary" type="submit" disabled={busy}>
        {busy ? 'Saving…' : buttonLabel}
        <Icon name="add" size={18} />
      </button>
    </form>
  );
}
