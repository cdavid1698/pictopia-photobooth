export type Faq = { q: string; a: string; source: string; sample?: true };

export const faqs: Faq[] = [
  {
    q: "What is pause time?",
    a: "We stay at your venue for up to 4 hours and run the booth for 2 of them. When your program starts — the entrance, the 18 roses, the cake — we can pause for up to 2 hours so your guests don't miss it, then start again for the party.",
    source: "A1.6",
  },
  {
    q: "How much is it?",
    a: "It depends on how many photos go on each print: ₱3,500 for 3 or 4 shots (including the classic photo strip), ₱5,500 for 2 shots, and ₱6,000 for 1 shot (including Polaroid style). Every package has 2 hours of unlimited shots.",
    source: "A1.3, A1.11",
  },
  {
    q: "Can we add more booth time?",
    a: "Yes. Each extra operating hour is ₱1,000.",
    source: "A1.7",
  },
  {
    q: "Do you charge a travel fee?",
    a: "It depends on how far your venue is from our bases in Pura, Tarlac and Magalang, Pampanga. Tell us the venue when you book and we'll confirm the fee before anything is final.",
    source: "A1.8, F7",
  },
  {
    q: "Do we need to pay a deposit?",
    a: "No deposit is needed to reserve your date.",
    source: "A1.9",
  },
  {
    q: "Where do we get the soft copies?",
    a: "We upload every photo from your event to an album on our Facebook page, so your guests can find and tag themselves.",
    source: "A1.10",
  },
  {
    q: "Can we choose the backdrop?",
    a: "Yes — sequin or plain, in blue, pink, gray or white. Props are free to use, and we bring a set picked to suit your event.",
    source: "A1.13, A1.14",
  },
  {
    q: "What kind of booth is it?",
    a: "A traditional photobooth with a live monitor, so guests can see themselves and fix their pose before the countdown.",
    source: "A1.12",
  },
  {
    q: "Can someone else book the same date?",
    a: "Yes, more than one person can request a date. Your booking is confirmed when you confirm with us by phone, and dates go to whoever confirms first. We can cover more than one event on some days, so it's always worth asking.",
    source: "A1.16",
  },
  {
    q: "How do I check my booking?",
    a: "Go to Booking status (link at the bottom of every page) and enter your reference number, like PIC-AB12CD, plus the mobile number you booked with. You'll see whether it's pending, confirmed or declined, with all your details.",
    source: "site feature",
  },
  {
    q: "How soon will you confirm my booking?",
    a: "We reply within 24 hours by text or Messenger to confirm your date and travel fee.",
    source: "A1.15",
    sample: true,
  },
];
