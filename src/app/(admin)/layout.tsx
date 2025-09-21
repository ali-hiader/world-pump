import AdminNavBar from "@/components/admin/admin_navbar";
import AdminAuthProvider from "@/components/admin/admin-auth-provider";
import { PropsWithChildren } from "react";

function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AdminAuthProvider>
      <AdminNavBar />
      {children}
    </AdminAuthProvider>
  );
}

export default AdminLayout;
