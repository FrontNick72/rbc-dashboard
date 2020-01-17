import React from 'react';
import './Header.scss';

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<IHeaderProps> = (props) => {
  return <div className="header">{props.children}</div>;
};

export default Header;
