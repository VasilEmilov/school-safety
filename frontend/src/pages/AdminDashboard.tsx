// frontend/src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import type { AuthContext } from '../App';
import ReportsTable from '../components/ReportsTable';

type Report = {
  id: string;
  description: string;
  category?: string | null;
  incidentDate?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  school: { id: string; name: string; slug: string };
  attachments: { id: string; filename: string; mimetype: string; size: number; path: string }[];
};

interface AdminDashboardProps {
  auth: AuthContext;
}

const AdminDashboard = ({ auth }: AdminDashboardProps) => {
  const { token, user, apiBaseUrl } = auth;
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to load reports');
        }
        const data = (await response.json()) as Report[];
        setReports(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, apiBaseUrl]);

  if (!token || user?.role !== 'SCHOOL_ADMIN') {
    return <p>Only school administrators can view this dashboard.</p>;
  }

  return (
    <section>
      <h1>{user?.schoolId ? 'School Reports' : 'Reports'}</h1>
      {loading && <p>Loading reports…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <ReportsTable reports={reports} />}
    </section>
  );
};

export default AdminDashboard;
