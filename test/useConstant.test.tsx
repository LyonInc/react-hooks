import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useConstant from '../src/useConstant';

describe('useConstant', () => {
  it('should retain the same reference after component re-rendering.', () => {
    interface Example {
      value: number[];
      state: number;
      update(): void;
    }
    const useExample = (): Example => {
      const value = useConstant(() => []);

      const [state, setState] = useState(0);

      const update = () => {
        setState(state + 1);
      };

      return {
        value,
        state,
        update,
      };
    };

    const { result } = renderHook(() => useExample());

    const prevValue = result.current.value;
    const prevState = result.current.state;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.update();
    });

    expect(result.current.value).toBe(prevValue);
    expect(result.current.state).not.toBe(prevState);
  });
});
