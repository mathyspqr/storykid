export type CreationAnswers = {
  need: string;
  customNeed?: string;
  childName: string;
  age: string;
  interests: string[];
  customInterests?: string;
  storyAnchor: string;
  customStoryAnchor?: string;
  desiredFeeling: string;
  parentIntent?: string;
  pageCount: 6 | 8;
  audioEnabled: boolean;
};

export type PrePaywallTeaser = {
  provisionalTitle: string;
  childName: string;
  needLabel: string;
  storyAnchorLabel: string;
  feelingLabel: string;
  pageCount: 6 | 8;
  audioEnabled: boolean;
  selectedPrice: 4.99 | 7.99;
  status: "prepared_for_reveal";
};

export type CheckoutIntent = {
  productType: "digital" | "digital_with_audio";
  amountInCents: 499 | 799;
  currency: "EUR";
};
