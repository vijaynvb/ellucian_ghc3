import { useEffect, useState } from "react";
import { reportsApi } from "../api/reports.api";

export const ReportsPage = () => {
  const [summary, setSummary] = useState<unknown>(null);

  useEffect(() => {
    void (async () => {
      const data = await reportsApi.statusSummary();
      setSummary(data);
    })();
  }, []);

  return (
    <section className="page">
      <h2>Reports</h2>
      {summary ? <pre>{JSON.stringify(summary, null, 2)}</pre> : <p>Loading reports...</p>}
    </section>
  );
};
