/**
 * This method is a state transition pipeline and allows developers to define custom overrides.
 */
export function doBeforeCounterInc(_evt: any) {
	return async (_getState: any, _dispatch: any, transition: any) => {
		transition({
			type: "UP_COUNT"
		});
	};
}

/**
 * This method dispatches an INCREMENT trigger to the reducer state
 */
export function doCounterInc(_evt: any) {
	return async (_getState: any, dispatch: any, transition: any) => {
		dispatch({
			type: "ADD"
		});
		transition({
			type: "ON_LOADED"
		})
	};
}

/**
 * This method dispatches a DECREMENT trigger to the reducer state
 */
export function doCounterDec(_evt: any) {
	return async (_: any, dispatch: any, transition: any) => {
		dispatch({
			type: "DEC"
		});
		transition({
			type: "ON_LOADED"
		})
	};
}
