import { forwardRef, ForwardRefRenderFunction } from 'rax';
import View from 'rax-view';
import './style.scss';

export interface ComponentProps {
  /**
   * 名称
   */
  name: string;
  /**
   * 内容
   */
   content: any;
}

/**
 * 示例组件
 * @param props
 * @constructor
 */
function ExampleComponent(props: ComponentProps, ref: any) {
  return (
    <View ref={ref}>
      <h1>{props.name}</h1>
      <span>{props.content}</span>
    </View>
  );
}

const RefComponent = forwardRef(ExampleComponent as ForwardRefRenderFunction<any, ComponentProps>);

RefComponent.defaultProps = {
  name: '标题',
};
RefComponent.displayName = 'ExampleComponent';

export default RefComponent;
