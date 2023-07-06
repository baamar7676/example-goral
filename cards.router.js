const express = require("express");
const router = express.Router();
const Check = require("../api/Check");
const path = require("path");
const viewsPath = path.join(__dirname + "/../views");
const db = require("../config/db");
router.use("/", express.static(viewsPath + "/card"));
const controller_card = require("../controllers/cards.controller");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');



router.get("/", async (req, res, next) => {

    res.sendFile((viewsPath + "/card/cards.html"));


   const url = req.url;
   
    if (url.includes('cards=')) {
       
    const urlSplit = url.split('cards=');
    const url_wins = urlSplit[1] 
    const url_wins_split = url_wins.split('&')
    console.log(url_wins_split[0], 'url_wins_split[0]');

    const urlSplit2 = url.split('emailW=');
    const email = urlSplit2[1]
    const emailSplit = email.split('cards=')

    console.log( emailSplit[0], 'emailSplit[0]');

        

        res.cookie('wins_cards' ,"wins_cards" + url_wins_split[0]  +   "emailW" + emailSplit[0], { maxAge: 900000 });
      
    //   window.localStorage.setItem('wins_cards', url_wins_split[0]);
   }
 

   if (url.includes('qr_profile')) {
    const urlSplit = url.split('phone=');
    const phone = urlSplit[1]
    const phoneSplit = phone.split('email=')


    const urlSplit2 = urlSplit[1].split('email=');
    const email = urlSplit2[1]
    const emailSplit = email.split('idUser=')


    const urlSplit3 = url.split('idUser=');
  
    

    
    res.cookie('qr_profile',  "phone" + phoneSplit[0]  + "email" + emailSplit[0] , { maxAge: 900000 });
   
   }
   




}
);

router.post("/", async (req, res) => {
    const data = req.body;
    const email = data.email
    console.log(data, "data");
    const phone = data.phone

    const codeShope = data.codeShope
    const email_b = data.email_B

    if( email && phone && codeShope){

        const phoneStr = phone.toString();

    if (Check.checkEmail(email + email_b + phoneStr) === false) {
        console.log("checkEmail");
        return false
    }

   if (Check.CheckPassword( codeShope) === false) {
        return false
    }
}
   

  async  function check_cookie() {
     const email_B = data.email_B;

    console.log(data.email_B, "email_B");

    // const map = new Map(Object.entries(data.Order));
    // console.log(map , "map");
    const emailCookie = data.emailCookie;

    if (Check.checkEmail(emailCookie) === false) {
        console.log("checkEmail emailCookie");
        return false
    }

    console.log("emailCookieeeee", emailCookie);

    const dataverify = `${email_B}123`
    try {

    const decoded = jwt.verify(emailCookie, 'secretkey');
    console.log("decoded", decoded.hash);
    // console.log(decoded.iat ,"iat");

    const compare = bcrypt.compareSync(dataverify, decoded.hash);
    // console.log(compare, "compare");

    return compare;
    }
    catch (err) {
    console.log(err);
    return false
    }

    }
   await check_cookie();

console.log(await check_cookie(), "check_cookie()");

    if (check_cookie() === false){
        console.log(checkEmail(), "check_cookie()");
        res.send({ message: 'קוד שששג ' });
        return false
    }

    if(data.name_id_goral == true && await check_cookie() == true){

        if (Check.checkEmail(data.email_B) === false) {
            return false
        }

        let sql_business = `select * from business where email = '${data.email_B}' `
        db.execute(sql_business,async function (err, result) {
          if (err) throw err;
          // console.log(result);
          if (result.length > 0) {
            console.log('user exist');
            // res.send({ status: 'exist' });
            const codOrder = result[0].codOrder;
            console.log("codOrder" , codOrder);
            let sql_name_id_goral = `select * from cards where codeShope = '${codOrder}' `
            db.execute(sql_name_id_goral, function (err, result) {
              if (err) throw err;
              // console.log(result);
              if (result.length > 0) {
                console.log('user exist');
                const reso = result
                res.send({ compare: true , reso : reso });
              } 
             
  
            }
            )
  
          } 
          else {
            console.log('user not exist');
            // res.send({ status: 'not exist' });
          }
  
        }
        )
  
  
  
      }
   
    async function checkEmail() {


        let sql = `SELECT * FROM users WHERE email = '${email}'  AND  phone = '${phone}'`;
        db.execute(sql, async function (err, result) {
            if (err) throw err;

            if (result.length > 0 && result[0].verify == 'verify') {
                console.log('exsists user')


                const randomCode = Math.floor(Math.random() * 1000000 + 10);

                let sqlCodeShope = `SELECT * FROM business WHERE email = '${email_b}'`;
                db.execute(sqlCodeShope, async function (err, result) {
                    if (err) throw err;
                    // console.log('result cooodddd' , result[0].codOrder);

                    const name_shope = result[0].business_name;
                    const name_cards = data.name_id_goral.split('-');
                    console.log( name_cards , 'name_cards');


                    const str_name_cards = name_cards[0].toString() + name_cards[1].toString() 

                    if(Check.CheckPassword(str_name_cards) === false){
                        console.log('Check.CheckPassword(name_cards) xxxxxx false');
                        return false
                    }


                    try {
                        if (result.length > 0 && bcrypt.compareSync(codeShope, result[0].codeShope)) {

                           
                            const codOrder = result[0].codOrder;
                            // console.log( codOrder  , 'codOrder' , result[0].codOrder);
                            const random = Math.floor(Math.random() * 1000000000000000 + 10);
                            const string = Math.random().toString(36).substring(2, 6).toUpperCase();
                            const card = string + randomCode +  codOrder 
                            console.log(card, 'card');
                            let if_win = null

                            let sqlCards = `insert into cards_users (email , id_goral , codeShope , num_cards , name_card ,if_win, name_shope ,card) values ('${email}' , '${name_cards[0]}' , '${codOrder}' , 1 , '${name_cards[1]}' ,'${if_win}',  '${name_shope}' , '${card}')`;
                            db.execute(sqlCards, async function (err, result) {

                                if (err) throw err;
                                console.log('result' , result);
                                if (result) {
                                    console.log('result' , result);

                                    let qslRemove_Cards_Business = `UPDATE cards SET num_cards = num_cards - 1 WHERE codeShope = '${codOrder}' AND id_goral = '${name_cards[0]}' `
                                    
                                        db.execute(qslRemove_Cards_Business, async function (err, result) {

                                            if (err) throw err;
                                            console.log("rmove_cards_to_businness");

                                
                                        });



                                                     

                                    res.status(200).json({ message: true});
                                }
                                else {
                                    res.status(200).json({ message: 'הקוד לא נמצא' });
                                }
                            }
                        
                        )
                    }


                                else {
                                    res.status(200).json({ message: 'הקוד לא נמצא' });
                                }
                            }
                    catch (err) {
                                console.log(err);
                            }
                        }
                )
            }
            else {
                console.log('no exsists email');
                res.send({ message: false  });

            }
        });
    }

if (data.add_card) {
     checkEmail();


}

}
)

router.delete("/", async (req, res) => {

    const data = req.body;
    const email = data.email;

    const deletCode = data.deletCode;

    if (Check.CheckPassword(deletCode) === false) {
        return false
    }

    if (Check.checkEmail(email)  === false){
        return false
    }
  

    // let status = []

    console.log('data', data);
    if (data.deletCode) {
        console.log('data.email', data.email);

        let myWins = `SELECT * FROM users WHERE email = '${data.email}'`;
        db.execute(myWins, function (err, result) {
            if (err) throw err;


            if (result.length > 0) {
                console.log('result win 295', result);


                let sqlCards_users =  `SELECT * FROM cards_users WHERE email = '${data.email}' AND card = '${data.deletCode}' AND if_win = 'yes'`
                db.execute(sqlCards_users, function (err, result) {
                    if (err) throw err;
                    console.log('result win 301', result);

                    if (result.length > 0) {
                        console.log('result win 304', result);

                        let sqlCards_users = `DELETE FROM cards_users WHERE email = '${data.email}' AND card = '${data.deletCode}' AND if_win = 'yes'`;
                        db.execute(sqlCards_users, function (err, result) {
                            if (err) throw err;
                            console.log('result win 304', result);
                        res.status(200).json({ message: true , cards : result });

                        }
                        )
                    }
                    else {
                        console.log('result win 307', result);
                        res.status(200).json({  cards : null });
                    }
                }
                )


            }
            else {
                console.log('no exsists email win');
                res.send({ message: false });
                try {
                    // res.send({ message: false });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });


    }


})



module.exports = router;
