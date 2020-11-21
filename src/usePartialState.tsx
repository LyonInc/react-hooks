/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Lyon Software Technologies, Inc.
 * @copyright Lyon Software Technologies, Inc. 2020
 */
import { Dispatch, SetStateAction, useState } from 'react';
import useConstantCallback from './useConstantCallback';

interface AnyObject {
  [key: string]: any;
}

type SetPartialState<T> = Dispatch<SetStateAction<T>>;

function isActionFunc<T>(action: SetStateAction<T>): action is (prev: T) => T {
  return typeof action === 'function';
}

export default function usePartialState<T extends AnyObject>(
  initialState: () => T,
): [T, SetPartialState<T>] {
  const [state, setState] = useState(initialState);

  const setPartialState = useConstantCallback<SetPartialState<T>>((action) => {
    setState((current) => {
      const newValue = isActionFunc(action)
        ? action(current)
        : action;

      return {
        ...current,
        ...newValue,
      };
    });
  });

  return [state, setPartialState];
}
