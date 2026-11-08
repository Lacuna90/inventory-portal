import { dashboardStats, mockInventoryItems, mockLoans } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Velkommen til Inventar Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Samlede inventar"
          value={dashboardStats.totalItems}
          color="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Under udlån"
          value={dashboardStats.itemsLoaned}
          color="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Reserveret"
          value={dashboardStats.itemsReserved}
          color="bg-orange-50"
          textColor="text-orange-600"
        />
        <StatCard
          title="Aktive medlemmer"
          value={dashboardStats.activeMembers}
          color="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      {/* Recent Items & Loans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Seneste inventar
          </h2>
          <div className="space-y-3">
            {mockInventoryItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.lokation}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.mængde} stk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Loans */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aktive udlån
          </h2>
          <div className="space-y-3">
            {mockLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium text-gray-900">{loan.item}</p>
                  <p className="text-sm text-gray-600">{loan.medlem}</p>
                </div>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                  {loan.til}
                </span>
              </div>
            ))}
          </div>
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
}: {
  title: string;
  value: number;
  color: string;
  textColor: string;
}) {
  return (
    <div className={`${color} rounded-lg p-6`}>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
    </div>
  );
}
