const { Keyboard } = require('./Main_Machine/Keyboard.js');
const { Plugboard } = require('./Main_Machine/Plugboard.js');
const { Rotor } = require('./Main_Machine/Rotor.js');
const { Reflector } = require('./Main_Machine/Reflector.js');

const express = require('express');
const path = require('path');
const app = express();


const keyboard = new Keyboard();

app.get('/', (req, res) => {
    const output = keyboard.forward('Z');
    res.send('Hello World — forward(A) => ' + output);
});

app.get('/enigma', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`);
});

