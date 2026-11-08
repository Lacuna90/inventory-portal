import { mockInventoryItems } from "@/lib/mockData";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventar</h1>
        <p className="text-gray-600 mt-1">Oversigt over alle inventargenstande</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Navn
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Mængde
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Lokation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockInventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.kategori}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.mængde}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.lokation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          I alt {mockInventoryItems.reduce((sum, item) => sum + item.mængde, 0)} genstande
        </p>
      </div>
    </div>
  );
}
