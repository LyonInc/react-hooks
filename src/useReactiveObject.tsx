/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
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
 * @copyright Lyon Software Technologies, Inc. 2021
 */
import { useDebugValue } from 'react';
import useConstant from './useConstant';
import useForceUpdate from './useForceUpdate';

export default function useReactiveObject<T extends { [key: string]: any }>(
  supplier: () => T,
): T {
  const object = useConstant(supplier);

  const forceUpdate = useForceUpdate();

  const proxyObject = useConstant(() => new Proxy(object, {
    get(target, property, handler) {
      return Reflect.get(target, property, handler);
    },
    set(target, property, value, receiver) {
      if (!Object.is(Reflect.get(target, property, receiver), value)) {
        Reflect.set(target, property, value, receiver);
        forceUpdate();
      }
      return true;
    },
  }));

  useDebugValue(proxyObject);

  return proxyObject;
}
