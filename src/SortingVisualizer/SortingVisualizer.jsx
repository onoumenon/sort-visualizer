import React, { Component } from 'react';
import './SortingVisualizer.css';
import {
  getRandomIntFromRange,
  getMergeSortAnimations,
  getBubbleSortAnimations,
  getHeapSortAnimations,
  getQuickSortAnimations,
} from './HelperFunctions';

const ANIMATION_SPEED_MS = 10;
const NUMBER_OF_ARRAY_BARS = 100;
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

  playAnimation(type) {
    this.resetArray();
    setTimeout(() => {
      this.playSortAnimation(type);
    }, 100);
  }

  resetArray() {
    // stop playing animation frames
    TIMEOUTS.forEach((timeout) => {
      clearTimeout(timeout);
    });
    TIMEOUTS = [];

    const activeBars = document.getElementsByClassName('array-bar');
    if (activeBars.length) {
      for (let i = 0; i < activeBars.length; i++) {
        activeBars[i].classList.remove('active');
      }
    }
    const array = [];
    for (let index = 0; index < NUMBER_OF_ARRAY_BARS; index += 1) {
      array.push(getRandomIntFromRange(5, 500));
    }
    this.setState({ array });
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
              this.playAnimation(getMergeSortAnimations);
            }}
          >
            Merge Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.playAnimation(getQuickSortAnimations);
            }}
          >
            Quick Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.playAnimation(getHeapSortAnimations);
            }}
          >
            Heap Sort
          </button>
          <button
            type="button"
            className="rounded-button"
            onClick={() => {
              this.playAnimation(getBubbleSortAnimations);
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
            />
          ))}
        </div>
      </div>
    );
  }
}
