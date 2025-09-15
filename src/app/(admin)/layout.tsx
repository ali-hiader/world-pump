import AdminNavBar from "@/components/admin/admin_navbar";
import { PropsWithChildren } from "react";

function AdminLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AdminNavBar />
      {children}
    </>
  );
}

export default AdminLayout;
