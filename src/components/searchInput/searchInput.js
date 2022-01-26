import React, {useState} from "react";


const SearchInput = (props) => {
    const {searchFrom, username} = props;

    return (
        <div className='inputSearchBlock'>
            <input
                type="text"
                placeholder="Укажите ваш ID"
                onInput={username}/>
            <button onClick={searchFrom}></button>
        </div>
    )
};


export default SearchInput;