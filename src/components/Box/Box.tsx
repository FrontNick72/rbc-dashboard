import * as React from 'react';
import cn from 'classnames';
import './Box.scss';

interface IBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element | JSX.Element[] | string;
  isTransparent?: boolean;
}

const Box: React.FC<IBoxProps> = (props) => {
  let { className, isTransparent } = props;

  const baseClass = 'box';

  const classes = cn(baseClass, className, {
    [`${baseClass}--transparent`]: isTransparent === true,
  });

  return <div className={classes}>{props.children}</div>;
};

export default Box;
