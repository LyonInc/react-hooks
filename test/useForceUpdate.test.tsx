import { useRef } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useForceUpdate from '../src/useForceUpdate';

describe('useForceUpdate', () => {
  it('should increment by one after re-rendering.', () => {
    interface Example {
      value: number;
      update(): void;
    }
    const useExample = (): Example => {
      const value = useRef(0);

      value.current += 1;

      const update = useForceUpdate();

      return {
        value: value.current,
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
