/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
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
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import { DependencyList, useRef, useCallback } from 'react';
import useUnmount from './useUnmount';

/**
 * Transforms a given callback into a debounced callback
 * with the given timeout.
 *
 * @param callback The callback to transform with.
 * @param timeout The amount of time to debounce the callback.
 * @param deps optional. Recomputes the debounced callback reference
 * when the dependencies changes (this also includes the timeout)
 */
export default function useDebouncedCallback<T extends((...args: any[]) => void)>(
  callback: T,
  timeout = 150,
  deps?: DependencyList): T {
  // Create a timer reference
  const timer = useRef<number | undefined>();

  // Once the component unmount, prevent the callback on going through
  useUnmount(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
  });

  // Memoize the callback with the given reference
  const wrapped = useCallback(callback, deps || [{}]);

  // Create the debounce callback reference
  return useCallback<T>(((...args) => {
    // If there is a debounce schedule, clear the reference
    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    // Reschedule the debounce callback
    timer.current = window.setTimeout(() => {
      // Run the callback
      wrapped(...args);
      // Finish the schedule by clearing the timer reference
      timer.current = undefined;
    }, timeout);
  }) as T, [timeout, wrapped]);
}
