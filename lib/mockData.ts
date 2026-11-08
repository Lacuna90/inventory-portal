export const mockInventoryItems = [
  { id: 1, name: "Projektor", kategori: "Elektronik", mængde: 3, lokation: "Rum 101", mængdeHjemme: 2, mængdeUdlånt: 1, lånCount: 15 },
  { id: 2, name: "Whiteboard", kategori: "Møbler", mængde: 5, lokation: "Gang", mængdeHjemme: 5, mængdeUdlånt: 0, lånCount: 8 },
  { id: 3, name: "Stol", kategori: "Møbler", mængde: 12, lokation: "Rum 102", mængdeHjemme: 11, mængdeUdlånt: 1, lånCount: 22 },
  { id: 4, name: "Laptop", kategori: "Elektronik", mængde: 8, lokation: "Lager", mængdeHjemme: 7, mængdeUdlånt: 1, lånCount: 24 },
  { id: 5, name: "Skærm", kategori: "Elektronik", mængde: 10, lokation: "Lager", mængdeHjemme: 10, mængdeUdlånt: 0, lånCount: 18 },
  { id: 6, name: "Kabel HDMI", kategori: "Tilbehør", mængde: 20, lokation: "Lager", mængdeHjemme: 15, mængdeUdlånt: 5, lånCount: 45 },
  { id: 7, name: "Mikrofon", kategori: "Elektronik", mængde: 4, lokation: "Rum 103", mængdeHjemme: 3, mængdeUdlånt: 1, lånCount: 12 },
  { id: 8, name: "Højtaler", kategori: "Elektronik", mængde: 6, lokation: "Lager", mængdeHjemme: 4, mængdeUdlånt: 2, lånCount: 19 },
  { id: 9, name: "Projektor dæmp", kategori: "Tilbehør", mængde: 8, lokation: "Lager", mængdeHjemme: 6, mængdeUdlånt: 2, lånCount: 28 },
  { id: 10, name: "Adapter", kategori: "Tilbehør", mængde: 15, lokation: "Lager", mængdeHjemme: 12, mængdeUdlånt: 3, lånCount: 35 },
  { id: 11, name: "Kamera", kategori: "Elektronik", mængde: 3, lokation: "Rum 104", mængdeHjemme: 2, mængdeUdlånt: 1, lånCount: 9 },
];

export const mockLoans = [
  { id: 1, item: "Projektor", medlem: "Anders Hansen", fra: "2024-11-01", til: "2024-11-08", status: "forfalden" },
  { id: 2, item: "Laptop", medlem: "Marie Andersen", fra: "2024-11-05", til: "2024-11-12", status: "snartForfalden" },
  { id: 3, item: "Stol", medlem: "Peter Nielsen", fra: "2024-11-03", til: "2024-11-17", status: "aktiv" },
  { id: 4, item: "Højtaler", medlem: "Søren Larsen", fra: "2024-11-06", til: "2024-11-13", status: "snartForfalden" },
  { id: 5, item: "Kabel HDMI", medlem: "Lisa Jensen", fra: "2024-11-07", til: "2024-11-21", status: "aktiv" },
];

export const mockReservations = [
  { id: 1, item: "Projektor", medlem: "Søren Larsen", dato: "2024-11-15" },
  { id: 2, item: "Whiteboard", medlem: "Lisa Jensen", dato: "2024-11-12" },
  { id: 3, item: "Laptop", medlem: "Thomas Christensen", dato: "2024-11-18" },
];

export const mockMembers = [
  { id: 1, name: "Anders Hansen", email: "anders@example.com", medlemskat: "aktiv" },
  { id: 2, name: "Marie Andersen", email: "marie@example.com", medlemskat: "aktiv" },
  { id: 3, name: "Peter Nielsen", email: "peter@example.com", medlemskat: "aktiv" },
  { id: 4, name: "Søren Larsen", email: "soren@example.com", medlemskat: "inaktiv" },
  { id: 5, name: "Lisa Jensen", email: "lisa@example.com", medlemskat: "aktiv" },
];

export const mockActivity = [
  { id: 1, type: "loan", item: "Laptop", medlem: "Marie Andersen", tidspunkt: "I dag 14:30", ikon: "📤" },
  { id: 2, type: "return", item: "Projektor", medlem: "Anders Hansen", tidspunkt: "I dag 12:15", ikon: "📥" },
  { id: 3, type: "reservation", item: "Whiteboard", medlem: "Lisa Jensen", tidspunkt: "I dag 10:45", ikon: "📋" },
  { id: 4, type: "loan", item: "Højtaler", medlem: "Søren Larsen", tidspunkt: "I går 16:20", ikon: "📤" },
  { id: 5, type: "return", item: "Stol", medlem: "Peter Nielsen", tidspunkt: "I går 09:30", ikon: "📥" },
];

export const dashboardStats = {
  totalItems: 92,
  itemsHome: 77,
  itemsLoaned: 5,
  itemsReserved: 3,
  itemsForSale: 7,
  activeMembers: 4,
};

export const topBorrowedItems = mockInventoryItems
  .sort((a, b) => b.lånCount - a.lånCount)
  .slice(0, 10);
