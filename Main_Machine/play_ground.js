class Keyboard{
    forward(signal){
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(signal); 
    }
    backward(signal){
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal];
    }
}
class Plugboard{
    constructor(pairs){
        this.left  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.right = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let pair of pairs){
            const A = pair[0];
            const B = pair[1];
            let pos_a = this.left.indexOf(A);
            let pos_b = this.left.indexOf(B);
            this.right = this.right.substring(0, pos_a) + B + this.right.substring(pos_a+1)
            this.right = this.right.substring(0, pos_b) + A + this.right.substring(pos_b+1)
        }
    }
    forward(signal){
        let letter = this.right[signal]; 
        signal = this.left.indexOf(letter);
        return signal;
    }
    backward(signal){
        let letter = this.left[signal]
        signal = this.right.indexOf(letter)
        return signal
    }

}

class Rotor{
    constructor(wiring, notch){
        this.left = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        this.right = wiring
        this.notch = notch
    }
    forward(signal){
        const letter = this.left[signal]
        signal = this.right.indexOf(letter)
        return signal
    }
    backward(signal){
        const letter = this.right[signal]
        signal = this.left.indexOf(letter)
        return signal
    }
    rotate(n = 1){
        for (let i = 0; i < n; i++){
            this.left = this.left.substring(1) + this.left[0]
            this.right = this.right.substring(1) + this.right[0]
        }
    }
    rotate_to_letter(letter){
        let idx = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letter)
        this.rotate(idx) 
    }
}

class Reflector{
    constructor(wiring){
        this.left = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        this.right = wiring
    }
    reflect(signal){
        const letter = this.right[signal]
        signal = this.left.indexOf(letter)
        return signal
    }
}


key_brd = new Keyboard()
// // console.log(key_brd.forward("B"))
plug_brd = new Plugboard(["AZ"])
console.log(plug_brd.right)
Rotor_I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q")

console.log(Rotor_I.left, "\n")
console.log(Rotor_I.right, "\n")
// Rotor_I.rotate_to_letter("D")
// Rotor_I.rotate(2)
// console.log(Rotor_I.left)
// console.log(Rotor_I.right)

Reflector_A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD")
// console.log(Reflector_A.reflect(0))

signal = key_brd.forward("K")
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = plug_brd.forward(signal)
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = Rotor_I.forward(signal)
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = Reflector_A.reflect(signal)
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = Rotor_I.backward(signal)
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = plug_brd.backward(signal)
console.log( signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])
signal = key_brd.backward(signal)
console.log( signal)

console.log("Final signal:", signal, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal])


