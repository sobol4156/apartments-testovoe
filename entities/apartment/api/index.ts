import { apartmentsItems } from "../mock";

export const getApartments = (): Promise<typeof apartmentsItems> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(apartmentsItems);
    }, 250);
  });
};
