import Link from "next/link";
import { notFound } from "next/navigation";

import { countOrdersByUserEmail } from '@/actions/order';
import { fetchUserById } from '@/actions/user';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function UserDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const userData = await fetchUserById(userId);

  if (!userData) {
    notFound();
  }

  const orderCount = await countOrdersByUserEmail(userData.email);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" className="mb-4">
            ← Back to Users
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">
              {userData.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userData.name}
            </h1>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* User Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-lg">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Status</p>
              <Badge variant={userData.emailVerified ? "default" : "secondary"}>
                {userData.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-sm text-gray-600 font-mono">{userData.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Information */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{orderCount}</p>
                {orderCount > 0 && (
                  <Link href={`/admin/users/${userData.id}/orders`}>
                    <Button variant="outline" size="sm">
                      View Orders
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(userData.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-lg">
                {new Date(userData.updatedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(userData.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/users/${userData.id}/orders`}>
              <Button variant="outline">
                View User Orders ({orderCount})
              </Button>
            </Link>
            <Button
              variant="outline"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Send Email (Coming Soon)
            </Button>
            <Button
              variant="outline"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Edit User (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default UserDetailsPage;
