export class Enigma{
    
    constructor(kb, pb, rotors, rf){
        this.kb = kb;
        this.pb = pb;
        this.rf = rf;
        this.rotors = rotors

    }
    set_key(key){
        for ( let i = 0; i < this.rotors.length; i++){
            this.rotors[i].rotate_to_letter(key[i])
        }
    }
    encrypt(letter){

        for (let i = 1; i < this.rotors.length; i++){
            for (let j = this.rotors.length - i; j >= 0; j--){
                if (this.rotors[j].left[0] === this.rotors[j].notch){
                    this.rotors[j-1].rotate()
                }
            }
        }

        let signal = this.kb.forward(letter);
        signal = this.pb.forward(signal);
        
        for (let i = this.rotors.length - 1; i >= 0; i--){
            signal = this.rotors[i].forward(signal);
        }
        signal = this.rf.reflect(signal);
        for (let i = 0; i < this.rotors.length; i++){
            signal = this.rotors[i].backward(signal);
        }
        
        signal = this.pb.backward(signal);
        letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal];
        this.rotors[this.rotors.length - 1].rotate();
        return letter;        
    }
}

