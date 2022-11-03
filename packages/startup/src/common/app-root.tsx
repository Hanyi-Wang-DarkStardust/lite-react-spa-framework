import React, { useEffect } from 'react';
import { render } from 'react-dom';

interface IStartupAppRoot {
  /**
   * 组件挂载完毕后的回调函数
   * @注意
   * 对于懒加载的组件，以 Suspense 挂载为准。故无法得知 lazy component 准确时间
   * 需要组件方自己控制
   */
  onComponentMounted: () => void;

  children: JSX.Element
}

const StartupAppRoot: React.FC<IStartupAppRoot> = (props: IStartupAppRoot) => {
  const { children, onComponentMounted } = props;

  useEffect(() => {
    onComponentMounted();
  }, []);

  return children;
};

/**
 * 封装 HOC ，提供给渲染组件 onMounted 方法
 * @param mainComponent 需要渲染的组件
 * @param onComponentMounted 组件挂载完毕后的回调函数
 * @returns 封装后的组件
 */
export function getWrappedRoot(mainComponent: JSX.Element, onComponentMounted: () => void) {
  return (
    <StartupAppRoot onComponentMounted={onComponentMounted}>
      {mainComponent}
    </StartupAppRoot>
  );
}

/**
 * 将指定组件封装后渲染在指定 DOM 节点上
 * @param mainComponent 需要渲染的组件
 * @param htmlNode DOM 节点
 * @param onComponentMounted 组件挂载完毕后的回调函数
 */
export function renderAtNode(
  mainComponent: JSX.Element,
  htmlNode: HTMLElement,
  onComponentMounted: () => void,
): void {
  const wrappedRoot = getWrappedRoot(mainComponent, onComponentMounted);
  render(wrappedRoot, htmlNode);
}
