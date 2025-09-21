import Heading from "@/components/client/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/products-table";

export default function AdminProductsPage() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6">
      <div className="flex justify-between items-center">
        <Heading title="Manage Products" />
        <Link href="/admin/add-product">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsTable />
    </main>
  );
}
