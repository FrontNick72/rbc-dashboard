import React from 'react';
import cn from 'classnames';
import './Column.scss';

interface IColumnProps {
  className?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  offset?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const Column: React.FC<IColumnProps> = (props) => {
  let { children, className, xs, sm, md, lg, offset } = props;

  const baseClass = 'column';
  const offsetXs = offset && offset.xs ? offset.xs : null;
  const offsetSm = offset && offset.sm ? offset.sm : null;
  const offsetMd = offset && offset.md ? offset.md : null;
  const offsetLg = offset && offset.lg ? offset.lg : null;

  const classes = cn(baseClass, className, {
    [`column_xs-${xs}`]: xs,
    [`column_sm-${sm}`]: sm,
    [`column_md-${md}`]: md,
    [`column_lg-${lg}`]: lg,
    [`offset-xs-${offsetXs}`]: offsetXs,
    [`offset-sm-${offsetSm}`]: offsetSm,
    [`offset-md-${offsetMd}`]: offsetMd,
    [`offset-lg-${offsetLg}`]: offsetLg
  });

  return <div className={classes}>{children}</div>;
};

export default Column;
