import React from 'react';
import './Scrollbar.scss';
import { Scrollbars, ScrollbarProps } from 'react-custom-scrollbars';
import getScrollbarWidth from '../../utils/getScrollbarWidth';

const Scrollbar: React.FC<ScrollbarProps> = (props) => {
  const { children, ...rest } = props;

  const scrollBarWidth: number = getScrollbarWidth();

  return (
    <Scrollbars
      className="scrollbar-container"
      style={{ width: `calc(100% + ${scrollBarWidth}px)` }}
      renderThumbVertical={(props) => (
        <span
          {...props}
          style={{ right: `${scrollBarWidth - 6}px` }}
          className="scrollbar scrollbar_vertical"
        />
      )}
      {...rest}
    >
      <div style={{ width: `calc(100% - ${scrollBarWidth}px)` }}>{children}</div>
    </Scrollbars>
  );
};

export default Scrollbar;
