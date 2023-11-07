import { Item } from "../types";

export const calculateItemBuildPoints = (items: Item[]) => {
  let itemsOver1751 = 0;
  let itemsOver5k = 0;

  for (const item of items) {
    if (item.price > 1751 && item.price < 5000) {
      itemsOver1751++;
    }
    if (item.price >= 5000) {
      itemsOver5k++;
    }
  }

  if (itemsOver1751 === 3 && itemsOver5k === 0) {
    return 1;
  }

  if (itemsOver1751 === 1 && itemsOver5k === 2) {
    return 1;
  }

  if (itemsOver1751 === 3 && itemsOver5k === 1) {
    return 2;
  }

  if (itemsOver1751 === 4 && itemsOver5k === 0) {
    return 2;
  }

  if (itemsOver1751 === 2 && itemsOver5k === 2) {
    return 2;
  }

  if (itemsOver1751 === 5 && itemsOver5k === 0) {
    return 2;
  }

  if (itemsOver1751 === 4 && itemsOver5k === 1) {
    return 3;
  }

  if (itemsOver1751 === 3 && itemsOver5k === 2) {
    return 3;
  }

  if (itemsOver1751 === 2 && itemsOver5k === 3) {
    return 3;
  }

  if (itemsOver1751 === 6 && itemsOver5k === 0) {
    return 3;
  }

  if (itemsOver1751 === 5 && itemsOver5k === 1) {
    return 4;
  }

  if (itemsOver1751 === 4 && itemsOver5k === 2) {
    return 4;
  }

  if (itemsOver1751 === 3 && itemsOver5k === 3) {
    return 6;
  }

  if (itemsOver1751 === 2 && itemsOver5k === 4) {
    return 6;
  }

  return 0;
};
