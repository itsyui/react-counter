import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Counter} from './components/counter/Counter';
import { StateManagerContext, DataLoaderFactory, WidgetsFactory, ICustomStateMachineProvider, ICustomStateMachineData } from '@itsy-ui/core';

// retrieve the DataLoaderFactory singleton
const dataLoader = WidgetsFactory.instance.services["DataLoaderFactory"] as DataLoaderFactory;
// retrieve the custom state machine provider
const customStateProvider: ICustomStateMachineProvider = dataLoader.getLoader('customStateProvider') as ICustomStateMachineProvider;

// this function is called whenever INCREMENT or DECREMENT state is changed in counter
function doCustomBeforeCounterInc(evt: any) {
  return async (_getState: any, _dispatch: any, transition: any) => {
    console.log(`Custom override hitting here with ${JSON.stringify(evt)}`);
    transition({
      type: "UP_COUNT"
    });
  }
}

// Define the custom state machine override object.
// implements the ICustomStateMachineData interface.
const counterStateMachineOverride: ICustomStateMachineData = {
  stateJSON: {
    "name": "counterState",
    "states": {
      // State overrides are possible if the widget has that state declared already.
      // Check for this state in components/counter/Counter.tsx
      "beforeCounterInc": {
        "onEntry": [
          // define a custom "onEntry" that calls the mapDispatchToAction as defined below
          "onCustomBeforeCounterInc"
        ],
        "on": {
          // State is continued to UP_COUNT as expected in the base widget
          "UP_COUNT": "counterInc"
        }
      },
    },
  },
  mapDispatchToAction: (dispatch: any) => {
    return {
      // Define a mapping action to implement business logic
      // whenever there is a change of state.
      onCustomBeforeCounterInc: (evt: any) => dispatch(doCustomBeforeCounterInc(evt)),
    };
  },
};

// register the custom override with Control Name, ContextPath in which the
// override needs to occur and the ICustomStateMachineData object.
customStateProvider.registerCustomStateMachine("Counter", { pageId: "app" }, counterStateMachineOverride);

function App() {
  return (
    <div className="App">
      <div>
        <StateManagerContext.Provider key={'fsm'} value={{ contextPath: { pageId: "app" } }}>
          <Counter />
        </StateManagerContext.Provider>
      </div>
    </div>
  );
}

export default App;
