import Heading from "@/components/client/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import AccessoriesTable from "@/components/admin/accessories-table";

export default function AdminAccessoriesPage() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6 max-w-[2000px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <Heading title="Manage Accessories" />
        <Link href="/admin/add-accessory" className="w-fit">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Add Accessory</span>
          </Button>
        </Link>
      </div>
      <AccessoriesTable />
    </main>
  );
}
