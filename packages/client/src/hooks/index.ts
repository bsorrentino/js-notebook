import store, { RootState } from "../redux/store";
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";
import { bindActionCreators } from "redux";
import { SHOW } from '../embedded-code'
import { Cell } from "@bsorrentino/jsnotebook-client-data";
import { getLogger, ILogger } from '@bsorrentino/jsnotebook-logger'

const logger = getLogger( 'hooks' )

type AppDispatch = typeof store.dispatch;

// Export typed version of useDispatch and useSelector
export const useDispatch = () => _useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

// action creators
const actionCreators = {
  
}

/**
 * 
 * @returns 
 */
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
}

/**
 * 
 * @param id 
 * @returns 
 */
export const useCumulativeCode = (id: string) => {
  logger.trace( `useCumulativeCode(${id})`)
  
  return useSelector( state => {
    const { cells: data, order, language } = state.notebook;

    const orderedCodeCells = Array<Cell>()

    for( let i = 0 ; i < order.length; ++i ) {
        const c = data[order[i]]
        if( c.type !== 'code') continue
        orderedCodeCells.push(c)
        if( id === c.id) break
    }

    return orderedCodeCells.reduce( (result, c) => {
      if (c.id === id) {
        result[0] += `${SHOW.implementation}\n${c.content}`
      }
      else {
        if( language === 'typescript' ) result[1] += c.content

        result[0] += `show = () => {}\n${c.content}`
      }
      return result
    }, [ 'let show', '' ] )

  })
};
 