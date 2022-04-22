const callLogin = (form) => {
    const email = form.email.value;
    const password = form.password.value;

    const login = fetch('/gen-token', {
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        headers: {'Content-Type': 'application/json'}
    })


    login.then(data => {
        var status = document.getElementById('status')

        if (data.status == 404){
            status.innerText = "An account with this email does not exist."
        }else if (data.status = 403){
            status.innerText = "Incorrect password, please try again."
        }else if (data.status = 500){
            status.innerText = "There has been an unknown error logging in, please try again later"
        }else{

            const d = new Date(Date.now() + 12096e5);
            let expires = "expires="+d.toUTCString();
            if (form.rememberme.checked == true){
                document.cookie = `tokenid=${data.token}; ${expires}; `
            }else{
                document.cookie = `tokenid=${data.token};`
            }
        }






    })
}