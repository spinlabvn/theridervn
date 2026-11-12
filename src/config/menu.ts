/**
 * Menu chính – giữ đúng cấu trúc của therider.vn:
 *   New · Bike Check · Reviews ▾ (Bikes, Parts) · Videos ▾ (How To, Events, Podcast, Interview) · Events
 * Mỗi mục trỏ tới một chuyên mục (slug trong content/categories.json hoặc trên Sanity).
 */
export type MenuLink = { label: string; category: string };
export type MenuItem = MenuLink | { label: string; children: MenuLink[] };

export const mainMenu: MenuItem[] = [
  { label: "New", category: "news" },
  { label: "Bike Check", category: "bike-check" },
  {
    label: "Reviews",
    children: [
      { label: "Bikes", category: "review-bikes" },
      { label: "Parts", category: "review-parts" },
    ],
  },
  {
    label: "Videos",
    children: [
      { label: "How To", category: "how-to" },
      { label: "Events", category: "events" },
      { label: "Podcast", category: "podcast" },
      { label: "Interview", category: "interview" },
    ],
  },
  { label: "Events", category: "events" },
];

export const hasChildren = (item: MenuItem): item is { label: string; children: MenuLink[] } => "children" in item;
