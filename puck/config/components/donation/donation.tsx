"use client";

import { type ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/puck/lib/utils";
import {
  CompoundBadge,
  CompoundBadgeProps,
} from "@/puck/components/badge";
import {
  CompoundContainer,
  CompoundContainerProps,
} from "@/puck/components/container";
import {
  CompoundImage,
  ImageData,
} from "@/puck/components/image";
import { useIsEditorMode } from "@/puck/context/is-editor-mode-context";

export interface DonationFrequencyOption {
  label: string;
  value: string;
}

export interface DonationAmountOption {
  label: string;
  amount: number;
  description?: string;
}

export interface DonationStepLabels {
  donate: string;
  details: string;
  payment: string;
}

export interface DonationButtonLabels {
  back: string;
  next: string;
  submit: string;
}

export interface DonationCopy {
  frequencyHeading: string;
  amountHeading: string;
  customAmountPlaceholder: string;
  customAmountPrefix: string;
  recurringDayLabel: string;
  recurringDayFirst: string;
  recurringDaySecond: string;
  detailsHeading: string;
  paymentHeading: string;
  donationSummaryPrefix: string;
}

export interface DonationDetailsFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  onBehalfLabel: string;
  organizationName: string;
  anonymousLabel: string;
}

export interface DonationPaymentFields {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  coverPlatformCosts: string;
  coverPlatformCostsDescription: string;
}

export interface DonationProps {
  padding?: CompoundContainerProps["padding"];
  badge?: CompoundBadgeProps;
  heading: string;
  description?: ReactNode;
  backgroundImage?: ImageData;
  backgroundOverlayOpacity?: number;
  stepLabels: DonationStepLabels;
  buttonLabels: DonationButtonLabels;
  copy: DonationCopy;
  frequencyOptions: DonationFrequencyOption[];
  amountOptions: DonationAmountOption[];
  detailsFields: DonationDetailsFields;
  paymentFields: DonationPaymentFields;
}

type DonationStep = 0 | 1 | 2;

interface DonationFormState {
  frequency: string;
  presetAmount: number | null;
  customAmount: string;
  recurringDay: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  onBehalf: boolean;
  organizationName: string;
  anonymous: boolean;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  coverPlatformCosts: boolean;
}

const COVER_PLATFORM_PERCENT = 0.05;

export const Donation = ({
  padding,
  badge,
  heading,
  description,
  backgroundImage,
  backgroundOverlayOpacity,
  stepLabels,
  buttonLabels,
  copy,
  frequencyOptions,
  amountOptions,
  detailsFields,
  paymentFields,
}: DonationProps) => {
  const isEditorMode = useIsEditorMode();
  const [step, setStep] = useState<DonationStep>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<DonationFormState>({
    frequency: frequencyOptions[0]?.value ?? "once",
    presetAmount: amountOptions[0]?.amount ?? null,
    customAmount: "",
    recurringDay: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    onBehalf: false,
    organizationName: "",
    anonymous: false,
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    coverPlatformCosts: false,
  });

  const steps = useMemo(
    () => [stepLabels.donate, stepLabels.details, stepLabels.payment],
    [stepLabels]
  );

  const baseAmount =
    form.customAmount.trim() !== ""
      ? Number(form.customAmount)
      : (form.presetAmount ?? 0);
  const isRecurring = form.frequency !== frequencyOptions[0]?.value;
  const coverAmount = form.coverPlatformCosts
    ? Math.round(baseAmount * COVER_PLATFORM_PERCENT * 100) / 100
    : 0;
  const finalAmount = Math.max(0, baseAmount + coverAmount);

  const validateStep = (targetStep: DonationStep) => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 0) {
      if (!form.frequency) {
        nextErrors.frequency = "Please choose a donation frequency.";
      }
      if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
        nextErrors.amount = "Please select or enter a valid donation amount.";
      }
      if (isRecurring && !form.recurringDay) {
        nextErrors.recurringDay = "Please select a recurring debit day.";
      }
    }

    if (targetStep === 1) {
      if (!form.firstName.trim()) {
        nextErrors.firstName = "First name is required.";
      }
      if (!form.lastName.trim()) {
        nextErrors.lastName = "Last name is required.";
      }
      if (!form.email.trim()) {
        nextErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = "Please enter a valid email address.";
      }
      if (form.onBehalf && !form.organizationName.trim()) {
        nextErrors.organizationName = "Organization name is required.";
      }
    }

    if (targetStep === 2) {
      const cardDigits = form.cardNumber.replace(/\D/g, "");
      if (!form.cardholderName.trim()) {
        nextErrors.cardholderName = "Cardholder name is required.";
      }
      if (cardDigits.length < 12) {
        nextErrors.cardNumber = "Enter a valid card number.";
      }
      if (!/^\d{2}$/.test(form.expiryMonth)) {
        nextErrors.expiryMonth = "Enter month as MM.";
      }
      if (!/^\d{4}$/.test(form.expiryYear)) {
        nextErrors.expiryYear = "Enter year as YYYY.";
      }
      if (!/^\d{3,4}$/.test(form.cvc)) {
        nextErrors.cvc = "Enter a valid CVC.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (step === 0 && !validateStep(0)) {
      return;
    }
    if (step === 1 && !validateStep(1)) {
      return;
    }
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
    }
  };

  const goBack = () => {
    setErrors({});
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(0);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStep(2)) {
      return;
    }

    if (!isEditorMode) {
      console.log("Mock donation submitted", {
        ...form,
        amount: finalAmount,
      });
    }
  };

  return (
    <CompoundContainer padding={padding}>
      <section className="relative overflow-hidden rounded-3xl border border-border/60">
        {backgroundImage?.src ? (
          <div className="absolute inset-0">
            <CompoundImage
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              className="h-full"
            />
            <div
              className="absolute inset-0 bg-foreground"
              style={{
                opacity: Math.min(
                  Math.max(backgroundOverlayOpacity ?? 0.45, 0.1),
                  0.8
                ),
              }}
            />
          </div>
        ) : null}

        <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-2 lg:gap-10 lg:p-12">
          <div className="flex flex-col gap-5 text-background lg:pr-4">
            {badge?.label ? (
              <div>
                <CompoundBadge
                  label={badge.label}
                  variant={badge.variant}
                  url={badge.url}
                />
              </div>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              {heading}
            </h2>
            {description ? (
              <div className="max-w-xl text-base leading-relaxed text-background/85 md:text-lg [&_p]:m-0">
                {description}
              </div>
            ) : null}
          </div>

          <form
            className="rounded-2xl border border-border bg-background/95 p-4 text-foreground backdrop-blur-sm md:p-6"
            onSubmit={handleSubmit}
          >
            <ol className="mb-5 grid grid-cols-3 gap-2">
              {steps.map((stepLabel, index) => (
                <li
                  key={stepLabel}
                  className={cn(
                    "rounded-md border px-2 py-2 text-center text-xs font-medium md:text-sm",
                    {
                      "border-primary bg-primary text-primary-foreground":
                        step === index,
                      "border-border bg-muted text-muted-foreground":
                        step !== index,
                    }
                  )}
                >
                  {index + 1}. {stepLabel}
                </li>
              ))}
            </ol>

            {step === 0 ? (
              <StepDonate
                copy={copy}
                frequencyOptions={frequencyOptions}
                amountOptions={amountOptions}
                form={form}
                setForm={setForm}
                errors={errors}
              />
            ) : null}

            {step === 1 ? (
              <StepDetails
                copy={copy}
                detailsFields={detailsFields}
                form={form}
                setForm={setForm}
                errors={errors}
              />
            ) : null}

            {step === 2 ? (
              <StepPayment
                copy={copy}
                paymentFields={paymentFields}
                form={form}
                setForm={setForm}
                errors={errors}
                finalAmount={finalAmount}
                isRecurring={isRecurring}
              />
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === 0}
              >
                {buttonLabels.back}
              </Button>

              {step < 2 ? (
                <Button type="button" onClick={goNext}>
                  {buttonLabels.next}
                </Button>
              ) : (
                <Button type="submit">{buttonLabels.submit}</Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </CompoundContainer>
  );
};

const StepDonate = ({
  copy,
  frequencyOptions,
  amountOptions,
  form,
  setForm,
  errors,
}: {
  copy: DonationCopy;
  frequencyOptions: DonationFrequencyOption[];
  amountOptions: DonationAmountOption[];
  form: DonationFormState;
  setForm: React.Dispatch<React.SetStateAction<DonationFormState>>;
  errors: Record<string, string>;
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{copy.frequencyHeading}</p>
        <div className="grid grid-cols-2 gap-2">
          {frequencyOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={form.frequency === option.value ? "default" : "outline"}
              className="w-full"
              onClick={() => setForm((prev) => ({ ...prev, frequency: option.value }))}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {errors.frequency ? (
          <p className="text-xs text-destructive">{errors.frequency}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{copy.amountHeading}</p>
        <div className="grid grid-cols-2 gap-2">
          {amountOptions.map((option) => {
            const isSelected =
              form.customAmount === "" && form.presetAmount === option.amount;

            return (
              <Button
                key={option.label}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className="h-auto flex-col items-start px-3 py-2 text-start"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    presetAmount: option.amount,
                    customAmount: "",
                  }))
                }
              >
                <span className="text-sm font-semibold">{option.label}</span>
                {option.description ? (
                  <span className="text-xs opacity-80">{option.description}</span>
                ) : null}
              </Button>
            );
          })}
        </div>

        <div className="space-y-1">
          <Label htmlFor="custom-amount">{copy.customAmountPlaceholder}</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {copy.customAmountPrefix}
            </span>
            <Input
              id="custom-amount"
              type="number"
              min={1}
              step="0.01"
              value={form.customAmount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  customAmount: event.target.value,
                  presetAmount: null,
                }))
              }
              className="pl-9"
            />
          </div>
        </div>

        {errors.amount ? (
          <p className="text-xs text-destructive">{errors.amount}</p>
        ) : null}
      </div>

      {form.frequency === frequencyOptions[1]?.value ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{copy.recurringDayLabel}</p>
          <div className="flex gap-2">
            {[copy.recurringDayFirst, copy.recurringDaySecond].map((label) => (
              <Button
                key={label}
                type="button"
                variant={form.recurringDay === label ? "default" : "outline"}
                onClick={() => setForm((prev) => ({ ...prev, recurringDay: label }))}
              >
                {label}
              </Button>
            ))}
          </div>
          {errors.recurringDay ? (
            <p className="text-xs text-destructive">{errors.recurringDay}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const StepDetails = ({
  copy,
  detailsFields,
  form,
  setForm,
  errors,
}: {
  copy: DonationCopy;
  detailsFields: DonationDetailsFields;
  form: DonationFormState;
  setForm: React.Dispatch<React.SetStateAction<DonationFormState>>;
  errors: Record<string, string>;
}) => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-foreground">{copy.detailsHeading}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldInput
          id="first-name"
          label={detailsFields.firstName}
          value={form.firstName}
          onChange={(value) => setForm((prev) => ({ ...prev, firstName: value }))}
          error={errors.firstName}
        />
        <FieldInput
          id="last-name"
          label={detailsFields.lastName}
          value={form.lastName}
          onChange={(value) => setForm((prev) => ({ ...prev, lastName: value }))}
          error={errors.lastName}
        />
      </div>

      <FieldInput
        id="email"
        label={detailsFields.email}
        type="email"
        value={form.email}
        onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        error={errors.email}
      />

      <FieldInput
        id="phone"
        label={detailsFields.phone}
        value={form.phone}
        onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
      />

      <FieldInput
        id="address"
        label={detailsFields.address}
        value={form.address}
        onChange={(value) => setForm((prev) => ({ ...prev, address: value }))}
      />

      <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
        <CheckboxRow
          id="on-behalf"
          label={detailsFields.onBehalfLabel}
          checked={form.onBehalf}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, onBehalf: checked }))
          }
        />

        {form.onBehalf ? (
          <FieldInput
            id="organization"
            label={detailsFields.organizationName}
            value={form.organizationName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, organizationName: value }))
            }
            error={errors.organizationName}
          />
        ) : null}

        <CheckboxRow
          id="anonymous"
          label={detailsFields.anonymousLabel}
          checked={form.anonymous}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, anonymous: checked }))
          }
        />
      </div>
    </div>
  );
};

const StepPayment = ({
  copy,
  paymentFields,
  form,
  setForm,
  errors,
  finalAmount,
  isRecurring,
}: {
  copy: DonationCopy;
  paymentFields: DonationPaymentFields;
  form: DonationFormState;
  setForm: React.Dispatch<React.SetStateAction<DonationFormState>>;
  errors: Record<string, string>;
  finalAmount: number;
  isRecurring: boolean;
}) => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-foreground">{copy.paymentHeading}</p>

      <FieldInput
        id="cardholder-name"
        label={paymentFields.cardholderName}
        value={form.cardholderName}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, cardholderName: value }))
        }
        error={errors.cardholderName}
      />

      <FieldInput
        id="card-number"
        label={paymentFields.cardNumber}
        value={form.cardNumber}
        onChange={(value) => setForm((prev) => ({ ...prev, cardNumber: value }))}
        error={errors.cardNumber}
        inputMode="numeric"
      />

      <div className="grid grid-cols-3 gap-3">
        <FieldInput
          id="expiry-month"
          label={paymentFields.expiryMonth}
          value={form.expiryMonth}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, expiryMonth: value }))
          }
          error={errors.expiryMonth}
          inputMode="numeric"
          maxLength={2}
        />
        <FieldInput
          id="expiry-year"
          label={paymentFields.expiryYear}
          value={form.expiryYear}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, expiryYear: value }))
          }
          error={errors.expiryYear}
          inputMode="numeric"
          maxLength={4}
        />
        <FieldInput
          id="cvc"
          label={paymentFields.cvc}
          value={form.cvc}
          onChange={(value) => setForm((prev) => ({ ...prev, cvc: value }))}
          error={errors.cvc}
          inputMode="numeric"
          maxLength={4}
        />
      </div>

      <div className="space-y-1 rounded-md border border-border bg-muted/30 p-3">
        <CheckboxRow
          id="cover-platform-costs"
          label={paymentFields.coverPlatformCosts}
          checked={form.coverPlatformCosts}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, coverPlatformCosts: checked }))
          }
        />
        <p className="text-xs text-muted-foreground">
          {paymentFields.coverPlatformCostsDescription}
        </p>
      </div>

      <p className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
        {copy.donationSummaryPrefix} ${finalAmount.toFixed(2)}
        {isRecurring ? " weekly" : " once"}
      </p>
    </div>
  );
};

const FieldInput = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
};

const CheckboxRow = ({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="h-4 w-4 rounded border border-input accent-primary"
      />
      {label}
    </label>
  );
};
