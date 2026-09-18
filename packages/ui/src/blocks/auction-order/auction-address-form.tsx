import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { FormEvent } from "react";
import { useState } from "react";
import type {
  AuctionAddressFormProps,
  AuctionAddressFormValues,
} from "./types";

const EMPTY_VALUES: AuctionAddressFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  country: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  apartment: "",
  state: "",
  postalCode: "",
};

function label(labelText: string, required: boolean, optional: string) {
  return (
    <>
      {labelText}
      {required ? (
        <span aria-hidden="true"> *</span>
      ) : (
        <span className="text-secondary-foreground"> ({optional})</span>
      )}
    </>
  );
}

function AuctionAddressForm({
  copy,
  initialValues,
  errors,
  pending = false,
  onConfirm,
  onCancel,
  className,
}: AuctionAddressFormProps) {
  const [values, setValues] = useState<AuctionAddressFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });

  function update(field: keyof AuctionAddressFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function field(
    name: keyof AuctionAddressFormValues,
    labelText: string,
    required: boolean,
    props?: React.ComponentProps<typeof TextInput>,
  ) {
    const error = errors?.[name];
    return (
      <TextInput
        {...props}
        label={label(labelText, required, copy.optional)}
        message={error}
        name={name}
        onChange={(event) => update(name, event.target.value)}
        required={required}
        status={error != null ? "error" : "default"}
        value={values[name]}
      />
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm({ ...values });
  }

  return (
    <form
      className={className}
      data-slot="auction-address-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <VStack gap="md" hAlign="stretch">
        <div className="grid gap-3 sm:grid-cols-2">
          {field("firstName", copy.firstName, true, {
            autoComplete: "given-name",
          })}
          {field("lastName", copy.lastName, true, {
            autoComplete: "family-name",
          })}
        </div>
        {field("phone", copy.phone, true, {
          autoComplete: "tel",
          inputMode: "tel",
          type: "tel",
        })}
        {field("company", copy.company, false)}
        {field("country", copy.country, true, {
          autoComplete: "country-name",
        })}
        {field("city", copy.city, true, {
          autoComplete: "address-level2",
        })}
        {field("addressLine1", copy.addressLine1, true, {
          autoComplete: "address-line1",
        })}
        {field("addressLine2", copy.addressLine2, false, {
          autoComplete: "address-line2",
        })}
        {field("apartment", copy.apartment, false)}
        <div className="grid gap-3 sm:grid-cols-2">
          {field("state", copy.state, true, {
            autoComplete: "address-level1",
          })}
          {field("postalCode", copy.postalCode, true, {
            autoComplete: "postal-code",
          })}
        </div>
        <HStack className="flex-wrap" gap="sm" vAlign="center">
          <Button loading={pending} size="md" type="submit">
            {copy.confirm}
          </Button>
          <Button onClick={onCancel} size="md" type="button" variant="outline">
            {copy.cancel}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

export type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
} from "./types";
export { AuctionAddressForm };
