import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { CATEGORIES } from '../constants/categories';

const INITIAL = { name: '', description: '', photo: '', category: '', contact: '', location: '' };

function LostForm({ setLostItems, onSuccess }) {
  const [item, setItem] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, val) => setItem(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.name || !item.description) return;
    setSubmitting(true);
    setTimeout(() => {
      setLostItems(prev => [
        { ...item, id: Date.now(), reportedAt: new Date().toLocaleString() },
        ...prev,
      ]);
      setItem(INITIAL);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    }, 400);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Item Name <span className="required">*</span></label>
        <input
          className="input-3d"
          type="text"
          placeholder="e.g. Blue Water Bottle, Student ID Card"
          value={item.name}
          onChange={e => set('name', e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Category</label>
        <select
          className="input-3d select-3d"
          value={item.category}
          onChange={e => set('category', e.target.value)}
        >
          <option value="">— Select a category —</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Where & When Lost <span className="required">*</span></label>
        <textarea
          className="input-3d"
          rows={3}
          placeholder="Describe where/when you lost it — Library 2nd floor, Monday evening..."
          value={item.description}
          onChange={e => set('description', e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Last Seen Location</label>
        <input
          className="input-3d"
          type="text"
          placeholder="e.g. Block-B Canteen, CS Dept Corridor"
          value={item.location}
          onChange={e => set('location', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Your Contact (Phone / Email)</label>
        <input
          className="input-3d"
          type="text"
          placeholder="So the finder can reach you"
          value={item.contact}
          onChange={e => set('contact', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Upload Photo <span className="label-hint">(optional)</span></label>
        <ImageUpload onImageChange={val => set('photo', val)} preview={item.photo} />
      </div>

      <button className={`btn-3d ${submitting ? 'btn-loading' : ''}`} type="submit" disabled={submitting}>
        {submitting ? '⏳ Submitting...' : '📋 Report Lost Item'}
      </button>
    </form>
  );
}

export default LostForm;
