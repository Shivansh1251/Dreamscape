    let lusername = localStorage.getItem('user');
    let lpassword = localStorage.getItem('passw');
    
    lusername = lusername ? lusername.split(",") : []
    lpassword = lpassword ? lpassword.split(",") : []

    
    function login() {
        let counter = 0;
        let username = document.querySelector('#Memail').value;
        let pass = document.querySelector('#password').value;
        if (!username || !pass) {
            alert("Please Enter username and password");
            return;
        }

        for (let i = 0; i < lusername.length; i++) {
            if (username === lusername[i] && pass === lpassword[i]) {
                counter++;
            }
        }
        if (counter == 1) {
            alert("Login successful!");
            window.location.href = 'Dashboard.html'; 
        } else {
            alert("Login Failed! Incorrect Password");
        }
    }
    function register() {

        let username = document.querySelector('#username').value;
        let pass = document.querySelector('#passwrd').value;
        let cpass = document.querySelector('#confirm-passwrd').value;
        if (!username || !pass || !cpass) {
            alert("Please enter username or password or confirm-password");
            return;
        }
        if (pass === cpass) {
            lusername.push(username);
            lpassword.push(pass);
            localStorage.setItem('user', lusername);
            localStorage.setItem('passw', lpassword);
            alert("User Saved !!!!!!!");
            window.location.href = 'Dashboard.html'; 
        } else {
            alert("Passwords do not match. Retry.");
            document.querySelector('#username').value = "";
            document.querySelector('#passwrd').value = "";
            document.querySelector('#confirm-passwrd').value = "";
        }
    }
    