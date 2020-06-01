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
    addComparingAnimation(animations, i, j);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([{ index: k, newHeight: auxiliaryArray[i] }]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([{ index: k, newHeight: auxiliaryArray[j] }]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIndex) {
    addComparingAnimation(animations, i, i);
    animations.push([{ index: k, newHeight: auxiliaryArray[i] }]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIndex) {
    addComparingAnimation(animations, j, j);
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

function bubbleSortHelper(array, animations) {
  for (let index = 0; index <= array.length - 1; index++) {
    let hasSwapped = false;
    for (let i = 0; i < array.length - index - 1; i++) {
      if (array[i] > array[i + 1]) {
        addAnimations(array, animations, i, i + 1, true);
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        hasSwapped = true;
      } else {
        addAnimations(array, animations, i, i + 1);
      }
    }
    if (hasSwapped === false) {
      // end early if list is already sorted
      break;
    }
  }
}

export function getHeapSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  heapSortHelper(array, animations);
  return animations;
}

function heapSortHelper(array, animations) {
  let arrLength;

  // AKA max-heapify
  function heapify(arr, i) {
    // treat array as heap
    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;
    let maxIndex = i;

    if (leftChild < arrLength && arr[leftChild] > arr[maxIndex]) {
      maxIndex = leftChild;
    }
    if (rightChild < arrLength && arr[rightChild] > arr[maxIndex]) {
      maxIndex = rightChild;
    }
    if (maxIndex !== i) {
      addAnimations(arr, animations, maxIndex, i, true);
      [arr[i], arr[maxIndex]] = [arr[maxIndex], arr[i]];
      heapify(arr, maxIndex);
    }
  }

  function heapSort(arr) {
    arrLength = arr.length;

    // build a max heap from bottom-up, which only needs to run arrLength/2 because leaves are already max heaps
    for (let i = Math.floor(arrLength / 2); i >= 0; i -= 1) {
      heapify(arr, i);
    }

    // iteratively get largest value to the 'sorted' portion of array
    for (let i = arrLength - 1; i > 0; i--) {
      addAnimations(arr, animations, 0, i, true);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      arrLength--;

      heapify(arr, 0);
    }
  }
  heapSort(array);
}

export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  quickSortHelper(array, animations);
  return animations;
}

function quickSortHelper(array, animations) {
  function quickSort(arr, startIndex = 0, endIndex = arr.length - 1) {
    if (startIndex < endIndex) {
      const pIndex = quickSortPartition(arr, startIndex, endIndex);
      quickSort(arr, startIndex, pIndex - 1);
      quickSort(arr, pIndex + 1, endIndex);
    }
    return arr;
  }

  function quickSortPartition(arr, startIndex, endIndex) {
    // pick the pivot using median of 3 method
    const midIndex = Math.floor((startIndex + endIndex) / 2);
    if (arr[midIndex] < arr[startIndex]) {
      addAnimations(arr, animations, midIndex, startIndex, true);
      [arr[midIndex], arr[startIndex]] = [arr[startIndex], arr[midIndex]];
    }
    if (arr[endIndex] < arr[startIndex]) {
      addAnimations(arr, animations, endIndex, startIndex, true);
      [arr[endIndex], arr[startIndex]] = [arr[startIndex], arr[endIndex]];
    }
    if (arr[midIndex] < arr[endIndex]) {
      addAnimations(arr, animations, midIndex, endIndex, true);
      [arr[midIndex], arr[endIndex]] = [arr[endIndex], arr[midIndex]];
    }
    const pivot = arr[endIndex];
    // pIndex ends at the pivot's correct position
    let pIndex = startIndex;
    for (let index = startIndex; index < endIndex; index++) {
      if (arr[index] <= pivot) {
        addAnimations(arr, animations, index, pIndex, true);
        [arr[index], arr[pIndex]] = [arr[pIndex], arr[index]];
        pIndex += 1;
      } else {
        addAnimations(arr, animations, index, pIndex);
      }
    }
    addAnimations(arr, animations, pIndex, endIndex, true);
    [arr[pIndex], arr[endIndex]] = [arr[endIndex], arr[pIndex]];
    return pIndex;
  }
  quickSort(array);
}

function addComparingAnimation(animations, a, b) {
  // first array is to indicate color change
  animations.push([a, b]);
  // second array to indicate reverting to original color
  animations.push([a, b]);
}

// add animation frames for compared value
function addAnimations(arr, animations, a, b, isSwapping = false) {
  addComparingAnimation(animations, a, b);
  if (isSwapping) {
    animations.push([
      { index: a, newHeight: arr[b] },
      { index: b, newHeight: arr[a] },
    ]);
  } else {
    animations.push([]);
  }
}
