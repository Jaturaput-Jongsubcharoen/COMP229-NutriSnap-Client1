import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import useEntries from '../../nutrition/hooks/useEntries';
import {
  formatNumber,
  totalEntries,
  macroFields,
} from '../../nutrition/nutritionUtils';
import NutritionCard from '../../nutrition/components/NutritionCard';
import { navigation } from '../../../navigation/navigationConfig';
import PageHeading from '../../../components/ui/PageHeading';
import Icon from '../../../components/ui/Icon';
import Feedback from '../../../components/feedback/Feedback';
export default function DashboardPage() {
  const { token, username } = useAuth();
  const { entries, loading, error, reload } = useEntries();
  const totals = totalEntries(entries);
  const available = Boolean(token) && !loading && !error;
  const summaryValue = (value) => (available ? formatNumber(value) : '—');
  return (
    <>
      <PageHeading
        eyebrow="YOUR EVERYDAY / BETTER FUELED"
        title={
          username
            ? `Let's fuel up, ${username}.`
            : "Let's fuel your potential."
        }
        description="A little awareness. A stronger everyday. Your nutrition starts here."
      >
        <Link to="/add-item" className="button primary">
          <Icon name="add" /> Add food
        </Link>
      </PageHeading>
      <section className="overview-grid" aria-label="Nutrition overview">
        <div className="calorie-panel">
          <div className="panel-heading">
            <span className="eyebrow">Saved nutrition</span>
            <span className="badge">ALL ENTRIES</span>
          </div>
          <p className="calorie-intro">
            The energy behind
            <br />
            your everyday.
          </p>
          <div className="hero-number">
            {summaryValue(totals.calories)}
            <span>KCAL</span>
          </div>
          <div className="calorie-baseline" />
          <div className="panel-bottom">
            <span>
              {available
                ? `${entries.length} saved ${entries.length === 1 ? 'entry' : 'entries'}`
                : 'Your numbers belong here'}
            </span>
            <Icon name="arrow" />
          </div>
        </div>
        <div className="macro-panel">
          <div className="panel-heading">
            <h2>Fuel breakdown</h2>
            <span className="eyebrow">GRAMS / TOTAL</span>
          </div>
          <p className="muted">Macronutrients from all your saved entries.</p>
          <div className="macro-summary">
            {macroFields.map((field, index) => {
              const total = totals.protein + totals.carbohydrates + totals.fat;
              const percent = total > 0 ? (totals[field.key] / total) * 100 : 0;
              return (
                <div className="macro-summary-row" key={field.key}>
                  <div>
                    <span>
                      <i className={`macro-dot macro-${index}`} />
                      {field.label}
                    </span>
                    <strong>
                      {summaryValue(totals[field.key])}
                      <small> g</small>
                    </strong>
                  </div>
                  <div className="macro-track" aria-hidden="true">
                    <span
                      className={`macro-fill macro-${index}`}
                      style={{ width: `${available ? percent : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="micro-copy">
            Saved-entry totals. No daily goal is set.
          </p>
        </div>
      </section>
      <Feedback error={error} loading={loading} />
      {error && (
        <button className="button secondary" onClick={reload}>
          Retry loading nutrition
        </button>
      )}
      {!token && (
        <div className="signin-banner">
          <div>
            <strong>Your progress starts with one entry.</strong>
            <p className="muted">
              Log in to save food and see your own nutrition totals.
            </p>
          </div>
          <Link to="/login" className="button secondary">
            Login <Icon name="arrow" size={18} />
          </Link>
        </div>
      )}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LOG IT YOUR WAY</p>
            <h2>Good habits. Less friction.</h2>
          </div>
          <span className="muted section-caption">
            Three ways to know your food
          </span>
        </div>
        <div className="action-grid">
          {navigation.slice(1, 4).map((item, index) => (
            <Link to={item.to} key={item.to} className="action-card">
              <div className="action-card-top">
                <span className="action-icon">
                  <Icon name={item.icon} size={26} />
                </span>
                <span className="eyebrow">0{index + 1}</span>
              </div>
              <h3>{item.label}</h3>
              <p className="muted">{item.description}</p>
              <span className="action-card-link">
                Get started <Icon name="arrow" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR FOOD JOURNAL</p>
            <h2>Saved & accounted for.</h2>
          </div>
          <Link className="text-link" to="/history">
            View history <Icon name="arrow" size={18} />
          </Link>
        </div>
        {available && entries.length > 0 ? (
          <div className="entry-grid">
            {entries.slice(0, 3).map((entry, index) => (
              <NutritionCard key={entry._id || index} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Icon name="history" size={28} />
            </span>
            <div>
              <h3>
                {loading
                  ? 'Loading your journal…'
                  : error
                    ? 'Your journal is unavailable'
                    : 'A fresh start looks good on you.'}
              </h3>
              <p className="muted">
                {error
                  ? 'Retry loading your saved nutrition above.'
                  : 'Your saved meals will appear here. Start with something you ate.'}
              </p>
            </div>
            <Link to="/add-item" className="text-link">
              Add your first item <Icon name="arrow" size={18} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
