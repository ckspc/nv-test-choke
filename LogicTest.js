const checkLength = (number) => {
  return number.toString().length >= 6;
};

const checkDuplicate = (number) => {
  return !/(.)\1{2}/.test(number.toString()) ? true : false;
};

const checkConsecutive = (num) => {
  const numStr = num.toString();
  for (let i = 0; i < numStr.length - 2; i++) {
    const currentDigit = parseInt(numStr[i]);
    const nextDigit = parseInt(numStr[i + 1]);
    const nextNextDigit = parseInt(numStr[i + 2]);

    if (nextDigit === currentDigit + 1 && nextNextDigit === currentDigit + 2) {
      return false;
    }

    if (nextDigit === currentDigit - 1 && nextNextDigit === currentDigit - 2) {
      return false;
    }
  }

  return true;
};

const checkDuplicateTwo = (number) => {
  const matches = [];
  const numArr = number.toString().split('');
  for (let i = 0; i < numArr.length; i++) {
    const currentNumber = numArr[i];
    const matchArr = [];
    for (let j = i + 1; j < numArr.length; j++) {
      if (numArr[j] === currentNumber) {
        matchArr.push(j);
      }
    }

    if (matchArr.length > 0) {
      matchArr.push(i);
      matchArr.sort();
      matches.push(matchArr.map((index) => parseInt(numArr[index])));
    }
  }
  if (matches.length > 2) {
    return false;
  }
  return true;
};

//function for validate pincode
const validatePincode = (number) => {
  return (
    checkLength(number) &&
    checkDuplicate(number) &&
    checkConsecutive(number) &&
    checkDuplicateTwo(number)
  );
};

console.log(validatePincode(887712));
