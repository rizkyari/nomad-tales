import React from 'react';

const Loading = () => {
    return (
        <>
            <div className='flex justify-center items-center'>
                <div className='text-center'>
                    <h1 className='font-bold my-5 text-xl'>Loading...</h1>
                    <img src='/page-load.gif' alt='loading.png'/>
                </div>
            </div>
        </>
    )
}

export default Loading;