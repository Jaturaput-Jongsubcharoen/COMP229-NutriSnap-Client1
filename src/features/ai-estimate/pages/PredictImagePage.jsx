import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../../../components/ui/PageHeading';
import Icon from '../../../components/ui/Icon';
import Feedback from '../../../components/feedback/Feedback';
import EntryForm from '../../nutrition/components/EntryForm';
import NutritionCard from '../../nutrition/components/NutritionCard';
import { estimateNutrition } from '../services/estimateService';
export default function PredictImagePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState([]);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setResult('');
    try {
      setResult(await estimateNutrition(input));
    } catch (err) {
      setError(err.message || 'Unable to get an estimate. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="03 / A LITTLE GUIDANCE"
        title="Not sure? Start here."
        description="Describe your meal for an AI-assisted estimate. Review every value before saving."
      />
      <div className="feature-layout">
        <section className="panel">
          <div className="feature-icon">
            <Icon name="spark" size={32} />
          </div>
          <h2>Describe your food</h2>
          <p className="muted">
            Tell us about ingredients, serving size, and how it was prepared.
          </p>
          <form onSubmit={submit} aria-busy={busy}>
            <label htmlFor="estimate-input">
              Food description
              <textarea
                id="estimate-input"
                rows="5"
                placeholder="e.g. A bowl of homemade chicken soup, about 300ml…"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                required
              />
            </label>
            <button className="button primary" disabled={busy}>
              {busy ? 'Estimating…' : 'Get estimate'}
              <Icon name="spark" size={18} />
            </button>
          </form>
          <Feedback error={error} loading={busy} />
          <p className="micro-copy">
            AI estimates can be inaccurate. Check against a food label when
            available.
          </p>
          <Link to="/add-item" className="text-link">
            Prefer to enter known values? <Icon name="arrow" size={16} />
          </Link>
        </section>
        <section>
          {result ? (
            <div className="panel">
              <span className="badge">AI ESTIMATE / REVIEW REQUIRED</span>
              <h2>Your starting point</h2>
              <p className="estimate-text">{result}</p>
              <hr />
              <h3>Manually confirm values</h3>
              <p className="muted">
                Enter the numbers you want to save. Estimates are never saved
                automatically.
              </p>
              <EntryForm
                buttonLabel="Save to History"
                onSaved={(entry) =>
                  setSaved((previous) => [entry, ...previous])
                }
              />
            </div>
          ) : (
            <div className="result-placeholder">
              <Icon name="spark" size={52} />
              <span className="eyebrow">ESTIMATE / REVIEW / CONFIRM</span>
              <h2>
                Turn a description
                <br />
                into a starting point.
              </h2>
              <p className="muted">Your estimate will appear here.</p>
            </div>
          )}
        </section>
      </div>
      {saved.length > 0 && (
        <section className="section-block">
          <h2>Saved this session</h2>
          <div className="entry-grid">
            {saved.map((entry, index) => (
              <NutritionCard key={index} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
