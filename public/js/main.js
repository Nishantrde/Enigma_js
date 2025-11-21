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

const out = document.getElementById('output');
const state = document.getElementById('state');
const RotorsInput = [
  document.getElementById('I'),
  document.getElementById('II'),
  document.getElementById('III'),
  document.getElementById('IV'),
  document.getElementById('V')
];
const PlugboardInput = document.getElementById('plugboard');
const keyboardCheckbox = document.getElementById('key');

let ENIGMA = null;

function getSelectedReflectorValue() {
  const sel = document.querySelector('input[name="Reflector"]:checked');
  return sel ? sel.value : null;
}

function getSelectedRotorsList() {
  const list = [];
  for (let rotor of RotorsInput) {
    if (rotor && rotor.checked) list.push(Rotors[rotor.id]);
  }
  return list;
}

function buildPlugboard() {
  const raw = PlugboardInput.value || "";
  // split on comma, dot, dash, space, etc, and filter empty strings
  const pairs = raw.split(/[,.\-\s]+/).filter(Boolean);
  return new Plugboard(pairs);
}

// Initialize or re-initialize ENIGMA when settings change or keyboard enabled
function initEnigmaIfNeeded() {
  if (!keyboardCheckbox.checked) {
    ENIGMA = null;
    state.textContent = `Keyboard disabled`;
    return;
  }

  const pb = buildPlugboard();
  const reflectorKey = getSelectedReflectorValue() || "A";
  const reflector = Reflectors[reflectorKey] || A;

  let rotorsList = getSelectedRotorsList();
  if (rotorsList.length === 0) rotorsList = [I, II, III]; // fallback

  ENIGMA = new Enigma(KB, pb, rotorsList, reflector);
  state.textContent = `Enigma initialized — Rotor positions: ${ENIGMA.rotors.map(r => r.pos).join(' ')}`;
  console.log("ENIGMA (initialized):", ENIGMA);
}

// Re-init when user toggles keyboard checkbox or changes any setting
keyboardCheckbox.addEventListener('change', initEnigmaIfNeeded);
PlugboardInput.addEventListener('input', () => {
  // keep ENIGMA updated if keyboard is enabled
  if (keyboardCheckbox.checked) initEnigmaIfNeeded();
});
document.querySelectorAll('input[name="Reflector"]').forEach(r => {
  r.addEventListener('change', () => {
    if (keyboardCheckbox.checked) initEnigmaIfNeeded();
  });
});
RotorsInput.forEach(r => {
  if (r) r.addEventListener('change', () => {
    if (keyboardCheckbox.checked) initEnigmaIfNeeded();
  });
});

// Key handler — uses existing ENIGMA instance (does not recreate it)
document.addEventListener('keydown', (e) => {
  if (!keyboardCheckbox.checked) return;
  if (!ENIGMA) {
    initEnigmaIfNeeded();
    if (!ENIGMA) return;
  }

  const key = e.key;
  const isAlphabet = /^[a-zA-Z]$/.test(key);
  const isNumber = /^[0-9]$/.test(key);
  if (!isAlphabet && !isNumber) return;

  let encrypted = key;
  if (isAlphabet) encrypted = ENIGMA.encrypt(key.toUpperCase());

  
  out.textContent = `You pressed: ${key} → Encrypted: ${encrypted}`;
  state.textContent = `Rotor positions: ${ENIGMA.rotors.map(r => r.pos).join(' ')}`;
});
