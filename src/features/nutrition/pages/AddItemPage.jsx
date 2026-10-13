import { useState } from 'react';
import PageHeading from '../../../components/ui/PageHeading';
import EntryForm from '../components/EntryForm';
import NutritionCard from '../components/NutritionCard';
export default function AddItemPage() {
  const [saved, setSaved] = useState([]);
  return (
    <>
      <PageHeading
        eyebrow="YOUR FOOD / YOUR NUMBERS"
        title="Make it count."
        description="Add a custom food with the nutrition values you know."
      />
      <div className="feature-layout">
        <section className="panel">
          <h2>Fill product information</h2>
          <p className="muted">
            Use the serving size on your label. Blank values stay blank.
          </p>
          <EntryForm
            allowAttachment
            onSaved={(entry) => setSaved((previous) => [entry, ...previous])}
          />
        </section>
        <section>
          <div className="section-heading">
            <h2>This session</h2>
            <span className="badge">{saved.length} SAVED</span>
          </div>
          {saved.length ? (
            <div className="session-list">
              {saved.map((entry, index) => (
                <NutritionCard key={index} entry={entry}>
                  {entry.attachmentName && (
                    <small className="muted">
                      Local attachment: {entry.attachmentName}
                    </small>
                  )}
                </NutritionCard>
              ))}
            </div>
          ) : (
            <div className="result-placeholder">
              <span className="eyebrow">ONE ENTRY AT A TIME</span>
              <strong>
                YOUR
                <br />
                NEXT BITE.
              </strong>
              <p className="muted">
                Successfully saved entries appear here.
                <br />
                Your full journal lives in History.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
