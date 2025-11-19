import { Keyboard } from "./Keyboard.js";
import { Plugboard } from "./Plugboard.js";
import { Rotor } from "./Rotor.js";
import { Reflector } from "./Reflector.js";
import { Enigma } from "./Enigma.js";

export const I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q")
export const II = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E")
export const III = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V")
const IV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "J")
const V = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "Z")

export const A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD")
const B = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT")
const C = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL")

export const KB = new Keyboard()
export const PB = new Plugboard(["AR", "GK", "OX"])

const ENIGMA = new Enigma(KB,PB,[I,II,III],A)

const out = document.getElementById('output');
const state = document.getElementById('state');

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const isAlphabet = /^[a-zA-Z]$/.test(key);
  const isNumber = /^[0-9]$/.test(key);

  if (!isAlphabet && !isNumber) return;

  // Encrypt only alphabets for now
  let encrypted = key;
  if (isAlphabet) encrypted = ENIGMA.encrypt(key.toUpperCase());

  out.textContent = `You pressed: ${key} → Encrypted: ${encrypted}`;
  // show rotor positions (helpful for debugging)
  const pos = ENIGMA.rotors.map(r => r.pos).join(' ');
  state.textContent = `Rotor positions: ${pos}`;
});
