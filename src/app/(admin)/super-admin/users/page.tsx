import Link from 'next/link'

import { fetchAllUsersWithStats } from '@/actions/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function AdminUsersPage() {
  const usersWithStats = await fetchAllUsersWithStats()

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage registered users</p>
        </div>
        <div className="text-sm text-gray-500">Total Users: {usersWithStats.length}</div>
      </div>

      {usersWithStats.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500">No users have registered yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {usersWithStats.map((userData) => (
            <Card key={userData.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {userData.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{userData.name}</h3>
                        <p className="text-gray-600 text-sm">{userData.email}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Status</p>
                        <Badge
                          variant={userData.emailVerified ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {userData.emailVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-sm font-semibold">{userData.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Joined</p>
                        <p className="text-sm">
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {userData.orderCount > 0 && (
                    <div className="flex justify-end">
                      <Link href={`/admin/users/${userData.id}/orders`}>
                        <Button variant="outline" size="sm">
                          View Orders ({userData.orderCount})
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default AdminUsersPage
