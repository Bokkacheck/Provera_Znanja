let http = require("http")
const fs = require("fs")
const qs = require("query-string")
const url = require("url")
let artikli = [{ id: 1, naziv: "Automobil", cena: "2000", imeKompanije: "SMB" }, { id: 2, naziv: "Motor", cena: "1000", imeKompanije: "SMB" }, { id: 3, naziv: "Frizider", cena: "Markovic", imeKompanije: "Gorenje" }];
let server = http.createServer((req, res) => {
    let q = url.parse(req.url, true, false);
    console.log("Request-> " + q.pathname);
    if (req.method == "GET") {
        if (q.pathname == "/") {
            res.writeHead(200);
            res.end(fs.readFileSync("index.html"))
        }
        else if (q.pathname == '/sviArtikli') {
            if (q.query.imeKompanije == "") {
                res.end(JSON.stringify(artikli))
            } else {
                res.end(JSON.stringify(artikli.filter(a => a.imeKompanije == q.query.imeKompanije)))
            }
        }
    } else if (req.method == "POST") {
        HandleRequest(req, res);
    }
}).listen(5000)
function HandleRequest(req, res) {
    let body = "";
    req.on("data", (data) => {
        body += data;
    })
    req.on("end", () => {
        PostRoutes(req, res, qs.parse(body))
    })
}
function PostRoutes(req, res, data) {
    let q = url.parse(req.url, true, false);
    if (q.pathname == '/dodajArtikal') {
        if(artikli.find(a=>a.id==data.id)==undefined){
            artikli.push(data);
            res.end(JSON.stringify(artikli))
        }else{
            res.end(JSON.stringify("greska"))
            return;
        }
    }
    else if (q.pathname == '/obrisiArtikal') {
        artikli = artikli.filter(a => a.id != data.id)
        res.end(JSON.stringify(artikli))
    } else if (q.pathname == '/izmeniArtikal') {
        artikal = artikli.find(a => a.id == data.id)
        if(artikal==undefined){
            res.end(JSON.stringify("greska"))
        }else{
            artikal.naziv = data.naziv;
            artikal.cena = data.cena;
            artikal.imeKompanije = data.imeKompanije;
            res.end(JSON.stringify(artikli))
            return;
        }
    }
}