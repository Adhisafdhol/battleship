const Ship = (length = 1) => {
  let numberOfHits = 0;

  const hit = () => {
    if (numberOfHits < length) {
      numberOfHits += 1;
    }
  };

  const isSunk = () => length === numberOfHits;

  return {
    get numberOfHits() {
      return numberOfHits;
    },
    get length() {
      return length;
    },
    hit,
    isSunk,
  };
};

export default Ship;
