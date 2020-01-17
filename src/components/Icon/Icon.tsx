import React, { CSSProperties } from 'react';
import cn from 'classnames';
import './Icon.scss';

import Icons, { TIconNames } from '../../utils/icons';

type TIconContent =
  | {
      children?: undefined;
      name: TIconNames;
    }
  | {
      children: JSX.Element;
      name?: undefined;
    };

interface IIconProps {
  children?: JSX.Element;
  className?: string;
  noPointerEvents?: boolean;
  onClick?(event: React.FormEvent): void;
  selected?: boolean;
  style?: CSSProperties;
}

export type TIcon = IIconProps & TIconContent;

const Icon: React.FC<TIcon> = (props) => {
  let { children, className, name, selected, noPointerEvents, ...rest } = props;

  const baseClass = 'icon';

  const classes = cn(baseClass, className, {
    [baseClass + '_selected']: selected,
    [baseClass + '_control']: rest.onClick,
  });

  if (noPointerEvents) {
    rest.style = {
      ...rest.style,
      pointerEvents: 'none',
    };
  }

  return (
    <span className={classes} {...rest}>
      {children || Icons[name!]}
    </span>
  );
};

export default Icon;
