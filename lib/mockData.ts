export const mockInventoryItems = [
  { id: 1, name: "Projektor", kategori: "Elektronik", mængde: 3, lokation: "Rum 101", status: "hjemme", mængdeHjemme: 2, mængdeUdlånt: 1, lånCount: 15, billede: "🎬" },
  { id: 2, name: "Whiteboard 1x2m", kategori: "Møbler", mængde: 5, lokation: "Gang", status: "hjemme", mængdeHjemme: 5, mængdeUdlånt: 0, lånCount: 8, billede: "📋" },
  { id: 3, name: "Stol ergonomisk", kategori: "Møbler", mængde: 12, lokation: "Rum 102", status: "hjemme", mængdeHjemme: 11, mængdeUdlånt: 1, lånCount: 22, billede: "🪑" },
  { id: 4, name: "Laptop Dell XPS", kategori: "Elektronik", mængde: 8, lokation: "Lager", status: "udlånt", mængdeHjemme: 7, mængdeUdlånt: 1, lånCount: 24, billede: "💻" },
  { id: 5, name: "Skærm LG 27\"", kategori: "Elektronik", mængde: 10, lokation: "Lager", status: "hjemme", mængdeHjemme: 10, mængdeUdlånt: 0, lånCount: 18, billede: "🖥️" },
  { id: 6, name: "Kabel HDMI 2m", kategori: "Tilbehør", mængde: 20, lokation: "Lager", status: "hjemme", mængdeHjemme: 15, mængdeUdlånt: 5, lånCount: 45, billede: "🔌" },
  { id: 7, name: "Mikrofon Shure", kategori: "Elektronik", mængde: 4, lokation: "Rum 103", status: "hjemme", mængdeHjemme: 3, mængdeUdlånt: 1, lånCount: 12, billede: "🎤" },
  { id: 8, name: "Højtaler Bose", kategori: "Elektronik", mængde: 6, lokation: "Lager", status: "hjemme", mængdeHjemme: 4, mængdeUdlånt: 2, lånCount: 19, billede: "🔊" },
  { id: 9, name: "Projektor fjernbetjening", kategori: "Tilbehør", mængde: 8, lokation: "Lager", status: "hjemme", mængdeHjemme: 6, mængdeUdlånt: 2, lånCount: 28, billede: "📡" },
  { id: 10, name: "USB-C Adapter", kategori: "Tilbehør", mængde: 15, lokation: "Lager", status: "hjemme", mængdeHjemme: 12, mængdeUdlånt: 3, lånCount: 35, billede: "🔋" },
  { id: 11, name: "Kamera Sony A6400", kategori: "Elektronik", mængde: 3, lokation: "Rum 104", status: "reserveret", mængdeHjemme: 2, mængdeUdlånt: 1, lånCount: 9, billede: "📷" },
  { id: 12, name: "Tripod aluminium", kategori: "Møbler", mængde: 7, lokation: "Lager", status: "hjemme", mængdeHjemme: 7, mængdeUdlånt: 0, lånCount: 14, billede: "🦵" },
  { id: 13, name: "Lighting kit 3x", kategori: "Elektronik", mængde: 2, lokation: "Rum 105", status: "udlånt", mængdeHjemme: 1, mængdeUdlånt: 1, lånCount: 11, billede: "💡" },
  { id: 14, name: "Grøn baggrund kit", kategori: "Tilbehør", mængde: 4, lokation: "Lager", status: "til_salg", mængdeHjemme: 2, mængdeUdlånt: 0, lånCount: 6, billede: "🟢" },
  { id: 15, name: "Lydkort Focusrite", kategori: "Elektronik", mængde: 1, lokation: "Rum 106", status: "defekt", mængdeHjemme: 0, mængdeUdlånt: 0, lånCount: 5, billede: "🎛️" },
  { id: 16, name: "Skrivebord 120x60cm", kategori: "Møbler", mængde: 6, lokation: "Lager", status: "hjemme", mængdeHjemme: 6, mængdeUdlånt: 0, lånCount: 7, billede: "🛠️" },
  { id: 17, name: "Monitor arm", kategori: "Tilbehør", mængde: 10, lokation: "Lager", status: "hjemme", mængdeHjemme: 9, mængdeUdlånt: 1, lånCount: 16, billede: "⚙️" },
  { id: 18, name: "Headphones Sony", kategori: "Elektronik", mængde: 5, lokation: "Rum 107", status: "solgt", mængdeHjemme: 0, mængdeUdlånt: 0, lånCount: 8, billede: "🎧" },
  { id: 19, name: "Keyboard mekanisk", kategori: "Elektronik", mængde: 4, lokation: "Lager", status: "hjemme", mængdeHjemme: 4, mængdeUdlånt: 0, lånCount: 13, billede: "⌨️" },
  { id: 20, name: "Mus logitech MX", kategori: "Elektronik", mængde: 8, lokation: "Lager", status: "hjemme", mængdeHjemme: 8, mængdeUdlånt: 0, lånCount: 19, billede: "🖱️" },
];

export const mockLoans = [
  { id: 1, item: "Projektor", itemId: 1, billede: "🎬", kategori: "Elektronik", medlem: "Anders Hansen", telefon: "40 12 34 56", fra: "2024-10-25", til: "2024-11-08", status: "forfalden", returneret: null },
  { id: 2, item: "Laptop Dell XPS", itemId: 4, billede: "💻", kategori: "Elektronik", medlem: "Marie Andersen", telefon: "30 45 67 89", fra: "2024-11-02", til: "2024-11-12", status: "snartForfalden", returneret: null },
  { id: 3, item: "Stol ergonomisk", itemId: 3, billede: "🪑", kategori: "Møbler", medlem: "Peter Nielsen", telefon: "20 98 76 54", fra: "2024-10-28", til: "2024-11-25", status: "aktiv", returneret: null },
  { id: 4, item: "Højtaler Bose", itemId: 8, billede: "🔊", kategori: "Elektronik", medlem: "Søren Larsen", telefon: "50 11 22 33", fra: "2024-11-01", til: "2024-11-13", status: "snartForfalden", returneret: null },
  { id: 5, item: "Kabel HDMI 2m", itemId: 6, billede: "🔌", kategori: "Tilbehør", medlem: "Lisa Jensen", telefon: "60 99 88 77", fra: "2024-11-05", til: "2024-11-26", status: "aktiv", returneret: null },
  { id: 6, item: "Lighting kit 3x", itemId: 13, billede: "💡", kategori: "Elektronik", medlem: "Thomas Christensen", telefon: "40 55 66 77", fra: "2024-11-04", til: "2024-11-11", status: "snartForfalden", returneret: null },
  { id: 7, item: "Mikrofon Shure", itemId: 7, billede: "🎤", kategori: "Elektronik", medlem: "Ingrid Østergaard", telefon: "22 33 44 55", fra: "2024-11-06", til: "2024-11-27", status: "aktiv", returneret: null },
  { id: 8, item: "Kamera Sony A6400", itemId: 11, billede: "📷", kategori: "Elektronik", medlem: "Johannes Møller", telefon: "45 77 88 99", fra: "2024-10-30", til: "2024-11-09", status: "forfalden", returneret: null },
  { id: 9, item: "Tripod aluminium", itemId: 12, billede: "🦵", kategori: "Møbler", medlem: "Anna Bergström", telefon: "38 22 11 44", fra: "2024-11-01", til: "2024-11-18", status: "aktiv", returneret: null },
  { id: 10, item: "USB-C Adapter", itemId: 10, billede: "🔋", kategori: "Tilbehør", medlem: "Rasmus Andersen", telefon: "55 66 77 88", fra: "2024-10-29", til: "2024-11-10", status: "snartForfalden", returneret: null },
  { id: 11, item: "Monitor arm", itemId: 17, billede: "⚙️", kategori: "Tilbehør", medlem: "Henrik Nielsen", telefon: "35 42 58 67", fra: "2024-11-03", til: "2024-11-24", status: "aktiv", returneret: null },
  { id: 12, item: "Whiteboard 1x2m", itemId: 2, billede: "📋", kategori: "Møbler", medlem: "Sandra Larsen", telefon: "44 55 66 77", fra: "2024-10-26", til: "2024-11-06", status: "returneret", returneret: "2024-11-06" },
];

export const mockReservations = [
  { id: 1, item: "Projektor", itemId: 1, billede: "🎬", kategori: "Elektronik", medlem: "Søren Larsen", startdato: "2024-11-10", slutdato: "2024-11-14", status: "kommende" },
  { id: 2, item: "Whiteboard 1x2m", itemId: 2, billede: "📋", kategori: "Møbler", medlem: "Lisa Jensen", startdato: "2024-11-08", slutdato: "2024-11-12", status: "aktiv" },
  { id: 3, item: "Laptop Dell XPS", itemId: 4, billede: "💻", kategori: "Elektronik", medlem: "Thomas Christensen", startdato: "2024-11-12", slutdato: "2024-11-16", status: "kommende" },
  { id: 4, item: "Kamera Sony A6400", itemId: 11, billede: "📷", kategori: "Elektronik", medlem: "Henrik Nielsen", startdato: "2024-11-15", slutdato: "2024-11-22", status: "kommende" },
  { id: 5, item: "Højtaler Bose", itemId: 8, billede: "🔊", kategori: "Elektronik", medlem: "Anna Bergström", startdato: "2024-11-09", slutdato: "2024-11-11", status: "aktiv" },
  { id: 6, item: "Stol ergonomisk", itemId: 3, billede: "🪑", kategori: "Møbler", medlem: "Johannes Møller", startdato: "2024-11-18", slutdato: "2024-11-25", status: "kommende" },
  { id: 7, item: "Tripod aluminium", itemId: 12, billede: "🦵", kategori: "Møbler", medlem: "Ingrid Østergaard", startdato: "2024-11-11", slutdato: "2024-11-13", status: "aktiv" },
  { id: 8, item: "Mikrofon Shure", itemId: 7, billede: "🎤", kategori: "Elektronik", medlem: "Rasmus Andersen", startdato: "2024-11-20", slutdato: "2024-11-27", status: "kommende" },
  { id: 9, item: "Lighting kit 3x", itemId: 13, billede: "💡", kategori: "Elektronik", medlem: "Sandra Larsen", startdato: "2024-11-17", slutdato: "2024-11-19", status: "kommende" },
  { id: 10, item: "Skærm LG 27\"", itemId: 5, billede: "🖥️", kategori: "Elektronik", medlem: "Marie Andersen", startdato: "2024-11-21", slutdato: "2024-11-28", status: "kommende" },
  { id: 11, item: "Monitor arm", itemId: 17, billede: "⚙️", kategori: "Tilbehør", medlem: "Peter Nielsen", startdato: "2024-10-28", slutdato: "2024-11-05", status: "udløbet" },
  { id: 12, item: "Kabel HDMI 2m", itemId: 6, billede: "🔌", kategori: "Tilbehør", medlem: "Anders Hansen", startdato: "2024-11-06", slutdato: "2024-11-07", status: "udløbet" },
  { id: 13, item: "USB-C Adapter", itemId: 10, billede: "🔋", kategori: "Tilbehør", medlem: "Thomas Christensen", startdato: "2024-11-25", slutdato: "2024-11-29", status: "kommende" },
  { id: 14, item: "Keyboard mekanisk", itemId: 19, billede: "⌨️", kategori: "Elektronik", medlem: "Henrik Nielsen", startdato: "2024-11-13", slutdato: "2024-11-15", status: "kommende" },
  { id: 15, item: "Mus logitech MX", itemId: 20, billede: "🖱️", kategori: "Elektronik", medlem: "Lisa Jensen", startdato: "2024-11-14", slutdato: "2024-11-17", status: "kommende" },
  { id: 16, item: "Projektor fjernbetjening", itemId: 9, billede: "📡", kategori: "Tilbehør", medlem: "Søren Larsen", startdato: "2024-11-10", slutdato: "2024-11-14", status: "kommende" },
  { id: 17, item: "Skrivebord 120x60cm", itemId: 16, billede: "🛠️", kategori: "Møbler", medlem: "Anna Bergström", startdato: "2024-11-08", slutdato: "2024-11-10", status: "aktiv" },
];

export const mockMembers = [
  { id: 1, name: "Anders Hansen", email: "anders.hansen@example.com", telefon: "40 12 34 56", adresse: "Hovedgaden 42, 2100 København Ø", rolle: "Admin", tilmeldingsdato: "2023-03-15", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👨‍💼", aktiveLån: 1, aktivtReservationer: 0 },
  { id: 2, name: "Marie Andersen", email: "marie.andersen@example.com", telefon: "30 45 67 89", adresse: "Strandvejen 15, 2100 København Ø", rolle: "Familie", tilmeldingsdato: "2023-05-20", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👩‍💼", aktiveLån: 1, aktivtReservationer: 1 },
  { id: 3, name: "Peter Nielsen", email: "peter.nielsen@example.com", telefon: "20 98 76 54", adresse: "Nørrebrogade 88, 2200 København N", rolle: "Medlem", tilmeldingsdato: "2023-02-10", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👨‍💻", aktiveLån: 1, aktivtReservationer: 2 },
  { id: 4, name: "Søren Larsen", email: "soren.larsen@example.com", telefon: "50 11 22 33", adresse: "Vesterbrogade 5, 1620 København V", rolle: "Gæst", tilmeldingsdato: "2022-11-05", senessteAktivitet: "2024-10-15", status: "inaktiv", avatar: "👨‍🔧", aktiveLån: 0, aktivtReservationer: 0 },
  { id: 5, name: "Lisa Jensen", email: "lisa.jensen@example.com", telefon: "60 99 88 77", adresse: "Tåsinge Plads 3, 2100 København Ø", rolle: "Familie", tilmeldingsdato: "2023-07-12", senessteAktivitet: "2024-11-07", status: "aktiv", avatar: "👩‍🎓", aktiveLån: 1, aktivtReservationer: 1 },
  { id: 6, name: "Thomas Christensen", email: "thomas.christensen@example.com", telefon: "40 55 66 77", adresse: "Rantzausgade 22, 2200 København N", rolle: "Medlem", tilmeldingsdato: "2024-01-08", senessteAktivitet: "2024-11-06", status: "aktiv", avatar: "👨‍💼", aktiveLån: 1, aktivtReservationer: 0 },
  { id: 7, name: "Ingrid Østergaard", email: "ingrid.oestergaard@example.com", telefon: "22 33 44 55", adresse: "Sortedamstræde 45, 2100 København Ø", rolle: "Admin", tilmeldingsdato: "2023-09-22", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👩‍🏫", aktiveLån: 1, aktivtReservationer: 1 },
  { id: 8, name: "Johannes Møller", email: "johannes.moller@example.com", telefon: "45 77 88 99", adresse: "Farvergade 11, 2100 København Ø", rolle: "Medlem", tilmeldingsdato: "2023-04-17", senessteAktivitet: "2024-11-05", status: "aktiv", avatar: "👨‍🎨", aktiveLån: 1, aktivtReservationer: 2 },
  { id: 9, name: "Anna Bergström", email: "anna.bergstrom@example.com", telefon: "38 22 11 44", adresse: "Skovshoved Strandvej 8, 2920 Charlottenlund", rolle: "Familie", tilmeldingsdato: "2023-06-30", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👩‍💻", aktiveLån: 1, aktivtReservationer: 0 },
  { id: 10, name: "Rasmus Andersen", email: "rasmus.andersen@example.com", telefon: "55 66 77 88", adresse: "Enghavevej 66, 1670 København V", rolle: "Medlem", tilmeldingsdato: "2023-08-14", senessteAktivitet: "2024-11-04", status: "aktiv", avatar: "👨‍🚀", aktiveLån: 1, aktivtReservationer: 1 },
  { id: 11, name: "Henrik Nielsen", email: "henrik.nielsen@example.com", telefon: "35 42 58 67", adresse: "Voldsminde 40, 2100 København Ø", rolle: "Medlem", tilmeldingsdato: "2024-02-01", senessteAktivitet: "2024-11-08", status: "aktiv", avatar: "👨‍💡", aktiveLån: 2, aktivtReservationer: 1 },
  { id: 12, name: "Sandra Larsen", email: "sandra.larsen@example.com", telefon: "44 55 66 77", adresse: "Østerfælledvej 100, 2100 København Ø", rolle: "Gæst", tilmeldingsdato: "2023-10-11", senessteAktivitet: "2024-10-20", status: "inaktiv", avatar: "👩‍🔬", aktiveLån: 0, aktivtReservationer: 0 },
];

export const mockActivity = [
  { id: 1, type: "loan", item: "Laptop", medlem: "Marie Andersen", tidspunkt: "I dag 14:30", ikon: "📤" },
  { id: 2, type: "return", item: "Projektor", medlem: "Anders Hansen", tidspunkt: "I dag 12:15", ikon: "📥" },
  { id: 3, type: "reservation", item: "Whiteboard", medlem: "Lisa Jensen", tidspunkt: "I dag 10:45", ikon: "📋" },
  { id: 4, type: "loan", item: "Højtaler", medlem: "Søren Larsen", tidspunkt: "I går 16:20", ikon: "📤" },
  { id: 5, type: "return", item: "Stol", medlem: "Peter Nielsen", tidspunkt: "I går 09:30", ikon: "📥" },
];

export const memberLoans = {
  1: [ { id: 1, item: "Projektor", itemId: 1, billede: "🎬", kategori: "Elektronik", fra: "2024-10-25", til: "2024-11-08", status: "forfalden", returneret: null } ],
  2: [ { id: 2, item: "Laptop Dell XPS", itemId: 4, billede: "💻", kategori: "Elektronik", fra: "2024-11-02", til: "2024-11-12", status: "snartForfalden", returneret: null } ],
  3: [ { id: 3, item: "Stol ergonomisk", itemId: 3, billede: "🪑", kategori: "Møbler", fra: "2024-10-28", til: "2024-11-25", status: "aktiv", returneret: null } ],
  5: [ { id: 5, item: "Kabel HDMI 2m", itemId: 6, billede: "🔌", kategori: "Tilbehør", fra: "2024-11-05", til: "2024-11-26", status: "aktiv", returneret: null } ],
  6: [ { id: 6, item: "Lighting kit 3x", itemId: 13, billede: "💡", kategori: "Elektronik", fra: "2024-11-04", til: "2024-11-11", status: "snartForfalden", returneret: null } ],
  7: [ { id: 7, item: "Mikrofon Shure", itemId: 7, billede: "🎤", kategori: "Elektronik", fra: "2024-11-06", til: "2024-11-27", status: "aktiv", returneret: null } ],
  8: [ { id: 8, item: "Kamera Sony A6400", itemId: 11, billede: "📷", kategori: "Elektronik", fra: "2024-10-30", til: "2024-11-09", status: "forfalden", returneret: null } ],
  9: [ { id: 9, item: "Tripod aluminium", itemId: 12, billede: "🦵", kategori: "Møbler", fra: "2024-11-01", til: "2024-11-18", status: "aktiv", returneret: null } ],
  10: [ { id: 10, item: "USB-C Adapter", itemId: 10, billede: "🔋", kategori: "Tilbehør", fra: "2024-10-29", til: "2024-11-10", status: "snartForfalden", returneret: null } ],
  11: [
    { id: 11, item: "Monitor arm", itemId: 17, billede: "⚙️", kategori: "Tilbehør", fra: "2024-11-03", til: "2024-11-24", status: "aktiv", returneret: null },
    { id: 100, item: "Keyboard mekanisk", itemId: 19, billede: "⌨️", kategori: "Elektronik", fra: "2024-10-15", til: "2024-10-29", status: "returneret", returneret: "2024-10-29" },
  ],
};

export const memberReservations = {
  2: [ { id: 2, item: "Whiteboard 1x2m", itemId: 2, billede: "📋", kategori: "Møbler", startdato: "2024-11-08", slutdato: "2024-11-12", status: "aktiv" } ],
  3: [
    { id: 3, item: "Laptop Dell XPS", itemId: 4, billede: "💻", kategori: "Elektronik", startdato: "2024-11-12", slutdato: "2024-11-16", status: "kommende" },
    { id: 15, item: "Mus logitech MX", itemId: 20, billede: "🖱️", kategori: "Elektronik", startdato: "2024-11-14", slutdato: "2024-11-17", status: "kommende" },
  ],
  5: [ { id: 5, item: "Højtaler Bose", itemId: 8, billede: "🔊", kategori: "Elektronik", startdato: "2024-11-09", slutdato: "2024-11-11", status: "aktiv" } ],
  7: [ { id: 1, item: "Projektor", itemId: 1, billede: "🎬", kategori: "Elektronik", startdato: "2024-11-10", slutdato: "2024-11-14", status: "kommende" } ],
  8: [ { id: 8, item: "Mikrofon Shure", itemId: 7, billede: "🎤", kategori: "Elektronik", startdato: "2024-11-20", slutdato: "2024-11-27", status: "kommende" } ],
  10: [ { id: 15, item: "Mus logitech MX", itemId: 20, billede: "🖱️", kategori: "Elektronik", startdato: "2024-11-14", slutdato: "2024-11-17", status: "kommende" } ],
  11: [ { id: 14, item: "Keyboard mekanisk", itemId: 19, billede: "⌨️", kategori: "Elektronik", startdato: "2024-11-13", slutdato: "2024-11-15", status: "kommende" } ],
};

export const memberActivityLog = {
  1: [
    { id: 1, type: "loan_return", item: "Projektor", tidspunkt: "2024-11-08 14:30", ikon: "📥" },
    { id: 2, type: "loan", item: "Projektor", tidspunkt: "2024-10-25 10:15", ikon: "📤" },
  ],
  2: [
    { id: 3, type: "loan", item: "Laptop Dell XPS", tidspunkt: "2024-11-02 09:20", ikon: "📤" },
    { id: 4, type: "reservation", item: "Whiteboard 1x2m", tidspunkt: "2024-11-01 16:45", ikon: "📋" },
  ],
};

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
