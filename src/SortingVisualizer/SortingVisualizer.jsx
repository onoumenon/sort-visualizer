import React, { Component } from 'react';
import './SortingVisualizer.css';
import {
  getRandomIntFromRange,
  getMergeSortAnimations,
  getBubbleSortAnimations,
  getHeapSortAnimations,
} from './HelperFunctions';

const ANIMATION_SPEED_MS = 80;
const NUMBER_OF_ARRAY_BARS = 40;
let TIMEOUTS = [];

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    // const activeBars = document.getElementsByClassName('array-bar active');
    // if (activeBars.length) {
    //   for (let i = 0; i < activeBars.length; i++) {
    //     activeBars[i].classList.remove('active');
    //   }
    // }

    // stop playing animation frames
    // TIMEOUTS.forEach((timeout) => {
    //   clearTimeout(timeout);
    // });
    // TIMEOUTS = [];

    const array = [];
    for (let index = 0; index < NUMBER_OF_ARRAY_BARS; index += 1) {
      array.push(getRandomIntFromRange(5, 500));
    }
    this.setState({ array });
  }

  mergeSort() {
    this.playSortAnimation(getMergeSortAnimations);
  }

  bubbleSort() {
    this.playSortAnimation(getBubbleSortAnimations);
  }

  heapSort() {
    this.playSortAnimation(getHeapSortAnimations);
  }

  playSortAnimation(getAnimationFrames) {
    // param getAnimationFrames is a helper function to be passed in, eg: getBubbleSortAnimations
    const { array } = this.state;
    const animations = getAnimationFrames(array);
    animations.forEach((ele, i) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        // barOne and barTwo are values being compared
        const [barOneIdx, barTwoIdx] = animations[i];

        TIMEOUTS.push(
          setTimeout(() => {
            arrayBars[barOneIdx].classList.toggle('active');
            arrayBars[barTwoIdx].classList.toggle('active');
          }, i * ANIMATION_SPEED_MS)
        );
      } else {
        TIMEOUTS.push(
          setTimeout(() => {
            if (animations.length === 0) {
              return;
            }
            animations[i].forEach((change) => {
              const { index, newHeight } = change;
              const barStyle = arrayBars[index].style;
              barStyle.height = `${newHeight}px`;
              arrayBars[index].innerHTML = newHeight;
            });
          }, i * ANIMATION_SPEED_MS)
        );
      }
    });
  }

  render() {
    const { array } = this.state;
    return (
      <div className="container">
        <div className="toolbar">
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.resetArray();
            }}
          >
            Reset Array
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.mergeSort();
            }}
          >
            Merge Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.resetArray();
            }}
          >
            Quick Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.heapSort();
            }}
          >
            Heap Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.bubbleSort();
            }}
          >
            Bubble Sort
          </button>
        </div>
        <div className="array-container">
          {array.map((value, index) => (
            <div
              className="array-bar"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              id={`array-bar${index}`}
              style={{ height: `${value}px` }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
