import {
  dashboardStats,
  mockLoans,
  mockActivity,
  topBorrowedItems,
  mockInventoryItems,
} from "@/lib/mockData";

export default function Dashboard() {
  const loansExpiringSoon = mockLoans.filter((l) => l.status === "snartForfalden");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Velkommen til Inventar Portal</p>
      </div>

      {/* Statistics Cards - 5 items mobile, responsive */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard
          title="I alt"
          value={dashboardStats.totalItems}
          color="bg-blue-50"
          textColor="text-blue-600"
          icon="📦"
        />
        <StatCard
          title="Hjemme"
          value={dashboardStats.itemsHome}
          color="bg-green-50"
          textColor="text-green-600"
          icon="🏠"
        />
        <StatCard
          title="Udlånt"
          value={dashboardStats.itemsLoaned}
          color="bg-orange-50"
          textColor="text-orange-600"
          icon="📤"
        />
        <StatCard
          title="Reserveret"
          value={dashboardStats.itemsReserved}
          color="bg-purple-50"
          textColor="text-purple-600"
          icon="📋"
        />
        <StatCard
          title="Til salg"
          value={dashboardStats.itemsForSale}
          color="bg-red-50"
          textColor="text-red-600"
          icon="💰"
        />
      </div>

      {/* Main content grid - 1 col on mobile, 2 on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - full width on mobile, 2 cols on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Udlånt lige nu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Udlånt lige nu
            </h2>
            <div className="space-y-3">
              {mockLoans.length > 0 ? (
                mockLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex justify-between items-start p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{loan.item}</p>
                      <p className="text-sm text-gray-600">{loan.medlem}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Retur: {loan.til}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                        loan.status === "forfalden"
                          ? "bg-red-100 text-red-800"
                          : loan.status === "snartForfalden"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {loan.status === "forfalden"
                        ? "Forfalden"
                        : loan.status === "snartForfalden"
                          ? "Snart"
                          : "OK"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Ingen aktive udlån</p>
              )}
            </div>
          </div>

          {/* Skal snart retur */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Skal snart retur
            </h2>
            <div className="space-y-3">
              {loansExpiringSoon.length > 0 ? (
                loansExpiringSoon.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{loan.item}</p>
                      <p className="text-sm text-gray-600">{loan.medlem}</p>
                    </div>
                    <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {loan.til}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Ingen items der snart forfalde</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Seneste aktivitet */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Seneste aktivitet
          </h2>
          <div className="space-y-3">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="border-l-4 border-gray-200 pl-3 py-2">
                <div className="flex gap-2">
                  <span className="text-lg">{activity.ikon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {activity.medlem}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.tidspunkt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Most Borrowed Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top 10 mest udlånte genstande
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">
                  Rank
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">
                  Genstand
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900">
                  Gange udlånt
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900">
                  Hjemme
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900">
                  Udlånt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topBorrowedItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="font-bold text-lg text-gray-400">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {item.lånCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">
                    {item.mængdeHjemme}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-orange-600 font-medium">
                    {item.mængdeUdlånt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  textColor,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  textColor: string;
  icon: string;
}) {
  return (
    <div className={`${color} rounded-lg p-4 md:p-6`}>
      <div className="text-2xl md:text-3xl mb-2">{icon}</div>
      <p className="text-xs md:text-sm font-medium text-gray-700">{title}</p>
      <p className={`text-2xl md:text-3xl font-bold ${textColor} mt-1`}>
        {value}
      </p>
    </div>
  );
}
