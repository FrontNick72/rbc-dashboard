import React from 'react';
import cn from 'classnames';
import './Row.scss';

interface IRowProps {
  className?: string;
}

const Row: React.FC<IRowProps> = (props) => {
  let { children, className } = props;

  const baseClass = 'row';

  const classes = cn(baseClass, className);

  return <div className={classes}>{children}</div>;
};

export default Row;
