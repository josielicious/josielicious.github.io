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
        this.mvq = 0;
        this.dollHolder = false;
        this.dollEpisode = -1;
        this.dunkSurivalEpisode = []
        this.earnedMvq = [];
        this.giftedMvq = [];
        this.donatedMvq = [];
        this.episodesOn = 0;
        this.rankP = 0;
        this.ogPlace = 0;
        this.title = "";

        this._name = name;
        this.stats = {
            acting,
            comedy,
            dance,
            design,
            improv,
            runway,
            lipsync
        };

        if (image === "noimage") {
            this.image = "images/queens/noimage.png";
        } else if (custom || image.includes("https")) {
            this.image = image;
        } else {
            this.image = `images/queens/${image}.webp`;
        }
    }

    _calculateScores(min, max, stat = 0) {
        let score = randomNumber(min, max);
        return score - stat;
    }

    getName() {
        return this._name;
    }

    getStat(statName) {
        return this.stats[statName] || 0;
    }

    getPerformance(type) {
        const ranges = {
            acting:    [15, 35, this.getStat("acting")],
            comedy:    [15, 35, this.getStat("comedy")],
            marketing: [25, 45, this.getStat("comedy") + this.getStat("acting")],
            dance:     [15, 35, this.getStat("dance")],
            design:    [15, 35, this.getStat("design")],
            runwayCh:  [15, 35, this.getStat("runway")],
            improv:    [15, 35, this.getStat("improv")],
            snatch:    [25, 45, this.getStat("improv") + this.getStat("comedy")],
            rusical:   [25, 45, this.getStat("dance") + this.getStat("lipsync")],
            ball:      [25, 45, this.getStat("design") + this.getStat("runway")],
            rumix:     [25, 45, this.getStat("dance") + this.getStat("improv")],
            talent:    [15, 35, randomNumber(1, 35)]
        };

        if (!ranges[type]) return;
        let [min, max, stat] = ranges[type];
        this.performanceScore = this._calculateScores(min, max, stat);
    }

    getFinale() {
        this.finaleScore = this.favoritism - this.unfavoritism;
    }

    getRunway() {
        this.runwayScore = this._calculateScores(12, 35, this.getStat("runway"));
    }

    getLipsync() {
        this.lipsyncScore =
            this._calculateScores(0, this.getStat("lipsync"), this.unfavoritism) +
            this.favoritism;
    }

    getASLipsync() {
        this.lipsyncScore = this._calculateScores(0, this.getStat("lipsync"));
    }

    addToTrackRecord(placement) {
        this.trackRecord.push(placement);
    }

    editTrackRecord(added) {
        if (this.trackRecord.length > 0) {
            this.trackRecord[this.trackRecord.length - 1] += added;
        }
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
let onya = new Queen("Onya Nurve", 14, 13, 9, 7, 13, 8, 8, "OnyaNurve"); // 56
let samStar = new Queen("Sam Star", 10, 11, 10, 13, 11, 13, 10, "SamStar"); // 55
let lexi = new Queen("Lexi Love", 9, 8, 13, 11, 7, 13, 13, "LexiLove"); // 48
let jewels = new Queen("Jewels Sparkles", 6, 8, 11, 12, 9, 13, 11, "JewelsSparkles"); // 46
let suzie = new Queen("Suzie Toot", 13, 7, 11, 6, 7, 11, 9, "SuzieToot"); // 45
let lydia = new Queen("Lydia B Kollins", 4, 10, 9, 10, 7, 12, 12, "LydiaBKollins"); // 40
let crystalE = new Queen("Crystal Envy", 9, 5, 10, 10, 5, 13, 8, "CrystalEnvy"); // 39
let acacia = new Queen("Acacia Forgot", 9, 8, 6, 6, 8, 9, 7, "AcaciaForgot"); // 39
let kori = new Queen("Kori King", 6, 8, 8, 5, 8, 7, 13, "KoriKing"); // 35
let hormona = new Queen("Hormona Lisa", 9, 5, 6, 8, 6, 9, 6, "HormonaLisa"); // 33
let lana = new Queen("Lana Ja'Rae", 6, 7, 8, 7, 5, 11, 13, "LanaJaRae"); // 33
let arrietty = new Queen("Arrietty", 4, 4, 4, 15, 4, 15, 6, "Arrietty"); // 52
let joella = new Queen("Joella", 5, 5, 6, 5, 5, 6, 6, "Joella"); // 26
let lucky = new Queen("Lucky Starzzz", 4, 4, 5, 4, 4, 8, 7, "LuckyStarzzz"); // 21
let us_season17 = [acacia, arrietty, crystalE, hormona, jewels, joella, kori, lana, lexi, lucky, lydia, onya, samStar, suzie];
//ALL STARS 9
let allstars_9 = [angeria, mik, jorgeous, ninaw, plastique, roxxxy, shannel, vanessa];
// ALL STARS 10
let allstars_10 = [acid, aja, bosco, alyssaH, cynthia, daya, olivia, phoenix, tina, deja, denali, ginger, irene, jorgeous, kerri, nicole, mistress, lydia];
//DRUK SEASON 1
let baga = new Queen("Baga Chipz", 13, 12, 5, 5, 13, 8, 7, "Baga");
let blu = new Queen("Blu Hydrangea", 5, 9, 8, 10, 10, 12, 9, "Blu");
let cheryl = new Queen("Cheryl", 5, 5, 9, 5, 7, 7, 9, "Cheryl");
let crystaluk = new Queen("Crystal", 6, 5, 6, 9, 4, 8, 6, "Crystal");
let divina = new Queen("Divina De Campo", 11, 6, 9, 12, 9, 9, 9, "Divina");
let gothy = new Queen("Gothy Kendoll", 9, 7, 5, 8, 5, 9, 4, "Gothy");
let scaredy = new Queen("Scaredy Kat", 3, 5, 6, 4, 4, 7, 5, "Scaredy");
let sumting = new Queen("Sum Ting Wong", 7, 5, 5, 6, 5, 7, 6, "Sum");
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
let actavia = new Queen("Actavia", 6, 5, 5, 9, 4, 8, 10, "Actavia");
let chanelO = new Queen("Chanel O’Conor", 6, 7, 4, 6, 5, 6, 5, "ChanelOConor");
let charra = new Queen("Charra Tea", 6, 8, 5, 6, 8, 7, 7, "CharraTea");
let dita = new Queen("Dita Garbo", 4, 4, 5, 10, 4, 6, 5, "DitaGarbo");
let kikiS = new Queen("Kiki Snatch", 4, 5, 4, 6, 5, 4, 5, "KikiSnatch");
let kyran = new Queen("Kyran Thrax", 12, 10, 13, 8, 10, 12, 12, "KyranThrax");
let lavoix = new Queen("La Voix", 10, 15, 9, 8, 13, 10, 9, "LaVoix");
let lill = new Queen("Lill", 7, 8, 5, 10, 9, 11, 10, "Lill");
let marmalade = new Queen("Marmalade", 8, 9, 11, 9, 8, 15, 8, "Marmalade");
let rileasa = new Queen("Rileasa Slaves", 5, 11, 6, 6, 9, 11, 3, "RileasaSlaves");
let saki = new Queen("Saki Yew", 2, 2, 2, 2, 2, 2, 2, "SakiYew");
let zahirah = new Queen("Zahirah Zapanta", 4, 4, 5, 4, 4, 6, 7, "ZahirahZapanta");
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
let helena = new Queen("Helena Poison", 9, 8, 6, 10, 9, 12, 8, "HelenaPoison");
let jaylene = new Queen("Jaylene Tyme", 7, 6, 6, 6, 7, 10, 7, "JayleneTyme");
let makayla = new Queen("Makayla Couture", 9, 6, 12, 10, 6, 10, 7, "MakaylaCouture");
let minhi = new Queen("Minhi Wang", 10, 9, 7, 12, 8, 12, 8, "MinhiWang");
let perla = new Queen("Perla", 9, 8, 8, 8, 7, 9, 9, "Perla");
let sanjina = new Queen("Sanjina Dabish Queen", 5, 7, 6, 6, 4, 6, 6, "SanjinaDabishQueen");
let tara = new Queen("Tara Nova", 4, 4, 4, 4, 4, 4, 4, "TaraNova");
let virgo = new Queen("The Virgo Queen", 8, 6, 12, 6, 8, 13, 8, "TheVirgoQueen");
let tiffany = new Queen("Tiffany Ann Co.", 5, 5, 6, 5, 6, 5, 6, "TiffanyAnnCo");
let uma = new Queen("Uma Gahd", 8, 7, 7, 7, 6, 7, 8, "UmaGahd");
let xana = new Queen("Xana", 5, 8, 5, 7, 8, 9, 8, "Xana");
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
let frankie = new Queen("Frankie Wonga", 8, 9, 10, 8, 12, 11, 8, "FrankieWonga");
let zepee = new Queen("Zepee", 10, 8, 11, 10, 7, 12, 11, "Zepee");
let gawdland = new Queen("Gawdland", 9, 9, 10, 8, 9, 10, 9, "Gawdland");
let spicy = new Queen("Spicy Sunshine", 6, 9, 7, 6, 9, 6, 10, "SpicySunshine");
let nane = new Queen("Nane Sphera", 6, 6, 8, 10, 6, 10, 7, "NaneSphera");
let gigiF = new Queen("Gigi Ferocious", 5, 5, 8, 7, 5, 8, 9, "GigiFerocious");
let benze = new Queen("Benze Diva", 4, 5, 7, 8, 5, 8, 7, "BenzeDiva");
let shortgun = new Queen("Shortgun", 4, 4, 5, 6, 5, 9, 5, "Shortgun");
let siam = new Queen("Siam Phusri", 9, 5, 6, 6, 5, 11, 6, "SiamPhusri");
let kara = new Queen("Kara Might", 5, 5, 5, 5, 5, 6, 5, "KaraMight");
let srirasha = new Queen("Srirasha Hotsauce", 4, 4, 4, 4, 4, 4, 4, "SrirashaHotsauce");
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
let ivory = new Queen("Ivory Glaze", 4, 4, 4, 4, 4, 7, 6, "IvoryGlaze");
let ritaMenu = new Queen("Rita Menu", 6, 6, 8, 6, 5, 8, 10, "RitaMenu");
let drdu_season3 = [amyl, ashley, bumpa, flor, gabriella, hollywould, isis, ivanna, ivory, ritaMenu];
// DRAG RACE DOWN UNDER SEASON 4
let brenda = new Queen("Brenda Bressed", 6, 10, 8, 6, 8, 7, 7, "BrendaBressed");
let freya = new Queen("Freya Armani", 10, 9, 8, 6, 7, 9, 7, "FreyaArmani");
let karna = new Queen("Karna Ford", 4, 4, 6, 4, 4, 4, 6, "KarnaFord");
let lazy = new Queen("Lazy Susan", 12, 11, 9, 9, 10, 13, 9, "LazySusan");
let lucina = new Queen("Lucina Innocence", 6, 6, 5, 7, 6, 8, 7, "LucinaInnocence");
let mandy = new Queen("Mandy Moobs", 7, 7, 8, 11, 8, 11, 10, "MandyMoobs");
let maxdq = new Queen("Max Drag Queen", 5, 5, 10, 8, 5, 10, 13, "MaxDragQueen");
let nikitaI = new Queen("Nikita Iman", 5, 6, 6, 7, 5, 6, 6, "NikitaIman");
let oliviaD = new Queen("Olivia Dreams", 4, 4, 4, 4, 4, 4, 4, "OliviaDreams");
let vybe = new Queen("Vybe", 7, 11, 9, 9, 10, 11, 10, "Vybe");
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
let angelita = new Queen("Angelita la Perversa", 10, 7, 7, 6, 8, 7, 9, "AngelitalaPerversa");
let chloeV = new Queen("Chloe Vittu", 6, 8, 6, 6, 8, 10, 8, "ChloeVittu");
let ditaD = new Queen("Dita Dubois", 4, 5, 5, 5, 5, 6, 4, "DitaDubois");
let kellyP = new Queen("Kelly Passa!?", 4, 5, 5, 6, 5, 5, 6, "KellyPassa");
let lanina = new Queen("La Niña Delantro", 4, 5, 10, 6, 5, 10, 12, "LaNinaDelantro");
let lecoco = new Queen("Le Cocó", 12, 13, 9, 8, 11, 11, 12, "LeCoco");
let mariana = new Queen("Mariana Stars", 6, 8, 8, 9, 9, 9, 10, "MarianaStars");
let megui = new Queen("Megui Yeillow", 9, 8, 11, 9, 8, 10, 10, "MeguiYeillow");
let khristo = new Queen("Miss Khristo", 6, 4, 5, 6, 4, 10, 5, "MissKhristo");
let porca = new Queen("Porca Theclubkid", 5, 5, 7, 5, 7, 6, 6, "PorcaTheclubkid");
let shani = new Queen("Shani LaSanta", 4, 4, 4, 4, 4, 4, 4, "ShaniLaSanta");
let vampirashian = new Queen("La Bella Vampi", 7, 7, 9, 8, 9, 9, 8, "Vampirashian"); // ID updated for clarity
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
let elips = new Queen("Elips", 7, 10, 10, 10, 8, 13, 9, "Elips");
let kam = new Queen("Kam Hugh", 7, 6, 7, 11, 5, 15, 7, "Kam");
let bigbertha = new Queen("La Big Bertha", 7, 9, 7, 6, 9, 8, 9, "BigBertha");
let briochee = new Queen("La Briochée", 6, 6, 6, 5, 6, 8, 5, "LaBriochee");
let grandedame = new Queen("La Grande Dame", 10, 9, 9, 13, 8, 14, 9, "GrandeDame");
let kahena = new Queen("La Kahena", 5, 6, 5, 3, 5, 6, 5, "Kahena");
let lolita = new Queen("Lolita Banana", 9, 7, 13, 11, 6, 9, 12, "LolitaBanana");
let lova = new Queen("Lova Ladiva", 5, 5, 6, 4, 6, 6, 5, "Lova");
let paloma = new Queen("Paloma", 11, 11, 6, 7, 9, 9, 8, "Paloma");
let soa = new Queen("Soa de Muse", 9, 6, 10, 7, 6, 9, 12, "Soa");
let drfr_season1 = [elips, kam, bigbertha, briochee, grandedame, kahena, lolita, lova, paloma, soa];
//DRAG RACE FRANCE 2
let cookie = new Queen("Cookie Kunty", 8, 6, 8, 10, 5, 11, 10, "CookieKunty");
let gingerB = new Queen("Ginger Bitch", 7, 6, 7, 6, 8, 8, 9, "GingerBitch");
let keiona = new Queen("Keiona", 11, 10, 15, 11, 11, 13, 13, "Keiona");
let kittyS = new Queen("Kitty Space", 6, 6, 7, 10, 7, 10, 9, "KittySpace");
let mami = new Queen("Mami Watta", 9, 9, 11, 9, 8, 13, 11, "MamiWatta");
let moon = new Queen("Moon", 9, 8, 9, 6, 8, 13, 7, "Moon");
let piche = new Queen("Piche", 7, 6, 13, 8, 7, 11, 11, "Piche");
let punani = new Queen("Punani", 8, 10, 7, 9, 11, 10, 9, "Punani");
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
let magnetica = new Queen("Magnetica", 5, 5, 7, 5, 5, 10, 6, "Magnetica");
let misty = new Queen("Misty Phoenix", 9, 10, 8, 9, 10, 10, 11, "MistyPhoenix");
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
let vinas = new Queen("Viñas DeLuxe", 10, 10, 12, 15, 12, 14, 12, "VinasDeLuxe");
let xilhouete = new Queen("Xilhouete", 6, 10, 6, 8, 11, 10, 8, "Xilhouete");
let drph_season1 = [brigiding, corazon, eva, gigiEra, morgana, marinaSummers, minty, precious, prince, turing, vinas, xilhouete];
//DRAG RACE PHILIPPINES 2
let arizona = new Queen("Arizona Brandy", 8, 9, 9, 6, 10, 8, 11, "ArizonaBrandy");
let astrid = new Queen("Astrid Mercury", 4, 4, 4, 4, 4, 4, 4, "AstridMercury");
let bernie = new Queen("Bernie", 7, 6, 9, 9, 8, 10, 9, "Bernie");
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
let adora = new Queen("Adora Black", 6, 5, 7, 15, 5, 12, 6, "AdoraBlack");
let bhelchi = new Queen("Bhelchi", 9, 9, 8, 8, 11, 10, 8, "Bhelchi");
let chanelbr = new Queen("Chanel", 4, 4, 8, 4, 4, 4, 4, "Chanelbr");
let desiree = new Queen("DesiRée Beck", 6, 10, 5, 6, 10, 8, 7, "DesiReeBeck");
let melina = new Queen("Melina Blley", 7, 7, 6, 7, 8, 8, 9, "MelinaBlley");
let mellody = new Queen("Mellody Queen", 6, 6, 10, 5, 6, 8, 10, "MellodyQueen");
let mercedez = new Queen("Mercedez Vulcão", 8, 6, 7, 7, 7, 6, 7, "MercedezVulcao");
let paola = new Queen("Paola Hoffmann Van Cartier", 5, 4, 5, 7, 4, 7, 4, "PaolaHoffmannVanCartier");
let poseidon = new Queen("Poseidon Drag", 8, 8, 7, 6, 7, 8, 9, "PoseidonDrag");
let rubyNox = new Queen("Ruby Nox", 7, 9, 9, 8, 8, 11, 7, "RubyNox");
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
// - UK 7 CAST - //
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

let PHSR1_Cast = [arizona, bernie, brigiding, ivory, khianna, kittyS, yoko, siam, suki, sumting, vinas, yuhua];
// - ALL STARS 11 - //
let AS11_Cast = [akeria, dawn, lucky, morgan, morphine, mystique, april, auraMayari, crystal, salina, silky, vivacious, hershii, jasmineK, joey, kennedy, samStar, shuga]

// - ES 5 CAST - //
let AlexandraDelRavalES5 = new Queen("Alexandra Del Raval", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/aa/AlexandradelRavalDRES5CastMug.jpg", true);
let DafneMuglerES5 = new Queen("Dafne Mugler", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/65/DafneMuglerDRES5CastMug.jpg", true);
let DenebolaMurnauES5 = new Queen("Denebola Murnau", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/16/Den%C3%A9bolaMurnauDRES5CastMug.jpg", true);
let EvaHarringtonES5 = new Queen("Eva Harrington", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/68/EvaHarringtonDRES5CastMug.jpg", true);
let FerrxnES5 = new Queen("Ferrxn", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1c/FerrxnDRES5CastMug.jpg", true);
let KrystalForeverES5 = new Queen("Krystal Forever", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/45/KrystalForeverDRES5CastMug.jpg", true);
let LaEscandaloES5 = new Queen("La Escandalo", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cc/LaEsc%C3%A1ndaloDRES5CastMug.jpg", true);
let LacaUdilaES5 = new Queen("Laca Udila", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ac/LacaUdillaDRES5CastMug.jpg", true);
let MargaritaKalifataES5 = new Queen("Margarita Kalifata", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e5/MargaritaKalifataDRES5CastMug.jpg", true);
let NixES5 = new Queen("Nix", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/22/NixDRES5CastMug.jpg", true);
let NoriES5 = new Queen("Nori", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3e/NoriDRES5CastMug.jpg", true);
let SatinGrecoES5 = new Queen("Satin Greco", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/77/Sat%C3%ADnGrecoDRES5CastMug.jpg", true);

let ES5_Cast = [AlexandraDelRavalES5, DafneMuglerES5, DenebolaMurnauES5, EvaHarringtonES5, FerrxnES5, KrystalForeverES5, LaEscandaloES5, LacaUdilaES5, MargaritaKalifataES5, NixES5, NoriES5, SatinGrecoES5];

// CUSTOM LMD QUEENS
let konnykortez = new Queen("Konny Kortez", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/Wvh1B0yH/IMG-3947.jpg");
let patypiñata = new Queen("Paty Piñata", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/qMrvsv4N/IMG-3948.jpg");
let brightystun = new Queen("Brighty Stun", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/nWcjw6M/IMG-3949.jpg");
let ricurasantana = new Queen("Ricura Santana", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/S4kLc5DF/IMG-3946.jpg");
let mоonLMD = new Queen("Mоon", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/8L2WnjTW/IMG-3950.jpg");
let deetoxalanis = new Queen("Deetox Alanis", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/VsygcZL/IMG-3951.jpg");
let tulsawalpurgis = new Queen("Tulsa Walpurgis", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/fVc8y9RW/IMG-3945.jpg");
let gretagrimm = new Queen("Greta Grimm", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/NddFZnb6/IMG-3952.jpg");
let nayladowns = new Queen("Nayla Downs", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/WNdGyWTM/IMG-3959.jpg");
let oslo = new Queen("Oslo", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/zWGmhzC6/IMG-3955.jpg");
let calypso = new Queen("Calypso", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/ZpVdqcpL/IMG-3957.jpg");
let caoslascivia = new Queen("Caos Lascivia", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/PvzL9f7h/IMG-3956.jpg");
let candelayeye = new Queen("Candela Yeye", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/PJpbzxX/IMG-3954.jpg");
let axelledevil = new Queen("Axelle De Vil", 7, 7, 7, 7, 7, 7, 7, "https://i.ibb.co/PsBZRBKH/IMG-3953.jpg");
let cattriona = new Queen("Cattriona", 8, 7, 15, 10, 7, 10, 15, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2f/CattrionaLMD6CastMug.jpg");
let juanaguadalupe = new Queen("Juana Guadalupe", 9, 10, 8, 8, 9, 13, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/19/JuanaGuadalupeLMD6CastMug.jpg");
let aries = new Queen("Aries", 10, 9, 8, 13, 8, 15, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/39/AriesLMD6CastMug.jpg");
let electrawalpurgis = new Queen("Electra Walpurgis", 8, 7, 8, 9, 7, 11, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e0/ElectraWalpurgisLMD6CastMug.jpg");
let lakyliezz = new Queen("La Kyliezz", 9, 8, 9, 5, 7, 9, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fd/LaKyliezzLMD6CastMug.jpg");
let kellycaracas = new Queen("Kelly Caracas", 6, 6, 10, 9, 6, 10, 11, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/KellyLMD6CastMug.jpg");
let shantelle = new Queen("Shantelle", 7, 8, 10, 6, 8, 9, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/64/ShantelleLMD6CastMug.jpg");
let arielLMD = new Queen("Ariel", 6, 6, 9, 10, 6, 11, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e7/ArielLMD6CastMug.jpg");
let alexismvgler = new Queen("Alexis Mvgler", 6, 5, 5, 6, 5, 6, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/19/AlexisMvglerLMD6CastMug.jpg");
let purga = new Queen("Purga", 8, 8, 6, 5, 6, 8, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f3/PurgaLMD6CastMug.jpg");
let braulio8000 = new Queen("Braulio 8000", 6, 6, 5, 8, 6, 10, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5f/Braulio8000LMD6CastMug.jpg");
let ankcosart = new Queen("Ank Cosart", 4, 4, 4, 9, 4, 9, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/de/AnkCosartLMD6CastMug.jpg");
let mizzpeaches = new Queen("Mizz Peaches", 4, 4, 4, 4, 4, 2, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4a/MizzPeachesLMD6CastMug.jpg");
let dimittra = new Queen("Dimittra", 6, 7, 9, 9, 8, 11, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/84/DimittraLMD6CastMug.jpg");
let deseosfab = new Queen("Deseos Fab", 6, 9, 4, 10, 8, 10, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0b/DeseosFabLMD5CastMug.jpg");
let isabellaycatalina = new Queen("Isabella y Catalina", 5, 5, 10, 5, 4, 8, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/13/IsabellayCatalinaLMD5CastMug.jpg");
let humakyle = new Queen("Huma Kyle", 8, 7, 5, 4, 4, 7, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6e/HumaKyleLMD5CastMug.jpg");
let lightking = new Queen("Light King", 4, 6, 4, 10, 8, 10, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cd/LightKingLMD5CastMug.jpg");
let aishadollkills = new Queen("Aisha Dollkills", 4, 4, 8, 5, 4, 7, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bc/AishaDollkillsLMD5CastMug.jpg");
let pekebalderas = new Queen("Peke Balderas", 10, 9, 9, 8, 11, 10, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/98/PekeBalderasLMD5CastMug.jpg");
let grethawhite = new Queen("Gretha White", 9, 8, 9, 11, 8, 11, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cf/GrethaWhiteLMD5CastMug.jpg");
let santalucía = new Queen("Santa Lucía", 4, 4, 8, 10, 6, 8, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/ff/SantaLucíaLMD5CastMug.jpg");
let hiddenmistake = new Queen("Hidden Mistake", 5, 4, 11, 11, 4, 12, 11, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/HiddenMistakeLMD5CastMug.jpg");
let lizazanzuzzi = new Queen("Liza Zan Zuzzi", 11, 10, 8, 2, 11, 8, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cc/LizaZanZuzziLMD5CastMug.jpg");
let papercut = new Queen("Paper Cut", 7, 8, 8, 13, 10, 13, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/23/PaperCutLMD5CastMug.jpg");
let fifíestah = new Queen("Fifí Estah", 8, 8, 14, 5, 9, 11, 14, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a1/FifiEstahLMD5CastMug.jpg");
let rebelmörk = new Queen("Rebel Mörk", 9, 8, 9, 9, 6, 13, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cc/RebelMörkLMD4CastMug.jpg");
let cpher = new Queen("C-Pher", 8, 7, 11, 15, 7, 15, 9, "https://i.postimg.cc/vmyX6cMn/IMG-6370.jpg");
let irisxc = new Queen("Iris XC", 9, 9, 8, 9, 9, 9, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c3/IrisXCLMD4CastMug.jpg");
let lamorralisa = new Queen("La Morra Lisa", 8, 7, 6, 7, 7, 10, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ae/LaMorraLisaLMD4CastMug.jpg");
let lupitakush = new Queen("Lupita Kush", 5, 6, 7, 6, 8, 7, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e1/LupitaKushLMD4CastMug.jpg");
let georgiana = new Queen("Georgiana", 7, 10, 8, 7, 10, 12, 7, "https://i.postimg.cc/ncQ1Rvh7/IMG-6374.jpg");
let veracruz = new Queen("Vera Cruz", 10, 12, 6, 6, 12, 9, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9d/VeraCruzLMD4CastMug.jpg");
let tiresias = new Queen("Tiresias", 4, 4, 8, 4, 4, 7, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6b/TiresiasLMD4CastMug.jpg");
let sirena = new Queen("Sirena", 9, 7, 11, 8, 9, 13, 11, "https://i.postimg.cc/BbRBZvMX/IMG-6373.jpg");
let lacarrera = new Queen("La Carrera", 5, 5, 4, 5, 4, 5, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/10/LaCarreraLMD4CastMug.jpg");
let aurorawonders = new Queen("Aurora Wonders", 4, 4, 4, 4, 4, 2, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/12/AuroraWondersLMD4CastMug.jpg");
let madisonbasrey = new Queen("Madison Basrey", 11, 10, 9, 7, 10, 11, 10, "https://i.postimg.cc/vTT0HkyS/IMG-6372.jpg");
let rudyreyes = new Queen("Rudy Reyes", 8, 7, 11, 6, 7, 8, 12, "https://i.postimg.cc/fbMjRpjj/IMG-6375.jpg");
let aviescwho = new Queen("Aviesc Who?", 7, 5, 5, 15, 5, 15, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cf/AviescWhoLMD3CastMug.jpg");
let ragadiamante = new Queen("Raga Diamante", 10, 10, 8, 7, 10, 10, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5d/RagaDiamanteLMD3CastMug.jpg");
let mistaboo = new Queen("Mista Boo", 9, 8, 6, 7, 8, 8, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/24/MistaBooLMD3CastMug.jpg");
let memoreyri = new Queen("Memo Reyri", 6, 9, 6, 7, 10, 8, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/79/MemoReyriLMD3CastMug.jpg");
let reginabronx = new Queen("Regina Bronx", 8, 9, 8, 7, 10, 8, 11, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/44/ReginaBronxLMD3CastMug.jpg");
let ivizalioza = new Queen("Iviza Lioza", 5, 6, 5, 5, 6, 6, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0e/IvizaLiozaLMD3CastMug.jpg");
let wynter = new Queen("Wynter", 6, 6, 5, 5, 5, 6, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/18/WynterLMD3CastMug.jpg");
let huntyyb = new Queen("Huntyy B", 6, 6, 7, 8, 6, 10, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/db/HuntyyBLMD3CastMug.jpg");
let stupidrag = new Queen("Stupidrag", 4, 4, 6, 4, 4, 6, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f9/StupiDragLMD3CastMug.jpg");
let yayoibowery = new Queen("Yayoi Bowery", 4, 4, 4, 4, 4, 7, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/YayoiBoweryLMD3CastMug.jpg");
let soronasty = new Queen("Soro Nasty", 8, 8, 9, 10, 8, 12, 10, "https://i.postimg.cc/RFMP2qDm/IMG-6371.jpg");
let gvajardo = new Queen("Gvajardo", 8, 7, 7, 6, 8, 10, 9, "https://i.postimg.cc/J4J2DwJ9/IMG-6380.jpg");
let alexis3xl = new Queen("Alexis 3XL", 7, 9, 6, 13, 9, 14, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/75/Alexis3XLCastMug.jpg");
let leandrarose = new Queen("Leandra Rose", 4, 4, 5, 4, 4, 6, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8b/LeandraRoseLMD2CastMug.jpg");
let redrabbitduo = new Queen("Red Rabbit Duo", 6, 5, 9, 6, 6, 10, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/56/RedRabbitDuoLMD2CastMug.jpg");
let ameliawaldorf = new Queen("Amelia Waldorf", 6, 6, 7, 10, 6, 10, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6e/AmeliaWaldorfLMD2CastMug.png");
let jobstar = new Queen("Job Star", 6, 6, 7, 5, 6, 7, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/81/JobStarLMD2CastMug.jpg");
let deborahlagrande = new Queen("Deborah La Grande", 8, 9, 7, 6, 8, 7, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/05/DeborahLaGrandeLMD1CastMug.png");
let bárbaradurango = new Queen("Bárbara Durango", 10, 8, 8, 8, 9, 9, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0a/BárbaraDurangoLMD1CastMug.png");
let lanaboswell = new Queen("Lana Boswell", 5, 5, 5, 8, 5, 10, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d1/LanaLMD1CastMug.png");
let cordeliadurango = new Queen("Cordelia Durango", 4, 4, 4, 4, 4, 8, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b4/CordeliaDurangoLMD1CastMug.png");
let debramen = new Queen("Debra Men", 6, 7, 7, 5, 5, 6, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/18/DebraMenLMD1CastMug.png");
let velvetine = new Queen("Velvetine", 9, 9, 10, 7, 8, 9, 8, "https://i.postimg.cc/y6D5K3N6/IMG-6379.jpg");
let sophiajimenez = new Queen("Sophia Jiménez", 7, 7, 7, 7, 7, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d0/SophiaJim%C3%A9nezLMD2CastMug.jpg");

let LMD1_Cast = [deborahlagrande, margaret, evaB, bárbaradurango, lanaboswell, debramen, cordeliadurango];
let LMD2_Cast = [alexis3xl, sophiajimenez, gvajardo, jobstar, soronasty, ameliawaldorf, redrabbitduo, leandrarose, ninaD];
let LMD3_Cast = [aviescwho, huntyyb, ivizalioza, lunaL, madisonbasrey, memoreyri, mistaboo, ragadiamante, reginabronx, rudyreyes, stupidrag, wynter, yayoibowery]
let LMD4_Cast = [aurorawonders, cpher, elektraV, georgiana, irisxc, lacarrera, lamorralisa, leexa, lupitakush, papercut, rebelmörk, sirena, tiresias,  veracruz];
let LMD5_Cast = [aishadollkills, deseosfab, fifíestah, grethawhite, hiddenmistake, humakyle, isabellaycatalina, lightking, lizazanzuzzi, papercut, pekebalderas, santalucía];
let LMD6_Cast = [cattriona, juanaguadalupe, electrawalpurgis, aries, kellycaracas, lakyliezz, dimittra, shantelle, arielLMD, alexismvgler, purga, braulio8000, ankcosart, mizzpeaches];
let LMD7_Cast = [konnykortez, patypiñata, brightystun, ricurasantana, mоonLMD, deetoxalanis, tulsawalpurgis, gretagrimm, nayladowns, oslo, calypso, caoslascivia, candelayeye, axelledevil];
let SLM1_Cast = [cpher, georgiana, gvajardo, madisonbasrey, rudyreyes, sirena, soronasty, velvetine];

let loris = new Queen("Loris", 5, 5, 9, 9, 5, 8, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/63/LorisTitans2CastMug.jpg");
let frankieDoom = new Queen("Frankie Doom", 8, 6, 6, 7, 6, 8, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/94/FrankieDoomTitans2CastMug.jpg");
let meatball = new Queen("Meatball", 10, 9, 5, 5, 8, 6, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/95/MeatballBBD1CastMug.png");
let xochiMochi = new Queen("Xochi Mochi", 8, 6, 6, 8, 6, 8, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9b/XochiMochiBBD1CastMug.png");
let foxieAdjuia = new Queen("Foxie Adjuia", 6, 5, 7, 7, 4, 5, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/57/FoxieAdjuiaBBD1CastMug.png");
let ursulaMajor = new Queen("Ursula Major", 4, 4, 3, 4, 4, 4, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c7/UrsulaMajorBBD1CastMug.png");
let pincheQueen = new Queen("Pinche Queen", 4, 4, 4, 3, 4, 4, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3a/PincheQueenBBD1CastMug.png");
let vanderVonOdd = new Queen("Vander Von Odd", 12, 8, 9, 12, 8, 13, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0b/Vandervonodd_mug-dragula_s1.png");
let melissaBefierce = new Queen("Melissa Befierce", 8, 6, 10, 7, 6, 9, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3c/MelissaBefierceBBDT1CastMug.jpg");
let abhora = new Queen("Abhora", 8, 8, 6, 9, 8, 10, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/AbhoraTitans2CastMug.jpg");
let disasterina = new Queen("Disasterina", 9, 9, 6, 7, 8, 8, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c4/DisasterinaTitans2CastMug.jpg");
let biqtchPuddin = new Queen("Biqtch Puddin", 12, 10, 9, 7, 10, 9, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8e/BiqtchPuddinBBD2CastMug.png");
let majesty = new Queen("Majesty", 11, 6, 8, 11, 6, 12, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b7/MajestyTBBDS6CastMug.jpg");
let erikaKlash = new Queen("Erika Klash", 6, 5, 6, 6, 5, 7, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1b/ErikaKlashBBDT1CastMug.jpg");
let kendraOnixxx = new Queen("Kendra Onixxx", 4, 4, 5, 4, 5, 4, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/27/KendraOnixxxBBDT1CastMug.jpg");
let victoriaElizabethBlack = new Queen("Victoria Elizabeth Black", 7, 6, 8, 15, 8, 15, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f6/VictoriaElizabethBlackBBDT1CastMug.jpg");
let dahli = new Queen("Dahli", 6, 7, 11, 10, 8, 12, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b8/DahliBBD4CastMug.jpg");
let felonyDodger = new Queen("Felony Dodger", 4, 4, 4, 4, 4, 4, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/40/FelonyDodgerBBD2CastMug.png");
let monikkieShame = new Queen("Monikkie Shame", 3, 3, 3, 4, 3, 4, 3, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/MonikkieShameBBD2CastMug.png");
let dollyaBlack = new Queen("Dollya Black", 7, 7, 10, 13, 7, 12, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d4/DollyaBlackTitans2CastMug.jpg");
let evahDestruction = new Queen("Evah Destruction", 10, 6, 12, 8, 8, 10, 12, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/EvahDestructionTitans2CastMug.jpg");
let priscillaChambers = new Queen("Priscilla Chambers", 9, 9, 8, 8, 9, 9, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ec/PriscillaChambersTitans2CastMug.jpg");
let yovska = new Queen("Yovska", 8, 9, 4, 10, 8, 10, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cc/YovskaBBDT1CastMug.jpg");
let landonCider = new Queen("Landon Cider", 9, 8, 9, 10, 7, 13, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fb/LandonCiderBBD3CastMug.png");
let louisiannaPurchase = new Queen("Louisianna Purchase", 10, 7, 10, 8, 8, 11, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/01/LouisiannaPurchaseBBD3CastMug.png");
let maddelynnHatter = new Queen("Maddelynn Hatter", 5, 6, 5, 6, 5, 6, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/40/MaddelynnHatterBBD3CastMug.png");
let hollowEve = new Queen("Hollow Eve", 10, 4, 6, 7, 6, 10, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/10/HollowEveBBD3CastMug.jpg");
let maxiGlamour = new Queen("Maxi Glamour", 5, 4, 7, 5, 4, 5, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9a/MaxiGlamourBBD3CastMug.jpg");
let violenciaExclamationPoint = new Queen("Violencia Exclamation Point", 4, 4, 4, 3, 4, 3, 3, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fd/ViolenciaBBD3CastMug.png");
let saint = new Queen("Saint", 9, 6, 10, 9, 6, 12, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b9/SaintBBD4CastMug.jpg");
let laZavaleta = new Queen("La Zavaleta", 7, 6, 10, 7, 6, 8, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f5/LaZavaletaTitans2CastMug.jpg");
let sigourneyBeaver = new Queen("Sigourney Beaver", 10, 9, 11, 8, 8, 11, 11, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/66/SigourneyBeaverTitans2CastMug.jpg");
let astrudAurelia = new Queen("Astrud Aurelia", 6, 6, 8, 10, 6, 11, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/84/AstrudAureliaBBDT1CastMug.jpg");
let kocoCaine = new Queen("Koco Caine", 10, 8, 9, 6, 8, 9, 11, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a9/KocoCaineBBDT1CastMug.jpg");
let hoSoTerraToma = new Queen("HoSo Terra Toma", 13, 6, 8, 12, 7, 14, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cc/HoSoTerraTomaBBDT1CastMug.jpg");
let bitterBetty = new Queen("Bitter Betty", 6, 5, 6, 5, 6, 7, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/86/BitterBettyBBD4CastMug.jpg");
let merrieCherry = new Queen("Merrie Cherry", 2, 2, 2, 2, 2, 2, 2, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0d/MerrieCherryBBD4CastMug.jpg");
let formeldaHyde = new Queen("Formelda Hyde", 4, 4, 4, 4, 4, 6, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7e/FormeldaHydeBBD4CastMug.jpg");
let jayKay = new Queen("Jay Kay", 8, 6, 9, 6, 6, 7, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ad/JayKayTitans2CastMug.jpg");
let cynthiaDoll = new Queen("Cynthia Doll", 9, 8, 8, 6, 8, 9, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/09/CynthiaDollTitans2CastMug.jpg");
let blackberri = new Queen("Blackberri", 10, 6, 7, 8, 9, 10, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d0/BlackberriTitans2CastMug.jpg");
let satanna = new Queen("Satanna", 5, 5, 5, 5, 5, 8, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f7/SatannaBBD5CastMug.jpg");
let jarvisHammer = new Queen("Jarvis Hammer", 9, 8, 6, 6, 8, 9, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2e/JarvisHammerBBD5CastMug.jpg");
let throbZombie = new Queen("Throb Zombie", 10, 8, 9, 9, 8, 11, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8e/ThrobZombieBBD5CastMug.jpg");
let niohuruX = new Queen("Niohuru X", 10, 9, 7, 15, 9, 15, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/af/NiohuruXBBD5CastMug.jpg");
let orkgotik = new Queen("Orkgotik", 8, 7, 10, 13, 8, 13, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/64/OrkgotikBBD5CastMug.jpg");
let onyxOndyx = new Queen("Onyx Ondyx", 6, 6, 5, 6, 6, 8, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/76/OnyxOndyxBBD5CastMug.jpg");
let annaPhylactic = new Queen("Anna Phylactic", 7, 7, 6, 6, 6, 8, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f1/AnnaPhylacticBBD5CastMug.jpg");
let fantasiaRoyaleGaga = new Queen("Fantasia Royale Gaga", 7, 7, 9, 6, 6, 8, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1a/FantasiaRoyaleGagaBBD5CastMug.jpg");
let jaharia = new Queen("Jaharia", 8, 7, 11, 5, 6, 7, 12, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/56/JahariaTitans2CastMug.jpg");
let severityStone = new Queen("Severity Stone", 4, 4, 4, 4, 4, 4, 4, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/db/SeverityStoneTBBD6CastMug.jpg");
let scylla = new Queen("Scylla", 6, 5, 6, 6, 5, 7, 6, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6b/ScyllaTBBD6CastMug.jpg");
let desireeDik = new Queen("Desiree Dik", 3, 3, 5, 5, 3, 5, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ab/DesireeDikTBBD6CastMug.jpg");
let auroraGozmic = new Queen("Aurora Gozmic", 9, 8, 9, 7, 6, 10, 10, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6e/AuroraGozmicTBBD6CastMug.jpg");
let vivviTheForce = new Queen("Vivvi The Force", 5, 5, 4, 7, 5, 8, 5, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a6/VivviTheForceTBBDS6CastMug.jpg");
let pi = new Queen("Pi", 8, 9, 10, 12, 8, 12, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/20/PiTBBD6CastMug.jpg");
let auntieHeroine = new Queen("Auntie Heroine", 10, 7, 9, 10, 6, 11, 7, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/68/AuntieHeroineTBBD6CastMug.jpg");
let greyMatter = new Queen("Grey Matter", 12, 9, 10, 15, 8, 15, 9, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7c/GreyMatterTBBDS6CastMug.jpg");
let asiaConsent = new Queen("Asia Consent", 10, 8, 8, 10, 8, 13, 8, "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/66/AsiaConsentTBBDS6CastMug.jpg");

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
    pangina, BonesUK7, BonnieAnnClydeUK7, CatrinFeelingsUK7, ChaiTGrandeUK7, ElleVosqueUK7, NyongbellaUK7, PaigeThreeUK7, PastyUK7, SallyTMUK7, SilllexaDictionUK7, TayrisMongardiUK7, ViolaUK7,
    AlexandraDelRavalES5, DafneMuglerES5, DenebolaMurnauES5, EvaHarringtonES5, FerrxnES5, KrystalForeverES5, LaEscandaloES5, LacaUdilaES5, MargaritaKalifataES5, NixES5, NoriES5, SatinGrecoES5,
    deborahlagrande, margaret, bárbaradurango, lanaboswell, debramen, cordeliadurango,
    alexis3xl, sophiajimenez, gvajardo, jobstar, soronasty, ameliawaldorf, redrabbitduo, leandrarose,
    aviescwho, huntyyb, ivizalioza, lunaL, madisonbasrey, memoreyri, mistaboo, ragadiamante, reginabronx, rudyreyes, stupidrag, wynter, yayoibowery,
    aurorawonders, cpher, elektraV, georgiana, irisxc, lacarrera, lamorralisa, lupitakush, papercut, rebelmörk, sirena, tiresias,  veracruz,
    aishadollkills, deseosfab, fifíestah, grethawhite, hiddenmistake, humakyle, isabellaycatalina, lightking, lizazanzuzzi, papercut, pekebalderas, santalucía,
    cattriona, juanaguadalupe, electrawalpurgis, aries, kellycaracas, lakyliezz, dimittra, shantelle, arielLMD, alexismvgler, purga, braulio8000, ankcosart, mizzpeaches,
    konnykortez, patypiñata, brightystun, ricurasantana, mоonLMD, deetoxalanis, tulsawalpurgis, gretagrimm, nayladowns, oslo, calypso, caoslascivia, candelayeye, axelledevil,
    velvetine,
    loris, frankieDoom, meatball, xochiMochi, foxieAdjuia, ursulaMajor, pincheQueen, vanderVonOdd, melissaBefierce, abhora, disasterina, biqtchPuddin, majesty, erikaKlash, kendraOnixxx, victoriaElizabethBlack, dahli, felonyDodger, monikkieShame, dollyaBlack, evahDestruction, priscillaChambers, yovska, landonCider, louisiannaPurchase, maddelynnHatter, hollowEve, maxiGlamour,
    violenciaExclamationPoint, saint, laZavaleta, sigourneyBeaver, astrudAurelia, kocoCaine, hoSoTerraToma, bitterBetty, merrieCherry, formeldaHyde, jayKay, cynthiaDoll, blackberri, satanna, jarvisHammer, throbZombie, niohuruX, orkgotik, onyxOndyx, annaPhylactic, fantasiaRoyaleGaga, jaharia, severityStone, scylla, desireeDik, auroraGozmic, vivviTheForce, pi, auntieHeroine, greyMatter, asiaConsent
].concat(allCustomQueens).sort((a, b) => a.getName().toLowerCase().localeCompare(b.getName().toLowerCase()));

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

let runwayBasedChallenge = false;
let episodeChallenges = [];

let phase = "bracket"; // bracket, merge, finale
let currentBracketIndex = 0;
let episodeCount = 0;

let lipsyncTiebreak = false;
let lipsyncRiggory = false;

let badunkaDunk = false;
let badunkaDunkOver = false;

let spainDoll = false;
let spainDollOver = false;

let rupaulMode = false;

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
    constructor(div = null) {
        this._MainBlock = div || document.querySelector("#simulation-block");
        if (div && !this._MainBlock.isConnected) {
            document.querySelector("#simulation-block").appendChild(this._MainBlock);
        }
    }

    clean() {
        this._MainBlock.innerHTML = "";
    }

    createBigText(text) {
        let p = document.createElement("p");
        let big = document.createElement("big");
        big.innerHTML = text;
        p.appendChild(big);
        this._MainBlock.appendChild(p);
    }

    createParagraph(text, id = "") {
        let p = document.createElement("p");
        if (id) p.id = id;
        p.innerHTML = text;
        this._MainBlock.appendChild(p);
    }

    createBold(text, id = "", parentId = "") {
        let p = document.createElement("p");
        if (parentId) p.id = parentId;

        let bold = document.createElement("b");
        if (id) bold.id = id;
        bold.innerHTML = text;

        p.appendChild(bold);
        this._MainBlock.appendChild(p);
    }

    createButton(text, method, id = "") {
        let button = document.createElement("button");
        button.innerHTML = text;
        if (id) button.id = id;

        if (typeof method === "function") {
            button.addEventListener("click", method);
        } else if (typeof method === "string") {
            button.setAttribute("onclick", method);
        }

        this._MainBlock.appendChild(button);
    }

    createHorizontalLine() {
        this._MainBlock.appendChild(document.createElement("hr"));
    }

    createImage(source, color = "black") {
        let image = document.createElement("img");
        image.src = source;
        image.style.cssText = `
            border: 3px solid ${color};
            width: 105px;
            height: 105px;
            border-radius: 100%;
            object-fit: cover;
        `;
        this._MainBlock.appendChild(image);
    }

    createCheckbox(labelText, id = "", imgSrc = "") {
        let container = document.createElement("div");
        container.className = "checkbox-card";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id || ("chk_" + Math.random().toString(36).substr(2, 5));

        let label = document.createElement("label");
        label.htmlFor = checkbox.id;

        if (imgSrc) {
            let img = document.createElement("img");
            img.src = imgSrc;
            img.alt = labelText;
            label.appendChild(img);
        }

        let span = document.createElement("span");
        span.innerText = labelText;
        label.appendChild(span);

        container.appendChild(checkbox);
        container.appendChild(label);

        this._MainBlock.appendChild(container);

        return checkbox;
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

let noMini = false;
class MiniChallenge extends Challenge {
    generateDescription() {
        noMini = false;
        const description = document.getElementById("description");
        const a = [
            "wigs with ", "a quiz about ", "nails with ", "a competition about ",
            "a song about ", "make-up tutorials with ", "make a quick look about ", "a photoshoot about "
        ];
        const b = [
            "the pitcrew.", "a partner.", "noodles.", "hip pads.", "balls.", "past Drag Race contestants", "a celebrity."
        ];

        if (currentCast.length === 5) {
            description.innerHTML = "Bring in the puppets! The queens will mock eachother, and customize puppets of eachother";
        }
        else if (currentCast.length === 7) {
            description.innerHTML = `The library is open! In today's mini-challenge, the queens will read each-other to FILTH!`;
            startReadingChallenge();
        } else {
            const miniChance = 80;
            const randomized = Math.floor(Math.random() * 100);
            if (randomized >= miniChance) {
                noMini = true;
                description.innerHTML = `Today there's no mini challenge, let's move onto the maxi challenge!`
            } else {
                description.innerHTML = `In today's mini-challenge, the queens will do ${a[randomNumber(0, a.length - 1)]}${b[randomNumber(0, b.length - 1)]}`;
            }
        }
    }

    rankPerformances() {
        if (noMini) return;

        const screen = new Scene();
        const winner = currentCast[randomNumber(0, currentCast.length - 1)];

        screen.createImage(winner.image);
        winner.miniEpisode.push(episodeCount - 1);
        screen.createBold(`${winner.getName()} won the mini-challenge!`);
    }
}

function startReadingChallenge() {
    const screen = new Scene();

    const allReads = [
        "You got a grill that could put Black & Decker out of business.",
        "Everyone thinks you're pretty. I do think you're pretty. I think you have a beautiful face... for radio.",
        "As Lady Gaga once said, there can be a hundred people in the room, and 99 have no idea who you are.",
        "You're still here?",
        "Haute couture? More like haute glue.",
        "Maybe you'd look good if you were six feet under.",
        "I see the sanitation men forgot to pick you up for garbage day.",
        "I don't shut up, I grow up. But when I look at you, I throw up...",
        "Your birth certificate should be an apology from your mother.",
        "You're like a really good pair of socks. Soft, supportive, full of cum.",
        "Keep rolling your eyes, maybe you’ll find a brain back there.",
        "You are so rank girl, that plants die when you walk past them.",
        "Someday you’ll go far. I hope you stay there.",
        "If I wanted to hear from an asshole, I’d fart.",
        "You bring everyone so much joy when you leave the room.",
        "I thought of you today. It reminded me to take out the trash.",
        "I’m not insulting you, I’m describing you.",
        "Hey, you have something on your chin. No, the 3rd one down.",
        "People like you are the reason God doesn’t talk to us anymore.",
        "You have come so far! Initially, your makeup was kind of busted and your outfits were a mess and your personality was super grating, but look how far you've come now. You are much older."
    ];

    for (let i = 0; i < currentCast.length; i++) {
        screen.createImage(currentCast[i].image, "black");
        if (i === 0) {
            screen.createBold(`First up, it's ${currentCast[i].getName()}!`);
        } else if (i === currentCast.length - 1) {
            screen.createBold(`Last but definetly not least, it's ${currentCast[i].getName()}!`);
        } else {
            screen.createBold(`Next up, it's ${currentCast[i].getName()}!`);
        }

        let numberOfReads = randomNumber(2, 3);
        let alreadyRead = [];

        for (let r = 0; r < numberOfReads; r++) {
            let queenToRead = currentCast[Math.floor(Math.random() * currentCast.length)];

            while (
                queenToRead.getName() === currentCast[i].getName() ||
                alreadyRead.includes(queenToRead)
                ) {
                queenToRead = currentCast[Math.floor(Math.random() * currentCast.length)];
            }
            alreadyRead.push(queenToRead);

            let readNumber = randomNumber(0, allReads.length - 1);
            let chosenRead = allReads[readNumber];

            screen.createImage(queenToRead.image, "lightgreen");
            screen.createBold(currentCast[i].getName() + " to " + queenToRead.getName() + ":");
            screen.createParagraph(`"${chosenRead}"`);

            allReads.splice(readNumber, 1);
            if (allReads.length === 0) {
                allReads.push(
                    "You're still here?",
                    "Never mind.",
                    "WHO CARES?"
                );
            }
        }

        screen.createHorizontalLine();
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
            currentCast[i].getPerformance("design");
        }
        sortPerformances(currentCast);
    }
}

class RumixChallenge extends Challenge {
    generateDescription() {
        const description = document.getElementById("description");
        const a = [
            "Read you Wrote you",
            "Category Is",
            "Kitty Girl",
            "American",
            "Super Queen",
            "Queens Everywhere",
            "Rock It",
            "Clap Back",
            "You Wear It Well",
            "Lucky",
            "Queen of the North"
        ];
        description.innerHTML = `The queens will write a verse and do choreography for the hit single... "${a[randomNumber(0, a.length - 1)]}"!`;
    }

    rankPerformances() {
        for (let i = 0; i < currentCast.length; i++) {
            currentCast[i].getPerformance("rumix");
        }
        sortPerformances(currentCast);
    }
}

class RoastChallenge extends Challenge {
    generateDescription() {
        const description = document.getElementById("description");
        const roastTopics = [
            "Josie",
            "Juvie",
            "Millie",
            "Stormi",
            "Beatngu",
            "Pip",
            "VZ",
            "Naori",
            "Francis",
            "Ke'Juan",
            "Marley",
            "MP",
            "Noir",
            "Roo",
            "Yitzu",
            "Seren"
        ];
        description.innerHTML = `The queens will prepare a set for the... "Roast of ${roastTopics[randomNumber(0, roastTopics.length - 1)]}"!`;
    }

    rankPerformances() {
        for (let i = 0; i < currentCast.length; i++) {
            currentCast[i].getPerformance("improv");
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

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function createCastItem(q) {
    const div = document.createElement("div");
    div.className = "cast-item";
    if (!isMobile()) div.setAttribute("draggable", true);

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

    const assignBtn = document.createElement("i");
    assignBtn.className = "fa-solid fa-list";
    assignBtn.style.cssText = "position:absolute;top:5px;left:5px;cursor:pointer;z-index:1001;";
    assignBtn.title = "Assign to Bracket";

    assignBtn.addEventListener("mousedown", e => e.stopPropagation());
    assignBtn.addEventListener("touchstart", e => e.stopPropagation());

    assignBtn.addEventListener("click", () => {
        document.querySelectorAll(".bracket-menu").forEach(m => m.remove());

        const menu = document.createElement("div");
        menu.className = "bracket-menu";

        BRACKETS.forEach(b => {
            const count = currentCast.filter(q => q.assignedBracket === b).length;
            if (count < QUEENS_PER_BRACKET) {
                const option = document.createElement("div");
                option.innerText = `Bracket ${b}`;
                option.addEventListener("click", () => {
                    q.assignedBracket = b;
                    updateCastScreen();
                    menu.remove();
                });
                menu.appendChild(option);
            }
        });

        const cancel = document.createElement("div");
        cancel.innerText = "Unassign";
        cancel.style.color = "red";
        cancel.addEventListener("click", () => {
            delete q.assignedBracket;
            updateCastScreen();
            menu.remove();
        });
        menu.appendChild(cancel);

        document.body.appendChild(menu);

        setTimeout(() => {
            document.addEventListener("click", function handler(e) {
                if (!menu.contains(e.target) && e.target !== assignBtn) {
                    menu.remove();
                    document.removeEventListener("click", handler);
                }
            });
        }, 50);
    });

    div.append(img, name, button, assignBtn);
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
    if (isMobile()) return;

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

    let riggory = document.getElementById("riggory");
    lipsyncRiggory = riggory.checked;

    let lsTiebreak = document.getElementById("lstb");
    lipsyncTiebreak = lsTiebreak.checked;

    let rpMode = document.getElementById("rupaul");
    rupaulMode = rpMode.checked;

    let dunkTank = document.getElementById("tank");
    badunkaDunk = dunkTank.checked;

    let esDoll = document.getElementById("doll");
    spainDoll = esDoll.checked;

    let wildcard = document.getElementById("wildcard-format");
    wildcardType = wildcard.options[wildcard.selectedIndex].value;

    let judging = document.getElementById("judging-type");
    judgingType = judging.options[judging.selectedIndex].value;

    let merge = document.getElementById("merge-format");
    mergeFormat = merge.options[merge.selectedIndex].value;

    episodeProcessing();
}

function restartSimulation() {
    BracketA = fullCast.filter(q => q.assignedBracket === "A");
    BracketB = fullCast.filter(q => q.assignedBracket === "B");
    BracketC = fullCast.filter(q => q.assignedBracket === "C");

    fullCast.forEach(q => {
        q.trackRecord = [];
        q.mvq = 0;
        q.earnedMvq = [];
        q.giftedMvq = [];
        q.donatedMvq = [];
        q.ppe = 0;
        q.episodesOn = 0;
        q.rankP = "";
        q.dollHolder = false;
        q.dollEpisode = -1;
        q.dunkSurivalEpisode = [];
        q.title = "";
        q.miniEpisode = [];
        q.ogPlace = 0;
    })

    episodeChallenges = [];

    Mergers = [];
    eliminatedCast = [];

    wildcardUsed = false;

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
        if ((mergeFormat == "regular" && (amountPassers != 1 && episodeCount == 12) || (amountPassers == 1 && episodeCount == 10) ) || (mergeFormat == "longer" && currentCast.length == 4) || mergeFormat == "none") {
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
    screen.createBold("The queens will exchange points between themselves.");
    let queensToDonate = currentCast.filter(q => {
        let lastPlacement = q.trackRecord[q.trackRecord.length - 1].trim();
        return lastPlacement !== "WIN";
    });

    queensToDonate.forEach(donor => {
        let eligible = currentCast.filter(c => c !== donor);
        let receiver = eligible[randomNumber(0, eligible.length - 1)];

        screen.createImage(donor.image);
        screen.createImage(receiver.image);
        screen.createBold(`${donor.getName()} has given her point to ${receiver.getName()}`);

        addGiftedMvqPoints(receiver, episodeCount, 1);

        const existingDonation = donor.donatedMvq.find(e => e.ep === episodeCount && e.to === receiver.getName());
        if (existingDonation) {
            existingDonation.points += 1;
        } else {
            donor.donatedMvq.push({ ep: episodeCount, points: 1, to: receiver.getName() });
        }
    });
    if (phase === "bracket" && (episodeCount % 3 === 0)) {
        screen.createButton("Announce Passers", "announcePassers()");
    } else {
        screen.createButton("Proceed", "contestantProgress()");
    }
}

function addGiftedMvqPoints(queen, ep, pts) {
    const existing = queen.giftedMvq.find(e => e.ep === ep);

    queen.mvq++;
    if (existing) {
        existing.points += pts;
    } else {
        queen.giftedMvq.push({ ep: ep, points: pts });
    }
}

function announcePassers() {
    let screen = new Scene();
    screen.clean();

    if (rupaulMode) {
        screen.createBigText("Select who makes merge...");

        const checkboxes = currentCast.map((q, i) => screen.createCheckbox(q.getName(), `queen_${i}`, q.image));

        const confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confirm Merge Passers";
        confirmBtn.addEventListener("click", () => {
            const selectedQueens = currentCast.filter((q, i) => document.getElementById(`queen_${i}`).checked);

            checkboxes.forEach(cb => cb.parentElement.remove());
            confirmBtn.remove();

            selectedQueens.forEach(q => {
                if (!Mergers.includes(q)) Mergers.push(q);
                q.editTrackRecord("ADV");
                screen.createImage(q.image, "green");
                screen.createBold(`${q.getName()} passed to merge!`);
            });

            const eliminated = currentCast.filter(q => !selectedQueens.includes(q));
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
        });

        screen._MainBlock.appendChild(confirmBtn);

    } else {
        currentCast.sort((a, b) => b.mvq - a.mvq);

        const cutoffScore = currentCast[amountPassers - 1].mvq;
        let tiedAtCutoff = currentCast.filter(q => q.mvq === cutoffScore);

        let passers = [];
        let eliminated = [];

        screen.createBigText("The final decision...");
        screen.createBold("The queens will be notified if they passed or not...");

        passers = currentCast.filter(q => q.mvq > cutoffScore);
        const remainingSlots = amountPassers - passers.length;

        if (tiedAtCutoff.length > 1 && remainingSlots > 0) {
            if (lipsyncTiebreak) {
                screen.createHorizontalLine();
                screen.createBigText("Tie-breaker Lip Sync!");
                screen.createBold("These queens will lip-sync for their spot in the merge...");

                tiedAtCutoff.forEach(q => q.getASLipsync());

                tiedAtCutoff.sort((a, b) => b.lipsyncScore - a.lipsyncScore);

                const winners = tiedAtCutoff.slice(0, remainingSlots);
                passers = passers.concat(winners);
                eliminated = currentCast.filter(q => !passers.includes(q));

                winners.forEach(q => {
                    screen.createImage(q.image, "gold");
                    screen.createBold(`${q.getName()} won the lip-sync and makes merge!`);
                });

                tiedAtCutoff.slice(remainingSlots).forEach(q => {
                    screen.createImage(q.image, "sienna");
                    screen.createBold(`${q.getName()} lost the lip-sync and has been eliminated.`);
                });

                screen.createHorizontalLine();

            } else {
                passers = passers.concat(tiedAtCutoff.slice(0, remainingSlots));
                eliminated = currentCast.filter(q => !passers.includes(q));

                tiedAtCutoff.slice(0, remainingSlots).forEach(q => {
                    screen.createImage(q.image, "gold");
                    screen.createBold(`${q.getName()} was selected to make merge.`);
                });
            }
        } else {
            passers = currentCast.slice(0, amountPassers);
            eliminated = currentCast.slice(amountPassers);
        }

        passers.forEach(q => {
            if (!Mergers.includes(q)) Mergers.push(q);
            q.editTrackRecord("ADV");
            screen.createImage(q.image, "green");
            screen.createBold(`${q.getName()} passed with ${q.mvq} MVQ Points!`);
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
}

function startMergeAndProceed() {
    phase = "merge";
    currentCast = fullCast.filter(q => !eliminatedCast.includes(q));

    if (spainDoll) {
        receiveDolls();
    } else {
        contestantProgress();
    }
}

function receiveDolls() {
    let screen = new Scene();
    screen.clean();
    screen.createBigText("El Roscón de Reinas!");
    screen.createBold("The queens will grab a slice of cake, one lucky queen will get the lucky doll.")
    currentCast.forEach(q => {
        screen.createImage(q.image, "black");
        screen.createImage("images/Cake.png", "black");
        screen.createBold(`${q.getName()} grabbed a cake slice...`);
    })

    const luckyQueen = currentCast[Math.floor(Math.random() * currentCast.length)];
    luckyQueen.dollHolder = true;

    screen.createButton("Proceed", "contestantProgress()");
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
    runwayBasedChallenge = false;

    if (currentCast.length < 6) {
        spainDollOver = true;
    }

    const screen = new Scene();
    screen.clean();

    if (wildcardType === "merge" && !wildcardUsed && phase === "merge") {
        addWildcard();
        wildcardUsed = true;
    }

    screen.createBigText("Mini challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");

    const mini = new MiniChallenge();
    mini.generateDescription();
    mini.rankPerformances();

    // BUTTON //
    generateChallenge()
}

function addWildcard() {
    const screen = new Scene();
    if (rupaulMode  && eliminatedCast.length === 0) {
        screen.createParagraph("Select the queen(s) to return as wildcard(s).");

        const checkboxes = eliminatedCast.map((q, i) => screen.createCheckbox(q.getName(), `wild_${i}`, q.image));

        const confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confirm Wildcards";
        confirmBtn.addEventListener("click", () => {
            const selectedQueens = eliminatedCast.filter((q, i) => document.getElementById(`wild_${i}`).checked);

            if (selectedQueens.length === 0) {
                alert("Please select at least one queen to return as a wildcard.");
                return;
            }

            checkboxes.forEach(cb => cb.parentElement.remove());
            confirmBtn.remove();

            selectedQueens.forEach(wildcard => {
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

                            const singleMatch = q.rankP.match(/^(\d+)(?:st|nd|rd|th)$/);
                            const rangeMatch = q.rankP.match(/^(\d+)[–-](\d+)$/);

                            if (singleMatch) {
                                let qRank = parseInt(singleMatch[1]);
                                if (qRank < originalMax) q.rankP = toOrdinal(qRank + 1);
                            } else if (rangeMatch) {
                                let start = parseInt(rangeMatch[1]);
                                let end = parseInt(rangeMatch[2]);
                                if (end < originalMax) {
                                    start += 1;
                                    end += 1;
                                    q.rankP = `${toOrdinal(start)}–${toOrdinal(end)}`;
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

                if (wildcard.trackRecord.length > 0) wildcard.trackRecord.pop();
                wildcard.addToTrackRecord("RTRN");

                screen.createImage(wildcard.image, "orange");
                screen.createBold(`${wildcard.getName()}, has been chosen to return as a wildcard!`);
            });
        });

        screen._MainBlock.appendChild(confirmBtn);
    } else {
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

                    const singleMatch = q.rankP.match(/^(\d+)(?:st|nd|rd|th)$/);
                    const rangeMatch = q.rankP.match(/^(\d+)[–-](\d+)$/);

                    if (singleMatch) {
                        let qRank = parseInt(singleMatch[1]);
                        if (qRank < originalMax) q.rankP = toOrdinal(qRank + 1);
                    } else if (rangeMatch) {
                        let start = parseInt(rangeMatch[1]);
                        let end = parseInt(rangeMatch[2]);
                        if (end < originalMax) {
                            start += 1;
                            end += 1;
                            q.rankP = `${toOrdinal(start)}–${toOrdinal(end)}`;
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

        if (wildcard.trackRecord.length > 0) wildcard.trackRecord.pop();
        wildcard.addToTrackRecord("RTRN");

        screen.createImage(wildcard.image, "orange");
        screen.createBold(`${wildcard.getName()}, has been chosen by the wheel to be a wildcard!`);
    }
    screen.createHorizontalLine();
}

function generateChallenge() {
    const screen = new Scene();

    const listChallenges = ["designChallenge", "rumixChallenge", "roastChallenge"];
    let randomChallenge = listChallenges[Math.floor(Math.random() * listChallenges.length)];

    if (randomChallenge === "designChallenge") {
        screen.createButton("Proceed", "designChallenge()");
    } else if (randomChallenge === "rumixChallenge") {
        screen.createButton("Proceed", "rumixChallenge()");
    } else if (randomChallenge === "roastChallenge") {
        screen.createButton("Proceed", "roastChallenge()");
    }
}

function designChallenge() {
    const screen = new Scene();
    screen.clean();
    screen.createBigText("Maxi challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");

    runwayBasedChallenge = true;
    episodeChallenges.push("Design");

    const maxi = new DesignChallenge();
    maxi.generateDescription();
    maxi.rankPerformances();
    generateMaxiPerformances();
}

function rumixChallenge() {
    const screen = new Scene();
    screen.clean();
    screen.createBigText("Maxi challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");

    episodeChallenges.push("Rumix");

    const maxi = new RumixChallenge();
    maxi.generateDescription();
    maxi.rankPerformances();
    generateMaxiPerformances();
}

function roastChallenge() {
    const screen = new Scene();
    screen.clean();
    screen.createBigText("Maxi challenge!");
    screen.createBold("", "description");
    swapBackground("Werkroom");

    episodeChallenges.push("Roast");

    const maxi = new RoastChallenge();
    maxi.generateDescription();
    maxi.rankPerformances();
    generateMaxiPerformances();
}

function generateMaxiPerformances() {
    const screen = new Scene();
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

    if (runwayBasedChallenge || episodeChallenges[episodeChallenges.length - 1] === "Design" || episodeChallenges[episodeChallenges.length - 1] === "Runway" || episodeChallenges[episodeChallenges.length - 1] === "Ball") {
        for (let i = 0; i < currentCast.length - 1; i++) {
            currentCast[i].runwayScore = 0;
        }
        screen.createButton("Proceed", "judging()");
    } else {
        screen.createButton("Proceed", "runway()", "runwayButton");
    }
}

function runway() {
    const screen = new Scene();
    const button = document.getElementById("runwayButton");
    button.classList.add("hidden");

    screen.createHorizontalLine();
    screen.createBigText("The runway");
    screen.createBold("The queens will bring it to the runway!");

    currentCast.forEach(q => {
        q.getRunway();
    })

    generateRunwayPerformances();
}

function generateRunwayPerformances() {
    const screen = new Scene();

    const performanceGroups = [
        { name: "slayR",   filter: q => q.runwayScore < 6,                         color: "darkblue",  message: "slayed the runway!", penalty: 7 },
        { name: "greatR",  filter: q => q.runwayScore >= 6 && q.runwayScore < 16,  color: "royalblue", message: "had a great runway!", penalty: 3 },
        { name: "goodR",   filter: q => q.runwayScore >= 16 && q.runwayScore < 26, color: "black",     message: "had a good runway.", penalty: 0 },
        { name: "badR",    filter: q => q.runwayScore >= 26 ,                     color: "pink",      message: "had a bad runway...", penalty: -3 }
    ];

    let assignedQueens = new Set();

    performanceGroups.forEach(group => {
        let queens = currentCast.filter(q => group.filter(q) && !assignedQueens.has(q));

        if (queens.length > 0) {
            shuffle(queens);

            queens.forEach(q => {
                q.runwayScore = group.penalty;
                screen.createImage(q.image, group.color);

                assignedQueens.add(q);
            });

            screen.createBold("", group.name);

            let textElement = document.getElementById(group.name);
            textElement.innerHTML = queens.map(q => q.getName()).join(", ") + " " + group.message;
        }
    });

    screen.createButton("Proceed", "judging()");
}

function judging() {
    topQueens = [];
    bottomQueens = [];

    currentCast.forEach(q => {
        q.performanceScore -= q.runwayScore;
    })
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
            topQueens.sort((a, b) => a.performanceScore - b.performanceScore);

            let top3 = topQueens.slice(0, 3);
            let diff = top3[2].performanceScore - top3[0].performanceScore;

            if (diff <= 2) {
                totaljudged = top3;
            } else {
                totaljudged = [topQueens[0], topQueens[1]];
                highQueen = topQueens[2] || null;
                topQueens.splice(2);
            }
        }

        totaljudged.forEach(q => {
            screen.createImage(q.image, "cyan")
            addEarnedMvqPoints(q, episodeCount, 2);
            q.ppe += 5;
        });
        screen.createBold(
            `${totaljudged.map(q => q.getName()).join(", ")}, you represent the Top ${totaljudged.length} All Stars of the week.`,
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

    topQueens = topQueens.filter(q => q);

    topQueens.forEach(q => {
        if (!q.lipsyncScore) q.lipsyncScore = 0;
        q.getASLipsync();
    });

    screen.createBigText("The time has come...");
    screen.createBold("For you to lip-sync... for your legacy! Good luck, and don't fuck it up.");
    let song = lsSong().toString();
    screen.createHorizontalLine();

    let event = checkForLipsyncEvent(topQueens);
    if (event !== false) {
        let eventQueen = topQueens.find(q => q.getName() === event.queen.getName());
        if (eventQueen) eventQueen.lipsyncScore += event.points;
        screen.createHorizontalLine();
    }

    screen.createBigText("Ladies, I've made my decision...");

    if (rupaulMode) {
        screen.createParagraph("Select who wins... None or more...");

        const checkboxes = topQueens.map((q, i) => screen.createCheckbox(q.getName(), `queen_${i}`, q.image));

        const confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confirm Winners";
        confirmBtn.addEventListener("click", () => {
            const selectedQueens = topQueens.filter((q, i) => document.getElementById(`queen_${i}`).checked);

            checkboxes.forEach(cb => cb.parentElement.remove());
            confirmBtn.remove();

            if (selectedQueens.length === 0) {
                topQueens.forEach(q => {
                    q.addToTrackRecord(" WIN");
                    screen.createImage(q.image, "cyan");
                    screen.createParagraph(`${q.getName()}, you are safe.`);
                });
            } else {
                selectedQueens.forEach(q => {
                    if (selectedQueens.length > 1) {
                        q.favoritism += 5;
                        q.addToTrackRecord(" WIN ");
                        addEarnedMvqPoints(q, episodeCount, 1);
                        screen.createImage(q.image, "darkblue");
                        screen.createBold(`${q.getName()}, you're a winner, baby!`);
                    } else {
                        q.favoritism += 5;
                        q.addToTrackRecord("WIN");
                        addEarnedMvqPoints(q, episodeCount, 1);
                        screen.createImage(q.image, "royalblue");
                        screen.createBold(`${q.getName()}, you're a winner, baby!`);
                    }
                });

                topQueens
                    .filter(q => !selectedQueens.includes(q))
                    .forEach(q => {
                        q.addToTrackRecord(" WIN");
                        screen.createImage(q.image, "cyan");
                        screen.createParagraph(`${q.getName()}, you are safe.`);
                    });
            }

            screen.createButton("Proceed", "pointCeremony()");
        });

        screen._MainBlock.appendChild(confirmBtn);
    } else {
        topQueens.sort((a, b) => b.lipsyncScore - a.lipsyncScore);

        const winner = topQueens[0];
        const second = topQueens[1] || null;
        const third = topQueens[2] || null;

        const isDoubleWinner =
            second &&
            winner.lipsyncScore === second.lipsyncScore &&
            winner.lipsyncScore > 6 &&
            currentCast.length > 6;

        if (isDoubleWinner) {
            [winner, second].forEach(q => {
                screen.createImage(q.image, "darkblue");
                q.favoritism += 5;
                addEarnedMvqPoints(q, episodeCount, 1);
                q.addToTrackRecord(" WIN ");
            });
            screen.createBold("Condragulations, you're both winners, baby!");

            if (third) {
                third.addToTrackRecord(" WIN");
                screen.createImage(third.image, "cyan");
                screen.createParagraph(`${third.getName()}, you are safe.`);
            }
        }
        else {
            winner.favoritism += 5;
            winner.addToTrackRecord("WIN");
            addEarnedMvqPoints(winner, episodeCount, 1);
            screen.createImage(winner.image, "royalblue");
            screen.createBold(`${winner.getName()}, you're a winner, baby!`);

            [second, third].filter(Boolean).forEach(q => {
                q.favoritism += 5;
                q.addToTrackRecord(" WIN");
                screen.createImage(q.image, "cyan");
                screen.createParagraph(`${q.getName()}, you are safe.`);
            });
        }

        screen.createButton("Proceed", "pointCeremony()");
    }
}

function addEarnedMvqPoints(queen, ep, pts) {
    const existing = queen.earnedMvq.find(e => e.ep === ep);

    queen.mvq += pts;
    if (existing) {
        existing.points += pts;
    } else {
        queen.earnedMvq.push({ ep: ep, points: pts });
    }
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
    btm2.innerHTML += `${bottomQueens[0].getName()}, ${bottomQueens[1].getName()}, I'm sorry my dears but you are up for elimination.`;
    screen.createButton("Proceed", "lipsyncDesc()");
}

function lipsyncDesc() {
    const screen = new Scene();
    screen.clean();

    screen.createBigText("The time has come...");
    screen.createBold("For you to lip-sync... for your life! Good luck, and don't fuck it up.");

    let song = lsSong().toString();
    screen.createHorizontalLine();

    bottomQueens.forEach(q => {
        if (lipsyncRiggory) q.getLipsync();
        else q.getASLipsync();
    });

    if (spainDoll && !spainDollOver) {
        const btnContainer = document.createElement("div");
        screen._MainBlock.appendChild(btnContainer);

        let seconds = 10;
        const countdownText = document.createElement("p");
        countdownText.innerText = `You can reveal results in ${seconds} seconds...`;
        btnContainer.appendChild(countdownText);

        const interval = setInterval(() => {
            seconds--;
            countdownText.innerText = `You can reveal results in ${seconds} seconds...`;

            const dollQueen = bottomQueens.find(q => q.dollHolder);
            if (dollQueen) {
                clearInterval(interval);
                countdownText.remove();

                screen.createImage(dollQueen.image, "black");
                screen.createImage("images/Queen.png", "gold");
                screen.createBold(`${dollQueen.getName()} HOLDS THE LUCKY DOLL! You are now safe to slay another day...`);

                dollQueen.addToTrackRecord("LOW");
                dollQueen.dollEpisode = episodeCount - 1;

                spainDollOver = true;
                
                let lowQueen = currentCast.find(q => {
                    const lastIndex = q.trackRecord.length - 1;
                    return q !== dollQueen &&
                        q.trackRecord[lastIndex] &&
                        q.trackRecord[lastIndex].toUpperCase() === "LOW";
                });

                screen.createImage(lowQueen.image, "tomato");
                screen.createBold(`${lowQueen.getName()}, I'm sorry my dear, but this means that you are now up for elimination...`);

                screen.createHorizontalLine();

                lowQueen.trackRecord.pop();
                bottomQueens = bottomQueens.filter(q => q !== dollQueen);
                if (lowQueen && !bottomQueens.includes(lowQueen)) bottomQueens.push(lowQueen);

                bottomQueens.forEach(q => {
                    if (lipsyncRiggory) q.getLipsync();
                    else q.getASLipsync();
                });

                generateLipsyncPerformances(bottomQueens);

                screen.createButton("Show result", "lipSync()");
            } else if (seconds <= 0) {
                clearInterval(interval);
                countdownText.remove();

                const event = checkForLipsyncEvent(bottomQueens);
                if (event !== false) {
                    const eventQueen = bottomQueens.find(q => q.getName() === event.queen.getName());
                    eventQueen.lipsyncScore += event.points;
                }

                generateLipsyncPerformances(bottomQueens);
                screen.createButton("Show result", "lipSync()");
            }
        }, 1000);

    } else {
        const event = checkForLipsyncEvent(bottomQueens);
        if (event !== false) {
            const eventQueen = bottomQueens.find(q => q.getName() === event.queen.getName());
            eventQueen.lipsyncScore += event.points;
        }

        generateLipsyncPerformances(bottomQueens);
        screen.createButton("Show result", "lipSync()");
    }
}

let badunkaDunkLevers = Array.from({ length: 10 }, (_, i) => i + 1);
let badunkaDunkLeversUsed = [];
let badunkaDunkMaxCorrect = 2;
let badunkaDunkCorrectCount = 0;

function lipSync() {
    const screen = new Scene();
    screen.clean();

    bottomQueens.sort((a, b) => b.lipsyncScore - a.lipsyncScore);

    const safeQueen = bottomQueens[0];
    screen.createImage(safeQueen.image, "tomato");
    screen.createBold(`${safeQueen.getName()}, shantay you stay.`);
    safeQueen.unfavoritism += 3;
    safeQueen.ppe += 1;

    const lastIndex1 = safeQueen.trackRecord.length - 1;
    if (safeQueen.trackRecord[lastIndex1].toUpperCase() === "RTRN") {
        safeQueen.editTrackRecord("BTM2");
    } else {
        safeQueen.addToTrackRecord("BTM2");
    }

    const queen = bottomQueens[1];

    if (badunkaDunk && !badunkaDunkOver) {
        screen.createImage(queen.image, "tomato");
        screen.createBold(`${queen.getName()}, my queen! Are you feeling lucky?`);

        let correctLever = null;
        if (badunkaDunkCorrectCount < badunkaDunkMaxCorrect) {
            const remainingLevers = badunkaDunkLevers.filter(l => !badunkaDunkLeversUsed.includes(l));
            if (remainingLevers.length > 0) {
                correctLever = remainingLevers[randomNumber(0, remainingLevers.length - 1)];
            }
        }

        if (rupaulMode) {
            const leverContainer = document.createElement("div");
            leverContainer.style.display = "flex";
            leverContainer.style.flexWrap = "wrap";
            leverContainer.style.gap = "40px";
            leverContainer.style.marginTop = "1rem";

            badunkaDunkLevers.forEach(i => {
                if (badunkaDunkLeversUsed.includes(i)) return;

                const sliderWrapper = document.createElement("div");
                sliderWrapper.className = "lever-wrapper";
                sliderWrapper.style.textAlign = "center";
                sliderWrapper.style.display = "flex";
                sliderWrapper.style.flexDirection = "column";
                sliderWrapper.style.alignItems = "center";

                const sliderLabel = document.createElement("p");
                sliderLabel.innerText = i;

                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = "0";
                slider.max = "1";
                slider.step = "0.01";
                slider.value = "0";

                slider.style.width = "150px";
                slider.style.transform = "rotate(90deg)";
                slider.style.cursor = "grab";
                slider.style.transition = "all 0.1s ease";

                slider.addEventListener("input", () => {
                    if (slider.value >= 0.95) {
                        slider.value = "1";
                        leverContainer.remove();
                        resolveLever(i, queen, correctLever, screen);
                    } else if (slider.value <= 0.05) {
                        slider.value = "0";
                    }
                });

                sliderWrapper.appendChild(sliderLabel);
                sliderWrapper.appendChild(slider);
                leverContainer.appendChild(sliderWrapper);
            });

            screen._MainBlock.appendChild(leverContainer);
        } else {
            const remainingLevers = badunkaDunkLevers.filter(l => !badunkaDunkLeversUsed.includes(l));
            const choice = remainingLevers[randomNumber(0, remainingLevers.length - 1)];
            resolveLever(choice, queen, correctLever, screen);
        }

    } else {
        screen.createImage(queen.image, "red");

        screen.createBold(`${queen.getName()}, sashay away...`);

        const totalContestants = fullCast.length;
        const eliminatedSoFar = eliminatedCast.length;
        const rankNum = totalContestants - eliminatedSoFar;
        const lastIndex2 = queen.trackRecord.length - 1;
        if (queen.trackRecord[lastIndex2].toUpperCase() === "RTRN") {
            queen.editTrackRecord("ELIM");
        } else {
            queen.addToTrackRecord("ELIM");
        }
        queen.rankP = toOrdinal(rankNum);

        eliminatedCast.unshift(queen);
        currentCast.splice(currentCast.indexOf(queen), 1);

        screen.createButton("Proceed", "contestantProgress()");
    }
}

function resolveLever(choice, queen, correctLever, screen) {
    badunkaDunkLeversUsed.push(choice);

    if (choice === correctLever) {
        badunkaDunkCorrectCount++;
        screen.createHorizontalLine();
        screen.createImage(queen.image, "hotpink");
        screen.createBold(`${queen.getName()} chose lever number ${choice}...`);
        screen.createBold(`${queen.getName()} CONDRAGULATIONS! You have lived to slay another day!`);

        queen.unfavoritism += 3;
        queen.ppe += 1;

        const lastIndex = queen.trackRecord.length - 1;
        if (queen.trackRecord[lastIndex].toUpperCase() === "RTRN") {
            queen.editTrackRecord("BTM2");
        } else {
            queen.addToTrackRecord("BTM2");
        }

        queen.dunkSurivalEpisode.push(episodeCount - 1);
    } else {
        screen.createHorizontalLine();
        screen.createImage(queen.image, "red");
        screen.createBold(`${queen.getName()} chose lever number ${choice}...`);
        screen.createBold(`${queen.getName()}, now, it is NOT your time, sashay away...`);

        const totalContestants = fullCast.length;
        const eliminatedSoFar = eliminatedCast.length;
        const rankNum = totalContestants - eliminatedSoFar;
        const lastIndex2 = queen.trackRecord.length - 1;
        if (queen.trackRecord[lastIndex2].toUpperCase() === "RTRN") {
            queen.editTrackRecord("ELIM");
        } else {
            queen.addToTrackRecord("ELIM");
        }
        queen.rankP = toOrdinal(rankNum);

        eliminatedCast.unshift(queen);
        currentCast.splice(currentCast.indexOf(queen), 1);
    }

    if (badunkaDunkLeversUsed.length >= badunkaDunkLevers.length) {
        badunkaDunkOver = true;
    }

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
        matchRoundLabel = [1, 2,3 ];
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

        match.forEach(q => {
            if (lipsyncRiggory) {
                q.getLipsync();
            } else {
                q.getASLipsync();
            }
        });
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
    if (phase === "mergers") {
        activeTabId = "Mergers";
    }

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

        if (tabName !== "Mergers") {
            const subTabs = ["Track Record", "Point History", "Donation History"];
            const subTabContainer = document.createElement("div");
            subTabContainer.className = "sub-tab-buttons";

            const subContentContainer = document.createElement("div");
            subContentContainer.className = "sub-tab-contents";

            let activeSubTab = "Track Record";

            subTabs.forEach(subName => {
                const subBtn = document.createElement("button");
                subBtn.textContent = subName;
                subBtn.className = "sub-tab-btn";
                if (subName === activeSubTab) subBtn.classList.add("active");

                subBtn.onclick = () => {
                    subContentContainer.querySelectorAll(".sub-tab-content").forEach(sc => sc.style.display = "none");
                    subTabContainer.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
                    document.getElementById(`${tabName}-${subName}`).style.display = "block";
                    subBtn.classList.add("active");
                    activeSubTab = subName;
                };
                subTabContainer.appendChild(subBtn);

                const subContent = document.createElement("div");
                subContent.id = `${tabName}-${subName}`;
                subContent.className = "sub-tab-content";
                subContent.style.display = (subName === activeSubTab ? "block" : "none");

                const centeringDiv = document.createElement("div");
                centeringDiv.style.display = "flex";
                centeringDiv.style.justifyContent = "center";

                if (subName === "Track Record") {
                    centeringDiv.appendChild(createTrackRecordTable(tabName));
                } else if (subName === "Point History") {
                    centeringDiv.appendChild(createPointHistoryTable(tabName));
                } else if (subName === "Donation History") {
                    centeringDiv.appendChild(createDonationHistoryTable(tabName));
                }

                subContent.appendChild(centeringDiv);
                subContentContainer.appendChild(subContent);
            });

            tabContent.appendChild(subTabContainer);
            tabContent.appendChild(subContentContainer);
        } else {
            const centeringDiv = document.createElement("div");
            centeringDiv.style.display = "flex";
            centeringDiv.style.justifyContent = "center";
            centeringDiv.appendChild(createTrackRecordTable(tabName));
            tabContent.appendChild(centeringDiv);
        }

        contentContainer.appendChild(tabContent);
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.style.marginTop = "10px";

    downloadBtn.onclick = () => {
        const activeTab = document.querySelector(".tab-content[style*='block']");
        if (!activeTab) { alert("No active tab found!"); return; }
        const table = activeTab.querySelector("table.trtable");
        if (!table) { alert("No table found in the active tab!"); return; }

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

function createDonationHistoryTable(groupName) {
    const table = document.createElement("table");
    table.className = "trtable";
    table.border = "2";

    let epStart = 0, epEnd = episodeChallenges.length;
    let cast;
    switch (groupName) {
        case "Bracket A": epStart = 0; epEnd = 3; cast = BracketA; break;
        case "Bracket B": epStart = 3; epEnd = 6; cast = BracketB; break;
        case "Bracket C": epStart = 6; epEnd = 9; cast = BracketC; break;
        default: cast = [];
    }

    const epsToShow = episodeChallenges.slice(epStart, epEnd);

    // ----- Header -----
    const header = document.createElement("tr");
    const thName = document.createElement("th");
    thName.innerHTML = "Contestant";
    thName.style.fontWeight = "bold";
    header.appendChild(thName);

    epsToShow.forEach((_, i) => {
        const thEp = document.createElement("th");
        thEp.innerHTML = "Ep. " + (epStart + i + 1);
        thEp.style.fontWeight = "bold";
        thEp.style.textAlign = "center";
        header.appendChild(thEp);
    });

    table.appendChild(header);

    // ----- Body -----
    cast.forEach(contestant => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = contestant.getName();
        nameCell.className = "nameTR";
        row.appendChild(nameCell);

        epsToShow.forEach((_, i) => {
            const epNum = epStart + i + 1;
            const donation = contestant.donatedMvq.find(d => d.ep === epNum);

            const td = document.createElement("td");
            if (donation) {
                td.textContent = donation.to;
                td.style.textAlign = "center";
            } else {
                td.style.backgroundColor = "#a1a8b0"
            }
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    return table;
}

function createPointHistoryTable(groupName) {
    const table = document.createElement("table");
    table.className = "trtable";
    table.border = "2";

    let epStart = 0, epEnd = episodeChallenges.length;
    let cast;
    switch (groupName) {
        case "Bracket A": epStart = 0; epEnd = 3; cast = BracketA; break;
        case "Bracket B": epStart = 3; epEnd = 6; cast = BracketB; break;
        case "Bracket C": epStart = 6; epEnd = 9; cast = BracketC; break;
        default: cast = [];
    }

    const epsToShow = episodeChallenges.slice(epStart, epEnd);

    const header1 = document.createElement("tr");

    let th = document.createElement("th");
    th.innerHTML = "Contestant";
    th.rowSpan = 2;
    th.style.fontWeight = "bold";
    header1.appendChild(th);

    epsToShow.forEach((_, i) => {
        const epTh = document.createElement("th");
        epTh.colSpan = 2;
        epTh.innerHTML = "Ep. " + (epStart + i + 1);
        epTh.style.fontWeight = "bold";
        epTh.style.textAlign = "center";
        header1.appendChild(epTh);
    });

    // Total column
    const totalTh = document.createElement("th");
    totalTh.rowSpan = 2;
    totalTh.innerHTML = "Total MVQ";
    totalTh.style.fontWeight = "bold";
    header1.appendChild(totalTh);

    table.appendChild(header1);

    // ----- Header Row 2 -----
    const header2 = document.createElement("tr");
    epsToShow.forEach(() => {
        const earnTh = document.createElement("th");
        earnTh.innerHTML = "Earn";
        earnTh.style.textAlign = "center";
        header2.appendChild(earnTh);

        const giftTh = document.createElement("th");
        giftTh.innerHTML = "Gift";
        giftTh.style.textAlign = "center";
        header2.appendChild(giftTh);
    });
    table.appendChild(header2);

    // ----- Body -----
    cast.forEach(contestant => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = contestant.getName();
        nameCell.className = "nameTR";
        row.appendChild(nameCell);

        let totalEarn = 0, totalGift = 0;

        epsToShow.forEach((_, i) => {
            const epNum = epStart + i + 1;

            const earned = contestant.earnedMvq.find(e => e.ep === epNum)?.points || 0;
            const gifted = contestant.giftedMvq.find(g => g.ep === epNum)?.points || 0;

            totalEarn += earned;
            totalGift += gifted;

            const tdEarn = document.createElement("td");
            tdEarn.innerHTML = `+${earned}`;
            tdEarn.style.textAlign = "center";
            if (earned === 3) {
                tdEarn.style.backgroundColor = "royalblue";
                tdEarn.style.fontWeight = "bold";
                tdEarn.style.color = "white";
            } else if (earned === 2) {
                tdEarn.style.backgroundColor = "deepskyblue";
                tdEarn.style.fontWeight = "bold";
            } else {
                tdEarn.innerHTML = "-"
            }
            row.appendChild(tdEarn);

            const tdGift = document.createElement("td");
            tdGift.innerHTML = `+${gifted}`;
            tdGift.style.textAlign = "center";
            if (gifted !== 0) {
                tdGift.style.backgroundColor = "lightblue";
            } else {
                tdGift.innerHTML = "-"
            }
            row.appendChild(tdGift);
        });

        // Total MVQ
        const totalCell = document.createElement("td");
        totalCell.textContent = contestant.mvq;
        totalCell.style.textAlign = "center";
        totalCell.style.fontWeight = "bold";
        row.appendChild(totalCell);

        table.appendChild(row);
    });

    return table;
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
        const rankOrder = ["RTRNWINNER", "WINNER", "RTRNWIN", "RTRN WIN", "RTRN WIN ", "WIN", "RTRNLR4", "LR4", "RTRNLR3", "LR3", "RTRNLR2", "LR2", "RTRNLR1", "LR1", "RTRNHIGH", "HIGH", "RTRNSAFE", "SAFE", "RTRNLOW", "LOW", "RTRNBTM2", "BTM2", "RTRNELIM", "ELIM", ""];

        cast.sort((a, b) => {
            const validA = a.trackRecord.filter(p => p && ![""].includes(p));
            const validB = b.trackRecord.filter(p => p && ![""].includes(p));

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
                case "RTRNLR5": td.style.backgroundColor = "#ffd911"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>5TH<br>ROUND';break;
                case "LR5": td.style.backgroundColor = "#ffd911"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>5TH<br>ROUND';break;
                case "RTRNLR4": td.style.backgroundColor = "#ffdb24"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>4TH<br>ROUND';break;
                case "LR4": td.style.backgroundColor = "#ffdb24"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>4TH<br>ROUND';break;
                case "RTRNLR3": td.style.backgroundColor = "#ffd100"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>3RD<br>ROUND';break;
                case "LR3": td.style.backgroundColor = "#ffd100"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>3RD<br>ROUND';break;
                case "RTRNLR2": td.style.backgroundColor = "#ffae00"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>2ND<br>ROUND';break;
                case "LR2": td.style.backgroundColor = "#ffae00"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>2ND<br>ROUND';break;
                case "RTRNLR1": td.style.backgroundColor = "#ff7c00"; td.style.fontWeight = "bold"; td.innerHTML = 'RTRN<br>+<br>LOST<br>1ST<br>ROUND';break;
                case "LR1": td.style.backgroundColor = "#ff7c00"; td.style.fontWeight = "bold"; td.innerHTML = 'LOST<br>1ST<br>ROUND';break;
                case "WIN": td.style.backgroundColor = "royalblue"; td.style.color = "white"; td.style.fontWeight = "bold"; break;
                case " WIN": td.style.backgroundColor = "deepskyblue"; td.style.fontWeight = "bold"; break;
                case " WIN ": td.style.backgroundColor = "darkblue"; td.style.color = "white"; td.style.fontWeight = "bold"; break;
                case "WINADV": td.style.backgroundColor = "royalblue"; td.style.color = "white"; td.style.fontWeight = "bold"; td.innerHTML = 'WIN<br>+<br>ADV'; break;
                case " WINADV": td.style.backgroundColor = "deepskyblue"; td.style.color = "black"; td.style.fontWeight = "bold"; td.innerHTML = 'WIN<br>+<br>ADV'; break;
                case " WIN ADV": td.style.backgroundColor = "darkblue"; td.style.color = "white"; td.style.fontWeight = "bold"; td.innerHTML = 'WIN<br>+<br>ADV'; break;
                case "HIGH": td.style.backgroundColor = "lightblue"; break;
                case "HIGHADV": td.style.backgroundColor = "lightblue"; td.innerHTML = 'HIGH<br>+<br><b>ADV</b>';break;
                case "LOW": td.style.backgroundColor = "pink"; break;
                case "BTM2":
                case "BTM3":
                case "BTM4": td.style.backgroundColor = "tomato"; break;
                case "SAFE": td.style.backgroundColor = "white"; break;
                case "SAFEADV": td.style.backgroundColor = "white"; td.innerHTML = 'SAFE<br>+<br><b>ADV</b>'; break;
                case "BTM4ADV": td.style.backgroundColor = "tomato"; td.innerHTML = 'BTM4<br>+<br><b>ADV</b>'; break;
                case "BTM3ADV": td.style.backgroundColor = "tomato"; td.innerHTML = 'BTM3<br>+<br><b>ADV</b>'; break;
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

            if (contestantData.dollEpisode === actualEp) {
                td.style.border = "3px gold solid";
            }

            if (contestantData.dunkSurivalEpisode.includes(actualEp)) {
                td.style.border = "3px #2a6bcc solid";
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
                ppeCell.innerHTML = `${formattedPPE} - ${contestantData.mvq}`;
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