import { useEffect, useRef, useState } from 'react';
import PageHeading from '../../../components/ui/PageHeading';
import Icon from '../../../components/ui/Icon';
import Feedback from '../../../components/feedback/Feedback';
import FoodResult from '../../nutrition/components/FoodResult';
import { decodeBarcode } from '../services/decodeBarcode';
import { lookupBarcode } from '../../food-search/services/nutritionixService';
export default function BarcodePage() {
  const [image, setImage] = useState('');
  const [barcode, setBarcode] = useState('');
  const [food, setFood] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    []
  );
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image);
    },
    [image]
  );
  const upload = (event) => {
    generation.current += 1;
    setFood(null);
    setBarcode('');
    setError('');
    setBusy(false);
    const file = event.target.files?.[0];
    if (!file) {
      setImage('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      setImage('');
      return;
    }
    setImage(URL.createObjectURL(file));
  };
  const scan = async () => {
    if (!image) {
      setError('Upload a barcode image first.');
      return;
    }
    const current = ++generation.current;
    setBusy(true);
    setError('');
    setFood(null);
    setBarcode('');
    try {
      const code = await decodeBarcode(image);
      if (current !== generation.current) return;
      setBarcode(code);
      const result = await lookupBarcode(code);
      if (current === generation.current) setFood(result);
    } catch (err) {
      if (current === generation.current)
        setError(err.message || 'Unable to scan this barcode.');
    } finally {
      if (current === generation.current) setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="02 / READ THE LABEL"
        title="Scan it. Know it."
        description="Upload a clear barcode image to look up its nutrition."
      />
      <div className="feature-layout">
        <section className="panel">
          <label className="upload-zone" htmlFor="barcode-image">
            <Icon name="barcode" size={46} />
            <strong>Bring the label into focus.</strong>
            <span className="muted">Choose a UPC or EAN barcode image</span>
            <input
              id="barcode-image"
              type="file"
              accept="image/*"
              onChange={upload}
            />
          </label>
          {image && (
            <img
              className="barcode-preview"
              src={image}
              alt="Uploaded barcode preview"
            />
          )}
          <button
            className="button primary"
            onClick={scan}
            disabled={busy || !image}
          >
            {busy ? 'Scanning…' : 'Scan Barcode'}
            <Icon name="barcode" size={18} />
          </button>
          <Feedback error={error} loading={busy} />
          {barcode && (
            <p className="barcode-value">
              Barcode: <strong>{barcode}</strong>
            </p>
          )}
          <p className="micro-copy">
            Keep the whole barcode visible and avoid glare. Image upload only;
            no camera permission needed.
          </p>
        </section>
        <section aria-label="Barcode result">
          {food ? (
            <FoodResult key={barcode} food={food} />
          ) : (
            <div className="result-placeholder">
              <div className="barcode-art" aria-hidden="true" />
              <span className="eyebrow">SCAN / DISCOVER / SAVE</span>
              <h2>
                From label to
                <br />
                nutrition facts.
              </h2>
              <p className="muted">
                Product matches are provided by Nutritionix.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
