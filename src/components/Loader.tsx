import React from "react";

interface LoaderProps {
    text: string;
}

const Loader: React.FC<LoaderProps> = ({text}) => {
    return(
        <div className='flex justify-center items-center'>
            <p>{text}</p>
            <img src='/loader.gif' alt='loader.png' className='h-5'/>
        </div>
    )
}

export default Loader;