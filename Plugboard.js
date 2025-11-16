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
