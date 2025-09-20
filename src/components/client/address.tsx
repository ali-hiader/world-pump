import React from "react";
import TextField from "@mui/material/TextField";
import { checkoutAddressFields } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type AddressValues = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type AddressesData = {
  shipping: AddressValues;
  billingSameAsShipping: boolean;
  billing?: AddressValues;
};

interface Props {
  userName: string;
  onAddressesChange?: (data: AddressesData) => void;
}

function Address({ userName, onAddressesChange }: Props) {
  const [billingSelection, setBillingSelection] = React.useState<
    "same" | "different"
  >("same");

  const initialAddress: AddressValues = React.useMemo(
    () => ({
      fullName: userName || "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Pakistan",
    }),
    [userName]
  );

  const [shipping, setShipping] = React.useState<AddressValues>(initialAddress);
  const [billing, setBilling] = React.useState<AddressValues>(initialAddress);

  React.useEffect(() => {
    const payload: AddressesData = {
      shipping,
      billingSameAsShipping: billingSelection === "same",
      billing: billingSelection === "different" ? billing : undefined,
    };
    onAddressesChange?.(payload);
  }, [shipping, billing, billingSelection, onAddressesChange]);

  const billingAddressFields = React.useMemo(
    () =>
      checkoutAddressFields.map((field) => ({
        ...field,
        name: `billing_${field.name}`,
      })),
    []
  );

  return (
    <section className="">
      <h2 className="">Enter your shipping details</h2>
      <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {checkoutAddressFields.map((field) => {
          const name = field.name as keyof AddressValues;
          const value = shipping[name] ?? "";
          return (
            <AddressInput
              key={field.name}
              {...field}
              userName={userName}
              value={value as string}
              onChange={(val) =>
                setShipping((prev) => ({ ...prev, [name]: val }))
              }
            />
          );
        })}
      </form>

      <div className="mt-8">
        <h3 className="mb-2">Billing address</h3>
        <div className="rounded-md border border-primary/20 overflow-hidden">
          <Accordion
            type="single"
            value={billingSelection}
            onValueChange={(v) =>
              v && setBillingSelection(v as "same" | "different")
            }
          >
            <BillingOption
              value="same"
              selected={billingSelection === "same"}
              title="Billing address same as shipping address"
            >
              We will use your shipping address for billing.
            </BillingOption>

            <BillingOption
              value="different"
              selected={billingSelection === "different"}
              title="Use a different billing address"
            >
              <form className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {billingAddressFields.map((field) => {
                  const baseName = field.name.replace(/^billing_/, "") as keyof AddressValues;
                  const value = billing[baseName] ?? "";
                  return (
                    <AddressInput
                      key={field.name}
                      {...field}
                      value={value as string}
                      onChange={(val) =>
                        setBilling((prev) => ({ ...prev, [baseName]: val }))
                      }
                    />
                  );
                })}
              </form>
            </BillingOption>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default Address;

export interface InputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  readonly: boolean;
  defaultValue?: string;
  userName?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function AddressInput({
  name,
  label,
  type = "text",
  required = false,
  defaultValue = "",
  readonly = false,
  userName,
  value,
  onChange,
}: InputProps) {
  return (
    <TextField
      id={name}
      name={name}
      label={label}
      variant="standard"
      fullWidth
      size="small"
      slotProps={{
        input: {
          sx: { fontSize: 14 }, // dY`^ input text font size
        },
        inputLabel: {
          sx: { fontSize: 14 }, // dY`^ label font size
        },
      }}
      required={required}
      type={type}
      value={
        value !== undefined
          ? value
          : name === "fullName"
          ? userName || ""
          : defaultValue || ""
      }
      disabled={readonly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

function BillingOption({
  value,
  selected,
  title,
  children,
}: {
  value: "same" | "different";
  selected: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const itemBase =
    "not-first:border-t !border-b-0 border-primary/20 overflow-hidden";
  const triggerBase =
    "px-4 py-4 [&>svg]:hidden flex items-center gap-3 text-[15px]";

  return (
    <AccordionItem
      value={value}
      className={cn(
        itemBase,
        selected ? "border-primary/40" : "border-primary/20"
      )}
    >
      <AccordionTrigger
        className={cn(
          triggerBase,
          selected ? "bg-primary/5" : "bg-muted/30 hover:bg-muted/50"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full border-2",
            selected ? "border-primary" : "border-muted-foreground/40"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              selected ? "bg-primary" : "bg-transparent"
            )}
          />
        </span>
        <span>{title}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
