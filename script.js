let lusername = localStorage.getItem('usernames');
    let lpassword = localStorage.getItem('password');
    
    lusername = lusername ? lusername.split(",") : []
    lpassword = lpassword ? lpassword.split(",") : []

    function login() {
        let counter = 0;
        let username = document.querySelector('#email').value;
        let pass = document.querySelector('#password').value;
        if (!username || !pass) {
            alert("Please Enter username and password")
        }

        for (let i = 0; i < lusername.length; i++) {
            if (username === lusername[i] && pass === lpassword[i]) {
                counter++;
            }
        }
        if (counter == 1) {
            alert("Login Granted!")
        } else {
            alert("Login Failed!!")
        }
    }
    function register() {

        let username = document.querySelector('#email').value;
        let pass = document.querySelector('#password').value;
        let cpass = document.querySelector('#confirm-password').value;
        if (!username || !pass || !cpass) {
            alert("Please enter username or password or confirm-password")
        }
        if (pass === cpass) {
            lusername.push(username);
            lpassword.push(pass);
            localStorage.setItem('usernames', lusername);
            localStorage.setItem('password', lpassword);
            alert("User Saved !!!!!!!");
        } else {
            alert("Retry");
            document.querySelector('#email').value = "";
            document.querySelector('#password').value = "";
            document.querySelector('#confirm-password').value = "";
        }
    }