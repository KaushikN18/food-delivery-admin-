
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
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Refunded: "bg-red-100 text-red-700",
};

function Finance() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = search.toLowerCase();

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
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "food-delivery-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      label: "Completed Payments",
      value: formatMoney(completedRevenue),
      description: `${completedTransactions.length} transactions`,
      icon: FiDollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Platform Commission",
      value: formatMoney(totalCommission),
      description: "From completed payments",
      icon: FiTrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Payments",
      value: formatMoney(pendingAmount),
      description: "Awaiting confirmation",
      icon: FiClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Refunded Amount",
      value: formatMoney(refundedAmount),
      description: "Marked as refunded",
      icon: FiRefreshCw,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments & Finance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review transactions, platform commission, and refunds.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FiDownload size={17} />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction history */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-bold text-gray-900">Transaction History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search, filter, inspect, and export transactions.
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transaction, order, or customer..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="All">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
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

            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition hover:bg-orange-50/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {transaction.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Order: {transaction.orderId}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString("en-IN")}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {transaction.customer}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <FiCreditCard className="text-gray-400" />
                      {transaction.method}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {formatMoney(transaction.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatMoney(transaction.commission)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[transaction.status]
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        title="View transaction"
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <FiCreditCard
                      className="mx-auto text-gray-300"
                      size={32}
                    />
                    <p className="mt-3 font-semibold text-gray-700">
                      No transactions found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transaction details modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Transaction Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedTransaction.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close transaction details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-500">Transaction Amount</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatMoney(selectedTransaction.amount)}
                </p>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[selectedTransaction.status]
                  }`}
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
                    { day: "numeric", month: "short", year: "numeric" }
                  ),
                ],
                ["Platform Commission", formatMoney(selectedTransaction.commission)],
                [
                  "Restaurant Payout (estimated)",
                  formatMoney(
                    selectedTransaction.amount - selectedTransaction.commission
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 text-sm"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-semibold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}

              {selectedTransaction.status !== "Refunded" && (
                <button
                  onClick={() => processRefund(selectedTransaction.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  <FiRefreshCw size={17} />
                  Mark as Refunded
                </button>
              )}

              {selectedTransaction.status === "Refunded" && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-semibold text-green-700">
                  <FiCheckCircle size={18} />
                  Marked as refunded
                </div>
              )}

              <p className="flex items-start gap-2 text-xs text-amber-700">
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
