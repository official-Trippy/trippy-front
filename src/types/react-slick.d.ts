declare module 'react-slick' {
    import { Component } from 'react';
  
    interface Settings {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      autoplay?: boolean;
      autoplaySpeed?: number;
      arrows?: boolean;
      nextArrow?: JSX.Element;
      prevArrow?: JSX.Element;
      [key: string]: any;
    }
  
    class Slider extends Component<Settings> {}
  
    export default Slider;
  }
  