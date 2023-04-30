import { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import ReactDOM from 'react-dom/client';
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

export default function RenderInWindow  (props)  {
    const [container, setContainer] = useState(null);
    const newWindow = useRef(window);
  
    useEffect(() => {
      const div = document.createElement("div");
      setContainer(div);
    }, []);
  
    useEffect(() => {
      if (container) {
        newWindow.current = window.open(
          "",
          ""
        );
        newWindow.current.document.body.appendChild(container);
        const curWindow = newWindow.current;
        return () => curWindow.close();
      }
    }, [container]);
  
    return container && createPortal(props.children, container);
};