import store, { RootState } from "../redux/store";
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";
import { bindActionCreators } from "redux";
import { SHOW } from '../embedded-code'

type AppDispatch = typeof store.dispatch;

// Export typed version of useDispatch and useSelector
export const useDispatch = () => _useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

// action creators
const actionCreators = {
  
}

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
}

export const useCumulativeCode = (id: string) => {
  return useSelector((state) => {
    const { cells: data, order } = state.notebook;
    const orderedCodeCells = order
      .map((id) => data[id])
      .filter((c) => c.type === "code");
    const cumulativeCodeArray = ["let show;"];
    for (let c of orderedCodeCells) {
      if (c.id !== id) {
        cumulativeCodeArray.push(`show = () => {}\n${c.content}`);
      } else if (c.id === id) {
        cumulativeCodeArray.push( `${SHOW.implementation}\n${c.content}`);
        break;
      }
    }

    return cumulativeCodeArray
              .reduce((all, prev) =>  `${all}\n${prev}`, '');
  });
};
 