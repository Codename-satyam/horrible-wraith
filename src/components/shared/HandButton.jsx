export default function HandButton({ variant = 'solid', className = '', children, ...rest }) {
  return <button type="button" className={`hbtn hbtn--${variant} ${className}`} {...rest}><span>{children}</span></button>;
}
