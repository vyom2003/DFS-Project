import React from "react";
import {useState,useEffect} from "react";
import {Progress} from "flowbite-react"
import { TOAST_VARIANTS } from "./constants";

export type ProgressBarProps = {
    className: string;
    category: TOAST_VARIANTS;
}

const ProgressBar=(props:ProgressBarProps)=>{
    const category = props.category
    const [filled, setFilled]=useState(100);
	const [isRunning, setIsRunning]=useState(false);
    const handleColor=()=>{
        switch (category) {
            case TOAST_VARIANTS.WARNING:
                return "yellow"
            case TOAST_VARIANTS.ERROR:
                return 'red'
            case TOAST_VARIANTS.SUCCESS:
                return 'green'
            case TOAST_VARIANTS.INFO:
                return 'blue'    
            default:
                return ''
        }
    }
    const pgColor = handleColor()
	useEffect(() => {
        setIsRunning(true);
		if (filled > 0 && isRunning) {
			setTimeout(() => setFilled(prev => prev -= 2), 90)
		}
	},[filled, isRunning])
    return (
        <Progress className="h-1"
            progress={filled}
            size="sm"
            color={pgColor}
        />
    );
}
export default ProgressBar