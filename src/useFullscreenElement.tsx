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

import { useDebugValue } from 'react';
import useSubscription, { Subscription } from './useSubscription';
import IS_CLIENT from './utils/is-client';

export interface FullscreenElement {
  element: Element;
}

const SUBSCRIPTION: Subscription<FullscreenElement | undefined> = {
  read: () => {
    if (IS_CLIENT && document.fullscreenElement) {
      return {
        element: document.fullscreenElement,
      };
    }
    return undefined;
  },
  subscribe: (callback) => {
    if (IS_CLIENT) {
      document.addEventListener('fullscreenchange', callback);

      return () => {
        document.removeEventListener('fullscreenchange', callback);
      };
    }
    return undefined;
  },
};

export default function useWindowScroll(): FullscreenElement | undefined {
  const value = useSubscription(SUBSCRIPTION);

  useDebugValue(value);

  return value;
}
