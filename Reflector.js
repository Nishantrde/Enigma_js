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
