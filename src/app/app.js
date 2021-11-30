import React, {useEffect, useState} from 'react';
import SearchInput from "../components/searchInput";

export function App() {
    const [state, setState] = useState({
        data: {},
        usernameForSearch: '',
        dataSearched: {
            username: {
                title: 'Username: ',
                value: 0
            },
            countTickets: {
                title: 'Количество билетов: ',
                value: 0
            },
            rangeTickets: {
                title: 'Диапазон билетов: ',
                value: 0
            },
        },
        searched: '',
        textNotFound: 'Билеты не найдены'
    });



    function getDataFromGoogleSheets() {
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsvkNkmpzgOQVqnzymB2q9zEUP-OGDYXFYoSJtujD9nOU4U2lrIs4zhxygjhRHDNmIWgUe8HsABxeS/pub?gid=0&single=true&output=csv'

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const lines = data.split("\n");
                const result = [];
                const headers = lines[0].split(",");
                for(let i=1; i<lines.length; i++){
                    const obj = {};
                    const currentline = lines[i].split(",");
                    for(let j=0; j<headers.length; j++){
                        obj[headers[j]] = currentline[j].replace('\r', '');
                    }
                    result.push(obj);
                }
                setState(state => {
                    return {
                        ...state,
                        data: result
                    }
                })
            })
    }


    function searchTicket() {
        if (state.usernameForSearch.length > 0) {
            setState(state => {
                return {
                    ...state,
                    searched: false
                }
            })
            console.log('state.usernameForSearch ' + state.usernameForSearch);
            //console.log(state.data);
            const allData = state.data;
            allData.forEach(item => {
                // 16111823
                if (item['USERNAME'] === state.usernameForSearch) {
                    console.log('USERNAME ' + item['USERNAME']);
                    console.log(state);
                    setState(state => {
                        return {
                            ...state,
                            dataSearched: {
                                username: {
                                    ...state.dataSearched.username,
                                    value: item[Object.keys(item)[0]]
                                },
                                countTickets: {
                                    ...state.dataSearched.countTickets,
                                    value: item[Object.keys(item)[1]]
                                },
                                rangeTickets: {
                                        ...state.dataSearched.rangeTickets,
                                        value: item[Object.keys(item)[2]]
                                    }
                            },
                            searched: true
                        }
                    })
                }
            })
        }
    }

    function saveUsernameForSearch(e) {
        console.log(e.target.value);
        setState(state => {
            return {
                ...state,
                usernameForSearch: e.target.value,
                searched: ''
            }
        })
    }

    let result;
    if (state.searched === true) {
        result = <div>
            <div className="userName">
                <p className="resultTitle">{state.dataSearched.username.title} </p><span>{state.dataSearched.username.value}</span>
            </div>
            <div className="countTickets">
                <p className="resultTitle">{state.dataSearched.countTickets.title} </p><span>{state.dataSearched.countTickets.value}</span>
            </div>
            <div className="rangeTickets">
                <p className="resultTitle">{state.dataSearched.rangeTickets.title} </p><span>{state.dataSearched.rangeTickets.value}</span>
            </div>
        </div>
    } else if ( state.searched === false ){
        result = <p>{state.textNotFound}</p>
    } else {
        result = ''
    }


    useEffect(() => {
        if (Object.keys(state.data).length === 0) {
            getDataFromGoogleSheets()
        }
    })
    
    
    return (
        <div className='blockSearch'>
            <div className="imageBlock">
                <img src='./images/tikets.png' />
            </div>
            <div>
                <SearchInput
                    username={saveUsernameForSearch}
                    searchFrom={searchTicket}/>

                <div className="resultBlock">{result}</div>
            </div>
        </div>
    )
}