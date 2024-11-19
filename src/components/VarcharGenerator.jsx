

export default function VarcharGenerator() {

    let result = ""
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const charactersLength = characters.length
    let counter = 0
    while (counter < 6) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter++
    }
    return result
    
}


