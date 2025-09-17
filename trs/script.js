class Queen {
    constructor(name, acting, comedy, dance, design, improv, runway, lipsync, image = "noimage", custom = false) {
        this.trackRecord = [];
        this.miniEpisode = [];
        this.runwayScore = 0;
        this.lipsyncScore = 0;
        this.performanceScore = 0;
        this.favoritism = 0;
        this.unfavoritism = 0;
        this.ppe = 0;
        this.stars = 0;
        this.episodesOn = 0;
        this.rankP = 0;
        this.ogPlace = 0;
        this.title = "";
        this._name = name;
        this._actingStat = acting;
        this._comedyStat = comedy;
        this._danceStat = dance;
        this._designStat = design;
        this._improvStat = improv;
        this._runwayStat = runway;
        this._lipsyncStat = lipsync;
        if (image === "noimage") {
            this.image = "images/queens/noimage.png";
        } else if (custom === true) {
            this.image = image;
        } else {
            this.image = "images/queens/" + image + ".webp";
        }
    }
    _calculateScores(min, max, stat = 0) {
        let score = randomNumber(min, max);
        return score - stat;
    }
    getName() {
        return this._name;
    }
    getLipSyncStat() {
        return this._lipsyncStat;
    }
    getActing() {
        this.performanceScore = this._calculateScores(15, 35, this._actingStat);
    }
    getComedy() {
        this.performanceScore = this._calculateScores(15, 35, this._comedyStat);
    }
    getMarketing() {
        this.performanceScore = this._calculateScores(25, 45, this._comedyStat + this._actingStat);
    }
    getDance() {
        this.performanceScore = this._calculateScores(15, 35, this._danceStat);
    }
    getDesign() {
        this.performanceScore = this._calculateScores(15, 35, this._designStat);
    }
    getRunwayChallenge() {
        this.performanceScore = this._calculateScores(15, 35, this._runwayStat);
    }
    getImprov() {
        this.performanceScore = this._calculateScores(15, 35, this._improvStat);
    }
    //special 'gets':
    getSnatch() {
        this.performanceScore = this._calculateScores(25, 45, this._improvStat + this._comedyStat);
    }
    getRusical() {
        this.performanceScore = this._calculateScores(25, 45, this._danceStat + this._lipsyncStat);
    }
    getBall() {
        this.performanceScore = this._calculateScores(25, 45, this._designStat + this._runwayStat);
    }
    getRumix() {
        this.performanceScore = this._calculateScores(25, 45, this._danceStat + this._improvStat);
    }
    getTalentShow() {
        this.performanceScore = this._calculateScores(15, 35, randomNumber(1, 35));
    }
    getFinale() {
        this.finaleScore = this.favoritism - this.unfavoritism;
    }
    getRunway() {
        this.runwayScore = this._calculateScores(12, 35, this._runwayStat);
    }
    getLipsync() {
        this.lipsyncScore = this._calculateScores(0, this._lipsyncStat, this.unfavoritism) + this.favoritism;
    }
    getASLipsync() {
        this.lipsyncScore = this._calculateScores(0, this._lipsyncStat);
    }
    addToTrackRecord(placement) {
        this.trackRecord.push(placement);
    }
    editTrackRecord(added) {
        this.trackRecord[this.trackRecord.length - 1] += added;
    }
}

// CUSTOM QUEENS
let customQueens = [];

if (localStorage.getItem("customs") != null) {
    let stored = JSON.parse(localStorage.getItem("customs") || "[]");

    customQueens = stored.map(q => {
        let template = new Queen('', 0, 0, 0, 0, 0, 0, 0, '');
        Object.assign(template, q);
        template.custom = true;
        return template;
    });
}

let allCustomQueens = [...customQueens];
if (document.location.href.includes("custom")) {
    const previewImg = document.querySelector("#queen-preview img");
    const previewName = document.querySelector("#queen-preview p");

    function saveCustoms() {
        localStorage.setItem("customs", JSON.stringify(customQueens));
        refreshCustomSelect();
    }

    function refreshCustomSelect() {
        const select = document.getElementById("custom-remove");
        select.innerHTML = "";
        customQueens.forEach((q, i) => {
            let opt = document.createElement("option");
            opt.value = i;
            opt.textContent = q._name;
            select.appendChild(opt);
        });
    }

    function updatePreview() {
        const name = document.getElementById("name").value || "Unnamed Queen";
        const pic = document.getElementById("pic").value || "images/queens/noimage.png";

        previewName.textContent = name;
        previewImg.src = pic;
    }

    function createCustom() {
        const name = document.getElementById("name").value.trim();
        let pic = document.getElementById("pic").value.trim();
        if (pic === "") {
            pic = "noimage";
        }

        if (!name) {
            alert("Theres no name...");
            return;
        }

        let queen = new Queen(
            name,
            parseInt(document.getElementById("acting").value),
            parseInt(document.getElementById("comedy").value),
            parseInt(document.getElementById("dance").value),
            parseInt(document.getElementById("design").value),
            parseInt(document.getElementById("improv").value),
            parseInt(document.getElementById("runway").value),
            parseInt(document.getElementById("lipsync").value),
            pic,
            true
        );

        customQueens.push(queen);
        saveCustoms();
        updatePreview();
    }

    function editCustomQueen() {
        const select = document.getElementById("custom-remove");
        const index = parseInt(select.value);

        if (isNaN(index)) {
            alert("Pick a queen to edit....");
            return;
        }

        let q = customQueens[index];

        document.getElementById("name").value = q._name;
        document.getElementById("pic").value = q.image;
        document.getElementById("acting").value = q._actingStat;
        document.getElementById("comedy").value = q._comedyStat;
        document.getElementById("dance").value = q._danceStat;
        document.getElementById("design").value = q._designStat;
        document.getElementById("improv").value = q._improvStat;
        document.getElementById("runway").value = q._runwayStat;
        document.getElementById("lipsync").value = q._lipsyncStat;

        updateStatLabels();
        updatePreview();

        customQueens.splice(index, 1);
        saveCustoms();
    }

    function removeCustomQueen() {
        const select = document.getElementById("custom-remove");
        const index = parseInt(select.value);

        if (isNaN(index)) {
            alert("Pick a queen to remove...");
            return;
        }

        if (confirm(`Remove ${customQueens[index]._name}?`)) {
            customQueens.splice(index, 1);
            saveCustoms();
            updatePreview();
        }
    }

    function randomizeStats() {
        ["acting", "comedy", "dance", "design", "improv", "runway", "lipsync"].forEach(stat => {
            document.getElementById(stat).value = randomNumber(1, 15);
        });
        updateStatLabels();
    }

    function updateStatLabels() {
        document.getElementById("acting-text").textContent = `Acting Skill: ${document.getElementById("acting").value}`;
        document.getElementById("comedy-text").textContent = `Comedy Skill: ${document.getElementById("comedy").value}`;
        document.getElementById("dance-text").textContent = `Dance Skill: ${document.getElementById("dance").value}`;
        document.getElementById("design-text").textContent = `Design Skill: ${document.getElementById("design").value}`;
        document.getElementById("improv-text").textContent = `Improv Skill: ${document.getElementById("improv").value}`;
        document.getElementById("runway-text").textContent = `Runway Skill: ${document.getElementById("runway").value}`;
        document.getElementById("lipsync-text").textContent = `Lipsync Skill: ${document.getElementById("lipsync").value}`;
    }

    document.querySelectorAll("input[type=range]").forEach(input => {
        input.addEventListener("input", updateStatLabels);
    });

    document.getElementById("name").addEventListener("input", updatePreview);
    document.getElementById("pic").addEventListener("input", updatePreview);

    updateStatLabels();
    updatePreview();
    refreshCustomSelect();
}

//QUEENS:
//SEASON 1:
let akashia = new Queen("Akashia", 3, 2, 7, 3, 2, 7, 11, "Akashia");
let bebe = new Queen("BeBe Zahara Benet", 6, 7, 8, 12, 6, 10, 9, "BeBe");
let jade = new Queen("Jade Sotomayor", 3, 3, 8, 7, 3, 7, 7, "Jade");
let ninaf = new Queen("Nina Flowers", 7, 5, 5, 11, 6, 10, 6, "NinaFlowers");
let ongina = new Queen("Ongina", 9, 8, 7, 9, 10, 9, 8, "Ongina");
let rebecca = new Queen("Rebecca Glasscock", 3, 3, 6, 4, 2, 6, 5, "Rebecca");
let shannel = new Queen("Shannel", 7, 8, 7, 9, 9, 13, 10, "Shannel");
let tammie = new Queen("Tammie Brown", 6, 7, 5, 7, 6, 7, 6, "Tammie");
let victoria = new Queen("Victoria 'Porkchop' Parker", 3, 6, 4, 3, 6, 5, 4, "Victoria");
let us_season1 = [akashia, bebe, jade, ninaf, ongina, rebecca, shannel, tammie, victoria];
//SEASON 2:       acting, comedy, dance, design, improv, runway, lipsync
let jessica = new Queen("Jessica Wild", 9, 8, 10, 11, 8, 9, 11, "Jessica");
let jujubee = new Queen("Jujubee", 9, 11, 7, 8, 12, 6, 12, "Jujubee");
let morgan = new Queen("Morgan McMichaels", 6, 6, 10, 9, 5, 10, 10, "Morgan");
let mystique = new Queen("Mystique Summers", 4, 5, 3, 3, 3, 5, 6, "Mystique");
let nicole = new Queen("Nicole Paige Brooks", 4, 4, 4, 6, 4, 7, 6, "Nicole");
let pandora = new Queen("Pandora Boxx", 12, 11, 6, 8, 10, 8, 7, "Pandora");
let raven = new Queen("Raven", 5, 8, 9, 10, 5, 8, 11, "Raven");
let sahara = new Queen("Sahara Davenport", 6, 6, 10, 4, 6, 7, 10, "Sahara");
let shangela = new Queen("Shangela", 14, 13, 10, 3, 9, 9, 12, "Shangela");
let sonique = new Queen("Kylie Sonique Love", 11, 9, 10, 9, 8, 11, 11, "Kylie");
let tatianna = new Queen("Tatianna", 8, 11, 8, 8, 10, 8, 10, "Tatianna");
let tyra = new Queen("King Tyra", 11, 7, 8, 11, 8, 9, 10, "Tyra");
let us_season2 = [jessica, jujubee, morgan, mystique, nicole, pandora, raven, sahara, shangela, sonique, tatianna, tyra];
//SEASON 3:
let alexis = new Queen("Alexis Mateo", 14, 12, 9, 7, 10, 8, 12, "Alexis");
let carmen = new Queen("Carmen Carrera", 3, 8, 6, 4, 3, 7, 7, "Carmen");
let delta = new Queen("Delta Work", 4, 6, 5, 5, 5, 7, 7, "Delta");
let india = new Queen("India Ferrah", 6, 4, 8, 6, 3, 10, 9, "India");
let manila = new Queen("Manila Luzon", 12, 11, 7, 14, 10, 13, 11, "Manila");
let mariah = new Queen("Mariah Paris Balenciaga", 6, 4, 7, 8, 4, 9, 8, "Mariah");
let mimi = new Queen("Mimi Imfurst", 11, 6, 6, 10, 7, 8, 6, "Mimi");
let phoenix = new Queen("Phoenix", 3, 3, 6, 5, 3, 5, 4, "Phoenix");
let raja = new Queen("Raja", 11, 13, 6, 14, 12, 14, 9, "Raja");
let stacey = new Queen("Stacy Layne Matthews", 6, 7, 5, 4, 10, 5, 6, "Stacy");
let venus = new Queen("Venus D-Lite", 4, 5, 8, 2, 3, 5, 2, "Venus");
let yara = new Queen("Yara Sofia", 11, 9, 9, 13, 7, 10, 8, "Yara");
let us_season3 = [alexis, carmen, delta, india, manila, mariah, mimi, phoenix, raja, shangela, stacey, venus, yara];
//SEASON 4:
let alisa = new Queen("Alisa Summers", 4, 4, 5, 2, 3, 5, 4, "Alisa");
let chad = new Queen("Chad Michaels", 11, 10, 8, 9, 12, 10, 8, "Chad");
let dida = new Queen("Dida Ritz", 8, 7, 8, 5, 7, 7, 12, "Dida");
let jiggly = new Queen("Jiggly Caliente", 4, 6, 9, 4, 4, 7, 10, "Jiggly");
let kenya = new Queen("Kenya Olivera", 9, 6, 6, 6, 8, 7, 8, "Kenya");
let leshauwn = new Queen("Lashauwn Beyond", 4, 4, 6, 11, 5, 7, 7, "Lashauwn");
let latrice = new Queen("Latrice Royale", 11, 8, 9, 8, 7, 9, 13, "Latrice");
let madame = new Queen("Madame LaQueer", 4, 7, 6, 5, 9, 7, 6, "Madame");
let milan = new Queen("Milan", 4, 5, 9, 7, 5, 8, 10, "Milan");
let phiphi = new Queen("Jaremi Carey", 13, 9, 8, 10, 10, 10, 8, "PhiPhi");
let sharon = new Queen("Sharon Needles", 12, 12, 8, 12, 11, 10, 8, "SharonNeedles");
let princess = new Queen("The Princess", 4, 4, 5, 7, 4, 7, 7, "Princess");
let willam = new Queen("Willam", 10, 8, 7, 10, 10, 9, 8, "Willam");
let us_season4 = [alisa, chad, dida, jiggly, kenya, leshauwn, latrice, madame, milan, phiphi, sharon, princess, willam];
//ALL STARS 1:
let allstars_1 = [alexis, chad, jujubee, latrice, manila, mimi, ninaf, pandora, raven, shannel, tammie, yara];
//SEASON 5:   acting, comedy, dance, design, improv, runway, lipsync
let alaska = new Queen("Alaska", 15, 14, 7, 8, 14, 10, 11, "Alaska");
let alyssa = new Queen("Alyssa Edwards", 4, 6, 15, 6, 10, 9, 12, "Alyssa");
let coco = new Queen("Coco Montrese", 10, 10, 11, 9, 7, 9, 15, "Coco");
let detox = new Queen("Detox", 10, 9, 9, 9, 8, 12, 11, "Detox");
let honey = new Queen("Honey Mahogany", 10, 3, 3, 6, 6, 8, 4, "Honey");
let ivy = new Queen("Ivy Winters", 11, 4, 8, 12, 7, 10, 7, "Ivy");
let jadejolie = new Queen("Jade Jolie", 5, 7, 8, 7, 8, 7, 8, "JadeJ");
let jinkx = new Queen("Jinkx Monsoon", 15, 15, 9, 8, 15, 9, 8, "Jinkx");
let lineysha = new Queen("Lineysha Sparx", 10, 4, 7, 11, 5, 9, 8, "Lineysha");
let monica = new Queen("Monica Beverly Hillz", 4, 4, 6, 6, 4, 9, 8, "Monica");
let penny = new Queen("Penny Tration", 4, 5, 4, 5, 5, 5, 4, "Penny");
let roxxxy = new Queen("Roxxxy Andrews", 8, 9, 7, 13, 8, 11, 15, "Roxxxy");
let serena = new Queen("Serena ChaCha", 3, 3, 7, 4, 5, 5, 8, "Serena");
let vivienne = new Queen("Vivienne Pinay", 7, 3, 4, 5, 3, 6, 4, "Vivienne");
let us_season5 = [alaska, alyssa, coco, detox, honey, ivy, jadejolie, jinkx, lineysha, monica, penny, roxxxy, serena, vivienne];
//SEASON 6:
let adore = new Queen("Adore Delano", 9, 11, 9, 6, 9, 8, 11, "Adore");
let april = new Queen("April Carrión", 5, 5, 6, 9, 5, 9, 8, "April");
let bendelacreme = new Queen("BenDeLaCreme", 12, 12, 11, 10, 15, 10, 9, "BenDeLaCreme");
let bianca = new Queen("Bianca Del Rio", 11, 15, 7, 13, 15, 10, 5, "Bianca");
let courtney = new Queen("Courtney Act", 11, 8, 10, 10, 10, 12, 9, "Courtney");
let darienne = new Queen("Darienne Lake", 10, 8, 6, 5, 9, 9, 13, "Darienne");
let gia = new Queen("Gia Gunn", 10, 4, 8, 8, 4, 8, 9, "Gia");
let joslyn = new Queen("Joslyn Fox", 6, 7, 8, 6, 8, 8, 11, "Joslyn");
let kelly = new Queen("Kelly Mantle", 6, 6, 5, 5, 4, 7, 4, "Kellu");
let laganja = new Queen("Laganja Estranja", 9, 5, 14, 8, 6, 10, 15, "Laganja");
let magnolia = new Queen("Magnolia Crawford", 4, 5, 6, 4, 5, 7, 4, "Magnolia");
let milk = new Queen("Milk", 6, 6, 7, 8, 8, 7, 7, "Milk");
let trinityk = new Queen("Trinity K. Bonet", 9, 9, 13, 12, 4, 10, 15, "TrinityKB");
let vivacious = new Queen("Vivacious", 4, 5, 5, 4, 4, 7, 7, "Vivacious");
let us_season6 = [adore, april, bendelacreme, bianca, courtney, darienne, gia, joslyn, kelly, laganja, magnolia, milk, trinityk, vivacious];
//SEASON 7:
let ginger = new Queen("Ginger Minj", 14, 12, 8, 9, 15, 7, 12, "Ginger");
let jaidynn = new Queen("Jaidynn Diore Fierce", 9, 7, 8, 6, 6, 7, 11, "Jaidynn");
let jasmine = new Queen("Jasmine Masters", 3, 4, 6, 5, 2, 7, 6, "Jasmine");
let kandy = new Queen("Kandy Ho", 4, 4, 7, 5, 4, 7, 10, "KandyH");
let katya = new Queen("Katya", 9, 12, 9, 7, 12, 10, 10, "Katya");
let kennedy = new Queen("Kennedy Davenport", 9, 8, 10, 8, 11, 10, 14, "Kennedy");
let max = new Queen("Max", 10, 7, 5, 8, 4, 8, 5, "Max");
let fame = new Queen("Miss Fame", 8, 4, 5, 11, 3, 10, 5, "MissFame");
let kasha = new Queen("Mrs. Kasha Davis", 11, 8, 10, 7, 6, 9, 7, "Kasha");
let pearl = new Queen("Pearl", 7, 10, 8, 9, 10, 9, 5, "Pearl");
let sashab = new Queen("Frisbee Jenkins", 6, 6, 4, 4, 6, 6, 4, "SashaB");
let tempest = new Queen("Tempest DuJour", 6, 6, 5, 3, 6, 7, 4, "Tempest");
let trixie = new Queen("Trixie Mattel", 13, 10, 6, 10, 11, 10, 5, "Trixie");
let violet = new Queen("Violet Chachki", 6, 7, 8, 15, 8, 13, 8, "Violet");
let us_season7 = [ginger, jaidynn, jasmine, kandy, katya, kennedy, max, fame, kasha, pearl, sashab, tempest, trixie, violet];
//SEASON 8:  acting, comedy, dance, design, improv, runway, lipsync
let acid = new Queen("Acid Betty", 9, 4, 7, 10, 5, 11, 7, "Acid");
let bob = new Queen("Bob The Drag Queen", 15, 15, 8, 9, 15, 8, 12, "Bob");
let chichi = new Queen("Chi Chi DeVayne", 8, 4, 13, 8, 6, 8, 13, "ChiChi");
let cynthia = new Queen("Cynthia Lee Fontaine", 4, 4, 7, 6, 4, 7, 6, "Cynthia");
let dax = new Queen("Dax ExclamationPoint", 5, 6, 6, 5, 6, 5, 4, "Dax");
let derrick = new Queen("Derrick Barry", 7, 7, 8, 8, 9, 7, 8, "Derrick");
let kim = new Queen("Kim Chi", 10, 7, 4, 15, 8, 13, 4, "Kim");
let laila = new Queen("Laila McQueen", 6, 6, 4, 7, 6, 8, 7, "Laila");
let naomi = new Queen("Naomi Smalls", 9, 7, 10, 14, 10, 12, 11, "Naomi");
let naysha = new Queen("Naysha Lopez", 7, 5, 7, 5, 4, 10, 7, "Naysha");
let robbie = new Queen("Robbie Turner", 4, 5, 6, 4, 3, 6, 6, "Robbie");
let thorgy = new Queen("Thorgy Thor", 14, 9, 6, 9, 13, 9, 8, "Thorgy");
let us_season8 = [acid, bob, chichi, cynthia, dax, derrick, kim, laila, naomi, naysha, robbie, thorgy];
//ALL STARS 2:
let allstars_2 = [adore, alaska, alyssa, coco, detox, ginger, katya, phiphi, roxxxy, tatianna];
//SEASON 9:
let aja = new Queen("Aja", 4, 8, 12, 11, 9, 10, 11, "Aja");
let alexism = new Queen("Alexis Michelle", 8, 8, 11, 10, 13, 10, 10, "AlexisM");
let charlie = new Queen("Charlie Hides", 10, 6, 5, 7, 4, 9, 2, "Charlie");
let eureka = new Queen("Eureka!", 9, 11, 8, 10, 13, 10, 12, "Eureka");
let farrah = new Queen("Farrah Moan", 9, 4, 7, 3, 6, 8, 7, "Farrah");
let jaymes = new Queen("Jaymes Mansfield", 8, 9, 5, 9, 9, 10, 7, "Jaymes");
let kimora = new Queen("Kimora Blac", 5, 5, 4, 6, 5, 8, 7, "Kimora");
let ninab = new Queen("Nina Bo'Nina Brown", 4, 8, 10, 9, 10, 10, 11, "NinaBB");
let peppermint = new Queen("Peppermint", 11, 9, 10, 9, 4, 7, 13, "Peppermint");
let sasha = new Queen("Sasha Velour", 9, 10, 8, 10, 11, 13, 11, "Sasha");
let shea = new Queen("Shea Couleé", 11, 12, 15, 12, 11, 15, 15, "Shea");
let trinity = new Queen("Trinity The Tuck", 13, 11, 9, 15, 10, 13, 11, "TrinityTT");
let valentina = new Queen("Valentina", 11, 7, 10, 9, 9, 9, 10, "Valentina");
let us_season9 = [aja, alexism, charlie, cynthia, eureka, farrah, jaymes, kimora, ninab, peppermint, sasha, shea, trinity, valentina];
//ALL STARS 3:
let allstars_3 = [aja, bebe, bendelacreme, chichi, kennedy, milk, morgan, shangela, thorgy, trixie];
//SEASON 10:
let aquaria = new Queen("Aquaria", 6, 11, 8, 15, 12, 14, 11, "Aquaria");
let asia = new Queen("Asia O'Hara", 11, 9, 6, 6, 7, 9, 9, "Asia");
let blair = new Queen("Blair St. Clair", 9, 8, 6, 10, 8, 8, 7, "Blair");
let dusty = new Queen("Dusty Ray Bottoms", 8, 8, 6, 7, 6, 7, 6, "Dusty");
let kalorie = new Queen("Kalorie K. Williams", 6, 6, 6, 5, 7, 7, 8, "Kalorie");
let kameron = new Queen("Kameron Michaels", 5, 8, 14, 10, 8, 8, 15, "Kameron");
let mayhem = new Queen("Mayhem Miller", 4, 8, 9, 13, 7, 9, 10, "Mayhem");
let miz = new Queen("Miz Cracker", 13, 11, 5, 12, 15, 9, 8, "Miz");
let monet = new Queen("Monét X Change", 11, 11, 14, 9, 10, 10, 15, "Monet");
let monique = new Queen("Mo Heart", 12, 8, 6, 10, 13, 12, 10, "Monique");
let vanessa = new Queen("Vanessa Vanjie", 9, 7, 13, 8, 9, 12, 11, "Vanjie");
let vixen = new Queen("The Vixen", 5, 4, 12, 9, 3, 8, 12, "Vixen");
let yuhua = new Queen("Yuhua Hamasaki", 4, 4, 6, 9, 6, 7, 7, "Yuhua");
let us_season10 = [aquaria, asia, blair, dusty, eureka, kalorie, kameron, mayhem, miz, monet, monique, vanessa, vixen, yuhua];
//ALL STARS 4:
let allstars_4 = [farrah, gia, jasmine, latrice, manila, monet, monique, naomi, trinity, valentina];
//SEASON 11:  acting, comedy, dance, design, improv, runway, lipsync
let akeria = new Queen("A'keria C. Davenport", 11, 9, 11, 8, 10, 13, 10, "Akeria");
let ariel = new Queen("Ariel Versace", 8, 6, 8, 5, 8, 8, 8, "Ariel");
let brooke = new Queen("Brooke Lynn Hytes", 8, 8, 13, 12, 8, 10, 13, "Brooke");
let honeyd = new Queen("Honey Davenport", 4, 6, 5, 7, 4, 9, 4, "HoneyD");
let kahanna = new Queen("Kahanna Montrese", 6, 6, 12, 8, 6, 13, 11, "Kahanna");
let mercedes = new Queen("Mercedes Iman Diamond", 4, 6, 4, 6, 6, 8, 8, "Mercedes");
let ninaw = new Queen("Nina West", 14, 11, 7, 9, 11, 9, 6, "NinaW");
let plastique = new Queen("Plastique Tiara", 11, 10, 10, 15, 8, 15, 9, "Plastique");
let rajah = new Queen("Ra'Jah O'Hara", 8, 8, 11, 12, 9, 12, 13, "Rajah");
let scarlet = new Queen("Scarlet Envy", 13, 9, 6, 13, 9, 11, 8, "Scarlet");
let shuga = new Queen("Shuga Cain", 10, 9, 7, 6, 7, 10, 7, "Shuga");
let silky = new Queen("Silky Nutmeg Ganache", 10, 10, 9, 8, 10, 10, 12, "Silky");
let soju = new Queen("Soju", 4, 4, 4, 4, 4, 4, 4, "Soju");
let yvie = new Queen("Yvie Oddly", 12, 7, 13, 12, 9, 12, 15, "Yvie");
let us_season11 = [akeria, ariel, brooke, honeyd, kahanna, mercedes, ninaw, plastique, rajah, scarlet, shuga, silky, soju, vanessa, yvie];
//SEASON 12:
let aiden = new Queen("Aiden Zhane", 9, 3, 6, 4, 3, 6, 6, "Aiden");
let brita = new Queen("Brita", 7, 8, 7, 4, 6, 8, 11, "Brita");
let crystal = new Queen("Crystal Methyd", 6, 8, 8, 9, 8, 12, 6, "CrystalM");
let dahlia = new Queen("Dahlia Sin", 4, 4, 6, 5, 5, 10, 4, "Dahlia");
let gigi = new Queen("Gigi Goode", 10, 11, 11, 13, 9, 12, 8, "Gigi");
let heidi = new Queen("Heidi N Closet", 9, 9, 11, 9, 12, 10, 13, "Heidi");
let jackie = new Queen("Jackie Cox", 11, 12, 6, 6, 13, 9, 11, "Jackie");
let jaida = new Queen("Jaida Essence Hall", 8, 5, 10, 15, 8, 13, 12, "Jaida");
let jan = new Queen("Jan", 8, 4, 12, 9, 5, 10, 9, "Jan");
let nicky = new Queen("Nicky Doll", 4, 4, 5, 12, 3, 11, 5, "Nicky");
let rock = new Queen("Rock M. Sakura", 6, 6, 6, 4, 8, 8, 7, "Rock");
let sherry = new Queen("Sherry Pie", 9, 8, 9, 8, 10, 11, 8, "SherryPie");
let widow = new Queen("Widow Von'Du", 11, 7, 13, 8, 11, 10, 15, "Widow");
let us_season12 = [aiden, brita, crystal, dahlia, gigi, heidi, jackie, jaida, jan, nicky, rock, sherry, widow];
//ALL STARS 5
let allstars_5 = [alexis, blair, derrick, india, jujubee, mariah, mayhem, miz, ongina, shea];
//SEASON 13
let denali = new Queen("Denali", 4, 8, 14, 9, 10, 11, 13, "Denali");
let elliott = new Queen("Elliott With 2 Ts", 5, 5, 12, 9, 3, 8, 11, "Elliott");
let mik = new Queen("Gottmik", 9, 11, 7, 14, 14, 15, 9, "Gottmik");
let joey = new Queen("Joey Jay", 6, 7, 6, 5, 5, 7, 7, "Joey");
let kahmora = new Queen("Kahmora Hall", 3, 4, 3, 5, 4, 12, 4, "Kahmora");
let kandym = new Queen("Kandy Muse", 11, 10, 10, 7, 8, 10, 14, "KandyM");
let lala = new Queen("LaLa Ri", 6, 8, 13, 7, 10, 9, 14, "LaLa");
let olivia = new Queen("Olivia Lux", 11, 5, 11, 10, 8, 11, 8, "Olivia");
let rose = new Queen("Rosé", 12, 11, 13, 8, 10, 10, 6, "Rose");
let symone = new Queen("Symone", 14, 7, 7, 9, 12, 13, 13, "Symone");
let tamisha = new Queen("Tamisha Iman", 7, 6, 7, 5, 6, 7, 7, "Tamisha");
let tina = new Queen("Tina Burner", 6, 6, 10, 5, 6, 8, 9, "TinaB");
let utica = new Queen("Utica Queen", 7, 4, 6, 15, 5, 12, 11, "Utica");
let us_season13 = [denali, elliott, mik, joey, kahmora, kandym, lala, olivia, rose, symone, tamisha, tina, utica];
//ALL STARS 6
let allstars_6 = [akeria, eureka, ginger, jan, jiggly, pandora, rajah, scarlet, serena, silky, sonique, trinityk, yara];
//SEASON 14:  acting, comedy, dance, design, improv, runway, lipsync
let alyssaH = new Queen("Alyssa Hunter", 5, 6, 7, 10, 7, 13, 8, "AlyssaH");
let angeria = new Queen("Angeria Paris VanMicheals", 13, 11, 10, 12, 9, 13, 11, "Angeria");
let bosco = new Queen("Bosco", 11, 12, 6, 7, 12, 11, 6, "Bosco");
let daya = new Queen("Daya Betty", 9, 8, 9, 9, 10, 10, 8, "DayaBetty");
let deja = new Queen("DeJa Skye", 9, 7, 9, 8, 13, 8, 8, "DeJa");
let jasmineK = new Queen("Jasmine Kennedie", 7, 6, 13, 7, 6, 10, 14, "JasmineK");
let jorgeous = new Queen("Jorgeous", 9, 7, 15, 10, 6, 11, 15, "Jorgeous");
let june = new Queen("June Jambalaya", 5, 6, 6, 4, 5, 6, 6, "June");
let kerri = new Queen("Kerri Colby", 6, 6, 5, 5, 6, 9, 6, "Kerri");
let kornbread = new Queen("Kornbread Jeté", 6, 7, 6, 6, 7, 8, 7, "Kornbread");
let cadmen = new Queen("Lady Camden", 12, 11, 12, 11, 7, 10, 11, "LadyCamden");
let maddy = new Queen("Maddy Morphosis", 8, 7, 6, 5, 6, 9, 7, "Maddy");
let orion = new Queen("Orion Story", 4, 6, 6, 5, 6, 6, 5, "Orion");
let willow = new Queen("Willow Pill", 11, 8, 7, 10, 10, 12, 8, "Willow");
let us_season14 = [alyssaH, angeria, bosco, daya, deja, jasmineK, jorgeous, june, kerri, kornbread, cadmen, maddy, orion, willow];
//SEASON 15
let amethyst = new Queen("Amethyst", 4, 8, 6, 5, 9, 8, 10, "Amethyst");
let anetra = new Queen("Anetra", 9, 7, 13, 11, 8, 11, 13, "Anetra");
let auraMayari = new Queen("Aura Mayari", 5, 5, 9, 7, 6, 9, 7, "AuraMayari");
let irene = new Queen("Irene The Alien", 4, 5, 4, 4, 4, 8, 6, "IreneDubois");
let jax = new Queen("Jax", 5, 6, 9, 8, 6, 8, 14, "Jax");
let loosey = new Queen("Loosey LaDuca", 10, 14, 9, 8, 13, 11, 9, "LooseyLaDuca");
let luxx = new Queen("Luxx Noir London", 10, 10, 9, 13, 9, 14, 9, "LuxxNoirLondon");
let malaysia = new Queen("Malaysia Babydoll Foxx", 9, 7, 7, 8, 6, 9, 8, "MalaysiaBabydollFoxx");
let marcia = new Queen("Marcia Marcia Marcia", 9, 9, 10, 8, 9, 8, 12, "MarciaMarciaMarcia");
let mistress = new Queen("Mistress Isabelle Brooks", 11, 10, 10, 10, 10, 13, 9, "MistressIsabelleBrooks");
let poppy = new Queen("Princess Poppy", 5, 6, 5, 5, 6, 6, 8, "PrincessPoppy");
let robin = new Queen("Robin Fierce", 7, 7, 6, 11, 7, 10, 9, "RobinFierce");
let salina = new Queen("Salina EsTitties", 9, 9, 9, 5, 7, 7, 11, "SalinaEsTitties");
let sashaColby = new Queen("Sasha Colby", 12, 8, 13, 11, 11, 15, 13, "SashaColby");
let spice = new Queen("Spice", 8, 6, 7, 8, 5, 11, 7, "Spice");
let sugar = new Queen("Sugar", 9, 7, 6, 6, 5, 11, 7, "Sugar");
let us_season15 = [amethyst, anetra, auraMayari, irene, jax, loosey, luxx, malaysia, marcia, mistress, poppy, robin, salina, sashaColby, spice, sugar];
//SEASON 16
let amandaTori = new Queen("Amanda Tori Meating", 9, 7, 7, 7, 7, 7, 9, "AmandaToriMeating");
let dawn = new Queen("Dawn", 8, 8, 8, 13, 8, 13, 7, "Dawn");
let geneva = new Queen("Geneva Karr", 5, 7, 10, 6, 8, 8, 11, "GenevaKarr");
let hershii = new Queen("Hershii LiqCour-Jeté", 4, 4, 4, 4, 4, 4, 4, "HershiiLiqCourJete");
let megami = new Queen("Megami", 9, 7, 10, 10, 9, 10, 12, "Megami");
let mhiya = new Queen("Mhi'ya Iman LePaige", 8, 6, 9, 9, 9, 9, 15, "MhiyaImanLePaige");
let mirage = new Queen("Mirage", 6, 7, 8, 7, 6, 9, 10, "Mirage");
let morphine = new Queen("Morphine Love Dion", 7, 6, 10, 10, 7, 11, 15, "MorphineLoveDion");
let nymphia = new Queen("Nymphia Wind", 10, 11, 12, 15, 8, 15, 12, "NymphiaWind");
let jane = new Queen("Plane Jane", 12, 12, 9, 9, 13, 11, 10, "PlaneJane");
let plasma = new Queen("Plasma", 13, 9, 9, 7, 8, 9, 10, "Plasma");
let qQueen = new Queen("Q", 12, 10, 8, 15, 8, 15, 8, "Q");
let sapphira = new Queen("Sapphira Cristál", 8, 11, 12, 10, 11, 13, 13, "SapphiraCristal");
let xunami = new Queen("Xunami Muse", 7, 6, 8, 8, 6, 10, 8, "XunamiMuse");
let us_season16 = [amandaTori, dawn, geneva, hershii, megami, mhiya, mirage, morphine, nymphia, jane, plasma, qQueen, sapphira, xunami];
// SEASON 17
let acacia = new Queen("Acacia Forgot", 7, 7, 7, 7, 7, 7, 7, "AcaciaForgot");
let arrietty = new Queen("Arrietty", 7, 7, 7, 7, 7, 7, 7, "Arrietty");
let crystalE = new Queen("Crystal Envy", 7, 7, 7, 7, 7, 7, 7, "CrystalEnvy");
let hormona = new Queen("Hormona Lisa", 7, 7, 7, 7, 7, 7, 7, "HormonaLisa");
let jewels = new Queen("Jewels Sparkles", 7, 7, 7, 7, 7, 7, 7, "JewelsSparkles");
let joella = new Queen("Joella", 7, 7, 7, 7, 7, 7, 7, "Joella");
let kori = new Queen("Kori King", 7, 7, 7, 7, 7, 7, 7, "KoriKing");
let lana = new Queen("Lana Ja'Rae", 7, 7, 7, 7, 7, 7, 7, "LanaJaRae");
let lexi = new Queen("Lexi Love", 7, 7, 7, 7, 7, 7, 7, "LexiLove");
let lucky = new Queen("Lucky Starzzz", 7, 7, 7, 7, 7, 7, 7, "LuckyStarzzz");
let lydia = new Queen("Lydia B Kollins", 7, 7, 7, 7, 7, 7, 7, "LydiaBKollins");
let onya = new Queen("Onya Nurve", 7, 7, 7, 7, 7, 7, 7, "OnyaNurve");
let samStar = new Queen("Sam Star", 7, 7, 7, 7, 7, 7, 7, "SamStar");
let suzie = new Queen("Suzie Toot", 7, 7, 7, 7, 7, 7, 7, "SuzieToot");
let us_season17 = [acacia, arrietty, crystalE, hormona, jewels, joella, kori, lana, lexi, lucky, lydia, onya, samStar, suzie];
//ALL STARS 9
let allstars_9 = [angeria, mik, jorgeous, ninaw, plastique, roxxxy, shannel, vanessa];
// ALL STARS 10
let allstars_10 = [acid, aja, bosco, alyssaH, cynthia, daya, olivia, phoenix, tina, deja, denali, ginger, irene, jorgeous, kerri, nicole, mistress, lydia];
let allstars_11 = [akeria, dawn, lucky, morgan, morphine, mystique, april, auraMayari, crystal, salina, silky, vivacious, hershii, jasmineK, joey, kennedy, samStar, shuga];
//DRUK SEASON 1
let baga = new Queen("Baga Chipz", 13, 12, 5, 5, 13, 8, 7, "Baga");
let blu = new Queen("Blu Hydrangea", 5, 9, 8, 10, 10, 12, 9, "Blu");
let cheryl = new Queen("Cheryl", 5, 5, 9, 5, 7, 7, 9, "Cheryl");
let crystaluk = new Queen("Crystal", 6, 5, 6, 9, 4, 8, 6, "Crystal");
let divina = new Queen("Divina De Campo", 11, 6, 9, 12, 9, 9, 9, "Divina");
let gothy = new Queen("Gothy Kendoll", 9, 7, 5, 8, 5, 9, 4, "Gothy");
let scaredy = new Queen("Scaredy Kat", 3, 5, 6, 4, 4, 7, 5, "Scaredy");
let sumting = new Queen("Sum Ting Wong", 8, 6, 6, 7, 6, 9, 8, "Sum");
let viv = new Queen("The Vivienne", 12, 13, 8, 10, 14, 11, 12, "TVivienne");
let vinegar = new Queen("Vinegar Strokes", 7, 6, 6, 4, 4, 6, 6, "Vinegar");
let uk_season1 = [baga, blu, cheryl, crystaluk, divina, gothy, scaredy, sumting, viv, vinegar];
// ALL STARS 7
let allstars_7 = [raja, jinkx, yvie, jaida, trinity, monet, shea, viv];
//DRUK SEASON 2
let awhora = new Queen("A'Whora", 7, 5, 8, 15, 10, 10, 8, "Awhora");
let asttina = new Queen("Asttina Mandella", 6, 6, 13, 8, 6, 10, 12, "Asttina");
let bimini = new Queen("Bimini", 11, 14, 10, 7, 11, 11, 11, "Bimini");
let cherry = new Queen("Cherry Valentine", 5, 6, 5, 7, 6, 11, 4, "Cherry");
let ellie = new Queen("Ellie Diamond", 10, 6, 7, 11, 8, 9, 8, "Ellie");
let ginny = new Queen("Ginny Lemon", 6, 6, 5, 5, 5, 8, 4, "Ginny");
let joe = new Queen("Joe Black", 5, 5, 4, 5, 4, 8, 5, "Joe");
let lawrence = new Queen("Lawrence Chaney", 13, 12, 5, 12, 9, 11, 10, "Lawrence");
let sister = new Queen("Sister Sister", 6, 8, 6, 4, 7, 8, 9, "Sister");
let tayce = new Queen("Tayce", 10, 9, 10, 5, 9, 12, 14, "Tayce");
let tia = new Queen("Tia Kofi", 11, 13, 10, 7, 11, 10, 10, "Tia");
let veronica = new Queen("Veronica Green", 6, 6, 10, 6, 5, 7, 8, "Veronica");
let uk_season2 = [awhora, asttina, bimini, cherry, ellie, ginny, joe, lawrence, sister, tayce, tia, veronica];
//DRUK SEASON 3
let anubis = new Queen("Anubis", 5, 5, 5, 4, 5, 4, 4, "Anubis");
let charity = new Queen("Charity Kase", 8, 7, 4, 10, 6, 13, 8, "Charity");
let choriza = new Queen("Choriza May", 9, 9, 5, 7, 8, 8, 6, "Choriza");
let elektraF = new Queen("Elektra Fence", 5, 6, 11, 4, 5, 8, 13, "ElektraF");
let ella = new Queen("Ella Vaday", 9, 14, 8, 10, 12, 9, 8, "Ella");
let kitty = new Queen("Kitty Scott-Claus", 12, 11, 7, 8, 9, 9, 7, "Kitty");
let krystal = new Queen("Krystal Versace", 8, 8, 11, 12, 8, 14, 12, "Krystal");
let river = new Queen("River Medway", 8, 6, 5, 9, 5, 7, 5, "River");
let scarlett = new Queen("Scarlett Harlett", 7, 7, 8, 8, 6, 8, 7, "ScarlettH");
let vanity = new Queen("Vanity Milan", 8, 6, 12, 7, 8, 8, 12, "Vanity");
let victoriaS = new Queen("Victoria Scone", 11, 10, 8, 10, 8, 10, 10, "VictoriaS");
let uk_season3 = [anubis, charity, choriza, elektraF, ella, kitty, krystal, river, scarlett, vanity, victoriaS, veronica];
//DRUK SEASON 4         acting, comedy, dance, design, improv, runway, lipsync
let baby = new Queen("Hey, Baby", 6, 6, 9, 10, 4, 9, 11, "Baby");
let black = new Queen("Black Peppa", 5, 4, 8, 4, 6, 13, 13, "BlackPeppa");
let cheddar = new Queen("Cheddar Gorgeous", 12, 9, 9, 8, 13, 14, 8, "Cheddar");
let copper = new Queen("Copper Topp", 5, 4, 9, 7, 6, 7, 8, "Copper");
let dakota = new Queen("Dakota Schiffer", 6, 9, 9, 10, 9, 11, 10, "Dakota");
let danny = new Queen("Danny Beard", 12, 10, 11, 8, 11, 13, 9, "Danny");
let jonbers = new Queen("Jonbers Blonde", 5, 9, 8, 8, 9, 10, 9, "Jonbers");
let just = new Queen("Just May", 4, 4, 4, 4, 4, 4, 4, "JustMay");
let leFil = new Queen("Le Fil", 6, 5, 8, 9, 5, 12, 9, "LeFil");
let pixie = new Queen("Pixie Polite", 7, 5, 9, 8, 8, 9, 9, "PixiePolite");
let sminty = new Queen("Sminty Drop", 5, 6, 5, 9, 4, 14, 8, "Sminty");
let starlet = new Queen("Starlet", 4, 4, 4, 4, 4, 13, 5, "Starlet");
let uk_season4 = [baby, black, cheddar, copper, dakota, danny, jonbers, just, leFil, pixie, sminty, starlet];
//DRUK SEASON 5
let alexisSP = new Queen("Alexis Saint-Pete", 4, 4, 4, 4, 4, 7, 8, "AlexisSaintPete");
let banksie = new Queen("Banksie", 6, 6, 6, 10, 7, 13, 8, "Banksie");
let cara = new Queen("Cara Melle", 6, 8, 10, 7, 7, 13, 12, "CaraMelle");
let dedelicious = new Queen("DeDeLicious", 8, 5, 8, 9, 6, 11, 14, "DeDeLicious");
let gingerJ = new Queen("Ginger Johnson", 10, 12, 11, 9, 13, 10, 10, "GingerJohnson");
let kate = new Queen("Kate Butch", 10, 9, 9, 8, 9, 8, 8, "KateButch");
let michael = new Queen("Michael Marouli", 6, 10, 9, 8, 10, 12, 10, "MichaelMarouli");
let naomiC = new Queen("Miss Naomi Carter", 6, 6, 8, 6, 6, 9, 9, "MissNaomiCarter");
let tomara = new Queen("Tomara Thomas", 8, 8, 10, 8, 10, 11, 11, "TomaraThomas");
let vicki = new Queen("Vicki Vivacious", 6, 6, 9, 8, 5, 11, 9, "VickiVivacious");
let uk_season5 = [alexisSP, banksie, cara, dedelicious, gingerJ, kate, michael, naomiC, tomara, vicki];
//DRUK SEASON 6
let actavia = new Queen("Actavia", 7, 7, 7, 7, 7, 7, 7, "Actavia");
let chanelO = new Queen("Chanel O’Conor", 7, 7, 7, 7, 7, 7, 7, "ChanelOConor");
let charra = new Queen("Charra Tea", 7, 7, 7, 7, 7, 7, 7, "CharraTea");
let dita = new Queen("Dita Garbo", 7, 7, 7, 7, 7, 7, 7, "DitaGarbo");
let kikiS = new Queen("Kiki Snatch", 7, 7, 7, 7, 7, 7, 7, "KikiSnatch");
let kyran = new Queen("Kyran Thrax", 7, 7, 7, 7, 7, 7, 7, "KyranThrax");
let lavoix = new Queen("La Voix", 7, 7, 7, 7, 7, 7, 7, "LaVoix");
let lill = new Queen("Lill", 7, 7, 7, 7, 7, 7, 7, "Lill");
let marmalade = new Queen("Marmalade", 7, 7, 7, 7, 7, 7, 7, "Marmalade");
let rileasa = new Queen("Rileasa Slaves", 7, 7, 7, 7, 7, 7, 7, "RileasaSlaves");
let saki = new Queen("Saki Yew", 7, 7, 7, 7, 7, 7, 7, "SakiYew");
let zahirah = new Queen("Zahirah Zapanta", 7, 7, 7, 7, 7, 7, 7, "ZahirahZapanta");
let uk_season6 = [actavia, chanelO, charra, dita, kikiS, kyran, lavoix, lill, marmalade, rileasa, saki, zahirah];
//CAN SEASON 1
let anastarzia = new Queen("Anastarzia Anaquway", 7, 6, 4, 12, 6, 8, 7, "Starzy");
let boa = new Queen("BOA", 6, 6, 5, 5, 6, 7, 7, "BOA");
let ilona = new Queen("Ilona Verley", 5, 8, 5, 8, 9, 10, 10, "Ilona");
let jimbo = new Queen("Jimbo", 13, 15, 6, 14, 15, 14, 6, "Jimbo");
let juice = new Queen("Juice Boxx", 6, 6, 6, 4, 6, 6, 7, "Juice");
let kiara = new Queen("Kiara", 10, 6, 8, 11, 6, 9, 11, "Kiara");
let kyne = new Queen("Kyne", 8, 6, 6, 7, 6, 6, 7, "Kyne");
let lemon = new Queen("Lemon", 10, 11, 12, 6, 11, 13, 11, "Lemon");
let priyanka = new Queen("Priyanka", 14, 9, 12, 8, 6, 10, 13, "Priyanka");
let rita = new Queen("Rita Baga", 11, 10, 9, 9, 8, 10, 12, "Rita");
let bobo = new Queen("Scarlett BoBo", 6, 8, 9, 9, 9, 10, 9, "Scarlett");
let tynomi = new Queen("Tynomi Banks", 5, 6, 5, 7, 5, 7, 10, "Tynomi");
let can_season1 = [anastarzia, boa, ilona, jimbo, juice, kiara, kyne, lemon, priyanka, rita, bobo, tynomi];
//ALL STARS 8
let allstars_8 = [alexism, darienne, heidi, jaymes, jessica, jimbo, kahanna, kandym, lala, monica, kasha, naysha];
//CAN SEASON 2
let adriana = new Queen("Adriana", 9, 6, 7, 6, 6, 8, 5, "Adriana");
let beth = new Queen("Beth", 5, 5, 6, 3, 6, 5, 4, "Beth");
let eve = new Queen("Eve 6000", 10, 5, 5, 6, 6, 8, 8, "Eve");
let giametric = new Queen("Gia Metric", 9, 6, 10, 6, 6, 9, 10, "Giametric");
let icesis = new Queen("Icesis Couture", 8, 11, 9, 12, 10, 14, 12, "Icesis");
let kendall = new Queen("Kendall Gender", 7, 9, 8, 6, 7, 8, 10, "Kendall");
let kimoraA = new Queen("Kimora Amour", 6, 5, 5, 6, 7, 7, 5, "KimoraA");
let oceane = new Queen("Océane Aqua-Black", 6, 7, 4, 7, 7, 7, 5, "Oceane");
let pythia = new Queen("Pythia", 8, 7, 8, 12, 9, 12, 7, "Pythia");
let stephanie = new Queen("Stephanie Prince", 6, 5, 6, 10, 5, 11, 6, "Stephanie");
let suki = new Queen("Suki Doll", 8, 7, 6, 9, 5, 9, 5, "Suki");
let synthia = new Queen("Synthia Kiss", 6, 8, 10, 7, 9, 7, 9, "Synthia");
let can_season2 = [adriana, beth, eve, giametric, icesis, kendall, kimoraA, oceane, pythia, stephanie, suki, synthia];
//CAN SEASON 3
let bombae = new Queen("Bombae", 5, 7, 6, 8, 6, 7, 7, "Bombae");
let chelazon = new Queen("Chelazon Leroux", 4, 9, 4, 7, 5, 7, 6, "Chelazon");
let gisele = new Queen("Gisèle Lullaby", 6, 10, 8, 11, 10, 12, 9, "Gisele");
let halal = new Queen("Halal Bae", 4, 4, 3, 3, 4, 7, 5, "Halal");
let irma = new Queen("Irma Gerd", 5, 7, 7, 8, 10, 9, 7, "Irma");
let jadashada = new Queen("Jada Shada Hudson", 9, 7, 9, 8, 7, 10, 12, "JadaShada");
let kaos = new Queen("Kaos", 5, 7, 5, 5, 5, 9, 9, "Kaos");
let kimmy = new Queen("Kimmy Couture", 7, 7, 12, 9, 6, 11, 12, "Kimmy");
let boomboom = new Queen("Lady Boom Boom", 5, 8, 9, 9, 6, 10, 9, "BoomBoom");
let fiercalicious = new Queen("Miss Fiercalicious", 9, 9, 8, 7, 7, 11, 9, "Fiercalicious");
let moco = new Queen("Miss Moço", 5, 4, 6, 4, 4, 7, 9, "Moco");
let vanderpuss = new Queen("Vivian Vanderpuss", 9, 9, 9, 7, 8, 9, 8, "Vanderpuss");
let can_season3 = [bombae, chelazon, gisele, halal, irma, jadashada, kaos, kimmy, boomboom, fiercalicious, moco, vanderpuss];
//CAN SEASON 4
let aimee = new Queen("Aimee Yonce Shennel", 8, 8, 9, 6, 8, 11, 10, "AimeeYonceShennel");
let auroraM = new Queen("Aurora Matrix", 8, 7, 12, 7, 6, 10, 12, "AuroraMatrix");
let denim = new Queen("Denim", 7, 8, 8, 10, 8, 11, 9, "Denim");
let kiki = new Queen("Kiki Coe", 8, 7, 5, 13, 6, 13, 11, "KikiCoe");
let kitten = new Queen("Kitten Kaboodle", 10, 10, 6, 9, 9, 9, 9, "KittenKaboodle");
let luna = new Queen("Luna DuBois", 5, 6, 8, 8, 6, 10, 7, "LunaDuBois");
let melinda = new Queen("Melinda Verga", 9, 10, 8, 6, 10, 7, 10, "MelindaVerga");
let nearah = new Queen("Nearah Nuff", 8, 8, 10, 6, 8, 9, 13, "NearahNuff");
let sisi = new Queen("Sisi Superstar", 4, 4, 4, 4, 4, 4, 4, "SisiSuperstar");
let girlfriend = new Queen("The Girlfriend Experience", 5, 6, 5, 6, 6, 9, 8, "TheGirlfriendExperience");
let venusCan = new Queen("Venus", 10, 10, 10, 9, 10, 12, 10, "VenusCan");
let can_season4 = [aimee, auroraM, denim, kiki, kitten, luna, melinda, nearah, sisi, girlfriend, venusCan];
//CAN SEASON 5
let helena = new Queen("Helena Poison", 7, 7, 7, 7, 7, 7, 7, "HelenaPoison");
let jaylene = new Queen("Jaylene Tyme", 7, 7, 7, 7, 7, 7, 7, "JayleneTyme");
let makayla = new Queen("Makayla Couture", 7, 7, 7, 7, 7, 7, 7, "MakaylaCouture");
let minhi = new Queen("Minhi Wang", 7, 7, 7, 7, 7, 7, 7, "MinhiWang");
let perla = new Queen("Perla", 7, 7, 7, 7, 7, 7, 7, "Perla");
let sanjina = new Queen("Sanjina Dabish Queen", 7, 7, 7, 7, 7, 7, 7, "SanjinaDabishQueen");
let tara = new Queen("Tara Nova", 7, 7, 7, 7, 7, 7, 7, "TaraNova");
let virgo = new Queen("The Virgo Queen", 7, 7, 7, 7, 7, 7, 7, "TheVirgoQueen");
let tiffany = new Queen("Tiffany Ann Co.", 7, 7, 7, 7, 7, 7, 7, "TiffanyAnnCo");
let uma = new Queen("Uma Gahd", 7, 7, 7, 7, 7, 7, 7, "UmaGahd");
let xana = new Queen("Xana", 7, 7, 7, 7, 7, 7, 7, "Xana");
let can_season5 = [helena, jaylene, makayla, minhi, perla, sanjina, tara, virgo, tiffany, uma, xana];
//DRAG RACE HOLLAND SEASON 1
let chelsea = new Queen("Chelsea Boy", 9, 10, 7, 7, 10, 12, 6, "Chelsea");
let envy = new Queen("Envy Peru", 11, 11, 11, 8, 11, 13, 11, "Envy");
let janey = new Queen("Janey Jacké", 7, 6, 13, 11, 6, 11, 12, "Janey");
let madamem = new Queen("Madame Madness", 8, 6, 5, 6, 5, 8, 7, "MadameM");
let mama = new Queen("Ma'Ma Queen", 9, 6, 5, 6, 6, 10, 7, "Mama");
let megan = new Queen("Megan Schoonbrood", 7, 6, 6, 5, 6, 9, 8, "Megan");
let abby = new Queen("Miss Abby OMG", 5, 6, 11, 6, 5, 8, 10, "Abby");
let patty = new Queen("Patty Pam-Pam", 5, 6, 6, 6, 5, 9, 7, "Patty");
let roem = new Queen("Roem", 6, 6, 5, 5, 5, 6, 5, "Roem");
let sederginne = new Queen("Sederginne", 7, 6, 6, 7, 5, 13, 5, "Sederginne");
let hol_season1 = [chelsea, envy, janey, madamem, mama, megan, abby, patty, roem, sederginne];
//DRAG RACE HOLLAND SEASON 2
let ivyelise = new Queen("Ivy-Elyse", 6, 8, 5, 4, 8, 5, 10, "IvyE");
let juicy = new Queen("Juicy Kutoure", 5, 6, 5, 5, 4, 4, 5, "Juicy");
let keta = new Queen("Keta Minaj", 8, 10, 9, 10, 12, 13, 9, "Keta");
let love = new Queen("Love Masisi", 6, 5, 6, 8, 5, 10, 7, "Love");
let mlp = new Queen("My Little Puny", 10, 10, 10, 7, 9, 10, 10, "MLP");
let reggy = new Queen("Reggy B", 6, 6, 6, 5, 6, 8, 8, "Reggy");
let tabitha = new Queen("Tabitha", 6, 7, 8, 6, 5, 7, 8, "Tabitha");
let countess = new Queen("The Countess", 7, 5, 4, 10, 6, 12, 5, "Countess");
let vanessaC = new Queen("Vanessa Van Cartier", 7, 5, 6, 8, 5, 12, 8, "VanessaC");
let vivaldi = new Queen("Vivaldi", 8, 8, 8, 7, 8, 12, 8, "Vivaldi");
let hol_season2 = [ivyelise, juicy, keta, love, mlp, reggy, tabitha, countess, vanessaC, vivaldi];
//DRT SEASON 1
let amadiva = new Queen("Amadiva", 7, 6, 7, 9, 4, 9, 8, "Amadiva");
let annee = new Queen("Anneé Maywong", 10, 9, 7, 12, 8, 11, 9, "Annee");
let b = new Queen("B Ella", 11, 7, 6, 7, 7, 7, 7, "B");
let bunny = new Queen("Bunny Be Fly", 6, 5, 5, 7, 5, 6, 5, "Bunny");
let dearis = new Queen("Dearis Doll", 8, 11, 7, 8, 10, 10, 10, "Dearis");
let jaja = new Queen("JAJA", 7, 5, 7, 6, 5, 9, 9, "Jaja");
let meannie = new Queen("Meannie Minaj", 5, 5, 5, 4, 5, 5, 4, "Meannie");
let morrigan = new Queen("Morrigan", 5, 4, 6, 4, 6, 7, 6, "Morrigan");
let natalia = new Queen("Natalia Pliacam", 8, 12, 7, 9, 12, 10, 9, "Natalia");
let petchra = new Queen("Petchra", 6, 5, 6, 8, 6, 7, 8, "Petchra");
let drt_season1 = [amadiva, annee, b, bunny, dearis, jaja, meannie, morrigan, natalia, petchra];
//DRT SEASON 2
let angele = new Queen("Angele Anang", 8, 8, 9, 11, 9, 9, 12, "Angele");
let bandit = new Queen("Bandit", 7, 8, 7, 8, 7, 8, 7, "Bandit");
let genie = new Queen("Genie", 10, 7, 7, 7, 8, 8, 7, "Genie");
let kana = new Queen("Kana Warrior", 9, 7, 8, 6, 8, 7, 12, "Kana");
let kandyz = new Queen("Kandy Zyanide", 7, 7, 10, 8, 9, 10, 8, "KandyZ");
let katy = new Queen("Katy Killer", 6, 6, 7, 6, 7, 9, 6, "Katy");
let m = new Queen("M Stranger Fox", 5, 6, 5, 6, 6, 5, 5, "M");
let maya = new Queen("Maya B'Haro", 5, 6, 6, 8, 7, 8, 7, "Maya");
let mocha = new Queen("Mocha Diva", 9, 9, 6, 8, 9, 7, 9, "Mocha");
let gimhuay = new Queen("Miss Gimhuay", 8, 7, 7, 9, 8, 11, 8, "Gimhuay");
let silver = new Queen("Silver Sonic", 5, 5, 6, 6, 5, 7, 6, "Silver");
let srimala = new Queen("Srimala", 7, 10, 8, 8, 7, 7, 8, "Srimala");
let tormai = new Queen("Tormai", 6, 5, 5, 6, 5, 7, 7, "Tormai");
let vanda = new Queen("Vanda Miss Joaquim", 11, 10, 8, 8, 9, 9, 9, "Vanda");
let drt_season2 = [angele, bandit, genie, kana, kandyz, katy, m, maya, mocha, gimhuay, silver, srimala, tormai, vanda];
//DRT SEASON 3
let benze = new Queen("Benze Diva", 7, 7, 7, 7, 7, 7, 7, "BenzeDiva");
let frankie = new Queen("Frankie Wonga", 7, 7, 7, 7, 7, 7, 7, "FrankieWonga");
let gawdland = new Queen("Gawdland", 7, 7, 7, 7, 7, 7, 7, "Gawdland");
let gigiF = new Queen("Gigi Ferocious", 7, 7, 7, 7, 7, 7, 7, "GigiFerocious");
let kara = new Queen("Kara Might", 7, 7, 7, 7, 7, 7, 7, "KaraMight");
let nane = new Queen("Nane Sphera", 7, 7, 7, 7, 7, 7, 7, "NaneSphera");
let shortgun = new Queen("Shortgun", 7, 7, 7, 7, 7, 7, 7, "Shortgun");
let siam = new Queen("Siam Phusri", 7, 7, 7, 7, 7, 7, 7, "SiamPhusri");
let spicy = new Queen("Spicy Sunshine", 7, 7, 7, 7, 7, 7, 7, "SpicySunshine");
let srirasha = new Queen("Srirasha Hotsauce", 7, 7, 7, 7, 7, 7, 7, "SrirashaHotsauce");
let zepee = new Queen("Zepee", 7, 7, 7, 7, 7, 7, 7, "Zepee");
let drt_season3 = [benze, frankie, gawdland, gigiF, kara, nane, shortgun, siam, spicy, srirasha, zepee];
//DRAG RACE DOWN UNDER SEASON 1
let anita = new Queen("Anita Wigl'it", 6, 9, 8, 6, 10, 8, 5, "Anita");
let art = new Queen("Art Simone", 6, 4, 5, 8, 4, 10, 4, "Art");
let cocoj = new Queen("Coco Jumbo", 6, 5, 6, 6, 5, 8, 10, "CocoJ");
let elektra = new Queen("Elektra Shock", 10, 6, 12, 8, 4, 7, 11, "Elektra");
let etc = new Queen("Etcetera Etcetera", 5, 8, 8, 7, 8, 8, 8, "Etc");
let jojo = new Queen("Jojo Zaho", 5, 5, 5, 5, 5, 6, 6, "Jojo");
let karen = new Queen("Karen From Finance", 5, 6, 5, 5, 7, 7, 5, "Karen");
let kita = new Queen("Kita Mean", 9, 9, 7, 7, 9, 9, 8, "Kita");
let maxi = new Queen("Maxi Shield", 6, 6, 5, 9, 7, 8, 8, "Maxi");
let scarletAdams = new Queen("Scarlet Adams", 8, 7, 10, 10, 7, 10, 10, "ScarletAdams");
let drdu_season1 = [anita, art, cocoj, elektra, etc, jojo, karen, kita, maxi, scarletAdams];
//DRAG RACE DOWN UNDER SEASON 2
let aubrey = new Queen("Aubrey Haive", 5, 4, 5, 7, 4, 8, 7, "Aubrey");
let beverly = new Queen("Beverly Kills", 8, 4, 10, 9, 5, 9, 10, "Beverly");
let faux = new Queen("Faúx Fúr", 4, 5, 4, 5, 4, 5, 6, "Faux");
let hannah = new Queen("Hannah Conda", 11, 12, 11, 8, 11, 10, 10, "Hannah");
let kweenKong = new Queen("Kween Kong", 5, 9, 10, 5, 8, 10, 11, "Kween");
let minnie = new Queen("Minnie Cooper", 9, 8, 5, 6, 6, 9, 7, "Minnie");
let molly = new Queen("Molly Poppinz", 8, 7, 6, 9, 7, 10, 9, "Molly");
let pomara = new Queen("Pomara Fifth", 8, 5, 5, 7, 5, 9, 8, "Pomara");
let spankie = new Queen("Spankie Jackzon", 11, 11, 8, 5, 8, 7, 9, "Spankie");
let yuri = new Queen("Yuri Guaii", 6, 11, 6, 12, 9, 13, 7, "Yuri");
let drdu_season2 = [aubrey, beverly, faux, hannah, kweenKong, minnie, molly, pomara, spankie, yuri];
//DRAG RACE DOWN UNDER SEASON 3
let amyl = new Queen("Amyl", 4, 4, 4, 4, 4, 4, 4, "Amyl");
let ashley = new Queen("Ashley Madison", 7, 10, 5, 8, 10, 9, 8, "AshleyMadison");
let bumpa = new Queen("Bumpa Love", 7, 7, 6, 8, 8, 7, 9, "BumpaLove");
let flor = new Queen("Flor", 7, 6, 9, 8, 8, 10, 9, "Flor");
let gabriella = new Queen("Gabriella Labucci", 7, 8, 9, 7, 10, 8, 9, "GabriellaLabucci");
let hollywould = new Queen("Hollywould Star", 7, 7, 11, 9, 8, 10, 9, "HollywouldStar");
let isis = new Queen("Isis Avis Loren", 8, 10, 10, 11, 9, 11, 10, "IsisAvisLoren");
let ivanna = new Queen("Ivanna Drink", 6, 6, 7, 6, 6, 8, 8, "IvannaDrink");
let ivory = new Queen("Ivory Glaze", 4, 4, 5, 5, 4, 6, 7, "IvoryGlaze");
let ritaMenu = new Queen("Rita Menu", 6, 6, 8, 6, 5, 8, 10, "RitaMenu");
let drdu_season3 = [amyl, ashley, bumpa, flor, gabriella, hollywould, isis, ivanna, ivory, ritaMenu];
// DRAG RACE DOWN UNDER SEASON 4
let brenda = new Queen("Brenda Bressed", 7, 7, 7, 7, 7, 7, 7, "BrendaBressed");
let freya = new Queen("Freya Armani", 7, 7, 7, 7, 7, 7, 7, "FreyaArmani");
let karna = new Queen("Karna Ford", 7, 7, 7, 7, 7, 7, 7, "KarnaFord");
let lazy = new Queen("Lazy Susan", 7, 7, 7, 7, 7, 7, 7, "LazySusan");
let lucina = new Queen("Lucina Innocence", 7, 7, 7, 7, 7, 7, 7, "LucinaInnocence");
let mandy = new Queen("Mandy Moobs", 7, 7, 7, 7, 7, 7, 7, "MandyMoobs");
let maxdq = new Queen("Max Drag Queen", 7, 7, 7, 7, 7, 7, 7, "MaxDragQueen");
let nikitaI = new Queen("Nikita Iman", 7, 7, 7, 7, 7, 7, 7, "NikitaIman");
let oliviaD = new Queen("Olivia Dreams", 7, 7, 7, 7, 7, 7, 7, "OliviaDreams");
let vybe = new Queen("Vybe", 7, 7, 7, 7, 7, 7, 7, "Vybe");
let drdu_season4 = [brenda, freya, karna, lazy, lucina, mandy, maxdq, nikitaI, oliviaD, vybe];
//DRAG RACE ESPAÑA 1
let arantxa = new Queen("Arantxa Castilla La Mancha", 6, 8, 6, 7, 8, 9, 7, "Arantxa");
let carmenf = new Queen("Carmen Farala", 10, 10, 10, 14, 8, 13, 10, "CarmenF");
let dovima = new Queen("Dovima Nurmi", 8, 7, 5, 7, 8, 10, 6, "Dovima");
let drag = new Queen("Drag Vulcano", 6, 6, 5, 7, 6, 9, 6, "Drag");
let hugaceo = new Queen("Hugáceo Crujiente", 5, 5, 5, 12, 6, 12, 8, "Hugaceo");
let inti = new Queen("Inti", 6, 6, 6, 7, 5, 11, 6, "Inti");
let killer = new Queen("Killer Queen", 6, 10, 8, 9, 11, 9, 8, "Killer");
let pupi = new Queen("Pupi Poisson", 10, 12, 8, 5, 13, 9, 9, "Puppy");
let sagittaria = new Queen("Sagittaria", 7, 8, 8, 10, 7, 12, 8, "Sagittaria");
let macarena = new Queen("The Macarena", 10, 6, 8, 8, 5, 8, 8, "Macarena");
let dres_season1 = [arantxa, carmenf, dovima, drag, hugaceo, inti, killer, pupi, sagittaria, macarena];
// DRAG RACE ESPAÑA 2
let arielRec = new Queen("Ariel Rec", 5, 5, 7, 4, 5, 9, 5, "ArielRec");
let diamante = new Queen("Diamante Merybrown", 7, 6, 10, 5, 5, 8, 11, "Diamante");
let sethlas = new Queen("Drag Sethlas", 7, 11, 10, 10, 10, 13, 10, "DragSethlas");
let estrella = new Queen("Estrella Xtravaganza", 10, 7, 7, 5, 9, 8, 8, "Estrella");
let jota = new Queen("Jota Carajota", 4, 5, 6, 4, 4, 8, 7, "Jota");
let juriji = new Queen("Juriji Der Klee", 8, 9, 10, 11, 10, 10, 7, "Juriji");
let marina = new Queen("Marina", 6, 10, 8, 7, 7, 8, 11, "Marina");
let marisa = new Queen("Marisa Prisa", 4, 4, 3, 2, 4, 4, 4, "Marisa");
let onyx = new Queen("Onyx", 6, 5, 7, 7, 5, 13, 7, "Onyx");
let samantha = new Queen("Samantha Ballentines", 5, 11, 9, 7, 9, 9, 8, "Samantha");
let sharonne = new Queen("Sharonne", 12, 10, 8, 8, 12, 10, 9, "Sharonne");
let venedita = new Queen("Venedita Von Däsh", 9, 9, 9, 9, 9, 10, 9, "Venedita");
let dres_season2 = [arielRec, diamante, sethlas, estrella, jota, juriji, marina, marisa, onyx, samantha, sharonne, venedita];
//DRAG RACE ESPAÑA S3
let bestiah = new Queen("Bestiah", 8, 7, 9, 10, 5, 13, 9, "Bestiah");
let chanel = new Queen("Chanel Anorex", 6, 6, 8, 5, 6, 10, 7, "ChanelAnorex");
let clover = new Queen("Clover Bish", 5, 9, 11, 8, 8, 9, 12, "CloverBish");
let chuchi = new Queen("Drag Chuchi", 6, 6, 6, 6, 6, 8, 8, "DragChuchi");
let hornella = new Queen("Hornella Góngora", 9, 9, 8, 8, 9, 9, 9, "HornellaGongora");
let maria = new Queen("María Edília", 4, 6, 4, 4, 4, 4, 4, "MariaEdilia");
let kellyRoller = new Queen("Kelly Roller", 5, 10, 9, 6, 6, 8, 11, "KellyRoller");
let pakita = new Queen("Pakita", 9, 5, 6, 10, 6, 10, 10, "Pakita");
let pink = new Queen("Pink Chadora", 8, 9, 8, 7, 11, 10, 7, "PinkChadora");
let pitita = new Queen("Pitita", 11, 6, 8, 13, 10, 11, 9, "Pitita");
let vania = new Queen("Vania Vainilla", 8, 12, 8, 10, 8, 10, 9, "VaniaVainilla");
let visa = new Queen("Visa", 7, 8, 8, 9, 9, 12, 12, "Visa");
let dres_season3 = [bestiah, chanel, clover, chuchi, hornella, macarena, maria, kellyRoller, pakita, pink, pitita, vania, visa];
// ESPAÑA ALL STARS 1
let allstars_es1 = [sethlas, hornella, juriji, onyx, pakita, pink, pupi, sagittaria, samantha];
//DRAG RACE ESPAÑA S4
let angelita = new Queen("Angelita la Perversa", 7, 7, 7, 7, 7, 7, 7, "AngelitalaPerversa");
let chloeV = new Queen("Chloe Vittu", 7, 7, 7, 7, 7, 7, 7, "ChloeVittu");
let ditaD = new Queen("Dita Dubois", 7, 7, 7, 7, 7, 7, 7, "DitaDubois");
let kellyP = new Queen("Kelly Passa!?", 7, 7, 7, 7, 7, 7, 7, "KellyPassa");
let lanina = new Queen("La Niña Delantro", 7, 7, 7, 7, 7, 7, 7, "LaNinaDelantro");
let lecoco = new Queen("Le Cocó", 7, 7, 7, 7, 7, 7, 7, "LeCoco");
let mariana = new Queen("Mariana Stars", 7, 7, 7, 7, 7, 7, 7, "MarianaStars");
let megui = new Queen("Megui Yeillow", 7, 7, 7, 7, 7, 7, 7, "MeguiYeillow");
let khristo = new Queen("Miss Khristo", 7, 7, 7, 7, 7, 7, 7, "MissKhristo");
let porca = new Queen("Porca Theclubkid", 7, 7, 7, 7, 7, 7, 7, "PorcaTheclubkid");
let shani = new Queen("Shani LaSanta", 7, 7, 7, 7, 7, 7, 7, "ShaniLaSanta");
let vampirashian = new Queen("Vampirashian", 7, 7, 7, 7, 7, 7, 7, "Vampirashian");
let dres_season4 = [angelita, chloeV, ditaD, kellyP, lanina, lecoco, mariana, megui, khristo, porca, shani, vampirashian];
//DRAG RACE ITALIA S1
let ava = new Queen("Ava Hangar", 8, 7, 5, 5, 6, 6, 6, "Ava");
let divinity = new Queen("Divinity", 9, 6, 8, 7, 6, 8, 7, "Divinity");
let elecktraBionic = new Queen("Elecktra Bionic", 7, 8, 8, 8, 9, 9, 8, "ElecktraBionic");
let enorma = new Queen("Enorma Jean", 8, 8, 6, 6, 8, 7, 6, "Enorma");
let farida = new Queen("Farida Kant", 7, 6, 8, 11, 5, 11, 8, "Farida");
let ivana = new Queen("Ivana Vamp", 6, 5, 6, 6, 6, 6, 5, "Ivana");
let riche = new Queen("Le Riche", 6, 8, 6, 8, 9, 8, 7, "Riche");
let luquisha = new Queen("Luquisha Lubamba", 7, 6, 6, 5, 7, 6, 7, "Luquisha");
let drita = [ava, divinity, elecktraBionic, enorma, farida, ivana, riche, luquisha];
//DRAG RACE ITALIA 2 acting, comedy, dance, design, improv, runway, lipsync
let aura = new Queen("Aura Eternal Visage", 11, 9, 9, 6, 5, 9, 8, "Aura");
let gioffre = new Queen("Gioffré", 6, 8, 5, 7, 5, 8, 8, "Gioffre");
let diamond = new Queen("La Diamond", 10, 12, 8, 12, 11, 13, 9, "LaDiamond");
let petite = new Queen("La Petite Rose Noire", 10, 5, 10, 8, 7, 11, 11, "Petite");
let narciso = new Queen("Narciso", 4, 4, 4, 4, 4, 4, 4, "Narciso");
let nehellenia = new Queen("Nehellenia", 8, 10, 10, 8, 10, 12, 9, "Nehellenia");
let obama = new Queen("Obama", 5, 9, 6, 8, 9, 8, 8, "Obama");
let panthera = new Queen("Panthera Virus", 7, 5, 6, 6, 5, 8, 9, "Panthera");
let skandalove = new Queen("Skandalove", 9, 7, 8, 8, 7, 9, 9, "Skandalove");
let tanissa = new Queen("Tanissa Yoncè", 5, 6, 6, 10, 6, 9, 7, "Tanissa");
let drita_season2 = [aura, gioffre, diamond, petite, narciso, nehellenia, obama, panthera, skandalove, tanissa];
// DRAG RACE ITALIA 3
let adrianaP = new Queen("Adriana Picasso", 4, 4, 4, 4, 4, 4, 4, "AdrianaPicasso");
let amy = new Queen("Amy Krania", 5, 5, 5, 5, 5, 5, 5, "AmyKrania");
let prada = new Queen("La Prada", 8, 8, 6, 9, 7, 8, 9, "LaPrada");
let sheeva = new Queen("La Sheeva", 9, 5, 8, 10, 5, 11, 8, "LaSheeva");
let leila = new Queen("Leila Yarn", 6, 7, 9, 8, 9, 12, 11, "LeilaYarn");
let aurora = new Queen("Lightning Aurora", 9, 6, 8, 5, 6, 10, 9, "LightningAurora");
let lina = new Queen("Lina Galore", 9, 12, 10, 10, 12, 14, 12, "LinaGalore");
let melissa = new Queen("Melissa Bianchini", 9, 9, 11, 9, 8, 14, 12, "MelissaBianchini");
let morganaC = new Queen("Morgana Cosmica", 9, 6, 7, 7, 6, 10, 9, "MorganaCosmica");
let silvana = new Queen("Silvana della Magliana", 10, 10, 8, 8, 10, 9, 8, "SilvanadellaMagliana");
let sissy = new Queen("Sissy Lea", 7, 6, 6, 9, 7, 8, 5, "SissyLea");
let sypario = new Queen("Sypario", 10, 6, 10, 6, 7, 9, 7, "Sypario");
let vezirja = new Queen("Vezirja", 9, 6, 6, 6, 6, 8, 5, "Vezirja");
let drita_season3 = [adrianaP, amy, prada, sheeva, leila, aurora, lina, melissa, morganaC, silvana, sissy, sypario, vezirja];
//DRAG RACE FRANCE 1
let elips = new Queen("Elips", 7, 9, 8, 8, 8, 8, 7, "Elips");
let kam = new Queen("Kam Hugh", 7, 5, 6, 9, 4, 13, 7, "Kam");
let bigbertha = new Queen("La Big Bertha", 7, 6, 7, 6, 6, 8, 9, "BigBertha");
let briochee = new Queen("La Briochée", 6, 6, 6, 5, 6, 8, 5, "LaBriochee");
let grandedame = new Queen("La Grande Dame", 10, 9, 9, 13, 8, 14, 9, "GrandeDame");
let kahena = new Queen("La Kahena", 5, 6, 5, 3, 5, 6, 5, "Kahena");
let lolita = new Queen("Lolita Banana", 9, 7, 13, 11, 6, 9, 12, "LolitaBanana");
let lova = new Queen("Lova Ladiva", 5, 5, 6, 4, 6, 6, 5, "Lova");
let paloma = new Queen("Paloma", 11, 11, 6, 7, 9, 9, 8, "Paloma");
let soa = new Queen("Soa de Muse", 9, 10, 10, 8, 8, 9, 10, "Soa");
let drfr_season1 = [elips, kam, bigbertha, briochee, grandedame, kahena, lolita, lova, paloma, soa];
//DRAG RACE FRANCE 2
let cookie = new Queen("Cookie Kunty", 8, 6, 8, 10, 5, 11, 10, "CookieKunty");
let gingerB = new Queen("Ginger Bitch", 7, 6, 7, 6, 8, 8, 9, "GingerBitch");
let keiona = new Queen("Keiona", 11, 10, 15, 11, 11, 13, 13, "Keiona");
let kittyS = new Queen("Kitty Space", 6, 6, 5, 6, 5, 9, 9, "KittySpace");
let mami = new Queen("Mami Watta", 9, 7, 9, 9, 8, 10, 9, "MamiWatta");
let moon = new Queen("Moon", 9, 9, 9, 6, 8, 10, 9, "Moon");
let piche = new Queen("Piche", 7, 6, 11, 7, 8, 9, 11, "Piche");
let punani = new Queen("Punani", 8, 10, 8, 9, 10, 10, 9, "Punani");
let roseF = new Queen("Rose", 4, 4, 4, 4, 4, 4, 4, "RoseF");
let sara = new Queen("Sara Forever", 8, 7, 11, 6, 10, 10, 10, "SaraForever");
let vespi = new Queen("Vespi", 6, 6, 5, 6, 6, 9, 7, "Vespi");
let drfr_season2 = [cookie, gingerB, keiona, kittyS, mami, moon, piche, punani, roseF, sara, vespi];
//DRAG RACE FRANCE 3
let afrodite = new Queen("Afrodite Amour", 4, 4, 4, 4, 4, 4, 4, "AfroditeAmour");
let edeha = new Queen("Edeha Noire", 6, 6, 5, 6, 6, 8, 9, "EdehaNoire");
let filip = new Queen("Le Filip", 10, 10, 8, 9, 7, 11, 9, "LeFilip");
let leona = new Queen("Leona Winter", 10, 7, 10, 10, 8, 10, 10, "LeonaWinter");
let lula = new Queen("Lula Strega", 9, 11, 7, 10, 9, 12, 7, "LulaStrega");
let magnetica = new Queen("Magnetica", 6, 6, 9, 6, 6, 10, 9, "Magnetica");
let misty = new Queen("Misty Phoenix", 9, 8, 10, 9, 9, 10, 11, "MistyPhoenix");
let norma = new Queen("Norma Bell", 9, 6, 10, 8, 7, 10, 8, "NormaBell");
let perseo = new Queen("Perseo", 9, 8, 9, 7, 7, 11, 10, "Perseo");
let ruby = new Queen("Ruby On The Nail", 9, 12, 9, 6, 10, 11, 11, "RubyOnTheNail");
let drfr_season3 = [afrodite, edeha, filip, leona, lula, magnetica, misty, norma, perseo, ruby];
//FRANCE ALL STARS 1
let allstars_fr1 = [elips, kam, bigbertha, magnetica, mami, misty, moon, piche, punani, soa];
//DRAG RACE PHILIPPINES 1 acting, comedy, dance, design, improv, runway, lipsync
let brigiding = new Queen("Brigiding", 6, 5, 8, 8, 4, 9, 10, "Brigiding");
let corazon = new Queen("Corazon", 4, 5, 4, 3, 4, 7, 5, "Corazon");
let eva = new Queen("Eva Le Queen", 6, 9, 8, 7, 8, 10, 8, "EvaLeQueen");
let gigiEra = new Queen("Gigi Era", 5, 5, 4, 5, 5, 6, 7, "GigiEra");
let morgana = new Queen("Lady Morgana", 6, 6, 7, 7, 5, 8, 11, "LadyMorgana");
let marinaSummers = new Queen("Marina Summers", 8, 9, 14, 10, 10, 15, 13, "MarinaSummers");
let minty = new Queen("Minty Fresh", 6, 5, 4, 12, 4, 11, 9, "MintyFresh");
let precious = new Queen("Precious Paula Nicole", 8, 8, 10, 7, 9, 9, 9, "PreciousPaulaNicole");
let prince = new Queen("Prince", 4, 4, 4, 4, 4, 7, 4, "Prince");
let turing = new Queen("Turing", 6, 6, 9, 6, 6, 7, 9, "Turing");
let vinas = new Queen("Viñas DeLuxe", 6, 8, 8, 10, 8, 11, 7, "VinasDeLuxe");
let xilhouete = new Queen("Xilhouete", 6, 10, 6, 8, 11, 10, 8, "Xilhouete");
let drph_season1 = [brigiding, corazon, eva, gigiEra, morgana, marinaSummers, minty, precious, prince, turing, vinas, xilhouete];
//DRAG RACE PHILIPPINES 2
let arizona = new Queen("Arizona Brandy", 8, 9, 9, 6, 10, 8, 11, "ArizonaBrandy");
let astrid = new Queen("Astrid Mercury", 4, 4, 4, 4, 4, 4, 4, "AstridMercury");
let bernie = new Queen("Bernie", 8, 7, 11, 9, 10, 13, 11, "Bernie");
let katkat = new Queen("Captivating Katkat", 10, 10, 11, 8, 11, 13, 10, "CaptivatingKatkat");
let deedee = new Queen("Dee Dee Marié Holliday", 6, 6, 10, 9, 6, 9, 8, "DeeDeeMarieHolliday");
let hana = new Queen("Hana Beshie", 9, 9, 6, 9, 9, 10, 9, "HanaBeshie");
let m1ss = new Queen("M1ss Jade So", 7, 9, 9, 9, 8, 9, 10, "M1ssJadeSo");
let matilduh = new Queen("Matilduh", 6, 6, 6, 9, 6, 9, 9, "Matilduh");
let nicoleP = new Queen("Nicole Pardaux", 4, 4, 4, 4, 4, 4, 4, "NicolePardaux");
let ovcunt = new Queen("ØV CÜNT", 10, 10, 8, 7, 9, 9, 7, "OVCUNT");
let tiny = new Queen("Tiny Deluxe", 6, 6, 5, 5, 5, 6, 8, "TinyDeluxe");
let veruschka = new Queen("Veruschka Levels", 6, 6, 6, 10, 6, 10, 7, "VeruschkaLevels");
let drph_season2 = [arizona, astrid, bernie, katkat, deedee, hana, m1ss, matilduh, nicoleP, ovcunt, tiny, veruschka];
//DRAG RACE PHILIPPINES 3
let angel = new Queen("Angel", 8, 11, 10, 6, 9, 9, 11, "Angel");
let jquinn = new Queen("J Quinn", 7, 6, 6, 8, 5, 10, 8, "JQuinn");
let john = new Queen("John Fedellaga", 8, 9, 8, 8, 10, 11, 8, "JohnFedellaga");
let khianna = new Queen("Khianna", 10, 8, 11, 10, 9, 12, 13, "Khianna");
let maxie = new Queen("Maxie", 10, 9, 12, 9, 11, 11, 12, "Maxie");
let myx = new Queen("Myx Chanel", 9, 7, 7, 10, 7, 10, 10, "MyxChanel");
let popstar = new Queen("Popstar Bench", 8, 7, 9, 8, 7, 9, 11, "PopstarBench");
let tita = new Queen("Tita Baby", 9, 10, 8, 6, 10, 9, 12, "TitaBaby");
let versex = new Queen("Versex", 6, 5, 5, 5, 5, 7, 6, "Versex");
let yudipota = new Queen("Yudipota", 9, 7, 6, 10, 6, 8, 6, "Yudipota");
let zymba = new Queen("Zymba Ding", 10, 6, 10, 9, 7, 10, 12, "ZymbaDing");
let drph_season3 = [angel, jquinn, john, khianna, maxie, myx, popstar, tita, versex, yudipota, zymba];
//DRAG RACE BELGIQUE 1
let amanda = new Queen("Amanda Tears", 7, 6, 6, 6, 6, 8, 8, "AmandaTears");
let athena = new Queen("Athena Likis", 9, 6, 7, 6, 8, 13, 9, "AthenaLikis");
let brittany = new Queen("Brittany Von Bottoks", 5, 5, 5, 5, 5, 5, 5, "BrittanyVonBottoks");
let dragCouenne = new Queen("Drag Couenne", 12, 11, 7, 9, 8, 13, 9, "DragCouenne");
let edna = new Queen("Edna Sorgelsen", 7, 6, 6, 7, 6, 9, 7, "EdnaSorgelsen");
let mademoiselle = new Queen("Mademoiselle Boop", 9, 9, 7, 7, 10, 9, 8, "MademoiselleBoop");
let moca = new Queen("Mocca Bone", 7, 7, 7, 6, 6, 9, 10, "MoccaBone");
let peach = new Queen("Peach", 10, 6, 6, 9, 6, 9, 8, "Peach");
let susan = new Queen("Susan", 5, 10, 7, 10, 9, 9, 9, "Susan");
let valenciaga = new Queen("Valenciaga", 5, 5, 6, 8, 6, 10, 9, "Valenciaga");
let drbl_season1 = [amanda, athena, brittany, dragCouenne, edna, mademoiselle, moca, peach, susan, valenciaga];
//DRAG RACE BELGIQUE 2
let alvilda = new Queen("Alvilda", 10, 11, 12, 10, 10, 12, 10, "Alvilda");
let chloe = new Queen("Chloe Clarke", 6, 10, 9, 7, 10, 12, 10, "ChloeClarke");
let gabanna = new Queen("Gabanna", 9, 8, 8, 8, 7, 9, 8, "Gabanna");
let veuve = new Queen("La Veuve", 12, 11, 6, 7, 9, 9, 8, "LaVeuve");
let loulou = new Queen("Loulou Velvet", 7, 8, 8, 10, 9, 10, 9, "LoulouVelvet");
let yoko = new Queen("Madame Yoko", 6, 6, 5, 9, 6, 8, 7, "MadameYoko");
let morphae = new Queen("Morphae", 6, 6, 8, 7, 6, 9, 7, "Morphae");
let sarahLogan = new Queen("Sarah Logan", 4, 4, 4, 4, 4, 4, 4, "SarahLogan");
let starQueen = new Queen("Star", 6, 6, 7, 7, 6, 7, 8, "Star");
let drbl_season2 = [alvilda, chloe, gabanna, veuve, loulou, yoko, morphae, sarahLogan, starQueen];
//DRAG RACE SVERIGE acting comedy dance design improv runway lipsync
let admira = new Queen("Admira Thunderpussy", 10, 10, 10, 9, 10, 11, 9, "AdmiraThunderpussy");
let almighty = new Queen("Almighty Aphroditey", 4, 4, 4, 4, 4, 7, 5, "AlmightyAphroditey");
let antonina = new Queen("Antonina Nutshell", 6, 6, 8, 6, 5, 5, 6, "AntoninaNutshell");
let elecktra = new Queen("Elecktra", 9, 9, 6, 7, 9, 10, 9, "Elecktra");
let endigo = new Queen("Endigo", 6, 5, 6, 6, 5, 9, 8, "Endigo");
let fontana = new Queen("Fontana", 9, 8, 8, 6, 8, 9, 11, "Fontana");
let imaa = new Queen("Imaa Queen", 6, 6, 6, 11, 5, 14, 7, "ImaaQueen");
let santana = new Queen("Santana Sexmachine", 6, 8, 7, 9, 8, 10, 9, "SantanaSexmachine");
let vanityVain = new Queen("Vanity Vain", 7, 7, 9, 12, 6, 12, 10, "VanityVain");
let drsv = [admira, almighty, antonina, elecktra, endigo, fontana, imaa, santana, vanityVain];
//DRAG RACE MEXICO 1
let argennis = new Queen("Argennis", 9, 7, 5, 10, 6, 9, 12, "Argennis");
let cristian = new Queen("Cristian Peralta", 9, 13, 11, 12, 11, 12, 11, "CristianPeralta");
let gala = new Queen("Gala Varo", 9, 5, 10, 9, 6, 11, 12, "GalaVaro");
let kero = new Queen("Lady Kero", 7, 7, 7, 9, 9, 10, 11, "LadyKero");
let margaret = new Queen("Margaret Y Ya", 5, 6, 9, 9, 6, 9, 9, "MargaretYYa");
let matraka = new Queen("Matraka", 10, 8, 10, 10, 9, 12, 11, "Matraka");
let vallarta = new Queen("Miss Vallarta", 4, 4, 4, 4, 4, 4, 4, "MissVallarta");
let pixiePixie = new Queen("Pixie Pixie", 8, 8, 6, 8, 6, 10, 8, "PixiePixie");
let regina = new Queen("Regina Voce", 11, 10, 9, 9, 8, 8, 10, "ReginaVoce");
let serenaM = new Queen("Serena Morena", 6, 6, 5, 6, 6, 8, 8, "SerenaMorena");
let vermelha = new Queen("Vermelha Noir", 4, 4, 4, 5, 4, 7, 5, "VermelhaNoir");
let drmx_season1 = [argennis, cristian, gala, kero, margaret, matraka, vallarta, pixiePixie, regina, serenaM, vermelha];
// DRAG RACE MEXICO 2
let avaP = new Queen("Ava Pocket", 7, 6, 10, 8, 6, 9, 10, "AvaPocket");
let elektraV = new Queen("Elektra Vandergeld", 7, 8, 10, 12, 8, 14, 11, "ElektraVandergeld");
let evaB = new Queen("Eva Blunt", 9, 9, 9, 10, 9, 12, 10, "EvaBlunt");
let garconne = new Queen("Garçonne", 7, 7, 6, 10, 7, 11, 7, "Garconne");
let horacio = new Queen("Horacio Potasio", 7, 9, 13, 9, 6, 12, 15, "HoracioPotasio");
let ignus = new Queen("Ignus Ars", 4, 4, 4, 4, 4, 4, 4, "IgnusArs");
let jenary = new Queen("Jenary Bloom", 10, 8, 10, 7, 10, 9, 12, "JenaryBloom");
let leexa = new Queen("Leexa Fox", 9, 10, 12, 10, 9, 13, 13, "LeexaFox");
let lunaL = new Queen("Luna Lansman", 9, 11, 7, 10, 10, 9, 9, "LunaLansman");
let mariaB = new Queen("María Bonita", 6, 6, 7, 9, 6, 10, 8, "MariaBonita");
let ninaD = new Queen("Nina De La Fuente", 5, 5, 5, 6, 5, 8, 7, "NinaDeLaFuente");
let suculenta = new Queen("Suculenta", 7, 8, 7, 6, 7, 6, 7, "Suculenta");
let unique = new Queen("Unique", 9, 10, 6, 7, 11, 7, 12, "Unique");
let drmx_season2 = [avaP, elektraV, evaB, garconne, horacio, ignus, jenary, leexa, lunaL, mariaB, ninaD, suculenta, unique];
//DRAG RACE BRASIL 1
let aquarela = new Queen("Aquarela", 6, 6, 7, 5, 7, 8, 9, "Aquarela");
let betina = new Queen("Betina Polaroid", 7, 10, 6, 9, 7, 10, 7, "BetinaPolaroid");
let dallas = new Queen("Dallas de Vil", 5, 8, 9, 5, 9, 8, 10, "DallasdeVil");
let diva = new Queen("Diva More", 4, 4, 4, 4, 4, 4, 4, "DivaMore");
let hellena = new Queen("Hellena Malditta", 9, 10, 9, 10, 10, 10, 9, "HellenaMalditta");
let melusine = new Queen("Melusine Sparkle", 8, 6, 8, 6, 6, 9, 8, "MelusineSparkle");
let miranda = new Queen("Miranda Lebrão", 9, 10, 7, 10, 9, 9, 8, "MirandaLebrao");
let naza = new Queen("Naza", 8, 6, 8, 9, 6, 9, 10, "Naza");
let organzza = new Queen("Organzza", 11, 9, 11, 8, 9, 12, 10, "Organzza");
let rubi = new Queen("Rubi Ocean", 7, 5, 9, 9, 6, 9, 9, "RubiOcean");
let shannon = new Queen("Shannon Skarllet", 10, 8, 10, 7, 7, 10, 11, "ShannonSkarllet");
let tristan = new Queen("Tristan Soledade", 6, 6, 8, 6, 6, 6, 6, "TristanSoledade");
let drbr_season1 = [aquarela, betina, dallas, diva, hellena, melusine, miranda, naza, organzza, rubi, shannon, tristan];
//DRAG RACE BRASIL 2
let adora = new Queen("Adora Black", 7, 7, 7, 7, 7, 7, 7, "AdoraBlack");
let bhelchi = new Queen("Bhelchi", 7, 7, 7, 7, 7, 7, 7, "Bhelchi");
let chanelbr = new Queen("Chanel", 7, 7, 7, 7, 7, 7, 7, "Chanelbr");
let desiree = new Queen("DesiRée Beck", 7, 7, 7, 7, 7, 7, 7, "DesiReeBeck");
let melina = new Queen("Melina Blley", 7, 7, 7, 7, 7, 7, 7, "MelinaBlley");
let mellody = new Queen("Mellody Queen", 7, 7, 7, 7, 7, 7, 7, "MellodyQueen");
let mercedez = new Queen("Mercedez Vulcão", 7, 7, 7, 7, 7, 7, 7, "MercedezVulcao");
let paola = new Queen("Paola Hoffmann Van Cartier", 7, 7, 7, 7, 7, 7, 7, "PaolaHoffmannVanCartier");
let poseidon = new Queen("Poseidon Drag", 7, 7, 7, 7, 7, 7, 7, "PoseidonDrag");
let rubyNox = new Queen("Ruby Nox", 7, 7, 7, 7, 7, 7, 7, "RubyNox");
let drbr_season2 = [adora, bhelchi, chanelbr, desiree, melina, mellody, mercedez, paola, poseidon, rubyNox];
//DRAG RACE GERMANY
let barbie = new Queen("Barbie Q", 4, 4, 4, 4, 4, 9, 4, "BarbieQ");
let kellyH = new Queen("Kelly Heelton", 8, 10, 9, 9, 10, 12, 9, "KellyHeelton");
let lele = new Queen("LéLé Cocoon", 6, 6, 8, 8, 6, 10, 7, "LeLeCocoon");
let loreley = new Queen("Loreley Rivers", 7, 5, 8, 9, 9, 11, 12, "LoreleyRivers");
let metamorkid = new Queen("Metamorkid", 10, 9, 10, 9, 9, 10, 9, "Metamorkid");
let nikita = new Queen("Nikita Vegas", 10, 9, 8, 8, 7, 7, 7, "NikitaVegas");
let pandoraNox = new Queen("Pandora Nox", 9, 9, 9, 11, 9, 14, 12, "PandoraNox");
let tessa = new Queen("Tessa Testicle", 6, 6, 6, 9, 6, 8, 12, "TessaTesticle");
let naomy = new Queen("The Only Naomy", 6, 6, 5, 8, 6, 8, 9, "TheOnlyNaomy");
let victoriaShakespears = new Queen("Victoria Shakespears", 8, 7, 9, 5, 8, 9, 12, "VictoriaShakespears");
let yvonne = new Queen("Yvonne Nightstand", 10, 10, 7, 7, 9, 11, 9, "YvonneNightstand");
let drgr = [barbie, kellyH, lele, loreley, metamorkid, nikita, pandoraNox, tessa, naomy, victoriaShakespears, yvonne];
//SPECIAL
let pangina = new Queen("Pangina Heals", 9, 7, 14, 11, 8, 13, 14, "Pangina");
//vs The World
let ukvstw_1 = [baga, blu, cheryl, janey, jimbo, jujubee, lemon, monique, pangina];
let ukvstw_2 =[arantxa, choriza, gothy, hannah, jonbers, keta, grandedame, marinaSummers, mayhem, scarlet, tia];
let canvstw_1 = [anita, icesis, kendall, rajah, rita, silky, stephanie, victoriaS, vanity];
let canvstw_2 = [alexis, cheryl, eureka, kennedy, kahena, leFil, lemon, fiercalicious, tynomi];
//Global All Stars
let gas_1 = [alyssa, athena, eva, gala, kitty, kweenKong, miranda, nehellenia, pythia, soa, tessa, vanityVain];
let BonesUK7 = new Queen("Bones", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ad/BonesDRUK7CastMug.jpg", true);
let BonnieAnnClydeUK7 = new Queen("Bonnie Ann Clyde", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3d/BonnieAnnClydeDRUK7CastMug.jpg", true);
let CatrinFeelingsUK7 = new Queen("Catrin Feelings", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/57/CatrinFeelingsDRUK7CastMug.jpg", true);
let ChaiTGrandeUK7 = new Queen("Chai T. Grande", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/ChaiTGrandeDRUK7CastMug.jpg", true);
let ElleVosqueUK7 = new Queen("Elle Vosque", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1f/ElleVosqueDRUK7CastMug.jpg", true);
let NyongbellaUK7 = new Queen("Nyongbella", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/02/NyongbellaDRUK7CastMug.jpg", true);
let PaigeThreeUK7 = new Queen("Paige Three", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3f/PaigeThreeDRUK7CastMug.jpg", true);
let PastyUK7 = new Queen("Pasty", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bf/PastyDRUK7CastMug.jpg", true);
let SallyTMUK7 = new Queen("Sally™", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/56/Sally%E2%84%A2DRUK7CastMug.jpg", true);
let SilllexaDictionUK7 = new Queen("Silllexa Diction", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cb/SilllexaDictionDRUK7CastMug.jpg", true);
let TayrisMongardiUK7 = new Queen("Tayris Mongardi", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e9/TayrisMongardiDRUK7CastMug.jpg", true);
let ViolaUK7 = new Queen("Viola", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7d/ViolaDRUK7CastMug.jpg", true);

let UK7_Cast = [BonesUK7, BonnieAnnClydeUK7, CatrinFeelingsUK7, ChaiTGrandeUK7, ElleVosqueUK7, NyongbellaUK7, PaigeThreeUK7, PastyUK7, SallyTMUK7, SilllexaDictionUK7, TayrisMongardiUK7, ViolaUK7];

let allQueens = [
    akashia, bebe, jade, ninaf, ongina, rebecca, shannel, tammie, victoria,
    jessica, jujubee, morgan, mystique, nicole, pandora, raven, sahara, shangela, sonique, tatianna, tyra,
    alexis, carmen, delta, india, manila, mariah, mimi, phoenix, raja, stacey, venus, yara,
    alisa, chad, dida, jiggly, kenya, leshauwn, latrice, madame, milan, phiphi, sharon, princess, willam,
    alaska, alyssa, coco, detox, honey, ivy, jadejolie, jinkx, lineysha, monica, penny, roxxxy, serena, vivienne,
    adore, april, bendelacreme, bianca, courtney, darienne, gia, joslyn, kelly, laganja, magnolia, milk, trinityk, vivacious,
    ginger, jaidynn, jasmine, kandy, katya, kennedy, max, fame, kasha, pearl, sashab, tempest, trixie, violet,
    acid, bob, chichi, cynthia, dax, derrick, kim, laila, naomi, naysha, robbie, thorgy,
    aja, alexism, charlie, eureka, farrah, jaymes, kimora, ninab, peppermint, sasha, shea, trinity, valentina,
    aquaria, asia, blair, dusty, kalorie, kameron, mayhem, miz, monet, monique, vanessa, vixen, yuhua,
    akeria, ariel, brooke, honeyd, kahanna, mercedes, ninaw, plastique, rajah, scarlet, shuga, silky, soju, yvie,
    aiden, brita, crystal, dahlia, gigi, heidi, jackie, jaida, jan, nicky, rock, sherry, widow,
    denali, elliott, mik, joey, kahmora, kandym, lala, olivia, rose, symone, tamisha, tina, utica,
    alyssaH, angeria, bosco, daya, deja, jasmineK, jorgeous, june, kerri, kornbread, cadmen, maddy, orion, willow,
    amethyst, anetra, auraMayari, irene, jax, loosey, luxx, malaysia, marcia, mistress, poppy, robin, salina, sashaColby, spice, sugar,
    amandaTori, dawn, geneva, hershii, megami, mhiya, mirage, morphine, nymphia, jane, plasma, qQueen, sapphira, xunami,
    acacia, arrietty, crystalE, hormona, jewels, joella, kori, lana, lexi, lucky, lydia, onya, samStar, suzie,
    baga, blu, cheryl, crystaluk, divina, gothy, scaredy, sumting, viv, vinegar,
    awhora, asttina, bimini, cherry, ellie, ginny, joe, lawrence, sister, tayce, tia, veronica,
    anubis, charity, choriza, elektraF, ella, kitty, krystal, river, scarlett, vanity, victoriaS,
    baby, black, cheddar, copper, dakota, danny, jonbers, just, leFil, pixie, sminty, starlet,
    alexisSP, banksie, cara, dedelicious, gingerJ, kate, michael, naomiC, tomara, vicki,
    actavia, chanelO, charra, dita, kikiS, kyran, lavoix, lill, marmalade, rileasa, saki, zahirah,
    anastarzia, boa, ilona, jimbo, juice, kiara, kyne, lemon, priyanka, rita, bobo, tynomi,
    adriana, beth, eve, giametric, icesis, kendall, kimoraA, oceane, pythia, stephanie, suki, synthia,
    bombae, chelazon, gisele, halal, irma, jadashada, kaos, kimmy, boomboom, fiercalicious, moco, vanderpuss,
    aimee, auroraM, denim, kiki, kitten, luna, melinda, nearah, sisi, girlfriend, venusCan,
    helena, jaylene, makayla, minhi, perla, sanjina, tara, virgo, tiffany, uma, xana,
    chelsea, envy, janey, madamem, mama, megan, abby, patty, roem, sederginne,
    ivyelise, juicy, keta, love, mlp, reggy, tabitha, countess, vanessaC, vivaldi,
    amadiva, annee, b, bunny, dearis, jaja, meannie, morrigan, natalia, petchra,
    angele, bandit, genie, kana, kandyz, katy, m, maya, mocha, gimhuay, silver, srimala, tormai, vanda,
    benze, frankie, gawdland, gigiF, kara, nane, shortgun, siam, spicy, srirasha, zepee,
    anita, art, cocoj, elektra, etc, jojo, karen, kita, maxi, scarletAdams,
    aubrey, beverly, faux, hannah, kweenKong, minnie, molly, pomara, spankie, yuri,
    amyl, ashley, bumpa, flor, gabriella, hollywould, isis, ivanna, ivory, ritaMenu,
    brenda, freya, karna, lazy, lucina, mandy, maxdq, nikitaI, oliviaD, vybe,
    arantxa, carmenf, dovima, drag, hugaceo, inti, killer, pupi, sagittaria, macarena,
    arielRec, diamante, sethlas, estrella, jota, juriji, marina, marisa, onyx, samantha, sharonne, venedita,
    bestiah, chanel, clover, chuchi, hornella, maria, kellyRoller, pakita, pink, pitita, vania, visa,
    angelita, chloeV, ditaD, kellyP, lanina, lecoco, mariana, megui, khristo, porca, shani, vampirashian,
    ava, divinity, elecktraBionic, enorma, farida, ivana, riche, luquisha,
    aura, gioffre, diamond, petite, narciso, nehellenia, obama, panthera, skandalove, tanissa,
    adrianaP, amy, prada, sheeva, leila, aurora, lina, melissa, morganaC, silvana, sissy, sypario, vezirja,
    elips, kam, bigbertha, briochee, grandedame, kahena, lolita, lova, paloma, soa,
    cookie, gingerB, keiona, kittyS, mami, moon, piche, punani, roseF, sara, vespi,
    afrodite, edeha, filip, leona, lula, magnetica, misty, norma, perseo, ruby,
    brigiding, corazon, eva, gigiEra, morgana, marinaSummers, minty, precious, prince, turing, vinas, xilhouete,
    arizona, astrid, bernie, katkat, deedee, hana, m1ss, matilduh, nicoleP, ovcunt, tiny, veruschka,
    angel, jquinn, john, khianna, maxie, myx, popstar, tita, versex, yudipota, zymba,
    amanda, athena, brittany, dragCouenne, edna, mademoiselle, moca, peach, susan, valenciaga,
    alvilda, chloe, gabanna, veuve, loulou, yoko, morphae, sarahLogan, starQueen,
    admira, almighty, antonina, elecktra, endigo, fontana, imaa, santana, vanityVain,
    argennis, cristian, gala, kero, margaret, matraka, vallarta, pixiePixie, regina, serenaM, vermelha,
    avaP, elektraV, evaB, garconne, horacio, ignus, jenary, leexa, lunaL, mariaB, ninaD, suculenta, unique,
    aquarela, betina, dallas, diva, hellena, melusine, miranda, naza, organzza, rubi, shannon, tristan,
    adora, bhelchi, chanelbr, desiree, melina, mellody, mercedez, paola, poseidon, rubyNox,
    barbie, kellyH, lele, loreley, metamorkid, nikita, pandoraNox, tessa, naomy, victoriaShakespears, yvonne,
    pangina, BonesUK7, BonnieAnnClydeUK7, CatrinFeelingsUK7, ChaiTGrandeUK7, ElleVosqueUK7, NyongbellaUK7, PaigeThreeUK7, PastyUK7, SallyTMUK7, SilllexaDictionUK7, TayrisMongardiUK7, ViolaUK7
].concat(customQueens).sort((a,b) => a.getName().toLowerCase().localeCompare(b.getName().toLowerCase()));

// ==============================
// GLOBAL VARIABLES
// ==============================
let fullCast = [];
let currentCast = [];
let eliminatedCast = [];

let wildcardType = "merge";
let wildcardUsed = false;

let BracketA = [];
let BracketB = [];
let BracketC = [];
let Mergers = [];

let isDesignChallenge = false;
let episodeChallenges = [];

let phase = "bracket"; // bracket, merge, finale
let currentBracketIndex = 0;
let episodeCount = 0;

let mergeFormat = "normal";
let judgingType = "canon";

let amountPassers = 3;
let seasonOver = false;

let topQueens = [];
let bottomQueens = [];

const MAX_QUEENS = 18;
const QUEENS_PER_BRACKET = 6;
const BRACKETS = ["A", "B", "C"];

// ==============================
// UTILITY FUNCTIONS
// ==============================
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

// ==============================
// SCREEN CLASS
// ==============================
class Scene {
    constructor(div = undefined) {
        this._MainBlock = div || document.querySelector("div#simulation-block");
        if (div) document.querySelector("div#simulation-block").appendChild(this._MainBlock);
    }

    clean() {
        this._MainBlock.innerHTML = '';
        this.createRightClick();
        let scrollup = document.querySelector(".toTop");
        window.addEventListener("scroll", () => {
            scrollup.classList.toggle("active", window.scrollY > 100);
        });
    }

    createRightClick() {
        if (!document.getElementById("inputRightKey")) {
            let text = document.createElement("input");
            text.className = "textRightClick";
            text.id = "inputRightKey";
            text.type = "text";
            text.readOnly = true;
            this._MainBlock.parentElement.appendChild(text);
        }
    }

    createHeader(text) {
        document.getElementById("MainTitle").innerHTML = text;
    }

    createBigText(text) {
        let big = document.createElement("big");
        let p = document.createElement("p");
        big.innerHTML = text;
        p.appendChild(big);
        this._MainBlock.appendChild(p);
    }

    createParagraph(text, id = '') {
        let p = document.createElement("p");
        p.innerHTML = text;
        if (id) p.id = id;
        this._MainBlock.appendChild(p);
    }

    createBold(text, id = '', id1 = '') {
        let p = document.createElement("p");
        if (id1) p.id = id1;
        let bold = document.createElement("b");
        if (id) bold.id = id;
        bold.innerHTML = text;
        p.appendChild(bold);
        this._MainBlock.appendChild(p);
    }

    createButton(text, method, id = '') {
        let button = document.createElement("button");
        button.innerHTML = text;
        if (id) button.id = id;
        button.setAttribute("onclick", method);
        this._MainBlock.appendChild(button);
        if (text === "Proceed" || text === "Show result") {
            let textField = document.getElementById("inputRightKey");
            textField.focus();
            textField.addEventListener("keydown", (e) => {
                let key = e.key;
                if (key === "ArrowRight" && document.querySelector("button[onclick='`${method}`']") == button) {
                    e.target.remove();
                    button.click();
                    this.goToTop();
                }
            }, {once: true});
            document.addEventListener("click", e => {
                if (e.target.matches('div#simulation-block') === false && e.target.matches('select') === false) {
                    textField.focus();
                }
            });
        }
    }

    createHorizontalLine() {
        this._MainBlock.appendChild(document.createElement("hr"));
    }

    createImage(source, color = "black") {
        let image = document.createElement("img");
        image.src = source;
        image.style.cssText = `border-color: ${color}; width: 105px; height: 105px;`;
        this._MainBlock.appendChild(image);
    }

    goToTop() {
        this._MainBlock.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==============================
// CHALLENGES
// ==============================
class Challenge {
    generateDescription() {}
    rankPerformances() {}
}

function sortPerformances(cast) {
    cast.sort((a, b) => (a.performanceScore - b.performanceScore));
}

class MiniChallenge extends Challenge {
    generateDescription() {
        const description = document.getElementById("description");
        const a = [
            "wigs with ", "a quiz about ", "nails with ", "a competition about ",
            "a song about ", "make-up tutorials with ", "make a quick look about ", "a photoshoot about "
        ];
        const b = [
            "the pitcrew.", "a partner.", "noodles.", "hip pads.", "balls.", "past Drag Race contestants", "a celebrity."
        ];
        description.innerHTML = `In today's mini-challenge, the queens will do ${a[randomNumber(0, a.length - 1)]}${b[randomNumber(0, b.length - 1)]}`;
    }

    rankPerformances() {
        const screen = new Scene();
        const winner = currentCast[randomNumber(0, currentCast.length - 1)];

        screen.createImage(winner.image);
        winner.miniEpisode.push(episodeCount - 1);
        screen.createBold(`${winner.getName()} won the mini-challenge!`);
    }
}

class DesignChallenge extends Challenge {
    generateDescription() {
        const description = document.getElementById("description");
        const a = [
            "trash.",
            "random items.",
            "dollar store items.",
            "a specific color scheme.",
            "fossilized cacao leaves.",
            "bags.",
            "wigs.",
            "curtains.",
            "sea items."
        ];
        description.innerHTML = `The queens will do outfits with ${a[randomNumber(0, a.length - 1)]}`;
    }

    rankPerformances() {
        for (let i = 0; i < currentCast.length; i++) {
            currentCast[i].getDesign();
        }
        sortPerformances(currentCast);
    }
}

// ==============================
// SEARCH AND CAST MANAGEMENT
// ==============================
const searchInput = document.getElementById("queen-search");
const suggestionBox = document.getElementById("queen-suggestions");
const passersSlider = document.getElementById("passers-slider");
const passersValue = document.getElementById("passers-value");

passersSlider.addEventListener("change", function() {
    passersValue.textContent = `${passersSlider.value} Passers`;
    amountPassers = passersSlider.value;
});

searchInput.addEventListener("input", () => {
    const query = normalizeString(searchInput.value);
    suggestionBox.innerHTML = "";
    if (!query) return;

    const matches = allQueens.filter(q => !currentCast.includes(q) && normalizeString(q.getName()).includes(query));
    if (!matches.length) return;

    const ul = document.createElement("ul");
    matches.forEach(q => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${q.image}" alt="${q.getName()}"><span>${q.getName()}</span>`;
        li.addEventListener("click", () => {
            if (currentCast.length >= MAX_QUEENS) return alert("You cannot add more than 18 queens.");
            currentCast.push(q);
            searchInput.value = "";
            suggestionBox.innerHTML = "";
            updateCastScreen();
        });
        ul.appendChild(li);
    });
    suggestionBox.appendChild(ul);
});

document.addEventListener("click", e => {
    if (!suggestionBox.contains(e.target) && e.target !== searchInput) suggestionBox.innerHTML = "";
});

function createCast() {
    for (let i = 0; i < MAX_QUEENS; i++) {
        const eligible = allQueens.filter(q => !currentCast.includes(q));
        const randomQueen = eligible[randomNumber(0, eligible.length - 1)];
        currentCast.push(randomQueen);
        updateCastScreen();
    }
}

function addRandomQueen() {
    if (currentCast.length >= MAX_QUEENS) return alert("You cannot add more than 18 queens.");
    const eligible = allQueens.filter(q => !currentCast.includes(q));
    const randomQueen = eligible[randomNumber(0, eligible.length - 1)];
    currentCast.push(randomQueen);
    updateCastScreen();
}

// ==============================
// CREATE CAST ITEM
// ==============================
function createCastItem(q) {
    const div = document.createElement("div");
    div.className = "cast-item";
    div.setAttribute("draggable", true);

    const img = document.createElement("img");
    img.src = q.image;
    img.alt = q.getName();

    const name = document.createElement("p");
    name.innerText = q.getName();

    const button = document.createElement("i");
    button.className = "fa-solid fa-xmark";
    button.addEventListener("click", () => {
        currentCast = currentCast.filter(c => c !== q);
        delete q.assignedBracket;
        updateCastScreen();
    });

    div.append(img, name, button);
    return div;
}

// ==============================
// UPDATE CAST SCREEN
// ==============================
function updateCastScreen() {
    const container = document.getElementById("cast-container");
    const bracketsContainer = document.getElementById("brackets-container");
    const logo = document.querySelector("#casting-block #logo");

    logo.classList.toggle("hidden", currentCast.length > 0);
    container.innerHTML = '';

    if (currentCast.length < MAX_QUEENS) {
        bracketsContainer?.classList.add("hidden");
        currentCast.forEach(q => container.appendChild(createCastItem(q)));
        createStartButton();
        return;
    }

    bracketsContainer.classList.remove("hidden");

    let pool = document.getElementById("unassigned-queens");
    if (!pool) {
        pool = document.createElement("div");
        pool.id = "unassigned-queens";
        pool.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;";
        container.appendChild(pool);
    }
    pool.innerHTML = '';

    let randomBtn = document.getElementById("randomize-brackets-btn");
    if (!randomBtn) {
        randomBtn = document.createElement("button");
        randomBtn.id = "randomize-brackets-btn";
        randomBtn.innerText = "Randomize Brackets";
        randomBtn.style.margin = "10px";
        randomBtn.addEventListener("click", randomizeBrackets);
        bracketsContainer.parentElement.insertBefore(randomBtn, bracketsContainer);
    }

    document.querySelectorAll(".bracket-queens").forEach(be => {
        be.innerHTML = '';
        const bracket = be.parentElement.dataset.bracket;
        const count = currentCast.filter(q => q.assignedBracket === bracket).length;
        be.parentElement.style.border = count < QUEENS_PER_BRACKET ? "2px solid red" : "2px solid transparent";
    });

    currentCast.forEach(q => {
        const div = createCastItem(q);
        if (q.assignedBracket) {
            const bracketDiv = document.querySelector(`.bracket[data-bracket="${q.assignedBracket}"] .bracket-queens`);
            bracketDiv?.appendChild(div);
        } else {
            pool.appendChild(div);
        }
    });

    initDragAndDrop();
    createStartButton();
}

// ==============================
// DRAG AND DROP
// ==============================
function initDragAndDrop() {
    const pool = document.getElementById("unassigned-queens");
    const brackets = document.querySelectorAll(".bracket-queens");

    let draggingItem = null;

    function handleDrop(targetContainer, draggedItem) {
        const qName = draggedItem.querySelector("p").innerText;
        const q = currentCast.find(c => c.getName() === qName);
        if (!q) return;

        const bracket = targetContainer.parentElement?.dataset.bracket;
        if (bracket && targetContainer.children.length >= QUEENS_PER_BRACKET && !targetContainer.contains(draggedItem)) return;

        q.assignedBracket = bracket || undefined;
        targetContainer.appendChild(draggedItem);

        // Update borders
        document.querySelectorAll(".bracket-queens").forEach(be => {
            const b = be.parentElement.dataset.bracket;
            const count = currentCast.filter(q => q.assignedBracket === b).length;
            be.parentElement.style.border = count < QUEENS_PER_BRACKET ? "2px solid red" : "2px solid transparent";
        });

        createStartButton();
    }

    function startDragging(item, e) {
        draggingItem = item;
        item.classList.add("dragging");

        if (e.type.startsWith("touch")) {
            item.style.position = "absolute";
            item.style.zIndex = 1000;
            moveAt(e.touches[0].pageX, e.touches[0].pageY);

            function moveAt(x, y) {
                item.style.left = x - item.offsetWidth / 2 + "px";
                item.style.top = y - item.offsetHeight / 2 + "px";
            }

            function onTouchMove(eMove) {
                moveAt(eMove.touches[0].pageX, eMove.touches[0].pageY);
            }

            document.addEventListener("touchmove", onTouchMove);

            item.addEventListener("touchend", function onTouchEnd(eEnd) {
                document.removeEventListener("touchmove", onTouchMove);

                const touch = eEnd.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".bracket-queens, #unassigned-queens");

                if (dropTarget) handleDrop(dropTarget, item);

                item.style.position = "";
                item.style.left = "";
                item.style.top = "";
                item.style.zIndex = "";
                item.classList.remove("dragging");

                item.removeEventListener("touchend", onTouchEnd);
                draggingItem = null;
            });
        }
    }

    document.querySelectorAll("#unassigned-queens .cast-item, .bracket-queens .cast-item").forEach(item => {
        item.setAttribute("draggable", true);

        item.addEventListener("dragstart", () => { draggingItem = item; item.classList.add("dragging"); });
        item.addEventListener("dragend", () => { draggingItem.classList.remove("dragging"); draggingItem = null; });

        item.addEventListener("touchstart", e => startDragging(item, e));
    });

    brackets.forEach(bracket => {
        bracket.addEventListener("dragover", e => {
            e.preventDefault();
        });
        bracket.addEventListener("drop", e => {
            e.preventDefault();
            if (draggingItem) handleDrop(bracket, draggingItem);
        });
    });

    pool.addEventListener("dragover", e => e.preventDefault());
    pool.addEventListener("drop", e => {
        e.preventDefault();
        if (draggingItem) handleDrop(pool, draggingItem);
    });
}

// ==============================
// RANDOMIZE BRACKETS
// ==============================
function randomizeBrackets() {
    const unassigned = currentCast.filter(q => !q.assignedBracket);
    unassigned.forEach((q, i) => q.assignedBracket = BRACKETS[i % BRACKETS.length]);
    updateCastScreen();
}

// ==============================
// START SIMULATION
// ==============================
function canStartSimulation() {
    return BRACKETS.every(b => currentCast.filter(q => q.assignedBracket === b).length === QUEENS_PER_BRACKET);
}

function createStartButton() {
    let btn = document.getElementById("start-sim-btn");
    if (btn) btn.remove();
    if (!canStartSimulation()) return;

    btn = document.createElement("button");
    btn.id = "start-sim-btn";
    btn.innerText = "Start Simulation";
    btn.style.margin = "10px";
    btn.addEventListener("click", () => startSimulation());

    document.getElementById("casting-block").appendChild(btn);
}

function loadCast(cast) {
    currentCast = cast;
    updateCastScreen();
}

function startSimulation() {
    fullCast = [...currentCast];
    BracketA = fullCast.filter(q => q.assignedBracket === "A");
    BracketB = fullCast.filter(q => q.assignedBracket === "B");
    BracketC = fullCast.filter(q => q.assignedBracket === "C");

    Mergers = [];
    currentCast = [];
    eliminatedCast = [];

    seasonOver = false;
    phase = "bracket";
    currentBracketIndex = 0;
    episodeCount = 0;

    const main = document.querySelector("div#main-block");
    if (main) {
        main.id = "simulation-block";
    }

    let wildcard = document.getElementById("wildcard-format");
    if (wildcard) {
        wildcardType = wildcard.options[wildcard.selectedIndex].value;
    }

    let judging = document.getElementById("judging-type");
    if (judging) {
        judgingType = judging.options[judging.selectedIndex].value;
    }

    let merge = document.getElementById("merge-format");
    if (merge) {
        mergeFormat = merge.options[merge.selectedIndex].value;
    }

    episodeProcessing();
}

function restartSimulation() {
    BracketA = fullCast.filter(q => q.assignedBracket === "A");
    BracketB = fullCast.filter(q => q.assignedBracket === "B");
    BracketC = fullCast.filter(q => q.assignedBracket === "C");

    Mergers = [];;
    eliminatedCast = [];

    seasonOver = false;
    phase = "bracket";
    currentBracketIndex = 0;
    episodeCount = 0;

    episodeProcessing();
}

// ==============================
// EPISODE FLOW
// ==============================
function loadCurrentBracket() {
    const bracketMap = [BracketA, BracketB, BracketC];
    currentCast = bracketMap[currentBracketIndex];
}

function episodeProcessing() {
    episodeCount++;

    if (phase === "bracket") {
        if (currentBracketIndex === 0) {
            BracketB.forEach(q => {
                q.addToTrackRecord(" ");
            })
            BracketC.forEach(q => {
                q.addToTrackRecord(" ");
            })
        }
        else if (currentBracketIndex === 1) {
            BracketA.forEach(q => {
                q.addToTrackRecord(" ");
            })
            BracketC.forEach(q => {
                q.addToTrackRecord(" ");
            })
        }
        else if (currentBracketIndex === 2) {
            BracketA.forEach(q => {
                q.addToTrackRecord(" ");
            })
            BracketB.forEach(q => {
                q.addToTrackRecord(" ");
            })
        }
        loadCurrentBracket();
        currentCast.forEach(q => q.episodesOn += 1);
        console.log(`Bracket Phase - Episode ${episodeCount}`);
        newEpisode();
    } else if (phase === "merge") {
        console.log(`Merge Phase - Episode ${episodeCount}`);
        eliminatedCast.forEach(q => {
            q.addToTrackRecord("");
        })
        if ((mergeFormat == "regular" && (amountPassers != 1 && episodeCount == 12) || (amountPassers == 1 && episodeCount == 10) ) || (mergeFormat == "longer" && currentCast.length == 4)) {
            startFinale();
            return;
        }
        newEpisode();
        currentCast.forEach(q => q.episodesOn += 1);
    }
}

function toOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function pointCeremony() {
    let screen = new Scene();
    screen.clean();
    screen.createBigText("The point ceremony")
    screen.createHorizontalLine();
    let queensToDonate = currentCast.filter(q => {
        let lastPlacement = q.trackRecord[q.trackRecord.length - 1].trim();
        return lastPlacement !== "WIN";
    });

    queensToDonate.forEach(q => {
        let eligible = currentCast.filter(c => c !== q);
        let chosenQueen = eligible[randomNumber(0, eligible.length - 1)];
        screen.createImage(q.image);
        screen.createImage(chosenQueen.image);
        screen.createBold(`${q.getName()} has given her point to ${chosenQueen.getName()}`);
        chosenQueen.stars += 1;
    });
    screen.createHorizontalLine();
    if (phase === "bracket" && (episodeCount % 3 === 0)) {
        screen.createButton("Announce Passers", "announcePassers()");
    } else {
        screen.createButton("Proceed", "contestantProgress()");
    }
}

function announcePassers() {
    let screen = new Scene();
    screen.clean();

    currentCast.sort((a, b) => b.stars - a.stars);

    const passers = currentCast.slice(0, amountPassers);
    const eliminated = currentCast.filter(queen => !passers.includes(queen));

    passers.forEach(q => {
        if (!Mergers.includes(q)) Mergers.push(q);
        screen.createImage(q.image, "green");
        screen.createBold(`${q.getName()} passed with ${q.stars} MVQ Points!`);
    });

    const totalContestants = 18;
    const eliminatedSoFar = eliminatedCast.length;
    const eliminatedThisRound = eliminated.length;

    const elimStart = totalContestants - eliminatedSoFar - eliminatedThisRound + 1;
    const elimEnd = totalContestants - eliminatedSoFar;

    eliminated.forEach(q => {
        if (!eliminatedCast.includes(q)) eliminatedCast.push(q);
        q.editTrackRecord("ELIM");
        q.rankP = `${toOrdinal(elimStart)}–${toOrdinal(elimEnd)}`;
        screen.createImage(q.image, "sienna");
        screen.createBold(`${q.getName()} has been eliminated.`);
    });


    if (currentBracketIndex < 2) {
        currentBracketIndex++;
        loadCurrentBracket();
        screen.createButton("Proceed", "contestantProgress()");
        return;
    }

    screen.createButton("Proceed", "startMergeAndProceed()");
}

function startMergeAndProceed() {
    phase = "merge";
    currentCast = fullCast.filter(q => !eliminatedCast.includes(q));

    contestantProgress();
}

function newEpisode() {
    miniChallenge();

    topQueens = [];
    bottomQueens = [];
}

function swapBackground(image) {
    document.body.style.backgroundImage = `url(images/background/${image}.png)`;
}

function miniChallenge() {
    isDesignChallenge = false;

    const screen = new Scene();
    screen.clean();
    screen.createBigText("Mini challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");
    const miniChance = 50;
    if (wildcardType === "merge" && !wildcardUsed && phase === "merge") {
        addWildcard();
        wildcardUsed = true;
    }
    if (miniChance > randomNumber(0, 100)) {
        const mini = new MiniChallenge();
        mini.generateDescription();
        mini.rankPerformances();
    } else {
        screen.createBold("Today, there's no mini challenge, let's go to the maxi challenge.");
    }
    generateChallenge()
}

function addWildcard() {
    const screen = new Scene();

    const wildcard = eliminatedCast[randomNumber(0, eliminatedCast.length - 1)];
    const originalRank = wildcard.rankP;

    eliminatedCast = eliminatedCast.filter(q => q !== wildcard);

    if (originalRank && originalRank.includes("–")) {
        const sharedElims = eliminatedCast.filter(q =>
            q.rankP === originalRank &&
            q.assignedBrackets === wildcard.assignedBrackets &&
            !Mergers.includes(q)
        );

        if (sharedElims.length === 1) {
            const onlyQueen = sharedElims[0];
            const match = originalRank.match(/\d+/g);
            if (match && match.length === 2) {
                const newRank = Math.max(parseInt(match[0]), parseInt(match[1]));
                onlyQueen.rankP = toOrdinal(newRank);
            }
        } else if (sharedElims.length > 1) {
            const match = originalRank.match(/\d+/g);
            if (match && match.length === 2) {
                const start = parseInt(match[0]);
                const end = parseInt(match[1]);
                const numNow = sharedElims.length;
                const newStart = end - numNow + 1;
                const newEnd = end;
                const newRank = `${toOrdinal(newStart)}–${toOrdinal(newEnd)}`;
                sharedElims.forEach(q => {
                    q.rankP = newRank;
                });
            }
        }
    }

    if (originalRank) {
        const match = originalRank.match(/\d+/g);
        if (match && match.length === 2) {
            const originalMax = parseInt(match[1]);

            eliminatedCast.forEach(q => {
                if (!q.rankP || Mergers.includes(q)) return;

                const qMatch = q.rankP.match(/^(\d+)(?:st|nd|rd|th)$/);
                if (qMatch) {
                    const qRank = parseInt(qMatch[1]);
                    if (qRank < originalMax) {
                        q.rankP = toOrdinal(qRank + 1);
                    }
                } else {
                    const rangeMatch = q.rankP.match(/^(\d+)[–-](\d+)$/);
                    if (rangeMatch) {
                        let start = parseInt(rangeMatch[1]);
                        let end = parseInt(rangeMatch[2]);
                        if (end < originalMax) {
                            start += 1;
                            end += 1;
                            q.rankP = `${toOrdinal(start)}–${toOrdinal(end)}`;
                        }
                    }
                }
            });
        }
    }

    if (!Mergers.includes(wildcard)) Mergers.push(wildcard);
    if (!currentCast.includes(wildcard)) currentCast.push(wildcard);

    wildcard.ogPlace = originalRank;
    wildcard.rankP = null;
    wildcard.rankRange = null;

    if (wildcard.trackRecord.length > 0) {
        wildcard.trackRecord.pop();
    }

    wildcard.addToTrackRecord("RTRN");

    screen.createImage(wildcard.image, "orange");
    screen.createBold(`${wildcard.getName()}, has been chosen by the wheel to be a wildcard!`);
}

function generateChallenge() {
    const screen = new Scene();
    screen.createButton("Proceed", "designChallenge()");
}

function designChallenge() {
    const screen = new Scene();
    screen.clean();
    screen.createBigText("Maxi challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");

    isDesignChallenge = true;
    episodeChallenges.push("Design");

    const maxi = new DesignChallenge();
    maxi.generateDescription();
    maxi.rankPerformances();
    generateMaxiPerformances();
}

function generateMaxiPerformances() {
    let screen = new Scene();
    screen.createBigText("Queens' performances...");

    const performanceGroups = [
        { name: "slay",   filter: q => q.performanceScore < 6,                              color: "darkblue",  message: "slayed the challenge!" },
        { name: "great",  filter: q => q.performanceScore >= 6 && q.performanceScore < 16,  color: "royalblue", message: "had a great performance!" },
        { name: "good",   filter: q => q.performanceScore >= 16 && q.performanceScore < 26, color: "black",     message: "had a good performance." },
        { name: "bad",    filter: q => q.performanceScore >= 26 && q.performanceScore < 31, color: "pink",      message: "had a bad performance..." },
        { name: "flop",   filter: q => q.performanceScore >= 31 && q.performanceScore < 50, color: "tomato",    message: "flopped the challenge..." }
    ];

    performanceGroups.forEach(group => {
        let queens = currentCast.filter(group.filter);

        if (queens.length > 0) {
            shuffle(queens);

            queens.forEach(q => screen.createImage(q.image, group.color));

            screen.createBold("", group.name);

            let textElement = document.getElementById(group.name);
            textElement.innerHTML = queens.map(q => q.getName()).join(", ") + " " + group.message;
        }
    });

    if (isDesignChallenge || episodeChallenges[episodeChallenges.length - 1] === "Design") {
        for (let i = 0; i < currentCast.length - 1; i++) {
            currentCast[i].runwayScore = 0;
        }
        screen.createButton("Proceed", "judging()");
    } else {
        screen.createButton("Proceed", "runway()");
    }
}

function judging() {
    topQueens = [];
    bottomQueens = [];

    currentCast.sort((a, b) => a.performanceScore - b.performanceScore);

    if (phase === "bracket") {
        let nonTops;
        if (judgingType == "canon") {
            nonTops = currentCast.slice(2)
            topQueens.push(...currentCast.slice(0, 2));
        } else {
            nonTops = currentCast.slice(3)
            topQueens.push(...currentCast.slice(0, 3));
        }

        bottomQueens.push(...nonTops);
        nonTops.forEach(q => {
            if (nonTops.length === 4) {
                q.addToTrackRecord("BTM4");
                q.ppe += 1;
            }
            else if (nonTops.length === 3) {
                if (judgingType == "mixed") {
                    q.addToTrackRecord("BTM3");
                    q.ppe += 1;
                } else {
                    q.addToTrackRecord("SAFE");
                    q.ppe += 3;
                }
            }
        });
    } else {
        if (currentCast.length >= 6) {
            topQueens.push(...currentCast.slice(0, 3));
            bottomQueens.push(...currentCast.slice(-3));
        } else {
            const randomNumber = Math.floor(Math.random() * 100);
            if (randomNumber < 40) {
                topQueens.push(...currentCast.slice(0, 2));
                bottomQueens.push(...currentCast.slice(-3));
            } else if (randomNumber < 70) {
                topQueens.push(...currentCast.slice(0, 3));
                bottomQueens.push(...currentCast.slice(-2));
            } else {
                topQueens.push(...currentCast.slice(0, 2));
                bottomQueens.push(...currentCast.slice(-2));
            }
        }
    }

    judgingScreen();
}

function judgingScreen() {
    let screen = new Scene();
    screen.clean();
    swapBackground("Stage");
    screen.createBigText("Based on tonight's performances...");

    if (phase === "bracket") {
        let totaljudged;
        let highQueen;
        if (judgingType == "canon") {
            totaljudged = shuffle([...topQueens]).slice(0, 2);
        } else {
            totaljudged = [topQueens[0], topQueens[1]];
            highQueen = topQueens[2] || null;
            topQueens.splice(2, 1);
        }

        totaljudged.forEach(q => {
            screen.createImage(q.image, "cyan")
            q.stars += 2;
            q.ppe += 5;
        });
        screen.createBold(
            `${totaljudged.map(q => q.getName()).join(", ")}, you represent the top two All Stars of the week.`,
            "judged"
        );

        if (highQueen) {
            screen.createImage(highQueen.image, "lightblue");
            screen.createBold(
                `${highQueen.getName()}, you are safe, great job!`,
                "high-queen"
            );
            highQueen.ppe += 4;
            highQueen.addToTrackRecord("HIGH");
        }

        screen.createHorizontalLine();

        if (judgingType == "canon" || judgingType == "mixed") {
            bottomQueens.forEach(q => screen.createImage(q.image, "red"));
            screen.createBold(
                `${bottomQueens.map(q => q.getName()).join(", ")}, since you are not in the top, you're in the bottom.`,
                "bottoms"
            );
        } else {
            bottomQueens.forEach(q => screen.createImage(q.image, "black"));
            screen.createBold(
                `${bottomQueens.map(q => q.getName()).join(", ")}, you are all safe.`,
                "safes"
            );
        }

        screen.createButton("Proceed", "topTwo()");

    }  else if (phase === "merge") {
        const totaljudged = shuffle([...topQueens, ...bottomQueens]);

        totaljudged.forEach(q => screen.createImage(q.image, "cyan"));
        screen.createBold(
            `${totaljudged.map(q => q.getName()).join(", ")}, you represent the tops and bottoms of the week.`,
            "judged"
        );

        const safeQueens = currentCast.filter(q => !totaljudged.includes(q));
        if (safeQueens.length > 0) {
            screen.createHorizontalLine();
            screen.createParagraph(
                `${safeQueens.map(q => q.getName()).join(", ")}, you are safe.`,
            );
            safeQueens.forEach(q => {
                const lastIndex = q.trackRecord.length - 1;
                if (q.trackRecord[lastIndex].toUpperCase() === "RTRN") {
                    q.editTrackRecord("SAFE");
                } else {
                    q.addToTrackRecord("SAFE");
                }
                q.ppe += 3;
            })
        }

        screen.createButton("Proceed", "winAndBtms()");
    }
}

let lipsyncsEventsBad = [
    {event: "broke a light of the scenario.", penalization: -1},
    {event: "tripped.", penalization: -3},
    {event: "tried to do a reveal and failed.", penalization: -3},
    {event: "lost their wig!", penalization: -3},
    {event: "lost their heels!", penalization: -3},
    {event: "took off their wig.", penalization: -3},
    {event: "isn't matching the song's energy.", penalization: -3},
    {event: "jumped off the stage.", penalization: -3},
    {event: "is fainting!", penalization: -3},
    {event: "fell!", penalization: -4},
    {event: "doesn't know the words!", penalization: -100},
    {event: "tried to lift up their opponent!", penalization: -7},
    {event: "isn't trying, she's defeated", penalization: -100}
];
let lipsyncsEventsGood = [
    {event: "did the best split of the season!", points: 5},
    {event: "did an amazing reveal!", points: 5},
    {event: "pretend to be tipped by the audience.", points: 4},
    {event: "embodied the song.", points: 3},
    {event: "knew every single word of the song.", points: 3},
    {event: "fake walked out.", points: 3},
    {event: "made a fake split.", points: 2},
    {event: "pulled out a microphone.", points: 2},
    {event: "kissed the guest judge.", points: 2},
    {event: "broke a light of the scenario.", points: 1}
];

function checkForLipsyncEvent(lipsyncContestants) {
    let screen = new Scene();
    let queen = lipsyncContestants[randomNumber(0, lipsyncContestants.length - 1)];
    let roll = randomNumber(0, 1000);

    if (roll >= 900) {
        let event = lipsyncsEventsBad[randomNumber(0, lipsyncsEventsBad.length - 1)];
        if (randomNumber(0, 1000) === 777) event = lipsyncsEventsBad[10];
        if (queen.unfavoritism > 8 && queen.favoritism < 5 && randomNumber(0, 100) >= 70) {
            event = lipsyncsEventsBad[11];
        }
        screen.createImage(queen.image, "red");
        screen.createBold("Oh no! " + queen.getName() + " " + event.event);
        return {queen: queen, points: event.penalization};
    } else if (roll >= 800) {
        let event = lipsyncsEventsGood[randomNumber(0, lipsyncsEventsGood.length - 1)];
        screen.createImage(queen.image, "green");
        screen.createBold(queen.getName() + " " + event.event);
        return {queen: queen, points: event.points};
    } else {
        return false;
    }
}

function lsSong() {
    let screen = new Scene();
    let song = randomNumber(0, lsSongs.length - 1);
    while (lsSongs[song].trim().length < 1) {
        song = randomNumber(0, lsSongs.length - 1);
    }
    screen.createBold(`The lip-sync song is... ${lsSongs[song]}!`);
    return lsSongs.splice(song, 1);
}
let allLsSongs = [];
function loadSongs() {
    fetch('textFiles/songs.txt')
        .then( (response) => {
            return response.text()
        })
        .then( (data) => {
            let songs = data.toString().replace(/"/gi, '').split(/,\r\n|\r|\n/);
            allLsSongs = songs;
            lsSongs = [...allLsSongs]
        });
}
loadSongs()
let lsSongs = [];

function topTwo() {
    let screen = new Scene();
    screen.clean();
    for (let i = 0; i < topQueens.length; i++) {
        topQueens[i].getASLipsync();
    }
    screen.createBigText("The time has come...");
    screen.createBold("For you to lip-sync... for your legacy! Good luck, and don't fuck it up.");
    let song = lsSong().toString();
    screen.createHorizontalLine();
    let event = checkForLipsyncEvent(topQueens);
    if (event !== false) {
        let eventQueen = topQueens.find( (q) => {
            return q.getName() === event.queen.getName()
        });
        eventQueen.lipsyncScore += event.points;
        screen.createHorizontalLine();
    }
    screen.createBigText("Ladies, I've made my decision...");

    const [queen1, queen2] = topQueens;
    topQueens.sort((a, b) => b.lipsyncScore - a.lipsyncScore);

    const isDoubleWinner =
        queen1.lipsyncScore === queen2.lipsyncScore &&
        queen1.lipsyncScore > 6 &&
        queen2.lipsyncScore > 6 &&
        currentCast.length > 6;

    if (isDoubleWinner) {
        [queen1, queen2].forEach(q => {
            screen.createImage(q.image, "darkblue");
            q.favoritism += 5;
            q.stars += 1;
            q.addToTrackRecord(" WIN ");
        });
        screen.createBold("Condragulations, you're both winners, baby!");
    } else {
        queen1.favoritism += 5;
        queen1.stars += 1;
        queen1.addToTrackRecord("WIN");
        screen.createImage(queen1.image, "royalblue");
        screen.createBold(`${queen1.getName()}, you're a winner, baby!`);

        queen2.favoritism += 5;
        queen2.addToTrackRecord(" WIN");
        screen.createImage(queen2.image, "cyan");
        screen.createParagraph(`${queen2.getName()}, you are safe.`);
    }

    screen.createButton("Proceed", "pointCeremony()");
}

function generateLipsyncPerformances(lipsyncers) {
    let screen = new Scene();

    const performanceGroups = [
        { id: "slay",   filter: q => q.lipsyncScore > 11,                       color: "black",  message: "slayed the lip-sync!" },
        { id: "great",  filter: q => q.lipsyncScore >= 8 && q.lipsyncScore < 12, color: "black",  message: "had a great lip-sync!" },
        { id: "good",   filter: q => q.lipsyncScore >= 4 && q.lipsyncScore < 8,  color: "black",  message: "had a good lip-sync." },
        { id: "bad",    filter: q => q.lipsyncScore > 2 && q.lipsyncScore < 4,   color: "black",  message: "had a bad lip-sync..." },
        { id: "flop",   filter: q => q.lipsyncScore <= 2,                        color: "black",  message: "flopped the lip-sync..." }
    ];

    performanceGroups.forEach(group => {
        let queens = lipsyncers.filter(group.filter);

        if (queens.length > 0) {
            shuffle(queens);

            queens.forEach(q => screen.createImage(q.image, group.color));
            screen.createBold(`${queens.map(q => q.getName()).join(", ")} ${group.message}`);
        }
    });
}

function winAndBtms() {
    let screen = new Scene();
    screen.clean();
    swapBackground("Stage");
    screen.createBigText("Bring back my girls!");
    screen.createBold("Ladies, I've made some decisions...");

    topQueens.forEach(q => q.performanceScore -= q.runwayScore);
    topQueens.sort((a, b) => a.performanceScore - b.performanceScore);

    if (
        topQueens.length > 1 &&
        topQueens[0].performanceScore === topQueens[1].performanceScore &&
        randomNumber(0, 100) < 60
    ) {
        [topQueens[0], topQueens[1]].forEach(q => {
            q.favoritism += 5;
            q.ppe += 5;
            screen.createImage(q.image, "darkblue");
            const lastIndex = q.trackRecord.length - 1;
            if (q.trackRecord[lastIndex].toUpperCase() === "RTRN") {
                q.editTrackRecord("WIN");
            } else {
                q.addToTrackRecord(" WIN ");
            }
        });

        screen.createBold(
            `${topQueens[0].getName()}, ${topQueens[1].getName()}, condragulations, you're the winners of today's challenge!`
        );

        topQueens.splice(0, 2);
    } else {
        let winner = topQueens[0];
        topQueens.splice(0, 1);
        const lastIndex = winner.trackRecord.length - 1;
        if (winner.trackRecord[lastIndex].toUpperCase() === "RTRN") {
            winner.editTrackRecord("WIN");
        } else {
            winner.addToTrackRecord("WIN");
        }
        winner.favoritism += 5;
        winner.ppe += 5;

        screen.createImage(winner.image, "royalblue");
        screen.createBold(`${winner.getName()}, condragulations, you're the winner of today's challenge!`);
    }

    if (topQueens.length > 0) {
        topQueens.forEach(q => {
            screen.createImage(q.image, "lightblue");
            q.favoritism += 1;
            q.ppe += 4;
            const lastIndex = q.trackRecord.length - 1;
            if (q.trackRecord[lastIndex].toUpperCase() === "RTRN") {
                q.editTrackRecord("HIGH");
            } else {
                q.addToTrackRecord("HIGH");
            }
        });

        screen.createParagraph(
            topQueens.map(q => q.getName()).join(", ") +
            ", good job this week, you're safe.",
            "highs"
        );
    }

    screen.createHorizontalLine();

    bottomQueens.forEach(q => q.performanceScore -= q.runwayScore);
    bottomQueens.sort((a, b) => a.performanceScore - b.performanceScore);

    if (bottomQueens.length >= 3) {
        bottomQueens.forEach(q => screen.createImage(q.image, "tomato"));

        screen.createParagraph(
            bottomQueens.map(q => q.getName()).join(", ") +
            ", you're the bottoms of the week...",
            "bottom3"
        );

        let safeQueen = bottomQueens.shift();
        safeQueen.unfavoritism += 1;
        safeQueen.ppe += 2;

        const lastIndex = safeQueen.trackRecord.length - 1;
        if (safeQueen.trackRecord[lastIndex].toUpperCase() === "RTRN") {
            safeQueen.editTrackRecord("LOW");
        } else {
            safeQueen.addToTrackRecord("LOW");
        }

        screen.createImage(safeQueen.image, "pink");
        screen.createBold(`${safeQueen.getName()}... you are safe.`);
    }

    bottomQueens.forEach(q => screen.createImage(q.image, "tomato"));
    screen.createBold("", "btm2");
    let btm2 = document.getElementById("btm2");
    btm2.innerHTML += "I'm sorry my dears but you are up for elimination.";
    screen.createButton("Proceed", "lipsyncDesc()");
}

function lipsyncDesc() {
    const screen = new Scene();
    screen.clean();

    for (let i = 0; i < bottomQueens.length; i++) {
        bottomQueens[i].getLipsync();
    }

    let event = checkForLipsyncEvent(bottomQueens);
    if (event != false) {
        let eventQueen = bottomQueens.find( (q) => {
            return q.getName() == event.queen.getName()
        });
        eventQueen.lipsyncScore += event.points;
    }
    for (let i = 0; i < bottomQueens.length; i++) {
        bottomQueens[i].lipsyncScore = (bottomQueens[i].lipsyncScore + bottomQueens[i].favoritism) - bottomQueens[i].unfavoritism;
    }
    generateLipsyncPerformances(bottomQueens);
    screen.createButton("Show result", "lipSync()");
}

function lipSync() {
    let screen = new Scene();
    screen.clean();

    if (bottomQueens[0].lipsyncScore < 2 && randomNumber(0, 10) >= 6) {
        screen.createBold("Meh...");
        screen.createHorizontalLine();
    }

    screen.createImage(bottomQueens[0].image, "tomato");
    screen.createBold(bottomQueens[0].getName() + ", shantay you stay.");
    bottomQueens[0].unfavoritism += 3;
    bottomQueens[0].ppe += 1;
    const lastIndex1 = bottomQueens[0].trackRecord.length - 1;
    if (bottomQueens[0].trackRecord[lastIndex1].toUpperCase() === "RTRN") {
        bottomQueens[0].editTrackRecord("BTM2");
    } else {
        bottomQueens[0].addToTrackRecord("BTM2");
    }

    screen.createImage(bottomQueens[1].image, "red");
    screen.createBold(bottomQueens[1].getName() + ", sashay away...");

    const totalContestants = fullCast.length;
    const eliminatedSoFar = eliminatedCast.length;

    const rankNum = totalContestants - eliminatedSoFar;

    const lastIndex2 = bottomQueens[1].trackRecord.length - 1;
    if (bottomQueens[1].trackRecord[lastIndex2].toUpperCase() === "RTRN") {
        bottomQueens[1].editTrackRecord("ELIM");
    } else {
        bottomQueens[1].addToTrackRecord("ELIM");
    }
    bottomQueens[1].rankP = toOrdinal(rankNum);

    eliminatedCast.unshift(bottomQueens[1]);
    currentCast.splice(currentCast.indexOf(bottomQueens[1]), 1);

    screen.createButton("Proceed", "contestantProgress()");
}

function startFinale() {
    phase = "finale";
    episodeChallenges.push("Finale");
    currentCast = fullCast.filter(q => !eliminatedCast.includes(q));

    finaleSmackdown();
}

function finaleSmackdown() {
    const screen = new Scene();
    screen.clean();

    if ((wildcardType === "finale" || wildcardType === "merge") && !wildcardUsed) {
        addWildcard();
        wildcardUsed = true;
    }

    let lipsyncers = shuffle([...currentCast]);
    smackdownRounds = [];

    for (let i = 0; i < Math.floor(lipsyncers.length / 2); i++) {
        const q1 = lipsyncers[i * 2];
        const q2 = lipsyncers[i * 2 + 1];
        if (q1 && q2) smackdownRounds.push([q1, q2]);
    }

    if (lipsyncers.length % 2 !== 0) {
        smackdownRounds.push([lipsyncers[lipsyncers.length - 1]]);
    }

    screen.createBold(`Our final ${currentCast.length} will participate in a lipsync smackdown for the crown!`);
    screen.createHorizontalLine();
    screen.createBigText("The preliminaries are...");

    smackdownRounds.forEach((match, i) => {
        match.forEach(q => screen.createImage(q.image, "black"));
        const names = match.map(q => q.getName()).join(" vs ");
        screen.createParagraph(`Round ${i + 1}: ${names}`);
    });

    screen.createButton("Resolve prelims", "resolveSmackdownRound(1)");
}

function resolveSmackdownRound(roundNumber = 1) {
    const screen = new Scene();
    screen.clean();
    let winners = [];
    let eliminated = [];

    let matchRoundLabel = [];
    if (currentCast.length === 4) {
        matchRoundLabel = [1, 2];
    } else if (currentCast.length === 6) {
        matchRoundLabel = [1, 1, 2];
    } else {
        matchRoundLabel = Array(smackdownRounds.length).fill(roundNumber);
    }

    smackdownRounds.forEach((match, i) => {
        if (match.length === 1) {
            winners.push(match[0]);
            screen.createParagraph(`${match[0].getName()} advances automatically!`);
            return;
        }

        match.forEach(q => q.getASLipsync());
        match.sort((a, b) => b.lipsyncScore - a.lipsyncScore);

        const winner = match[0];
        const loser = match[1];

        winners.push(winner);
        eliminated.push(loser);

        screen.createHorizontalLine();
        screen.createBigText("The time has come...");
        screen.createBold("For you to lip-sync... for the crown!");
        screen.createParagraph(`${winner.getName()} vs ${loser.getName()}`);
        screen.createImage(winner.image, "darkblue");
        screen.createImage(loser.image, "lightgrey");
        screen.createBold(`${winner.getName()} wins Round ${i + 1}!`);

        let lrRound = matchRoundLabel[i] || roundNumber;
        const lr = `LR${roundNumber}`;
        if (loser.trackRecord.at(-1)?.toUpperCase() === "RTRN") {
            loser.editTrackRecord(lr);
        } else {
            loser.addToTrackRecord(lr);
        }
    });

    const totalContestants = 18;
    const eliminatedSoFar = eliminatedCast.length;
    const eliminatedThisRound = eliminated.length;
    const elimStart = totalContestants - eliminatedSoFar - eliminatedThisRound + 1;
    const elimEnd = totalContestants - eliminatedSoFar;

    let placementRange;
    if (eliminatedThisRound === 1) {
        placementRange = toOrdinal(elimEnd);
    } else if (eliminatedThisRound === 2) {
        placementRange = `${toOrdinal(elimStart)}/${toOrdinal(elimEnd)}`;
    } else {
        placementRange = `${toOrdinal(elimStart)}–${toOrdinal(elimEnd)}`;
    }

    eliminated.forEach(q => {
        if (!eliminatedCast.includes(q)) eliminatedCast.push(q);
        q.rankP = placementRange;
    });

    if (winners.length > 1) {
        smackdownRounds = [];
        for (let i = 0; i < Math.floor(winners.length / 2); i++) {
            smackdownRounds.push([winners[i * 2], winners[i * 2 + 1]]);
        }
        if (winners.length % 2 !== 0) {
            smackdownRounds.push([winners[winners.length - 1]]);
        }
        screen.createButton("Proceed to next round", `resolveSmackdownRound(${roundNumber + 1})`);
    } else {
        const champ = winners[0];
        champ.rankP = toOrdinal(1);
        champ.title = "Winner";
        if (champ.trackRecord.at(-1)?.toUpperCase() === "RTRN") {
            champ.editTrackRecord("WINNER");
        } else {
            champ.addToTrackRecord("WINNER");
        }

        const runnerUp = eliminatedCast.at(-1);
        runnerUp.rankP = toOrdinal(2);
        runnerUp.title = "Runner-up";
        if (runnerUp.trackRecord.at(-1)?.toUpperCase() === "RTRN") {
            runnerUp.editTrackRecord("LR3");
        } else {
            runnerUp.addToTrackRecord("LR3");
        }

        screen.createHorizontalLine();
        screen.createBold(`${champ.getName()}, condragulations! You're the winner baby!`);

        seasonOver = true;
        screen.createButton("Proceed", "contestantProgress()");
    }
}

function ordinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function assignPlacements(cast, eliminated) {
    let placements = {};

    let finalCount = cast.length;
    cast.forEach((queen, i) => {
        let place = i + 1;
        placements[queen.getName()] = ordinalSuffix(place);
    });

    let placeCounter = cast.length + 1;
    eliminated.forEach((elimRound, i) => {
        if (Array.isArray(elimRound)) {
            elimRound.forEach(q => {
                placements[q.getName()] = ordinalSuffix(placeCounter);
            });
            placeCounter += elimRound.length;
        } else {
            placements[elimRound.getName()] = ordinalSuffix(placeCounter);
            placeCounter++;
        }
    });
    return placements;
}

function contestantProgress() {
    let screen = new Scene();
    screen.clean();

    const main = document.querySelector("div#simulation-block");
    main.innerHTML = "";

    const tabs = ["Bracket A", "Bracket B", "Bracket C", "Mergers"];
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-buttons";

    const contentContainer = document.createElement("div");
    contentContainer.className = "tab-contents";

    let activeTabId = tabs[currentBracketIndex] || tabs[0];

    tabs.forEach((tabName, index) => {
        const btn = document.createElement("button");
        btn.textContent = tabName;
        btn.className = "tab-btn";
        if (tabName === activeTabId) btn.classList.add("active");

        btn.onclick = () => {
            document.querySelectorAll(".tab-content").forEach(tc => tc.style.display = "none");
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById(tabName).style.display = "block";
            btn.classList.add("active");

            activeTabId = tabName;
        };
        tabContainer.appendChild(btn);

        const tabContent = document.createElement("div");
        tabContent.id = tabName;
        tabContent.className = "tab-content";
        tabContent.style.display = (tabName === activeTabId ? "block" : "none");

        const centeringDiv = document.createElement("div");
        centeringDiv.style.display = "flex";
        centeringDiv.style.justifyContent = "center";

        const table = createTrackRecordTable(tabName);
        centeringDiv.appendChild(table);

        tabContent.appendChild(centeringDiv);
        contentContainer.appendChild(tabContent);
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download Progress";
    downloadBtn.style.marginTop = "10px";

    downloadBtn.onclick = () => {
        const activeTab = document.querySelector(".tab-content[style*='block']");
        if (!activeTab) {
            alert("No active tab found!");
            return;
        }

        const table = activeTab.querySelector("table.trtable");
        if (!table) {
            alert("No table found in the active tab!");
            return;
        }

        const originalOverflow = activeTab.style.overflow;
        activeTab.style.overflow = "visible";

        const scale = window.devicePixelRatio || 1;

        html2canvas(table, { scale: scale }).then(canvas => {
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = activeTab.id.replace(/\s+/g, "_") + "_table.png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                activeTab.style.overflow = originalOverflow;
            });
        }).catch(err => {
            alert("Failed to capture image: " + err);
            activeTab.style.overflow = originalOverflow;
        });
    };

    main.appendChild(tabContainer);
    main.appendChild(contentContainer);
    main.appendChild(downloadBtn);
    if (!seasonOver) {
        screen.createButton("Proceed", "episodeProcessing()");
    } else {
        screen.createButton("Resimulate", "restartSimulation()");
    }
}

function createTrackRecordTable(groupName) {
    const table = document.createElement("table");
    table.className = "trtable";
    table.border = "2";

    let epStart = 0, epEnd = episodeChallenges.length;
    let cast;
    switch (groupName) {
        case "Bracket A": epStart = 0; epEnd = 3; cast = BracketA; break;
        case "Bracket B": epStart = 3; epEnd = 6; cast = BracketB; break;
        case "Bracket C": epStart = 6; epEnd = 9; cast = BracketC; break;
        case "Mergers": epStart = 9; epEnd = episodeChallenges.length; cast = Mergers; break;
        default: cast = [];
    }

    if (groupName === "Mergers") {
        const rankOrder = ["RTRNWINNER", "WINNER", "RTRNWIN", "RTRN WIN", "RTRN WIN ", "WIN", "RTRNLR3", "LR3", "RTRNLR2", "LR2", "RTRNLR1", "LR1", "RTRNHIGH", "HIGH", "RTRNSAFE", "SAFE", "RTRNLOW", "LOW", "RTRNBTM2", "BTM2", "RTRNELIM", "ELIM", ""];

        cast.sort((a, b) => {
            const validA = a.trackRecord.filter(p => p && !["", "RTRN"].includes(p));
            const validB = b.trackRecord.filter(p => p && !["", "RTRN"].includes(p));

            const aPerf = validA.at(-1) || "SAFE";
            const bPerf = validB.at(-1) || "SAFE";

            let aRank = rankOrder.findIndex(r => aPerf.toUpperCase().includes(r));
            let bRank = rankOrder.findIndex(r => bPerf.toUpperCase().includes(r));

            if (aRank === rankOrder.length - 1 && bRank === rankOrder.length - 1) {
                return eliminatedCast.indexOf(a) - eliminatedCast.indexOf(b);
            }

            return aRank - bRank;
        });
    }

    const epsToShow = episodeChallenges.slice(epStart, epEnd);

    const header = document.createElement("tr");
    [
        { text: "Rank", rowspan: 2 },
        { text: "Contestant", rowspan: 2, width: "100px" },
        { text: "Photo", rowspan: 2 }
    ].forEach(cell => {
        const th = document.createElement("th");
        th.innerHTML = cell.text;
        th.style.fontWeight = "bold";
        if (cell.width) th.style.width = cell.width;
        if (cell.rowspan) th.rowSpan = cell.rowspan;
        header.appendChild(th);
    });
    epsToShow.forEach((_, i) => {
        const th = document.createElement("th");
        th.innerHTML = "Ep. " + (epStart + i + 1);
        th.style.fontWeight = "bold";
        th.style.textAlign = "center";
        header.appendChild(th);
    });
    const thPPE = document.createElement("th");
    thPPE.className = "ppeTR";
    thPPE.rowSpan = 2;
    switch (groupName) {
        case "Bracket A":
        case "Bracket B":
        case "Bracket C":
            thPPE.innerHTML = "PPE - MVQ";
            break;
        case "Mergers":
            thPPE.innerHTML = "PPE";
            break;
    }
    header.appendChild(thPPE);

    table.appendChild(header);

    const header1 = document.createElement("tr");
    epsToShow.forEach(challenge => {
        const th = document.createElement("th");
        th.innerHTML = `<small>${challenge}</small>`;
        th.className = "episodeTR";
        th.style.textAlign = "center";
        header1.appendChild(th);
    });
    table.appendChild(header1);

    switch (groupName) {
        case "Bracket A": cast = BracketA; break;
        case "Bracket B": cast = BracketB; break;
        case "Bracket C": cast = BracketC; break;
        case "Mergers": cast = Mergers; break;
        default: cast = [];
    }

    cast.forEach(contestantData => {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.style.backgroundColor = "#f5ebf5";
        rankCell.style.fontWeight = "bold";
        if (contestantData.rankP) {
            rankCell.innerHTML = contestantData.rankP;
        } else {
            rankCell.innerHTML = "TBA";
        }
        if (contestantData.ogPlace !== 0) rankCell.innerHTML += `<br><small>(Orig. ${contestantData.ogPlace})</small>`;
        if (contestantData.title !== "") rankCell.innerHTML += `<br><small>(${contestantData.title})</small>`;
        row.appendChild(rankCell);

        const nameCell = document.createElement("td");
        nameCell.className = "nameTR";
        nameCell.textContent = contestantData.getName();
        row.appendChild(nameCell);

        const photoCell = document.createElement("td");
        photoCell.className = "placement";
        photoCell.style.background = `url(${contestantData.image}) center/cover no-repeat`;
        row.appendChild(photoCell);

        const trackSlice = contestantData.trackRecord.slice(epStart, epEnd);
        trackSlice.forEach((performance, index) => {
            const td = document.createElement("td");
            td.innerHTML = performance;
            td.style.textAlign = "center";

            switch (performance.toUpperCase()) {
                case "RTRNWINNER": td.style.backgroundColor = "yellow"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>WINNER';break;
                case "WINNER": td.style.backgroundColor = "yellow"; td.style.color = "black"; td.style.fontWeight = "bold"; break;
                case "RTRNLR3": td.style.backgroundColor = "#ffd100"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>3RD<br>ROUND';break;
                case "LR3": td.style.backgroundColor = "#ffd100"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>3RD<br>ROUND';break;
                case "RTRNLR2": td.style.backgroundColor = "#ffae00"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>2ND<br>ROUND';break;
                case "LR2": td.style.backgroundColor = "#ffae00"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>2ND<br>ROUND';break;
                case "RTRNLR1": td.style.backgroundColor = "#ff7c00"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>1ST<br>ROUND';break;
                case "LR1": td.style.backgroundColor = "#ff7c00"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>1ST<br>ROUND';break;
                case "WIN": td.style.backgroundColor = "royalblue"; td.style.color = "white"; td.style.fontWeight = "bold"; break;
                case " WIN": td.style.backgroundColor = "deepskyblue"; td.style.fontWeight = "bold"; break;
                case " WIN ": td.style.backgroundColor = "darkblue"; td.style.color = "white"; td.style.fontWeight = "bold"; break;
                case "HIGH": td.style.backgroundColor = "lightblue"; break;
                case "LOW": td.style.backgroundColor = "pink"; break;
                case "BTM2":
                case "BTM3":
                case "BTM4": td.style.backgroundColor = "tomato"; break;
                case "SAFE": td.style.backgroundColor = "white"; break;
                case "BTM4ELIM":
                case "BTM3ELIM":
                case "SAFEELIM":
                case "ELIM": td.style.backgroundColor = "red"; td.innerHTML = 'ELIM'; td.style.fontWeight = "bold"; break;
                case "HIGHELIM": td.style.backgroundColor = "red"; td.innerHTML = 'HIGH<br>+<br>ELIM'; td.style.fontWeight = "bold"; break;
                case "WINELIM":
                case " WINELIM":
                case " WIN ELIM": td.style.backgroundColor = "red";  td.style.color = "black";  td.innerHTML = 'WIN<br>+<br>ELIM'; td.style.fontWeight = "bold"; break;
                case "RTRNWIN": td.style.backgroundColor = "darkblue";  td.style.color = "white";  td.innerHTML = 'RTRN<br>+<br>WIN';  td.style.fontWeight = "bold"; break;
                case "RTRN WIN ": td.style.backgroundColor = "darkblue"; td.innerHTML = '<b>RTRN</b><br>+<br>WIN'; break;
                case "RTRNHIGH": td.style.backgroundColor = "lightblue"; td.innerHTML = '<b>RTRN</b><br>+<br>HIGH'; break;
                case "RTRNSAFE": td.style.backgroundColor = "orange"; td.innerHTML = '<b>RTRN</b><br>+<br>SAFE'; break;
                case "RTRNLOW": td.style.backgroundColor = "lightpink"; td.innerHTML = '<b>RTRN</b><br>+<br>LOW'; break;
                case "RTRNBTM2": td.style.backgroundColor = "tomato"; td.innerHTML = '<b>RTRN</b><br>+<br>BTM2'; break;
                case "RTRNELIM": td.style.backgroundColor = "red"; td.innerHTML = 'RTRN<br>+<br>ELIM';  td.style.fontWeight = "bold"; break;
                case "":
                case " ": td.style.backgroundColor = "#a2a9b1"; break;
                default: td.style.backgroundColor = "gray"; break;
            }

            const actualEp = epStart + index;
            const miniWins = contestantData.miniEpisode || [];
            const wonMini = miniWins.includes(actualEp);

            if (wonMini) {
                td.innerHTML += "<br><small><i>Mini<br>Chall.<br>Winner</i></small>";
            }
            row.appendChild(td);
        });
        const ppeCell = document.createElement("td");
        const ppeCalculated = contestantData.ppe / contestantData.episodesOn;
        const formattedPPE = isNaN(ppeCalculated) ? "TBA" : ppeCalculated.toFixed(2);
        switch (groupName) {
            case "Bracket A":
            case "Bracket B":
            case "Bracket C":
                ppeCell.innerHTML = `${formattedPPE} - ${contestantData.stars}`;
                break;
            case "Mergers":
                ppeCell.innerHTML = `${formattedPPE}`;
                break;
        }
        row.appendChild(ppeCell);

        table.appendChild(row);
    });

    return table;
}