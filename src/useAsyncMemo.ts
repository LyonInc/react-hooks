/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Lyon Software Technologies, Inc.
 * @copyright Lyon Software Technologies, Inc. 2021
 */
import { useEffect } from 'react';
import { defaultCompare, MemoCompare } from './useFreshLazyRef';
import useCallbackCondition from './useCallbackCondition';
import useFreshState from './useFreshState';

interface Pending {
  status: 'pending';
}

interface Success<T> {
  status: 'success';
  value: T;
}

interface Failure<F = any> {
  status: 'failure';
  value: F;
}

export type AsyncMemoResult<S, F = any> =
  | Pending
  | Success<S>
  | Failure<F>;

export default function useAsyncMemo<S, R, F = any>(
  supplier: () => Promise<S>,
  dependency: R,
  shouldUpdate: MemoCompare<R> = defaultCompare,
): AsyncMemoResult<S, F> {
  const [state, setState] = useFreshState<AsyncMemoResult<S, F>, R>(
    () => ({
      status: 'pending',
    }),
    dependency,
    shouldUpdate,
  );

  const request = useCallbackCondition(supplier, dependency, shouldUpdate);

  useEffect(() => {
    let mounted = true;

    request().then((value) => {
      if (mounted) {
        setState({
          status: 'success',
          value,
        });
      }
    }, (value) => {
      if (mounted) {
        setState({
          status: 'failure',
          value,
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, [request, setState]);

  return state;
}
