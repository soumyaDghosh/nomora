export const KnowBeforeYouGoData: Record<
  string,
  {
    essentialItems: { icon: string; text: string }[];
    accessibility: { icon: string; text: string }[];
    rulesRestrictions: { icon: string; text: string }[];
    weatherAdvisory: { icon: string; text: string }[];
  }
> = {
  // 🔹 Bangalore Trip
  "8c869966-79b0-4919-b418-33f154f57421": {
    essentialItems: [
      { icon: "ri-footprint-line", text: "Wear comfortable walking shoes" },
      { icon: "ri-id-card-line", text: "Carry valid photo ID" },
      { icon: "ri-sun-line", text: "Bring hat, sunglasses & sunscreen" },
      { icon: "ri-water-flash-line", text: "Carry reusable water bottle" },
      { icon: "ri-wallet-3-line", text: "Keep small cash for tickets" },
    ],
    accessibility: [
      { icon: "ri-walk-line", text: "Expect 2-3 km of walking" },
      { icon: "ri-stairs-line", text: "~100 stairs to climb" },
      { icon: "ri-wheelchair-line", text: "Not wheelchair accessible" },
      { icon: "ri-restaurant-line", text: "Inform driver of dietary needs early" },
    ],
    rulesRestrictions: [
      { icon: "ri-forbid-line", text: "No smoking/eating in vehicle" },
      { icon: "ri-shirt-line", text: "Cover shoulders & knees at temples" },
      { icon: "ri-camera-line", text: "Check rules for carrying mobiles, photography" },
    ],
    weatherAdvisory: [
      { icon: "ri-temp-cold-line", text: "Layer up for cool mornings/evenings" },
      { icon: "ri-sun-line", text: "Wear breathable clothes for warm midday" },
      { icon: "ri-cup-line", text: "Stay hydrated throughout the day" },
    ],
  },

  // 🔹 Mysore Trip
  "a38eba59-6338-4e4d-9fb7-f217309cbdc2": {
    essentialItems: [
      { icon: "ri-footprint-line", text: "Wear comfortable walking shoes" },
      { icon: "ri-id-card-line", text: "Carry valid photo ID" },
      { icon: "ri-sun-line", text: "Bring hat, sunglasses & sunscreen" },
      { icon: "ri-water-flash-line", text: "Carry reusable water bottle" },
      { icon: "ri-wallet-3-line", text: "Keep small cash for tickets" },
      { icon: "ri-money-dollar-circle-line", text: "Carry cash, cards not accepted everywhere" },
    ],
    accessibility: [
      { icon: "ri-walk-line", text: "Expect 4-5 km of walking" },
      { icon: "ri-car-line", text: "Chamundi Hills accessible by vehicle (no stairs)" },
      { icon: "ri-wheelchair-line", text: "Not wheelchair accessible" },
      { icon: "ri-restaurant-line", text: "Inform driver of dietary needs early" },
    ],
    rulesRestrictions: [
      { icon: "ri-forbid-line", text: "No smoking/eating in vehicle" },
      { icon: "ri-shirt-line", text: "Cover shoulders & knees at temples" },
      { icon: "ri-camera-line", text: "Check rules for carrying mobiles, photography" },
      { icon: "ri-briefcase-line", text: "Large bags not allowed in palace (lockers available)" },
    ],
    weatherAdvisory: [
      { icon: "ri-temp-cold-line", text: "Layer up for cool mornings/evenings" },
      { icon: "ri-sun-line", text: "Wear breathable clothes for warm midday" },
      { icon: "ri-cup-line", text: "Stay hydrated throughout the day" },
    ],
  },
};
