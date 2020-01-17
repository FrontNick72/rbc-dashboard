import React, { CSSProperties } from 'react';
import cn from 'classnames';
import './ColoredIcon.scss';

import ColoredIcons, { TColoredIconNames } from '../../utils/colored-icons';

interface IColoredIconProps {
  children?: JSX.Element;
  className?: string;
  onClick?(event: React.FormEvent): void;
  selected?: boolean;
  style?: CSSProperties;
  type: 'normal' | 'off';
  name: TColoredIconNames;
}

export type TColoredIcon = IColoredIconProps;

const ColoredIcon: React.FC<IColoredIconProps> = (props) => {
  let { children, className, name, selected, type } = props;

  const baseClass = 'colored-icon';

  const classes = cn(baseClass, className, {
    [baseClass + '--selected']: selected,
    [baseClass + '_' + type]: type,
  });

  return <span className={classes}>{children || ColoredIcons[name][type]}</span>;
};

export default ColoredIcon;
