import { Item } from "../types";

export const calculateItemBuildPoints = (items: Item[]) => {
  const itemsOver1751 = items.filter(
    (item) => item.price > 1751 && item.price < 5000
  ).length;
  const itemsOver5k = items.filter((item) => item.price >= 5000).length;

  if (itemsOver1751 === 3 && itemsOver5k === 0) {
    return 1;
  }

  if (itemsOver1751 === 2 && itemsOver5k === 1) {
    return 1;
  }

  if (itemsOver1751 === 1 && itemsOver5k === 2) {
    return 1;
  }

  if (itemsOver1751 === 0 && itemsOver5k === 3) {
    return 2;
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

  if (itemsOver1751 === 0 && itemsOver5k === 4) {
    return 3;
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

  if (itemsOver1751 === 1 && itemsOver5k === 3) {
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

  if (itemsOver1751 === 1 && itemsOver5k === 4) {
    return 6;
  }

  if (itemsOver1751 === 0 && itemsOver5k === 5) {
    return 5;
  }

  if (itemsOver1751 === 3 && itemsOver5k === 3) {
    return 6;
  }

  if (itemsOver1751 === 2 && itemsOver5k === 4) {
    return 6;
  }

  if (itemsOver1751 === 0 && itemsOver5k === 6) {
    return 7;
  }

  if (itemsOver1751 === 1 && itemsOver5k === 5) {
    return 7;
  }

  return 0;
};
