import {useEffect, useRef} from 'react';
import isEqual from 'fast-deep-equal';

export const useDeepCompareMemo = <T,>(value: T) => {
    const ref = useRef<T>(value);

    useEffect(()=> {
        if(!isEqual(ref.current, value)){
            ref.current = value;
        }
    }, [value]);

    return ref.current;
};