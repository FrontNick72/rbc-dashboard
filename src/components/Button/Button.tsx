import * as React from 'react';
import cn from 'classnames';
import './Button.scss';
import Icon from '../Icon';
import { TIconNames } from '../../utils/icons';

interface IButtonProps {
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.FormEvent) => void;
  color?: 'gray' | 'yellow' | 'yellow-dark' | 'ghost';
  filled?: boolean;
  label: string | number;
  children?: React.ReactChild;
  checked?: boolean;
  icon?: TIconNames;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<IButtonProps> = (props) => {
  const {
    children,
    className,
    color,
    disabled,
    label,
    filled,
    onClick,
    checked,
    icon,
    type,
  } = props;

  const baseClass = 'button';

  const classes = cn(baseClass, className, {
    [`button--${color}`]: color,
    [`button--filled`]: filled || checked,
    [`button--checked`]: checked === true,
  });

  const attributes = {
    type,
    disabled,
    onClick,
    className: classes,
  };

  const content = children ? children : label;
  const iconComponent = icon ? <Icon className={`${baseClass}__icon`} name={icon} /> : null;

  return (
    <button {...attributes}>
      {content}
      {iconComponent}
    </button>
  );
};

export default Button;
