import { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiRefreshCw,
  FiSearch,
  FiDownload,
  FiEye,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const initialTransactions = [
  {
    id: "TXN-5001",
    orderId: "FD-1082",
    customer: "Arun Kumar",
    method: "UPI",
    date: "2026-10-24",
    amount: 850,
    commission: 85,
    status: "Completed",
  },
  {
    id: "TXN-5002",
    orderId: "FD-1083",
    customer: "Priya Sharma",
    method: "Credit Card",
    date: "2026-10-24",
    amount: 1250,
    commission: 125,
    status: "Completed",
  },
  {
    id: "TXN-5003",
    orderId: "FD-1084",
    customer: "Rahul Raj",
    method: "Cash on Delivery",
    date: "2026-10-23",
    amount: 560,
    commission: 56,
    status: "Pending",
  },
  {
    id: "TXN-5004",
    orderId: "FD-1085",
    customer: "Divya S",
    method: "UPI",
    date: "2026-10-23",
    amount: 720,
    commission: 72,
    status: "Refunded",
  },
  {
    id: "TXN-5005",
    orderId: "FD-1086",
    customer: "Karthik M",
    method: "Debit Card",
    date: "2026-10-22",
    amount: 1680,
    commission: 168,
    status: "Completed",
  },
  {
    id: "TXN-5006",
    orderId: "FD-1087",
    customer: "Sneha R",
    method: "UPI",
    date: "2026-10-22",
    amount: 940,
    commission: 94,
    status: "Pending",
  },
  {
    id: "TXN-5007",
    orderId: "FD-1088",
    customer: "Vijay Anand",
    method: "Credit Card",
    date: "2026-10-21",
    amount: 2100,
    commission: 210,
    status: "Completed",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusStyles = {
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function Finance() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredTransactions = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchText) ||
        transaction.orderId.toLowerCase().includes(searchText) ||
        transaction.customer.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || transaction.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || transaction.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, search, statusFilter, methodFilter]);

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const completedRevenue = completedTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const totalCommission = completedTransactions.reduce(
    (total, transaction) => total + transaction.commission,
    0
  );

  const pendingAmount = transactions
    .filter((transaction) => transaction.status === "Pending")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const refundedAmount = transactions
    .filter((transaction) => transaction.status === "Refunded")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const processRefund = (transactionId) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: "Refunded" }
          : transaction
      )
    );

    setSelectedTransaction((current) =>
      current?.id === transactionId
        ? { ...current, status: "Refunded" }
        : current
    );

    setNotice(`Refund status updated for ${transactionId}.`);
  };

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Order ID",
      "Customer",
      "Payment Method",
      "Date",
      "Amount",
      "Commission",
      "Status",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.orderId,
      transaction.customer,
      transaction.method,
      transaction.date,
      transaction.amount,
      transaction.commission,
      transaction.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "food-delivery-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNotice(`${filteredTransactions.length} transactions exported.`);
  };

  const stats = [
    {
      label: "Completed Payments",
      value: formatMoney(completedRevenue),
      description: `${completedTransactions.length} transactions`,
      icon: FiDollarSign,
      color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      label: "Platform Commission",
      value: formatMoney(totalCommission),
      description: "From completed payments",
      icon: FiTrendingUp,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Pending Payments",
      value: formatMoney(pendingAmount),
      description: "Awaiting confirmation",
      icon: FiClock,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      label: "Refunded Amount",
      value: formatMoney(refundedAmount),
      description: "Marked as refunded",
      icon: FiRefreshCw,
      color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview / Finance Management
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Payments &amp; Finance
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review transactions, platform commission, and refunds.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="button-animate flex w-fit items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-900"
        >
          <FiDownload
            size={17}
            className="transition-transform duration-200 group-hover:translate-y-1"
          />
          Export CSV
        </button>
      </div>

      {/* Notification */}
      {notice && (
        <div
          role="status"
          className="card-animate flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
        >
          <span className="flex items-center gap-2">
            <FiCheckCircle size={18} />
            {notice}
          </span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="rounded-lg p-1 transition hover:bg-green-100 hover:text-green-900 dark:hover:bg-green-900/50"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              style={{ animationDelay: `${index * 80}ms` }}
              className="card-animate hover-card group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400 sm:text-2xl">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`shrink-0 rounded-xl p-3 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Transaction history */}
      <section className="card-animate overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Search, filter, inspect, and export transactions.
          </p>
        </div>

        {/* Search and filters */}
        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="group relative min-w-0">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-500"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transaction, order, or customer..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-orange-900/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-orange-900/30"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-orange-900/30"
          >
            <option value="All">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-5 py-4 font-semibold">Transaction</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Payment Method</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Commission</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  style={{ animationDelay: `${index * 35}ms` }}
                  className="table-row-animate group transition-colors duration-200 hover:bg-orange-50/70 dark:hover:bg-gray-800/80"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                      {transaction.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Order: {transaction.orderId}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString("en-IN")}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {transaction.customer}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiCreditCard className="text-gray-400" />
                      {transaction.method}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {formatMoney(transaction.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatMoney(transaction.commission)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition-transform duration-200 group-hover:scale-105 ${statusStyles[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(transaction)}
                        title="View transaction"
                        aria-label={`View ${transaction.id}`}
                        className="button-animate rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <FiEye
                          size={16}
                          className="transition-transform duration-200 hover:scale-110"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FiCreditCard
                      className="mx-auto text-gray-300 dark:text-gray-600"
                      size={32}
                    />

                    <p className="mt-3 font-semibold text-gray-700 dark:text-gray-200">
                      No transactions found
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                        setMethodFilter("All");
                      }}
                      className="button-animate mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </span>

          <span className="text-xs">
            {statusFilter !== "All" || methodFilter !== "All" || search
              ? "Filters applied"
              : "Showing all transactions"}
          </span>
        </div>
      </section>

      {/* Transaction details modal */}
      {selectedTransaction && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
            className="modal-animate max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div>
                <h2
                  id="transaction-modal-title"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  Transaction Details
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedTransaction.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close transaction details"
                className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-orange-600 dark:hover:bg-gray-800"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="hover-card rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transaction Amount
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {formatMoney(selectedTransaction.amount)}
                </p>

                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedTransaction.status]}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              {[
                ["Order ID", selectedTransaction.orderId],
                ["Customer", selectedTransaction.customer],
                ["Payment Method", selectedTransaction.method],
                [
                  "Date",
                  new Date(selectedTransaction.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  ),
                ],
                [
                  "Platform Commission",
                  formatMoney(selectedTransaction.commission),
                ],
                [
                  "Restaurant Payout (estimated)",
                  formatMoney(
                    selectedTransaction.amount -
                      selectedTransaction.commission
                  ),
                ],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className="card-animate flex items-start justify-between gap-4 border-b border-gray-100 pb-3 text-sm dark:border-gray-800"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {label}
                  </span>

                  <span className="text-right font-semibold text-gray-900 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}

              {selectedTransaction.status !== "Refunded" && (
                <button
                  type="button"
                  onClick={() => processRefund(selectedTransaction.id)}
                  className="button-animate flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
                >
                  <FiRefreshCw size={17} />
                  Mark as Refunded
                </button>
              )}

              {selectedTransaction.status === "Refunded" && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <FiCheckCircle size={18} />
                  Marked as refunded
                </div>
              )}

              <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                <FiAlertCircle className="mt-0.5 shrink-0" />
                Demo action only: this changes the displayed status. It does
                not initiate a real payment-provider refund.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;