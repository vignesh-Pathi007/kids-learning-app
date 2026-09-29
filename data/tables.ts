export type TableItem = {
  multiplier: number;
  answer: number;
};

export type MultiplicationTable = {
  table: number;
  items: TableItem[];
};

export const tablesData: MultiplicationTable[] = Array.from(
  { length: 20 },
  (_, tableIndex) => {
    const table = tableIndex + 1;

    return {
      table,
      items: Array.from(
        { length: 10 },
        (_, multiplierIndex) => {
          const multiplier = multiplierIndex + 1;

          return {
            multiplier,
            answer: table * multiplier,
          };
        },
      ),
    };
  },
);