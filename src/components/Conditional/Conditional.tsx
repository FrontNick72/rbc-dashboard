import React from 'react';

interface IConditionalProps {
  render: boolean;
}

const Conditional: React.FC<IConditionalProps> = (props) => {
  let { children, render } = props;

  return <>{render ? children : ''}</>;
};

export default Conditional;
