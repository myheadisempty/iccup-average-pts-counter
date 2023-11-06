export const calculatePointsForKDAScore = (kda: number) => {
  if (kda >= 30) {
    return 6;
  } else if (kda >= 20.4) {
    return 5;
  } else if (kda >= 17) {
    return 4;
  } else if (kda >= 13.6) {
    return 3;
  } else if (kda >= 6.1) {
    return 2;
  } else {
    return 1;
  }
};
