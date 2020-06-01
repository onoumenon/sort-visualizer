import React, { Component } from 'react';
import { Dropdown, Button, ButtonGroup, DropdownButton } from 'react-bootstrap';
import './SortingVisualizer.scss';
import {
  getRandomIntFromRange,
  getMergeSortAnimations,
  getBubbleSortAnimations,
  getHeapSortAnimations,
  getQuickSortAnimations,
} from './HelperFunctions';

// animation frames are set as timeouts
let TIMEOUTS = [];
const DEFAULT_NO_OF_ARRAY_BARS = 10;
// in MS
const SLOWSPEED = 200;
const FASTSPEED = 20;
// in px
const MOBILE_BREAKPOINT = 400;

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      array: [],
      numberOfArrayBars: DEFAULT_NO_OF_ARRAY_BARS,
      animationSpeedMS: SLOWSPEED,
      isAnimating: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.resetArray();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  playAnimation(type) {
    this.resetArray();
    // wait for previous timeouts to clear first
    setTimeout(() => {
      this.playSortAnimation(type);
    }, 0);
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
        activeBars[i].classList.remove('--active');
      }
    }
    const array = [];
    for (let index = 0; index < this.state.numberOfArrayBars; index += 1) {
      array.push(getRandomIntFromRange(5, 500));
    }
    this.setState({ array, isAnimating: false });
  }

  playSortAnimation(getAnimationFrames) {
    // param getAnimationFrames is a helper function to be passed in, eg: getBubbleSortAnimations
    const { array, animationSpeedMS } = this.state;
    // track start and end of animation
    this.setState({ isAnimating: true });
    const animations = getAnimationFrames(array);
    animations.forEach((ele, i) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        // barOne and barTwo are values being compared
        const [barOneIdx, barTwoIdx] = animations[i];

        TIMEOUTS.push(
          setTimeout(() => {
            arrayBars[barOneIdx].classList.toggle('--active');
            arrayBars[barTwoIdx].classList.toggle('--active');
          }, i * animationSpeedMS)
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
          }, i * animationSpeedMS)
        );
      }
      if (i === animations.length - 1) {
        TIMEOUTS.push(
          setTimeout(() => {
            this.setState({ isAnimating: false });
          }, (i + 1) * animationSpeedMS)
        );
      }
    });
  }

  render() {
    const { array, windowWidth, isAnimating } = this.state;
    return (
      <div className="page-container">
        <div className="toolbar">
          <ButtonGroup vertical={windowWidth < MOBILE_BREAKPOINT}>
            <Button
              onClick={() => {
                this.resetArray();
              }}
            >
              RESET
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                this.playAnimation(getMergeSortAnimations);
              }}
            >
              MERGE SORT
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                this.playAnimation(getQuickSortAnimations);
              }}
            >
              QUICK SORT
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                this.playAnimation(getHeapSortAnimations);
              }}
            >
              HEAP SORT
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                this.playAnimation(getBubbleSortAnimations);
              }}
            >
              BUBBLE SORT
            </Button>

            <DropdownButton
              disabled={isAnimating}
              as={ButtonGroup}
              title="ANIMATION SPEED"
              id="bg-nested-dropdown"
            >
              <Dropdown.Item
                onClick={() => {
                  this.setState({
                    numberOfArrayBars: DEFAULT_NO_OF_ARRAY_BARS,
                    animationSpeedMS: SLOWSPEED,
                  });
                }}
              >
                SLOW
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  this.setState({
                    numberOfArrayBars: windowWidth / DEFAULT_NO_OF_ARRAY_BARS,
                    animationSpeedMS: FASTSPEED,
                  });
                }}
              >
                FAST
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </div>
        <div className="array-container">
          {array.map((value, index) => (
            <div
              className="array-bar"
              key={index}
              id={`array-bar${index}`}
              style={{
                height: `${value}px`,
                width: `${(windowWidth * 0.4) / array.length}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}
