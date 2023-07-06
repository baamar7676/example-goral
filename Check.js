
function checkEmail(str) {
    const pattern = /^[a-zA-Z0-9@.-]*$/;


    if (str.match(pattern)) {
        console.log("Check mail- ✔");
        console.log(str);
        return true;
    }
    else {
        console.log("Check mail- ✖");
        console.log(str);
        return false;
    }


}

function CheckPassword(str) {

    const pattern = /^[a-zA-Z0-9א-ת!@#%₪]*$/;

    function clerSpace(str) {
        let str2 = str.replace(/\s/g, '');
        console.log(str);
        return str2;
    }

    str = clerSpace(str)

    if (str.match(pattern)) {
        console.log("Check pass- ✔");
        console.log(str);
        return true;


    }
    else {

        console.log("Check pass- ✖");
        console.log(str);
        return false;

    }

}
function checkName(str) {

    function clerSpace(strT) {
        let str2 = strT.replace(/\s/g, '');
        return str2;
    }

    str = clerSpace(str);


    const pattern = /^[a-zA-Z0-9א-ת-.]*$/;

    if (str.match(pattern)) {
        console.log("Check name- ✔");
        console.log(str);

        return true;
    }
    else {
        console.log("Check name- ✖");
        console.log(str);
        return false;
    }


}




module.exports = { checkIncludes, checkEmail, CheckPassword, checkName };