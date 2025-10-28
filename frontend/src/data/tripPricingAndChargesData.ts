// tripPricingData.ts
export const tripPricingAndChargesData: Record<
  string,
  {
    pricingCharges: {
      icon: string;
      color: string;
      text: string;
    }[];
  }
> = {
  "8c869966-79b0-4919-b418-33f154f57421": {
    pricingCharges: [
      {
        icon: "ri-money-dollar-circle-line",
        color: "text-emerald-600",
        text: "Pay only for time beyond the specified duration: ₹150/hr (Prime), ₹200/hr (Max).",
      },
      {
        icon: "ri-timer-2-line",
        color: "text-blue-600",
        text: "Minimum extension: 30 min.",
      },
      {
        icon: "ri-price-tag-3-line",
        color: "text-orange-600",
        text: "Extra billing applies after 15 min free period.",
      },
    ],
  },
  "a38eba59-6338-4e4d-9fb7-f217309cbdc2": {
    pricingCharges: [
      {
        icon: "ri-money-dollar-circle-line",
        color: "text-emerald-600",
        text: "Pay only for extra time beyond 10 PM: ₹150/hr (Prime), ₹200/hr (Max).",
      },
      {
        icon: "ri-timer-2-line",
        color: "text-blue-600",
        text: "Minimum extension: 30 min.",
      },
      {
        icon: "ri-price-tag-3-line",
        color: "text-orange-600",
        text: "Extra billing applies after 15 min free period.",
      },
    ],
  },
};
