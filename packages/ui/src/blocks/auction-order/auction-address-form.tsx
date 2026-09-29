import { Button } from "@grade10/design-system/components/forms/button";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { FormEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import type { Country } from "react-phone-number-input";
import {
  AuctionPhoneField,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "./auction-phone-field";
import type {
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionAddressKind,
} from "./types";

/** Tailwind `sm` — default kind control from here; `sm` size below. */
const SM_UP_MQ = "(min-width: 640px)";

function useIsSmUp() {
  const [smUp, setSmUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(SM_UP_MQ).matches : true,
  );

  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    setSmUp(media.matches);
    const onChange = () => setSmUp(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return smUp;
}

const EMPTY_VALUES: AuctionAddressFormValues = {
  addressKind: "personal",
  firstName: "",
  lastName: "",
  phone: "",
  phoneCountry: "",
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
  showActions = true,
  formId,
  renderCountry,
}: AuctionAddressFormProps) {
  const generatedFormId = useId();
  const resolvedFormId = formId ?? generatedFormId;
  const formRef = useRef<HTMLFormElement>(null);
  const focusInvalidRef = useRef(false);
  const smUp = useIsSmUp();
  const [values, setValues] = useState<AuctionAddressFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });
  const [attempted, setAttempted] = useState(false);

  function update<K extends keyof AuctionAddressFormValues>(
    field: K,
    value: AuctionAddressFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function setKind(kind: AuctionAddressKind) {
    setValues((current) => ({
      ...current,
      addressKind: kind,
      company: kind === "personal" ? "" : current.company,
    }));
  }

  function textField(
    name: Exclude<
      keyof AuctionAddressFormValues,
      "addressKind" | "phone" | "phoneCountry"
    >,
    labelText: string,
    required: boolean,
    props?: React.ComponentProps<typeof TextInput>,
  ) {
    const error = errors?.[name];
    const localRefuse =
      attempted && required && !String(values[name]).trim() && error == null
        ? `Enter ${labelText.toLowerCase()}.`
        : undefined;
    const message = error ?? localRefuse;
    return (
      <TextInput
        {...props}
        label={label(labelText, required, copy.optional)}
        message={message}
        name={name}
        onChange={(event) => update(name, event.currentTarget.value)}
        required={required}
        status={message != null ? "error" : "default"}
        value={values[name]}
      />
    );
  }

  const companyRequired = values.addressKind === "company";
  const phoneCountry = values.phoneCountry
    ? (values.phoneCountry as Country)
    : undefined;
  const phoneReady = auctionPhoneSoftReady(values.phone, phoneCountry);
  const phoneError = errors?.phone;
  const phoneLocalRefuse =
    attempted && !phoneReady && phoneError == null
      ? "Enter a phone number."
      : undefined;
  const phoneMessage = phoneError ?? phoneLocalRefuse;

  const companyError = errors?.company;
  const companyLocalRefuse =
    attempted &&
    companyRequired &&
    !values.company.trim() &&
    companyError == null
      ? "Enter a company name."
      : undefined;
  const companyMessage = companyError ?? companyLocalRefuse;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const incomplete =
      !phoneReady ||
      (companyRequired && !values.company.trim()) ||
      !values.firstName.trim() ||
      !values.lastName.trim() ||
      !values.country.trim() ||
      !values.city.trim() ||
      !values.addressLine1.trim() ||
      !values.postalCode.trim();

    if (incomplete) {
      focusInvalidRef.current = true;
      return;
    }

    onConfirm({
      ...values,
      phone: auctionPhoneConfirmValue(values.phone, phoneCountry),
      company: values.addressKind === "company" ? values.company : "",
    });
  }

  useEffect(() => {
    if (!focusInvalidRef.current) return;
    focusInvalidRef.current = false;
    formRef.current
      ?.querySelector<HTMLElement>("[aria-invalid='true']")
      ?.focus();
  });

  const countryLabel = label(copy.country, true, copy.optional);
  const countryError = errors?.country;
  const countryLocalRefuse =
    attempted && !values.country.trim() && countryError == null
      ? "Choose a country or region."
      : undefined;
  const countryMessage = countryError ?? countryLocalRefuse;

  return (
    <form
      className={cn("flex min-h-0 min-w-0 flex-col", className)}
      data-slot="auction-address-form"
      id={resolvedFormId}
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <VStack
        className="flex min-h-0 flex-1 flex-col"
        gap="md"
        hAlign="stretch"
      >
        <div
          className="w-fit shrink-0 self-start"
          data-slot="auction-address-kind"
        >
          <SegmentedControl
            aria-label="Address kind"
            className="w-fit self-start"
            onValueChange={(next) => {
              const kind = next[0];
              if (kind === "personal" || kind === "company") setKind(kind);
            }}
            size={smUp ? "default" : "sm"}
            value={[values.addressKind]}
          >
            <SegmentedControlItem value="personal">
              {copy.personal}
            </SegmentedControlItem>
            <SegmentedControlItem value="company">
              {copy.companyKind}
            </SegmentedControlItem>
          </SegmentedControl>
        </div>

        {/* The fields scroll, so they clip at their own edge: `p-1` keeps a
            focus ring's room inside it, `-m-1` keeps the column. */}
        <div
          className="scroll-fade -m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-1"
          data-slot="auction-address-fields"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {textField("firstName", copy.firstName, true, {
              autoComplete: "given-name",
            })}
            {textField("lastName", copy.lastName, true, {
              autoComplete: "family-name",
            })}
          </div>

          <AuctionPhoneField
            country={phoneCountry}
            countrySearchPlaceholder={copy.countrySearchPlaceholder}
            label={label(copy.phone, true, copy.optional)}
            message={phoneMessage}
            name="phone"
            onChange={(next) => update("phone", next)}
            onCountryChange={(next) => update("phoneCountry", next ?? "")}
            placeholder={copy.phonePlaceholder}
            status={phoneMessage != null ? "error" : "default"}
            value={values.phone}
          />

          {companyRequired ? (
            <TextInput
              autoComplete="organization"
              label={label(copy.company, true, copy.optional)}
              message={companyMessage}
              name="company"
              onChange={(event) => update("company", event.currentTarget.value)}
              required
              status={companyMessage != null ? "error" : "default"}
              value={values.company}
            />
          ) : null}

          {renderCountry ? (
            renderCountry({
              value: values.country,
              onChange: (next) => update("country", next),
              error: countryMessage,
              required: true,
              label: countryLabel,
            })
          ) : (
            <TextInput
              autoComplete="country-name"
              label={countryLabel}
              message={countryMessage}
              name="country"
              onChange={(event) => update("country", event.currentTarget.value)}
              required
              status={countryMessage != null ? "error" : "default"}
              value={values.country}
            />
          )}

          {textField("city", copy.city, true, {
            autoComplete: "address-level2",
          })}
          {textField("addressLine1", copy.addressLine1, true, {
            autoComplete: "address-line1",
          })}
          {textField("addressLine2", copy.addressLine2, false, {
            autoComplete: "address-line2",
          })}
          <div className="grid gap-3 sm:grid-cols-2">
            {textField("state", copy.state, false, {
              autoComplete: "address-level1",
            })}
            {textField("postalCode", copy.postalCode, true, {
              autoComplete: "postal-code",
            })}
          </div>
          {showActions ? (
            <HStack className="flex-wrap" gap="sm" vAlign="center">
              <Button loading={pending} size="md" type="submit">
                {copy.confirm}
              </Button>
              <Button
                onClick={onCancel}
                size="md"
                type="button"
                variant="outline"
              >
                {copy.cancel}
              </Button>
            </HStack>
          ) : null}
        </div>
      </VStack>
    </form>
  );
}

export type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
} from "./types";
export { AuctionAddressForm, auctionPhoneConfirmValue, auctionPhoneSoftReady };
