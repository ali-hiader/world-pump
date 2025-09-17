import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProductsStore from "@/stores/pump_store";

function ProductsPagePumpsCategory() {
  const { categories, setSelectedCategory } = useProductsStore();

  function handleSelect(value: string) {
    const s_category = value === "all" ? null : value;
    setSelectedCategory(s_category);
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
        <SelectItem value="all">All Pumps</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ProductsPagePumpsCategory;
