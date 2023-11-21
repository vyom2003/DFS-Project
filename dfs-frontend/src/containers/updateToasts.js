export const UpdateToastData = (isAdd, toastData, setToastData, countRef, message, variant, timeout, index) => {

    const addToast = () => {
        let activeCnt = 0, firstActiveIdx=-1;
        for (let i = 0; i < toastData.length; i++) {
            if (toastData[i].active === true) {
                activeCnt += 1;
                if(activeCnt===1){
                    firstActiveIdx=i;
                }
            }
        }

        const curIdx = toastData.length;
        const toastInp = {
            variant: variant,
            message: message,
            active: true
        }

        activeCnt>=5 ? setToastData([...toastData, toastInp], toastData[firstActiveIdx].active = false) : setToastData([...toastData, toastInp]);
        
        setTimeout(() => {
            setToastData([...countRef.current], countRef.current[curIdx].active = false);
        }, timeout)
    };

    const deleteToast = () => {
        countRef.current = toastData;
        setToastData([...countRef.current], countRef.current[index].active = false);
    }

    isAdd === 1 ? addToast() : deleteToast();
};