require('file-loader?name=[name].[ext]!./index.html')

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/app';
import './app/app.sass';


const appElement = document.getElementById('ticketsSearch');


ReactDOM.render(<App />, appElement)