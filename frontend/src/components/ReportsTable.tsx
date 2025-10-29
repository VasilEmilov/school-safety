// frontend/src/components/ReportsTable.tsx
import type { FC } from 'react';

type Attachment = {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
};

type School = {
  id: string;
  name: string;
  slug: string;
};

type Report = {
  id: string;
  description: string;
  category?: string | null;
  incidentDate?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  school: School;
  attachments: Attachment[];
};

interface ReportsTableProps {
  reports: Report[];
}

const ReportsTable: FC<ReportsTableProps> = ({ reports }) => (
  <div>
    <h2>Reports</h2>
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>School</th>
          <th>Description</th>
          <th>Category</th>
          <th>Incident Date</th>
          <th>Contact</th>
          <th>Attachments</th>
          <th>Submitted</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td>{report.id.slice(0, 8)}</td>
            <td>{report.school?.name}</td>
            <td>{report.description}</td>
            <td>{report.category ?? '—'}</td>
            <td>{report.incidentDate ? new Date(report.incidentDate).toLocaleDateString() : '—'}</td>
            <td>
              <div>{report.contactEmail ?? '—'}</div>
              <div>{report.contactPhone ?? ''}</div>
            </td>
            <td>{report.attachments.length}</td>
            <td>{new Date(report.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportsTable;
