import { Keyboard } from "./Keyboard.js";
import { Plugboard } from "./Plugboard.js";
import { Rotor } from "./Rotor.js";
import { Reflector } from "./Reflector.js";
import { Enigma } from "./Enigma.js";

const I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q")
const II = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E")
const III = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V")
const IV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "J")
const V = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "Z")

const A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD")
const B = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT")
const C = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL")

const KB = new Keyboard()
const PB = new Plugboard(["AR", "GK", "OX"])

const ENIGMA = new Enigma(KB,PB,[I,II,III],A)

let op = ""
ENIGMA.set_key("DOG")
let msg  = "JATA"
op = ENIGMA.encrypt(msg)


console.log(op)



