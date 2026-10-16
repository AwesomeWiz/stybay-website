/** Public brand configuration; never add private credentials here. */
export const site = {
  origin: "https://stybay.com",
  waitlist: "https://tally.so/r/0Qpg8P",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  name: "StyBay Technologies",
};
export const navigation = [
  { href: "/#experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/technology", label: "Technology" },
  { href: "/contact", label: "Contact" },
];
