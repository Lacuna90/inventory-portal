export const mockInventoryItems = [
  { id: 1, name: "Projektor", kategori: "Elektronik", mængde: 3, lokation: "Rum 101" },
  { id: 2, name: "Whiteboard", kategori: "Møbler", mængde: 5, lokation: "Gang" },
  { id: 3, name: "Stol", kategori: "Møbler", mængde: 12, lokation: "Rum 102" },
  { id: 4, name: "Laptop", kategori: "Elektronik", mængde: 8, lokation: "Lager" },
  { id: 5, name: "Skærm", kategori: "Elektronik", mængde: 10, lokation: "Lager" },
];

export const mockLoans = [
  { id: 1, item: "Projektor", medlem: "Anders Hansen", fra: "2024-11-01", til: "2024-11-08" },
  { id: 2, item: "Laptop", medlem: "Marie Andersen", fra: "2024-11-05", til: "2024-11-12" },
  { id: 3, item: "Stol", medlem: "Peter Nielsen", fra: "2024-11-03", til: "2024-11-17" },
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

export const dashboardStats = {
  totalItems: 38,
  itemsLoaned: 3,
  itemsReserved: 3,
  activeMembers: 4,
};
