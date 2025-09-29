import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
  multiple = false,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // For multi-select, value is string[]
  const selectedValues =
    multiple && Array.isArray(value) ? value : value ? [value as string] : [];
  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setOpen((prev) => !prev)}
            disabled={disabled}
          >
            {placeholder || "Select..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 min-w-[220px]">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder || "Search..."}
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              {filteredOptions.length === 0 && (
                <CommandEmpty>No option found.</CommandEmpty>
              )}
              {filteredOptions.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => {
                    if (multiple) {
                      let newValues;
                      if (selectedValues.includes(opt.value)) {
                        newValues = selectedValues.filter(
                          (v) => v !== opt.value
                        );
                      } else {
                        newValues = [...selectedValues, opt.value];
                      }
                      onChange(newValues);
                    } else {
                      onChange(opt.value);
                      setOpen(false);
                    }
                    setSearch("");
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {selectedValues.includes(opt.value) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Selected pumps shown in a separate div below the trigger */}
      {multiple && selectedOptions.length > 0 && (
        <div className="mt-2 p-2 rounded bg-gray-100 flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="px-2 py-1 w-full justify-between bg-white rounded shadow text-sm flex items-center gap-1"
            >
              {opt.label}

              <button
                type="button"
                className="text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  const newValues = selectedValues.filter(
                    (v) => v !== opt.value
                  );
                  onChange(newValues);
                }}
                aria-label={`Remove ${opt.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
