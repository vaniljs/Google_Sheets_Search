require('file-loader?name=[name].[ext]!./index.html')

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/app';
import './app/app.sass';

window.addEventListener('load', () => {
    const allTargetBlock = document.querySelectorAll('.ticketsSearch');
    allTargetBlock.forEach(item => {
        ReactDOM.render(<App />, item)
    })
});
