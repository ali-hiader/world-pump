import Heading from "@/components/client/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/products-table";

export default function AdminProductsPage() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6 max-w-[2000px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <Heading title="Manage Products" />
        <Link href="/admin/add-product" className="w-fit">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Add Product</span>
          </Button>
        </Link>
      </div>

      <ProductsTable />
    </main>
  );
}
