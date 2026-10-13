import { useState } from 'react';
import PageHeading from '../../../components/ui/PageHeading';
import Icon from '../../../components/ui/Icon';
import Feedback from '../../../components/feedback/Feedback';
import FoodResult from '../../nutrition/components/FoodResult';
import { searchFood } from '../services/nutritionixService';
export default function TextSearchPage() {
  const [query, setQuery] = useState('');
  const [food, setFood] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setFood(null);
    try {
      setFood(await searchFood(query));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="01 / KNOW YOUR FOOD"
        title="Food. Facts. Fuel."
        description="Search a food or describe a serving to see its nutritional content."
      />
      <div className="feature-layout">
        <section className="panel">
          <div className="feature-icon">
            <Icon name="search" size={32} />
          </div>
          <h2>What’s on your plate?</h2>
          <p className="muted">
            Include a quantity for a more useful result. For example, “100g
            cooked rice”.
          </p>
          <form onSubmit={submit} aria-busy={busy}>
            <label htmlFor="food-query">
              Food description
              <input
                id="food-query"
                placeholder="e.g. 1 banana and 2 eggs"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
              />
            </label>
            <button className="button primary" disabled={busy}>
              {busy ? 'Searching…' : 'Search food'}
              <Icon name="search" size={18} />
            </button>
          </form>
          <Feedback error={error} loading={busy} />
          <p className="micro-copy">
            Powered by Nutritionix. The first matching food is shown.
          </p>
        </section>
        <section aria-label="Search result">
          {food ? (
            <FoodResult key={JSON.stringify(food)} food={food} />
          ) : (
            <div className="result-placeholder">
              <span className="eyebrow">NUTRITION / IN FOCUS</span>
              <strong>
                KCAL<span> + </span>MACROS
              </strong>
              <p className="muted">
                Your search results will appear here.
                <br />
                Real food data. Clear numbers.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
