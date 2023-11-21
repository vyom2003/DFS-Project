import { useState, useRef, useCallback } from "react";
import { TOAST_VARIANTS } from "../toasts/constants";

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_VARIANT = TOAST_VARIANTS.INFO;

export const useToast = () => {
    const [toastData, setToastData] = useState([]);
    const countRef = useRef([toastData]);
    countRef.current = toastData;

    const addToast = useCallback(({ message, variant = DEFAULT_VARIANT, duration = DEFAULT_TOAST_DURATION }) => {
        let activeCnt = toastData.filter(toast => toast.active).length;
        let firstActiveIdx = toastData.findIndex(toast => toast.active);

        const curIdx = toastData.length;
        const toastInp = {
            variant: variant,
            message: message,
            active: true
        };

        if (activeCnt >= 5) {
            toastData[firstActiveIdx].active = false;
        }
        setToastData([...toastData, toastInp]);

        setTimeout(() => {
            countRef.current[curIdx].active = false;
            setToastData([...countRef.current]);
        }, duration);
    }, [toastData, setToastData]);

    const deleteToast = useCallback(({ index }) => {
        countRef.current = toastData;
        setToastData([...countRef.current], countRef.current[index].active = false);
    }, [toastData, setToastData]);

    return { toastData, addToast, deleteToast };
}