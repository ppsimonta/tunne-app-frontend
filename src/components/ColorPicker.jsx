import React, { useState } from 'react';
import Button from '@mui/material/Button';

const SelectionComponent = ({onSelect}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
    onSelect(option);
  };

  return (
    <div className="text-center p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-10">What color describes your feeling best?</h1>
        <div className='flex w-full justify-center'>
          <div className='flex flex-row flex-wrap overflow-y-auto justify-center items-center max-w-64 h-auto gap-3'>
            <button className="min-w-14 w-20 h-20 bg-yellow-300 active:bg-yellow-300/[.8] p-2 rounded-full shadow-md " onClick={() => handleOptionClick('yellow')}/>
            <button className="min-w-14 w-20 h-20 bg-green-500 active:bg-green-500/[.8] p-2 rounded-full shadow-md " onClick={() => handleOptionClick('green')}/>
            <button className="min-w-14 w-20 h-20 bg-slate-900 active:bg-slate-900/[.9] p-2 rounded-full shadow-md " onClick={() => handleOptionClick('black')}/>
            <button className="min-w-14 w-20 h-20 bg-blue-500 active:bg-blue-500/[.8] p-2 rounded-full shadow-md " onClick={() => handleOptionClick('blue')}/>
            <button className="min-w-14 w-20 h-20 bg-purple-500 active:bg-purple-500/[.8] p-2 rounded-full shadow-md " onClick={() => handleOptionClick('purple')}/>
            <button className="min-w-14 w-20 h-20 bg-red-500 p-2 rounded-full shadow-md " onClick={() => handleOptionClick('red')}/>
            <button className="min-w-14 w-20 h-20 bg-orange-500 p-2 rounded-full shadow-md " onClick={() => handleOptionClick('orange')}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionComponent;