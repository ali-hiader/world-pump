import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/utils";
import useProductsStore from "@/stores/pump_store";

function ProductsPagePumpsCategory() {
  const { setSelectedCategory } = useProductsStore();

  function handleSelect(value: string) {
    setSelectedCategory(value);
  }
  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-fit">
        <SelectValue
          placeholder="Select a category"
          defaultValue="all"
          defaultChecked
        />
      </SelectTrigger>
      <SelectContent className="max-h-56">
        <SelectItem value="All Pumps">All</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ProductsPagePumpsCategory;
