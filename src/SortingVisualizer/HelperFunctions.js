// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
export function getRandomIntFromRange(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function doMerge(
  mainArray,
  startIndex,
  middleIndex,
  endIndex,
  auxiliaryArray,
  animations
) {
  let k = startIndex;
  let i = startIndex;
  let j = middleIndex + 1;
  while (i <= middleIndex && j <= endIndex) {
    pushComparedValuesIndex(animations, i, j);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([{ index: k, newHeight: auxiliaryArray[i] }]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([{ index: k, newHeight: auxiliaryArray[j] }]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIndex) {
    pushComparedValuesIndex(animations, i, i);
    animations.push([{ index: k, newHeight: auxiliaryArray[i] }]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIndex) {
    pushComparedValuesIndex(animations, j, j);
    animations.push([{ index: k, newHeight: auxiliaryArray[j] }]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

function mergeSortHelper(
  mainArray,
  startIndex,
  endIndex,
  auxiliaryArray,
  animations
) {
  if (startIndex === endIndex) return;
  const middleIndex = Math.floor((startIndex + endIndex) / 2);
  mergeSortHelper(
    auxiliaryArray,
    startIndex,
    middleIndex,
    mainArray,
    animations
  );
  mergeSortHelper(
    auxiliaryArray,
    middleIndex + 1,
    endIndex,
    mainArray,
    animations
  );
  doMerge(
    mainArray,
    startIndex,
    middleIndex,
    endIndex,
    auxiliaryArray,
    animations
  );
}

export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  bubbleSortHelper(array, animations);
  return animations;
}

function bubbleSortHelper(arr, animations) {
  const array = arr.slice();
  for (let index = 0; index <= array.length - 1; index++) {
    let hasSwapped = false;
    for (let i = 0; i < array.length - index - 1; i++) {
      pushComparedValuesIndex(animations, i, i + 1);
      if (array[i] > array[i + 1]) {
        // swaps the values if first value is bigger
        animations.push([
          { index: i, newHeight: array[i + 1] },
          { index: i + 1, newHeight: array[i] },
        ]);
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        hasSwapped = true;
      } else {
        animations.push([]);
      }
    }
    if (hasSwapped === false) {
      // end early if list is already sorted
      break;
    }
  }
  return array;
}

export function getHeapSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  heapSortHelper(array, animations);
  return animations;
}

function heapSortHelper(arr, animations) {
  let arrLength;

  // AKA max-heapify
  function heapify(input, i) {
    // treat array as heap
    let leftChild = 2 * i + 1;
    let rightChild = 2 * i + 2;
    let maxIndex = i;

    if (leftChild < arrLength && input[leftChild] > input[maxIndex]) {
      maxIndex = leftChild;
    }
    if (rightChild < arrLength && input[rightChild] > input[maxIndex]) {
      maxIndex = rightChild;
    }
    if (maxIndex !== i) {
      pushComparedValuesIndex(animations, maxIndex, i);
      animations.push([
        { index: i, newHeight: input[maxIndex] },
        { index: maxIndex, newHeight: input[i] },
      ]);
      [input[i], input[maxIndex]] = [input[maxIndex], input[i]];
      heapify(input, maxIndex);
    }
  }

  function heapSort(input) {
    arrLength = input.length;

    // build a max heap from bottom-up, which only needs to run arrLength/2 because leaves are already max heaps
    for (let i = Math.floor(arrLength / 2); i >= 0; i -= 1) {
      heapify(input, i);
    }

    // iteratively get largest value to the 'sorted' portion of array
    for (let i = arrLength - 1; i > 0; i--) {
      pushComparedValuesIndex(animations, 0, i);
      animations.push([
        { index: 0, newHeight: input[i] },
        { index: i, newHeight: input[0] },
      ]);
      [input[0], input[i]] = [input[i], input[0]];
      arrLength--;

      heapify(input, 0);
    }
  }
  heapSort(arr);
}

function pushComparedValuesIndex(animations, a, b) {
  // first array is to indicate color change
  animations.push([a, b]);
  // second array to indicate reverting to original color
  animations.push([a, b]);
}
