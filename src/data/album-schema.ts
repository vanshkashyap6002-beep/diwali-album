export type PageId =
  | "diya"
  | "homes"
  | "blessings"
  | "sky"
  | "memories"
  | "letter"
  | "wishes"
  | "final";
export interface Memory {
  id: string;
  src: string;
  caption: string;
  date: string;
  demo?: boolean;
}
export interface Album {
  sender: string;
  recipient: string;
  relationship: string;
  senderCity: string;
  recipientCity: string;
  opening: string;
  blessing: string;
  letter: string;
  closing: string;
  wishes: [string, string, string];
  memories: Memory[];
  sound: boolean;
}
export const STORY = [
  { id: "entry", title: "Enter Our Diwali" },
  { id: "cover", title: "A Diwali, Made for You" },
  { id: "diya", title: "Light a Diya" },
  { id: "homes", title: "Two Homes, One Diwali" },
  { id: "blessings", title: "Blessings for Your Home" },
  { id: "sky", title: "Under the Same Sky" },
  { id: "memories", title: "Moments I Wish You Were Here For" },
  { id: "letter", title: "A Letter from Me" },
  { id: "wishes", title: "Three Wishes" },
  { id: "final", title: "A Little Light Stays" },
] as const;
export const PAGES = STORY.slice(2) as ReadonlyArray<{
  id: PageId;
  title: string;
}>;
