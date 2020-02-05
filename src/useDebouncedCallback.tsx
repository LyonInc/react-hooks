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
import React from 'react';
import useUnmount from './useUnmount';

export default function useDebouncedCallback
  <T extends((...args: any[]) => void)>(
  callback: T, timeout = 150, deps?: React.DependencyList): T {
  /**
   * Reference for the timer schedule
   */
  const timer = React.useRef<number | undefined>();

  /**
   * Cleanup logic
   */
  useUnmount(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
  });

  /**
   * Wrap a callback
   */
  const wrapped = React.useCallback(callback, deps || [{}]);

  /**
   * Return the memoized callback
   */
  return React.useCallback<T>(((...args) => {
    /**
     * Clear the timeout when called
     */
    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    /**
     * Reschedule
     */
    timer.current = window.setTimeout(() => {
      wrapped(...args);

      timer.current = undefined;
    }, timeout);
  }) as T, [timeout, wrapped]);
}