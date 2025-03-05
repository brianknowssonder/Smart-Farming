let password="briabffbfbcyh#"
let numbers=[0,1,2,3,4,5,6,7,8,9]
let special=["&","@","!","#"]
function check_password_strength(password) {
    if (password.length <= 6) {
        console.log("Weak");
    }
    for (let i = 0; i < password.length; i++){
    
        for (let x = 0; x < numbers.length; x++) {
            for (let y = 0; y < special.length; y++){
                if (password.length<10){
                
                    if (password.charAt(i) == numbers[x]){
                    console.log("moderate")
                    }else{
                    console.log("weak")
                    }
        
    
                }
                if (password.length>=10){
                    if (password.charAt(i) == special[y]){
                        console.log("strong")
                    }else{
                        console.log("moderate")
                    }
                }break
            }
            
        }   
    }
}
// check_password_strength(password);
// const hasDigit = /\d/.test(password);
//     const hasSpecialChar = /[!@#\$%\^&\*()]/.test(password);
    
//     if (password.length <= 10) {
//         return hasDigit ? "Moderate" : "Weak";
//     }
    
//     return hasDigit && hasSpecialChar ? "Strong" : "Moderate";
