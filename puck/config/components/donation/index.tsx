import { ComponentConfig } from "@puckeditor/core";
import {
  badge,
  image,
  image16x9Placeholder,
  padding,
  paddingDefaults,
} from "@/puck/config/fields";
import { Donation, DonationProps } from "./donation";

export type { DonationProps };

export const conf: ComponentConfig<DonationProps> = {
  fields: {
    heading: { type: "text", contentEditable: true },
    description: {
      type: "richtext",
      contentEditable: true,
      options: {
        heading: false,
        textAlign: false,
        blockquote: false,
      },
      ai: {
        instructions: "Keep under 45 words and emotionally direct.",
      },
    },
    badge,
    backgroundImage: {
      type: "object",
      objectFields: {
        ...image.objectFields,
      },
    },
    backgroundOverlayOpacity: {
      type: "number",
      min: 0.1,
      max: 0.8,
    },
    stepLabels: {
      type: "object",
      objectFields: {
        donate: { type: "text" },
        details: { type: "text" },
        payment: { type: "text" },
      },
    },
    buttonLabels: {
      type: "object",
      objectFields: {
        back: { type: "text" },
        next: { type: "text" },
        submit: { type: "text" },
      },
    },
    copy: {
      type: "object",
      objectFields: {
        frequencyHeading: { type: "text" },
        amountHeading: { type: "text" },
        customAmountPlaceholder: { type: "text" },
        customAmountPrefix: { type: "text" },
        recurringDayLabel: { type: "text" },
        recurringDayFirst: { type: "text" },
        recurringDaySecond: { type: "text" },
        detailsHeading: { type: "text" },
        paymentHeading: { type: "text" },
        donationSummaryPrefix: { type: "text" },
      },
    },
    frequencyOptions: {
      type: "array",
      max: 4,
      getItemSummary: (item, index = 0) => item.label || `Frequency ${index + 1}`,
      arrayFields: {
        label: { type: "text" },
        value: { type: "text" },
      },
      defaultItemProps: {
        label: "Give once",
        value: "once",
      },
    },
    amountOptions: {
      type: "array",
      max: 8,
      getItemSummary: (item, index = 0) => item.label || `Amount ${index + 1}`,
      arrayFields: {
        label: { type: "text" },
        amount: { type: "number", min: 1 },
        description: { type: "text" },
      },
      defaultItemProps: {
        label: "$50",
        amount: 50,
        description: "Supports one critical supply pack",
      },
    },
    detailsFields: {
      type: "object",
      objectFields: {
        firstName: { type: "text" },
        lastName: { type: "text" },
        email: { type: "text" },
        phone: { type: "text" },
        address: { type: "text" },
        onBehalfLabel: { type: "text" },
        organizationName: { type: "text" },
        anonymousLabel: { type: "text" },
      },
    },
    paymentFields: {
      type: "object",
      objectFields: {
        cardholderName: { type: "text" },
        cardNumber: { type: "text" },
        expiryMonth: { type: "text" },
        expiryYear: { type: "text" },
        cvc: { type: "text" },
        coverPlatformCosts: { type: "text" },
        coverPlatformCostsDescription: { type: "text" },
      },
    },
    padding,
  },
  defaultProps: {
    heading: "Improve outcomes for sick kids. Donate today.",
    description:
      "Your support helps fund research, treatment innovation, and practical care for families when they need it most.",
    badge: {
      label: "Support children in care",
      url: "",
      variant: "secondary",
    },
    backgroundImage: image16x9Placeholder,
    backgroundOverlayOpacity: 0.45,
    stepLabels: {
      donate: "Donate",
      details: "Details",
      payment: "Payment",
    },
    buttonLabels: {
      back: "Back",
      next: "Next",
      submit: "Donate now",
    },
    copy: {
      frequencyHeading: "Choose frequency",
      amountHeading: "Choose amount",
      customAmountPlaceholder: "Enter custom amount",
      customAmountPrefix: "$",
      recurringDayLabel: "Select debit day",
      recurringDayFirst: "15th",
      recurringDaySecond: "28th",
      detailsHeading: "Your details",
      paymentHeading: "Secure payment",
      donationSummaryPrefix: "Donation total:",
    },
    frequencyOptions: [
      {
        label: "Give once",
        value: "once",
      },
      {
        label: "Give weekly",
        value: "weekly",
      },
    ],
    amountOptions: [
      { label: "$30", amount: 30, description: "Provides transport support" },
      { label: "$50", amount: 50, description: "Funds one care resource kit" },
      { label: "$100", amount: 100, description: "Supports treatment support hours" },
      { label: "$200", amount: 200, description: "Helps families with extended care" },
    ],
    detailsFields: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone number",
      address: "Address",
      onBehalfLabel: "This donation is on behalf of an organization",
      organizationName: "Organization name",
      anonymousLabel: "Keep my donation anonymous",
    },
    paymentFields: {
      cardholderName: "Cardholder name",
      cardNumber: "Card number",
      expiryMonth: "Expiry month",
      expiryYear: "Expiry year",
      cvc: "CVC",
      coverPlatformCosts: "Cover platform costs",
      coverPlatformCostsDescription:
        "Add a small amount so 100% of your intended donation reaches programs.",
    },
    padding: paddingDefaults,
  },
  render: Donation,
};

export default conf;
