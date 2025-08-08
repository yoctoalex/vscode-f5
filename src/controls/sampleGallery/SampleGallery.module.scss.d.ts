declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare const styles: { [className: string]: string };
export default styles;