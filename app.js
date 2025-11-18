// app.js
// import { Keyboard } from './Main_Machine/Keyboard.js'; // <- named import
// import express from 'express';
// import path from 'path';
const { Keyboard } = require('./Main_Machine/Keyboard.js'); // <- named import
const express = require('express');
const path = require('path');
const app = express();
// const keyboard = new Keyboard(); // instantiate

app.get('/', (req, res) => {
  res.send('Hello World — forward(A) => ' + Keyboard.forward('A'));
});
app.get('/enigma', (req, res) => {
  res.sendFile(path.join(  __dirname, 'templates', 'index.html'));
  res.json({ message: 'Enigma endpoint' });
})

app.listen(3000, () => {
  console.log('server running on port http://localhost:3000');
});
