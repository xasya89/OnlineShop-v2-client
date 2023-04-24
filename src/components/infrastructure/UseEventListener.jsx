import { useEffect, useRef } from "react"

const useEventListener = (eventName, handler, element = window) => {
    const savedHandler = useRef();

    useEffect(() => savedHandler.current = handler, [handler]);
    useEffect(() => {
        const eventListner = (event) => savedHandler.current(event);
        element.addEventListener(eventName, eventListner);
        return () => element.removeEventListener(eventName, eventListner);
    }, [eventName, element])
}

export default useEventListener