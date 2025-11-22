/* --- your existing imports and rotor/reflector/KB declarations stay the same --- */
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
const Set_Keys = document.getElementById('Set_Key');
const keyboardCheckbox = document.getElementById('key');

let ENIGMA = null;

function getSelectedReflectorValue() {
  const sel = document.querySelector('input[name="Reflector"]:checked');
  return sel ? sel.value : null;
}

function getSelectedRotorValue() {
  const sel = document.querySelector('input[name="RotorI"]:checked');
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

function rotateIfSelectedUp() {
  if (!ENIGMA) return;

  const sel = document.querySelector('input[name="RotorI"]:checked');
  if (!sel) return;

  // If the selected button value is "up"
  if (sel.value === "up") {
    console.log(sel.value)
    // Rotate the RIGHTMOST rotor
    const last = ENIGMA.rotors.length - 1;
    const rotor = ENIGMA.rotors[last];

    if (rotor && typeof rotor.rotate === 'function') {
      rotor.rotate();
    }

    // 🔥 TURN THE BUTTON OFF AFTER ROTATING
    sel.checked = false;

    // Update UI
    state.textContent = `Rotor positions: ${ENIGMA.rotors.map(r => r.pos).join(' ')}`;
    console.log("Rotated, turning button OFF");
  }
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

  // Use the input's .value (string), sanitize, uppercase, and slice to number of rotors
  if (Set_Keys) {
    const raw = (Set_Keys.value || "");
    const sanitized = raw.replace(/[^A-Za-z]/g, "").toUpperCase();
    const desired = sanitized.slice(0, rotorsList.length); // match number of selected rotors
    // only call set_key if there's something to set (optional)
    if (desired.length > 0) ENIGMA.set_key(desired);
  }

  // If rotor selection is "up" at initialization, rotate once.
  rotateIfSelectedUp();

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
    if (keyboardCheckbox.checked) {
      initEnigmaIfNeeded();
      // also check the "up" state right after rotor selection change
      rotateIfSelectedUp();
    }
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

  // If RotorI value is "up", rotate before encrypting this keypress
  rotateIfSelectedUp();

  let encrypted = key;
  if (isAlphabet) encrypted = ENIGMA.encrypt(key.toUpperCase());

  out.textContent = `You pressed: ${key} → Encrypted: ${encrypted}`;
  state.textContent = `Rotor positions: ${ENIGMA.rotors.map(r => r.pos).join(' ')}`;
  console.log(ENIGMA.rotors)
});
