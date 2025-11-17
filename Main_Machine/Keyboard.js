export class Keyboard{
    forward(signal){
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(signal); 
    }
    backward(signal){
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[signal];
    }
}
