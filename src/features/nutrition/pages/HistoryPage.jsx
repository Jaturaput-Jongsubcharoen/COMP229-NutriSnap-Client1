import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import useEntries from '../hooks/useEntries';
import { deleteEntry } from '../services/nutritionService';
import NutritionCard from '../components/NutritionCard';
import PageHeading from '../../../components/ui/PageHeading';
import Feedback from '../../../components/feedback/Feedback';
import Icon from '../../../components/ui/Icon';
export default function HistoryPage() {
  const { token } = useAuth();
  const { entries, loading, error, reload } = useEntries();
  const [removed, setRemoved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef(null);
  const trigger = useRef(null);
  const restoreFocus = () => {
    if (trigger.current?.isConnected) trigger.current.focus();
    else document.querySelector('main')?.focus();
  };
  const close = () => {
    dialog.current.close();
  };
  const handleDialogKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (!busy) close();
    }
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      dialog.current.querySelectorAll('button:not(:disabled)')
    );
    const first = controls[0],
      last = controls.at(-1);
    if (!first) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const confirm = (entry, event) => {
    trigger.current = event.currentTarget;
    setSelected(entry);
    setDeleteError('');
    dialog.current.showModal();
  };
  const remove = async () => {
    setBusy(true);
    setDeleteError('');
    setMessage('');
    try {
      await deleteEntry(selected._id);
      setRemoved((previous) => [...previous, selected._id]);
      setMessage(`${selected.name} removed from history.`);
      close();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const visible = entries.filter((entry) => !removed.includes(entry._id));
  return (
    <>
      <PageHeading
        eyebrow="YOUR FOOD JOURNAL"
        title="Every bite. Accounted for."
        description="Review the nutrition entries you’ve saved. Keep what matters."
      >
        <Link className="button primary" to="/add-item">
          <Icon name="add" /> Add food
        </Link>
      </PageHeading>
      <Feedback error={error} loading={loading} message={message} />
      {error && (
        <button className="button secondary" onClick={reload}>
          Retry history
        </button>
      )}
      {!token ? (
        <div className="empty-state">
          <Icon name="history" size={36} />
          <div>
            <h2>Your journal is personal.</h2>
            <p className="muted">
              Login to view and manage your saved entries.
            </p>
          </div>
          <Link className="button primary" to="/login">
            Login
          </Link>
        </div>
      ) : !loading && !error && !visible.length ? (
        <div className="empty-state">
          <Icon name="history" size={36} />
          <div>
            <h2>A clean slate.</h2>
            <p className="muted">
              No items have been stored yet. Start with your next meal.
            </p>
          </div>
          <Link className="button primary" to="/add-item">
            Add an item
          </Link>
        </div>
      ) : (
        <>
          <p className="eyebrow">{visible.length} SAVED ENTRIES</p>
          <div className="entry-grid">
            {visible.map((entry, index) => (
              <NutritionCard key={entry._id || index} entry={entry}>
                <button
                  className="button danger"
                  disabled={!entry._id}
                  aria-label={`Remove ${entry.name}`}
                  onClick={(event) => confirm(entry, event)}
                >
                  <Icon name="trash" size={16} />
                  Remove item
                </button>
              </NutritionCard>
            ))}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        onKeyDown={handleDialogKey}
        onClose={restoreFocus}
        className="confirm-dialog"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <h2 id="delete-title">Remove this entry?</h2>
        <p id="delete-description">
          “{selected?.name}” will be removed from your saved history.
        </p>
        <Feedback error={deleteError} />
        <div className="dialog-actions">
          <button
            className="button secondary"
            autoFocus
            disabled={busy}
            onClick={close}
          >
            Keep entry
          </button>
          <button className="button danger" disabled={busy} onClick={remove}>
            {busy ? 'Removing…' : 'Remove item'}
          </button>
        </div>
      </dialog>
    </>
  );
}
