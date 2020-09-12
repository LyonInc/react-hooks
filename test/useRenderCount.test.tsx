import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useRenderCount from '../src/useRenderCount';

describe('useRenderCount', () => {
  it('should increment by one after re-rendering.', () => {
    interface Example {
      value: number;
      update(): void;
    }
    const useExample = (): Example => {
      const value = useRenderCount();

      const [state, setState] = useState(0);

      const update = () => {
        setState(state + 1);
      };

      return {
        value,
        update,
      };
    };

    const { result } = renderHook(() => useExample());

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.update();
    });

    expect(result.current.value).toBe(2);
  });
});
