import { Keyboard } from "./Keyboard.js";
import { Plugboard } from "./Plugboard.js";
import { Rotor } from "./Rotor.js";
import { Reflector } from "./Reflector.js";
import { Enigma } from "./Enigma.js";

export const I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q")
export const II = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E")
export const III = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V")
export const IV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "J")
export const V = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "Z")

export const Rotors = {"I": I, "II": II, "III": III, "IV": IV, "V": V}

export const A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD")
export const B = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT")
export const C = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL")

export const Reflectors = {"A": A, "B": B, "C": C}

export const KB = new Keyboard()
// export const PB = new Plugboard(["AR", "GK", "OX"])

// export const ENIGMA = new Enigma(KB,PB,[I,II,III],A)

const out = document.getElementById('output');
const state = document.getElementById('state');
const RotorsInput = [document.getElementById('I'), document.getElementById('II'), document.getElementById('III'), document.getElementById('IV'), document.getElementById('V')];
const PlugboardInput = document.getElementById('plugboard');
let sell;
function getSelectedReflectorValue() {
  let sell = document.querySelector('input[name="Reflector"]:checked');
  return sell ? sell.value : null;
}

// console.log(RotorsInput, ReflectorInput, PlugboardInput);
document.addEventListener('keydown', (e) => {
  const keyboardEnabled = document.getElementById("key").checked;
  if (!keyboardEnabled) return; 
  const PB = new Plugboard(PlugboardInput.value.split(/[,.\-\s]+/));

  const ReflectorInput = Reflectors[getSelectedReflectorValue()]

  console.log(ReflectorInput);
  const ENIGMA = new Enigma(KB,PB,[I,II,III],A)

  const currentReflector = getSelectedReflectorValue();
  // console.log(currentReflector);

  const key = e.key;
  const isAlphabet = /^[a-zA-Z]$/.test(key);
  const isNumber = /^[0-9]$/.test(key);
  
  for (let rotor of RotorsInput){
    if (rotor.checked){
      console.log("Selected rotor:", Rotors[rotor.id], );
    }

  }

  if (!isAlphabet && !isNumber) return;

  // Encrypt only alphabets for now
  let encrypted = key;
  if (isAlphabet) encrypted = ENIGMA.encrypt(key.toUpperCase());

  out.textContent = `You pressed: ${key} → Encrypted: ${encrypted}`;
  // show rotor positions (helpful for debugging)
  const pos = ENIGMA.rotors.map(r => r.pos).join(' ');
  state.textContent = `Rotor positions: ${pos}`;
});
