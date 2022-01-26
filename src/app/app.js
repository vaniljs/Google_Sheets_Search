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
                valueStart: 0,
                valueEnd: 0
            },
        },
        searched: '',
        textNotFound: 'Билетов для указанного ID в розыгрыше не найдено',
        textEmptyRange: 'Ваш диапазон будет известен в день розыгрыша'
    });



    function getDataFromGoogleSheets() {
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBx3Ynd8Oiglp14qUxQvWP2fVwrXVo4ztC-K_3vPPHE_UJk-KRrg9YtErrACrpfiakSA_cn27j712g/pub?gid=1646978202&single=true&output=csv'


        fetch(url)
            .then(response => response.text())
            .then(data => {
                console.log(data);
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
            const allData = state.data;
            allData.forEach(item => {
                // 16111823
                console.log(item);
                if (item['USERNAME'] === state.usernameForSearch) {
                    // console.log('USERNAME ' + item['USERNAME']);
                    setState(state => {
                        return {
                            ...state,
                            dataSearched: {
                                username: {
                                    ...state.dataSearched.username,
                                    value: item[Object.keys(item)[1]]
                                },
                                countTickets: {
                                    ...state.dataSearched.countTickets,
                                    value: item[Object.keys(item)[2]]
                                },
                                rangeTickets: {
                                        ...state.dataSearched.rangeTickets,
                                        valueStart: item[Object.keys(item)[3]],
                                        valueEnd: item[Object.keys(item)[4]]
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
        //console.log(e.target.value);
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
                <p className="resultTitle">{state.dataSearched.username.title} </p>
                <span>{state.dataSearched.username.value}</span>
            </div>
            <div className="countTickets">
                <p className="resultTitle">{state.dataSearched.countTickets.title} </p>
                <span>{state.dataSearched.countTickets.value}</span>
            </div>
            <div className="rangeTickets">
                {state.dataSearched.rangeTickets.valueStart.length === 0
                    ? <p>{state.textEmptyRange}</p>
                    : <p className="resultTitle">{state.dataSearched.rangeTickets.title}
                        <span>{state.dataSearched.rangeTickets.valueStart + ' - ' + state.dataSearched.rangeTickets.valueEnd}</span>
                      </p>
                }
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
                <SearchInput
                    username={saveUsernameForSearch}
                    searchFrom={searchTicket}/>

                <div className="resultBlock">{result}</div>
        </div>
    )
}