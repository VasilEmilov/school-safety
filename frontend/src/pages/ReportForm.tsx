// frontend/src/pages/ReportForm.tsx
import { FormEvent, useState } from 'react';

interface ReportFormProps {
  apiBaseUrl: string;
}

const ReportForm = ({ apiBaseUrl }: ReportFormProps) => {
  const [schoolSlug, setSchoolSlug] = useState('central-high');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('description', description);
    if (category) formData.append('category', category);
    if (incidentDate) formData.append('incidentDate', incidentDate);
    if (contactEmail) formData.append('contactEmail', contactEmail);
    if (contactPhone) formData.append('contactPhone', contactPhone);
    if (attachments) {
      Array.from(attachments).forEach((file) => {
        formData.append('attachments', file);
      });
    }

    try {
      const response = await fetch(`${apiBaseUrl}/reports/public/${schoolSlug}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setMessage('Report submitted successfully. Thank you for speaking up.');
      setDescription('');
      setCategory('');
      setIncidentDate('');
      setContactEmail('');
      setContactPhone('');
      setAttachments(null);
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Anonymous Safety Report</h1>
      <p>Submit details about bullying, threats, or violence at your school. Your identity is not collected.</p>
      <form onSubmit={handleSubmit}>
        <label>
          School Code
          <input value={schoolSlug} onChange={(event) => setSchoolSlug(event.target.value)} required />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={5}
          />
        </label>
        <label>
          Category (optional)
          <input value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
        <label>
          Incident Date (optional)
          <input value={incidentDate} onChange={(event) => setIncidentDate(event.target.value)} type="date" />
        </label>
        <label>
          Contact Email (optional)
          <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} type="email" />
        </label>
        <label>
          Contact Phone (optional)
          <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} type="tel" />
        </label>
        <label>
          Attach evidence (optional)
          <input onChange={(event) => setAttachments(event.target.files)} type="file" multiple />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Report'}
        </button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </section>
  );
};

export default ReportForm;
