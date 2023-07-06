
const form_card = document.querySelector('.form_card');
const form_delet_card = document.querySelector('.form_delet_card');
const x = document.querySelector('#x');
const alert_red = document.querySelector('.alert');
const title_alert = document.querySelector('#title_alert');



if (document.cookie.split(';').find(cookie => cookie.includes('wins_cards=')) == undefined) {
    window.location.href = "/";
}
else {
    const data_wins = document.cookie.split(';').find(cookie => cookie.includes('wins_cards=')).split('=')[1]

    const wins_cards = data_wins.split('wins_cards') 
    const emailW = data_wins.split('emailW')

    const wins_cards1 = wins_cards[1].split('emailW')
    const emailW1 = emailW[1].split('wins_cards')

    const emailReplace = emailW1[0].replace(/%40/g, "@");


    document.querySelector('#deletCode').value = wins_cards1[0]
    document.querySelector('#emailW').value =  emailReplace

}





async function goo() {

    if (document.cookie.split(';').find(cookie => cookie.includes('s_e_p=')) == undefined) {
        window.location.href = "/";
    }
    else {


        const emailCookie = document.cookie.split(';').find(cookie => cookie.includes('s_e_p=')).split('=')[1]

        // console.log(emailCookie, "emailCookie");

        // console.log(localStorage.getItem('email_B'), "email_B");

        if (emailCookie === undefined || localStorage.getItem('email_B') == null || localStorage.getItem('email_B').length == 0 || emailCookie.length == 0) {
            window.location.href = "/";
        }

        await fetch('/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name_id_goral : true,
                get_check_user: true,
                emailCookie: emailCookie,
                email_B: localStorage.getItem('email_B')

            })
        })
            .then(async (res) => {
                const t = await res.json();
                console.log(t, "t2");

                if (t.compare === true) {
                    // console.log( "true yes");
                    const resCards = t.reso 
                    console.log(resCards, "resCards");

                    resCards.forEach((element, index) => {

                        const name_cards = element.name_cards
                        const id_goral = element.id_goral
                        const num_cards = element.num_cards

                        console.log(name_cards, id_goral, num_cards, "name_cards, id_goral, num_cards");


                        const option = document.createElement('option')

                        option.innerHTML = `✴${name_cards } - ${id_goral}  - ${num_cards} ✴ `
                        option.value = id_goral + "-" + name_cards
                        option.style.color  = "green"
                    

                        document.querySelector('#name_id_goral').appendChild(option)


                    }
                    );
                }
                if (t.compare === false) {
                    window.location.href = "/";
                }
            })
            .catch((err) => {

            }
            )

    }

}

goo()

const phone_input = document.getElementById('phone_input');
const email_input = document.getElementById('email_input');


if (document.cookie.split(';').find(cookie => cookie.includes('qr_profile=')) !== undefined) {
    const qr_profile = document.cookie.split(';').find(cookie => cookie.includes('qr_profile')).split('=')[1]

    const phone = qr_profile.split("phone")
    const email = qr_profile.split('email')



    const phone1 = phone[1].split('email')
    const email1 = email[1].split('idUser')
 

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    const emailReplace = email1[0].replace(/%40/g, "@");

    phone_input.value = phone1[0]
    email_input.value = emailReplace

}

form_card.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form_card);

    const data = Object.fromEntries(formData);
    console.log(data);

    data['email_B'] = localStorage.getItem('email_B');
    data['emailCookie'] = document.cookie.split(';').find(cookie => cookie.includes('s_e_p=')).split('=')[1]
    data['add_card'] = true


    if ( data.email === '' || data.phone === '' || data.codeShope === '' || data.name_id_goral ==='' ) {

        alert_red.style.display = "block";
        title_alert.innerHTML = "מלא את כל השדות או שנגמרו הכרטיסים"
    }
    else {

        //2.
        fetch("/cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "data");


                if (data.message == "הקוד לא נמצא") {

                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "orange";
                    title_alert.innerHTML = "הקוד חנות לא נמצא"
                }
                
                if (data.message == false) {
                    alert_red.style.display = "block";
                    title_alert.innerHTML = "מייל או ת.ז לא נמצא"
                }
                
                else if (data.message == true) {

                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "green";
                    title_alert.innerHTML = "כרטיס נוצר בהצלחה"
                    setTimeout(function () {
                        document.cookie = "qr_profile=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        window.location.reload();

                        form_card.reset();
                    }, 2000);

                }
                if (data.message == "exsists card") {
                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "orange";
                    title_alert.innerHTML = "קיים כבר כרטיס   עליו לממש אותו קודם"
                }
                if (data.message == "not exsists cards") {
                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "orange";

                    title_alert.style.fontSize = "130%";
                    title_alert.innerHTML = `זכו בכל ההגרלות עליך ליצור כרטיסי זכיה  כדי שתוכל ליצור כרטיסים   ליצירה לחץ  ${'<a href="/business" style="color:blue">כאן</a>'}`
                }
            })
        //    form_card.style.display = 'none';

    }
}
);

form_delet_card.addEventListener("submit", (event) => {

    event.preventDefault();
    const formData = new FormData(form_delet_card);

    const data = Object.fromEntries(formData);
    console.log(data);

    if (data.deletCode === '' || data.email === '') {
        alert("חובה למלא את כל השדות");
    }
    else {
        //2.
        fetch("/cards", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.message == false) {
                    alert_red.style.display = "block";
                    title_alert.innerHTML = "מייל  לא נמצא"
                    return false
                }
                else if (data.message == "no wins") {
                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "orange";
                    title_alert.innerHTML = "לא נמצא כרטיס"
                }
               else if (data.cards == null) {
                    alert_red.style.display = "block";
                    title_alert.innerHTML = "לא נמצאו כרטיסים"
                }

                else if (data.message == true) {
                    alert_red.style.display = "block";
                    alert_red.style.backgroundColor = "green";
                    title_alert.innerHTML = "כרטיס מומש בהצלחה"
                    form_delet_card.reset();
                    setTimeout(function () {
                       document.cookie = "wins_cards=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        window.location.reload();
                    }, 2000);

                }
            })
    }
}
);

const camera = document.querySelector("#camera");
const video = document.querySelector("#video");

const close_camera = document.querySelector("#close_camera");

// video.muted = true;

camera.addEventListener("click", () => {

    close_camera.style.display = "block";
    video.style.display = "block";


    // Get video element
    // const video2 = document.getElementById("video");
 let front = false;
    document.getElementById("camera").onclick = () => {
        front = !front;
    };

    const constraints = {
        video: { facingMode: front ? "user" : "environment" },
    
    };


    // Request access to the camera
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            // Set video element source
            video.srcObject = stream;
            // Play video
            video.play();
        })
        .catch(error => {
            console.log(error);
        });

    // Listen for when video can play
    video.addEventListener("canplay", () => {
        // Create canvas element
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Get canvas context
        const ctx = canvas.getContext("2d");

        // Set interval to continuously scan for QR codes
        setInterval(() => {
            // Draw video frame onto canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get image data from canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Decode QR code from image data
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            // If QR code is detected, do something with the result
            if (code) {
                console.log("QR code detected:", code.data);
                window.location = code.data;
                // Stop scanning for QR codes
                clearInterval(interval);
            }
        }, 1000);
    });


});

document.querySelector("#close_camera").addEventListener("click", () => {
    // var video = document.getElementById("vid");

    video.style.display = "none";
    close_camera.style.display = "none";

    video.srcObject.getTracks().forEach(function (track) {
        track.stop();
    }
    );

});




