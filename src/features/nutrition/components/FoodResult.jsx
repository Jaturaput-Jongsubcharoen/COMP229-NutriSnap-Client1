import { useState } from 'react';
import { foodToEntry } from '../../food-search/services/nutritionixService';
import { saveEntry } from '../services/nutritionService';
import NutritionCard from './NutritionCard';
import Feedback from '../../../components/feedback/Feedback';
export default function FoodResult({ food }) {
  const entry = foodToEntry(food);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(null);
  const save = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await saveEntry(entry);
      setSaved(response);
      setMessage('Saved to history as Dinner.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <NutritionCard entry={entry}>
        <span className="muted">Source: Nutritionix · saved as Dinner</span>
        <button className="button primary" disabled={busy} onClick={save}>
          {busy ? 'Saving…' : 'Save entry'}
        </button>
      </NutritionCard>
      <Feedback error={error} message={message} />
      {saved && (
        <section
          className="section-block"
          aria-label="Recently stored nutrient entry"
        >
          <p className="eyebrow">Recently stored nutrient entry</p>
          <NutritionCard entry={saved} />
        </section>
      )}
    </div>
  );
}
