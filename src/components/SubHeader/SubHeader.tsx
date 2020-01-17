import React from 'react';
import './SubHeader.scss';
import { Link } from 'react-router-dom';

interface ISubHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  link?: string;
  clickedHandler?: any;
  className?: string;
}

const SubHeader: React.FC<ISubHeaderProps> = (props) => {
  const classes = props.className ? ' ' + props.className : '';
  return props.link ? (
    <Link
      to={props.link}
      className={'sub-header' + classes}
      onClick={(event) => {
        event.stopPropagation();
        props.clickedHandler();
      }}
    >
      {props.children}
    </Link>
  ) : (
    <div className={'sub-header sub-header--not-link ' + props.className}>{props.children}</div>
  );
};

export default SubHeader;
