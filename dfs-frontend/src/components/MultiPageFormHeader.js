const StepButton = ({ step, index, page, setPage }) => {
  const backgroundColor = page === step.page ? "bg-blue-500" : "bg-gray-400"
  const borderColor = page === step.page ? "border-blue-500" : "border-gray-400"
  const textColor = page === step.page ? "text-blue-500" : "text-gray-400"
  return (
    <button
      className="flex flex-col justify-center items-center border-none outline-none focus:outline-none p-0 m-0"
      onClick={() => setPage(step.page)}
      disabled={step.disabled}
    >
      <div className={"h-5"} />
      <div className={"w-10 h-10 p-0 m-0 rounded-full justify-center items-center border-2 border-solid bg-white flex " + borderColor}>
        <div className={"w-8 h-8 p-0 rounded-full flex justify-center items-center text-white text-xl " + backgroundColor}>
          {index}
        </div>
      </div>
      <div className={"m-0 p-0 " + textColor}>{step.header}</div>
    </button>
  )
}

export const MultiPageFormHeader = ({page, setPage, stepList }) => {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-2/3 flex justify-center relative items-center p-4">
        <div className="w-2/3 h-0.5 rounded bg-gray-400 absolute" />
        <div className="flex items-center justify-between w-2/3 absolute">
          {stepList.map((step, index) => ( 
              <div key={index} className="flex justify-center items-center">
                <StepButton step={step} index={index + 1} page={page} setPage={setPage}/>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};
