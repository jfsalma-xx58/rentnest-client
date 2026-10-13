import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PAGE_SIZE = 10;

const pageButton =
  "rounded-md border border-teal-brand px-4 py-2 text-sm font-medium " +
  "text-teal-brand hover:bg-teal-brand hover:text-cream " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    transactions: [],
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    axiosSecure
      .get("/admin/transactions", { params: { page, limit: PAGE_SIZE } })
      .then((res) => {
        if (active) setData(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [axiosSecure, page]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Transactions
      </h1>
      <p className="mt-1 text-sm text-charcoal/70">
        {data.total} {data.total === 1 ? "transaction" : "transactions"} in total
      </p>

      {loading && <p className="mt-6 text-charcoal/70">Loading transactions...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load transactions. Please refresh the page.
        </p>
      )}

      {!loading && !error && data.transactions.length === 0 && (
        <p className="mt-6 text-charcoal/70">No transactions yet.</p>
      )}

      {!loading && !error && data.transactions.length > 0 && (
        <>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal/70">
                  <th className="py-3 pr-4 font-semibold">Transaction ID</th>
                  <th className="py-3 pr-4 font-semibold">Property</th>
                  <th className="py-3 pr-4 font-semibold">Tenant</th>
                  <th className="py-3 pr-4 font-semibold">Owner</th>
                  <th className="py-3 pr-4 font-semibold">Amount</th>
                  <th className="py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-charcoal/5 last:border-0"
                  >
                    <td className="py-3 pr-4 font-mono text-xs text-charcoal">
                      {item.transactionId}
                    </td>
                    <td className="py-3 pr-4 text-charcoal">
                      {item.propertyTitle}
                    </td>
                    <td className="py-3 pr-4 text-charcoal">
                      {item.tenantName}
                    </td>
                    <td className="py-3 pr-4 text-charcoal">
                      {item.ownerName}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-charcoal">
                      ${Number(item.amount).toFixed(2)}
                    </td>
                    <td className="py-3 text-charcoal">
                      {formatDate(item.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className={pageButton}
              >
                Previous
              </button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`h-10 w-10 rounded-md text-sm font-medium ${
                      number === page
                        ? "bg-teal-brand text-cream"
                        : "border border-charcoal/15 text-charcoal hover:border-teal-brand"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages}
                className={pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;