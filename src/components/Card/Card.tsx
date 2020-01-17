import * as React from 'react';
import cn from 'classnames';
import './Card.scss';

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'colored' | 'empty';
}

const Card: React.FC<ICardProps> = (props) => {
  const { className, type } = props;

  const baseClass = 'card';

  const classes = cn(baseClass, className, {
    [`${baseClass}--colored`]: type === 'colored',
  });

  return <div className={classes}>{props.children}</div>;
};

export default Card;
