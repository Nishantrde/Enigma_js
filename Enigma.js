export class Enigma{
    // constructor(kb, pb, r1, r2, r3, rf){
    constructor(kb, pb, rotors, rf){
        this.kb = kb;
        this.pb = pb;
        // this.r1 = r1;
        // this.r2 = r2;
        // this.r3 = r3;
        this.rf = rf;
        this.rotors = rotors

    }
    set_key(key){
        // this.r1.rotate_to_letter(key[0])
        // this.r2.rotate_to_letter(key[1])
        // this.r3.rotate_to_letter(key[2])
        for ( let i = 0; i < this.rotors.length; i++){
            this.rotors[i].rotate_to_letter(key[i])
        }
    }
    encrypt(letter){

        for (let i = 0; i < this.rotors.length; i++){
            for (let j = this.rotors.length - 1; j >= 0; j--){
                if (this.rotors[j].left[0] === this.rotors[j].notch){
                    this.rotors[j-1].rotate()
                }
            }
        }

        // if (this.r2.left[0] === this.r2.notch && this.r1.left[0] === this.r1.notch){
        //     this.r1.rotate()
        //     this.r2.rotate()
        //     this.r3.rotate()
        // }

        // else if (this.r3.left[0] === this.r3.notch){
        //     this.r2.rotate()
        //     this.r3.rotate()
        // }

        // else{
        //     this.r3.rotate()
        // }

        let signal = this.kb.forward(letter);
        signal = this.pb.forward(signal);
        // signal = this.r3.forward(signal);
        // signal = this.r2.forward(signal);
        // signal = this.r1.forward(signal);
        for (let i = this.rotors.length - 1; i >= 0; i--){
            signal = this.rotors[i].forward(signal);
        }
        signal = this.rf.reflect(signal);
        for (let i = 0; i < this.rotors.length; i++){
            signal = this.rotors[i].backward(signal);
        }
        // signal = this.r1.backward(signal);
        // signal = this.r2.backward(signal);
        // signal = this.r3.backward(signal);
        signal = this.pb.backward(signal);
        letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal];
        return letter;
    }
}

