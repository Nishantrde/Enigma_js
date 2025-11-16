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
