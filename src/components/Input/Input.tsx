import React from 'react';
import cn from 'classnames';
import './Input.scss';
import Icon from '../Icon';
import InputMask from 'react-input-mask';

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  addonAfter?: React.ReactNode;
  error?: string;
  errorClassName?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  labelClassName?: string;
  prefix?: string;
  tabIndex?: number;
  theme?: 'underline' | 'noborder';
  isShowPassword?: boolean;
  defaultValue?: string;
  value?: string;
}

interface IStateInput {
  focus: boolean;
  value?: string;
  isShowPassword: boolean;
}

class Input extends React.PureComponent<IInput, IStateInput> {
  state: IStateInput = {
    focus: false,
    value: this.props.defaultValue,
    isShowPassword: false,
  };

  static defaultProps = {
    type: 'text',
  };

  ref = React.createRef<HTMLInputElement>();

  componentDidMount() {
    const { defaultValue, value } = this.props;

    this.setState({
      value: defaultValue || value || '',
    });
  }

  componentDidUpdate(prevProps: IInput) {
    if (this.props.value && this.props.value !== this.state.value) {
      this.setState({ value: this.props.value });
    }
  }

  onContainerClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.ref.current) {
      this.ref.current.focus();
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    this.setState({
      value: event.target.value,
    });

    if (onChange) {
      onChange(event);
    }
  };

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;

    this.setState({
      focus: true,
    });

    if (onFocus) {
      onFocus(event);
    }
  };

  onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onBlur } = this.props;

    this.setState({
      focus: false,
    });

    if (onBlur) {
      onBlur(event);
    }
  };

  togglePassword = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  render() {
    const {
      addonAfter,
      className,
      disabled,
      error,
      errorClassName,
      inputClassName,
      inputContainerClassName,
      labelClassName,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      prefix,
      theme,
      value,
      type,
      ...rest
    } = this.props;

    const { focus, value: _value } = this.state;

    if (_value) {
      rest.defaultValue = _value;
    }

    const baseClass = prefix || 'input';

    const classes = cn(baseClass, className, {
      [baseClass + '_with-addon']: addonAfter,
      [baseClass + '_disabled']: disabled,
      [baseClass + '_error']: error,
      [baseClass + '_focused']: focus,
      [baseClass + '_theme-' + theme]: theme,
    });
    const inputClasses = cn(baseClass + '__control', inputClassName);
    const inputContainerClasses = cn(baseClass + '__container', inputContainerClassName);
    const labelClasses = cn(baseClass + '__label', labelClassName, {
      [baseClass + '__label_floating']: _value && _value.length !== 0,
    });
    const afterAddon = addonAfter && (
      <span className={cn(baseClass + '__addon', baseClass + '__addon_after')}>{addonAfter}</span>
    );
    const errorClasses = cn(baseClass + '__error', errorClassName);
    const showButtonPassword =
      type === 'password' && this.state.value ? (
        <button
          type="button"
          className={cn(baseClass + '__toggle-password')}
          onClick={this.togglePassword}
        >
          {this.state.isShowPassword ? <Icon name="eye-closed" /> : <Icon name="eye-opened" />}
        </button>
      ) : null;

    let input = (
      <input
        disabled={disabled}
        className={inputClasses}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onFocus={this.onFocus}
        ref={this.ref}
        value={value}
        type={type === 'password' && this.state.isShowPassword ? 'text' : type}
        {...rest}
      />
    );

    if (rest.name === 'phone') {
      input = (
        <InputMask
          type="tel"
          mask="+7 999 999 99 99"
          maskChar="_"
          disabled={disabled}
          className={inputClasses}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          value={value}
        />
      );
    }

    return (
      <span className={classes} onClick={this.onContainerClick}>
        <span className={inputContainerClasses}>
          {input}
          <span className={labelClasses}>{placeholder}</span>
        </span>
        {showButtonPassword}
        {afterAddon}
        {error && <span className={errorClasses}>{error}</span>}
      </span>
    );
  }
}

export default Input;
