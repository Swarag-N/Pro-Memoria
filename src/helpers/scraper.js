const cheerio = require("cheerio");
const fs = require("fs");

const html_file = fs.readFileSync('./tt.html').toString();
const $ = cheerio.load(html_file);
let dataJSON = [];

// removes \t and \n between strings
let extremeTrim = (str) => {
    str = str.replace(/\t/g,'');
    str = str.replace(/\n/g,' ');
    return str;
}

// extracting course info
let third = (str) => {
    let res = str.split("-");
    return res;
};

// extracting slots
let eight = (str) => {
    let res = str.split("+");
    // Poping out Venue
    last = res.pop()
    res.push(last.split(" - ")[0])
    console.log(res)
    return res;
};

// extracting credits info
let fourth = (str) => {
    let res = str.split(' ');
    return res;
}

// Parsing Starts here
let tableData = [], len = $('.table > tbody:nth-child(1) > tr').length-2;
$('.table > tbody:nth-child(1) > tr').each((index,element)=>{
    if(index > 2 && index <= len) {
        let row = '.table > tbody:nth-child(1) > tr:nth-child('+index+') > td';
        let subData = [];
        $(row).each((subindex,subelement)=>{
            subData.push(extremeTrim($(subelement).text().trim()));
        });
        tableData.push(subData);
    }
});
console.log(tableData);

// saved tableData array converts to JSON here 
for(let i = 0; i < tableData.length; i++) {
    let j = {}, creditSum = 0;
    j.slot = eight(tableData[i][7]);

    // entering course info
    let courseInfo = third(tableData[i][2]), res = '';
    j.type = courseInfo.pop();
    j.CCode = courseInfo.shift();
    for(let i = 0; i<courseInfo.length;i++)
        res += courseInfo[i].trim()+' ';
    res = res.trim();
    j.CName = res;

    j.LTPJC = fourth(tableData[i][3]);
    j.category = tableData[i][4];
    j.classRoom = tableData[i][8];
    j.fName = tableData[i][9];
    
    creditSum += j.LTPJC;
    // console.log(j);
    dataJSON.push(j);
}

// console.log(dataJSON)

fs.writeFileSync('./output.json',JSON.stringify(dataJSON))