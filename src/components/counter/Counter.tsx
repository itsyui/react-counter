import React from 'react';
import { doBeforeCounterInc, doCounterInc, doCounterDec } from './actions';
import { useTransition } from "@itsy-ui/core";

/**
 * Declare the reducer state with all the necessary state properties.
 */
const initialState = {
  // counter variable to store the current increment or decremented value
  count: 0
};

/**
 * Reducer function to maintain the state change in the Counter widget
 * @param state - current state in the reducer
 * @param action - current action that was invoked
 * @returns new state after mutating
 */
function reducer(state: any, action: any) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        count: state.count + 1
      };
    case "DEC":
      return {
        ...state,
        count: state.count - 1
      };
    case "RESET":
      return {
        count: 0
      };
    default:
      return state === undefined ? initialState :
        Object.keys(state).length === 0 ? initialState : state;
  }
}

/**
 * State JSON metadata for the CounterWidget. It defines a default ```onLoaded``` state, 
 * And from the default state it can either goto BEFORE_UP_COUNT or DOWN_COUNT.
 * 
 * Technically, We can define any number of initial state that a widget can posses, provided
 * the FSM comes back to the ```onLoaded``` state after doing its necessary business logic.
 */
const stateJSON = {
  "initial": "onLoaded",
  "states": {
    "onLoaded": {
      "on": {
        "BEFORE_UP_COUNT": "beforeCounterInc",
        "DOWN_COUNT": "counterDec",
      }
    },
    "beforeCounterInc": {
      "onEntry": [
        "onBeforeCounterInc"
      ],
      "on": {
        "UP_COUNT": "counterInc"
      }
    },
    "counterInc": {
      "onEntry": [
        "onCounterInc"
      ],
      "on": {
        "ON_LOADED": "onLoaded"
      }
    },
    "counterDec": {
      "onEntry": [
        "onCounterDec"
      ],
      "on": {
        "ON_LOADED": "onLoaded"
      }
    },
  }
};

/**
 * mapDispatchToProps is a mapping function that internally calls the action implementations.
 * @param dispatch - a function dispatcher that triggers the transtiion or state override of ItsyUI widget
 * @returns void
 */
const mapDispatchToProps = (dispatch: any) => {
  return {
    /**
     * onBeforeCounterInc entry action is defined in stateJSON, this
     * function calls the doBeforeCounterInc from actions.ts.
     * onBefore_ENTRY_NAME is a pattern to define if we need to expose
     * custom state overrides.
     */
    onBeforeCounterInc: (evt: any) => dispatch(doBeforeCounterInc(evt)),
    /**
     * onCounterInc entry action is defined in stateJSON, this
     * function calls the doCounterInc from actions.ts
     */
    onCounterInc: (evt: any) => dispatch(doCounterInc(evt)),
    /**
     * onCounterDec entry action is defined in stateJSON, this
     * function calls the doCounterDec from actions.ts
     */
    onCounterDec: (evt: any) => dispatch(doCounterDec(evt))
  }
};

/**
 * Counter widget that uses the hook ```useTransition``` to register as ItsyUI widget.
 * @returns React Component
 */
export function Counter() {
  // state defines the current reducer state
  // transition is a callback to trigger event triggers
  const [state, transition] = useTransition("Counter", reducer, mapDispatchToProps, stateJSON);
  return (
    <div>
      <p>You clicked {state.count} times</p>
      <button onClick={() => transition({ type: "BEFORE_UP_COUNT" })}>
        ADD
      </button>
      <button onClick={() => transition({ type: "DOWN_COUNT" })}>
        DEC
      </button>
    </div>
  );
}
