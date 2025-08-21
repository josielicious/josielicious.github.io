/*document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function(e) {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        alert('Inspect Element is disabled on this page.');
    }
});


var devtoolsOpen = false;
var threshold = 160;
setInterval(function() {
    var widthThreshold = window.outerWidth - window.innerWidth > threshold;
    var heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            alert('DevTools detected! Please close it to continue.');
            window.location.href = '/';
        }
    } else {
        devtoolsOpen = false;
    }
}, 1000);

*/

// - HEADER LOGIC - //
fetch('data/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    });

// - CLASSES - //
class Interface {
    constructor(main) {
        this.main = document.getElementById("main-body");
    }

    clean() {
        this.main.innerHTML = '';
    }

    createImage(src, contestant) {
        const element = document.createElement("img");
        element.src = src;
        if (contestant) {
            element.classList.add('contestant');
        }
        this.main.appendChild(element);
    }

    createHeader(txt, type) {
        let element;
        switch (type) {
            case "1": element = document.createElement("h1"); break;
            case "2": element = document.createElement("h2"); break;
            case "3": element = document.createElement("h3"); break;
            case "4": element = document.createElement("h4"); break;
            default: element = document.createElement("h3"); break;
        }
        element.innerHTML = txt;
        this.main.appendChild(element);
    }

    createBold(txt, event = true) {
        const element = document.createElement("p");
        element.innerHTML = `<b>${txt}</b>`;
        if (event === true) {
            element.classList.add('event');
        }
        this.main.appendChild(element);
    }

    createItalic(txt,  event = true) {
        const element = document.createElement("p");
        element.innerHTML = `<i>${txt}</i>`;
        if (event === true) {
            element.classList.add('event');
        }
        this.main.appendChild(element);
    }

    createParagraph(txt, event = false) {
        const element = document.createElement("p");
        element.innerHTML = txt;
        if (event === true) {
            element.classList.add('event');
        }
        this.main.appendChild(element);
    }

    createHorizontal() {
        const element = document.createElement("hr");
        this.main.appendChild(element);
    }

    createButton(txt, onclick, clss = null) {
        const element = document.createElement("button");
        element.innerHTML = txt;
        element.setAttribute("onclick", onclick);
        element.classList.add(clss);
        this.main.appendChild(element);
    }
}

class Contestant {
    constructor(name, nick, image) {
        this._name = name;
        this._nick = Array.isArray(nick) ? nick : [nick];
        this._image = image;
        this.povWins = 0;
        this.hohWins = 0;
        this.sccWins = 0;
    }

    get name() {
        return this._name;
    }

    getNick(formal = false) {
        if (this._nick.length === 0) return "";
        return formal ? this._nick[0] : this._nick[Math.floor(Math.random() * this._nick.length)];
    }

    get image() {
        return `images/contestants/${this._image}.png`;
    }
}

class HouseEvents {
    constructor(cast, ui) {
        this._cast = cast;
        this._ui = ui;

        this.onepevents = [
            "NameA is lost in thought.",
            "NameA practices a new skill.",
            "NameA cleans their room.",
            "NameA writes in their journal.",
            "NameA discovers that the condom box is opened."
        ];

        this.tpevents = [
            "NameA fights NameB",
            "NameA pranks NameB",
            "NameA and NameB have a deep conversation",
            "NameA ignores NameB all day",
            "NameA considers back-dooring NameB.",
            "NameA and NameB take a condom from the condom box, and put it in the trash."
        ];

        this.thpevents = [
            "NameA, NameB, and NameC bond over video games",
            "NameA cooks while NameB and NameC watch",
            "NameA, NameB, and NameC argue about chores",
            "NameA shares a secret with NameB and NameC"
        ];
    }

    _getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    _shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    generateEvent() {
        const castLength = this._cast.length;

        if (castLength < 1) {
            this._ui.createItalic("No contestants to generate events.");
            return;
        }

        let eventType;
        const r = Math.random();
        if (r < 0.2) eventType = "onep";
        else if (r < 0.6) eventType = "tp";
        else eventType = "thp";

        let template, selectedContestants;

        if (eventType === "onep") {
            template = this._getRandom(this.onepevents);
            selectedContestants = this._shuffle(this._cast).slice(0, 1);
            template = template.replace(/NameA/g, selectedContestants[0].getNick(false));
        } else if (eventType === "tp") {
            template = this._getRandom(this.tpevents);
            selectedContestants = this._shuffle(this._cast).slice(0, 2);
            template = template
                .replace(/NameA/g, selectedContestants[0].getNick(false))
                .replace(/NameB/g, selectedContestants[1].getNick(false));
        } else {
            template = this._getRandom(this.thpevents);
            selectedContestants = this._shuffle(this._cast).slice(0, 3);
            template = template
                .replace(/NameA/g, selectedContestants[0].getNick(false))
                .replace(/NameB/g, selectedContestants[1].getNick(false))
                .replace(/NameC/g, selectedContestants[2].getNick(false));
        }

        selectedContestants.forEach(contestant => {
            this._ui.createImage(contestant.image, contestant.name);
        });

        this._ui.createParagraph(template, true);
    }
}

class HOHCompetition {
    constructor(cast, ui) {
        this._cast = cast;
        this._ui = ui;
    }

    generateHOH() {
        this._ui.createHeader("HOH Competition", "3");

        const shuffled = [...this._cast].sort(() => 0.5 - Math.random());
        const hoh = shuffled[0];

        SimulatorGlobals.cast['headOfHousehold'] = [hoh];

        hoh.hohWins++
        this._ui.createImage(hoh.image, true);
        this._ui.createParagraph(`${hoh.getNick()} has won Head of Household!`, true);
    }
}

class NominationCeremony {
    constructor(cast, ui) {
        this._cast = cast;
        this._ui = ui;
    }

    generateVotes() {
        this._ui.createHeader("Nomination Ceremony", "3");

        if (SimulatorGlobals.season['format'] !== 'original') {
            const hoh = SimulatorGlobals.cast['headOfHousehold'][0];
            const others = this._cast.filter(q => q !== hoh);

            const shuffled = others.sort(() => 0.5 - Math.random());

            const twists = SimulatorGlobals.season['active-twists'];
            const votedCast1 = shuffled[0];
            const votedCast2 = shuffled[1];
            if (twists.includes("ai-arena") || twists.includes("bb-blockbuster") && this._cast.length > 9) {
                const votedCast3 = shuffled[2];
                SimulatorGlobals.cast['nominatedContestants'].push(votedCast1, votedCast2, votedCast3);

                this._ui.createImage(hoh.image, true);
                this._ui.createImage(votedCast1.image, true);
                this._ui.createImage(votedCast2.image, true);
                this._ui.createImage(votedCast3.image, true);
                this._ui.createParagraph(`${hoh.getNick()} has nominated ${votedCast1.getNick()}, ${votedCast2.getNick()} and ${votedCast3.getNick()}.`, true);
            }
            else {
                SimulatorGlobals.cast['nominatedContestants'].push(votedCast1, votedCast2);

                this._ui.createImage(hoh.image, true);
                this._ui.createImage(votedCast1.image, true);
                this._ui.createImage(votedCast2.image, true);
                this._ui.createParagraph(`${hoh.getNick()} has nominated ${votedCast1.getNick()} and ${votedCast2.getNick()}`, true);
            }
        }
    }
}

class VetoCompetition {
    constructor(cast, ui) {
        this._cast = cast;
        this._ui = ui;

        const totalPlayers = this._cast.length;
        const hoh = SimulatorGlobals.cast['headOfHousehold'][0];
        const nominees = [...SimulatorGlobals.cast['nominatedContestants']];

        if (totalPlayers <= 6) {
            this._eligible = [...this._cast];
        } else {
            const lockedIn = [hoh, ...nominees];

            const potentialExtras = this._cast.filter(c => !lockedIn.includes(c));
            const shuffledExtras = potentialExtras.sort(() => 0.5 - Math.random());

            const numberOfExtras = 6 - lockedIn.length;
            const randomExtras = shuffledExtras.slice(0, numberOfExtras);

            this._eligible = [...lockedIn, ...randomExtras];
        }
    }

    prepareEligible() {
        const remaining = [...this._cast];
        const hoh = SimulatorGlobals.cast['headOfHousehold'][0];
        const nominees = SimulatorGlobals.cast['nominatedContestants'] || [];

        const lockedIn = [hoh, ...nominees];

        const potentialExtras = remaining.filter(c => !lockedIn.includes(c));

        const shuffledExtras = potentialExtras.sort(() => 0.5 - Math.random());
        const numberOfExtras = Math.min(3, potentialExtras.length);
        const randomExtras = shuffledExtras.slice(0, numberOfExtras);

        this._eligible = [...lockedIn, ...randomExtras];
    }

    generateVeto() {
        this._ui.createHeader("POV Competition", "3");

        this.prepareEligible();

        this._ui.createBold("The following houseguests are competing in the Power of Veto:");

        const names = this._eligible.map(q => q.getNick(true)).join(", ");

        this._eligible.forEach(c => {
            this._ui.createImage(c.image, true);
        });

        this._ui.createParagraph(`${names} will be participating in the Power of Veto competition.`, true);
        this._ui.createHorizontal();

        const winner = this._eligible[Math.floor(Math.random() * this._eligible.length)];
        SimulatorGlobals.cast['vetoWinner'] = winner;

        winner.povWins++;
        this._ui.createImage(winner.image, true);
        this._ui.createParagraph(`${winner.getNick()} has won the Power of Veto!`, true);
    }

    generateUsage() {
        const ui = this._ui;
        const nominees = SimulatorGlobals.cast['nominatedContestants'];
        const vetoWinner = SimulatorGlobals.cast['vetoWinner'];
        const hoh = SimulatorGlobals.cast['headOfHousehold'][0];

        ui.createHeader("Veto Ceremony", "3");
        ui.createImage(vetoWinner.image, true);

        const nomineeA = nominees[0];
        const nomineeB = nominees[1];
        let nomineeC = null;
        if (nominees.length > 2) {
            nomineeC = nominees[2];
        }

        let willUse = false;
        let savedNominee = null;
        let selfSaved = false;

        if (vetoWinner === nomineeA || vetoWinner === nomineeB || vetoWinner === nomineeC) {
            savedNominee = vetoWinner;
            willUse = true;
            selfSaved = true;
        } else {
            willUse = Math.random() < 0.5;
            if (willUse) {
                savedNominee = Math.random() < 0.5 ? nomineeA : nomineeB;
            }
        }

        const twists = SimulatorGlobals.season['active-twists'] || [];
        const specialTwist = twists.includes("ai-arena") || twists.includes("bb-blockbuster");

        if (!willUse) {
            ui.createParagraph(`${vetoWinner.getNick()} has decided not to use the Power of Veto.`, true);
            if (specialTwist && SimulatorGlobals.cast['currentCast'].length > 5) {
                ui.createButton("Proceed", "secondChanceChallenge()");
            } else {
                ui.createButton("Proceed", "votingCeremony()");
            }
            return;
        }

        if (selfSaved) {
            ui.createParagraph(`${vetoWinner.getNick()} has used the Power of Veto to save themselves.`, true);
        } else {
            ui.createImage(savedNominee.image, true);
            ui.createParagraph(`${vetoWinner.getNick()} has used the Power of Veto to save ${savedNominee.getNick()}.`, true);
        }

        const remainingNominees = nominees.filter(n => n !== savedNominee);
        SimulatorGlobals.cast['nominatedContestants'] = remainingNominees;

        if (selfSaved || willUse) {
            if (remainingNominees.length < 2 || specialTwist) {
                const potentialReplacements = this._cast.filter(c =>
                    c !== hoh &&
                    c !== vetoWinner &&
                    c !== savedNominee &&
                    !remainingNominees.includes(c)
                );

                if (potentialReplacements.length > 0) {
                    const replacement = potentialReplacements[Math.floor(Math.random() * potentialReplacements.length)];
                    SimulatorGlobals.cast['nominatedContestants'].push(replacement);

                    ui.createImage(hoh.image, true);
                    ui.createImage(replacement.image, true);
                    ui.createParagraph(`${hoh.getNick()} has nominated ${replacement.getNick()} as the replacement nominee.`, true);
                }
            }
        }

        if (specialTwist && SimulatorGlobals.cast['currentCast'].length > 5) {
            ui.createButton("Proceed", "secondChanceChallenge()");
        } else {
            ui.createButton("Proceed", "votingCeremony()");
        }
    }
}

class VotingCeremony {
    constructor(cast, ui) {
        this._cast = cast;
        this._ui = ui;
    }

    generateVoting() {
        this._ui.createHeader("Voting Ceremony", "3");

        const nominees = SimulatorGlobals.cast['nominatedContestants'];
        if (nominees.length < 2) {
            this._ui.createItalic("Not enough nominees to proceed with a vote.");
            return;
        }

        const nomineeA = nominees[0];
        const nomineeB = nominees[1];
        const votes = new Map();
        votes.set(nomineeA, 0);
        votes.set(nomineeB, 0);

        const hoh = SimulatorGlobals.cast['headOfHousehold'][0];
        const voters = this._cast.filter(c => c !== nomineeA && c !== nomineeB && c !== hoh)
        this._ui.createBold(`The following houseguests are voting to evict:`);

        voters.forEach(voter => {
            const vote = Math.random() < 0.5 ? nomineeA : nomineeB;
            votes.set(vote, votes.get(vote) + 1);

            this._ui.createImage(voter.image, true);
            this._ui.createImage(vote.image, true);
            this._ui.createParagraph(`${voter.getNick()} has voted to evict ${vote.getNick()}.`, true);
        });

        this._ui.createHorizontal();
        this._ui.createBold("Vote Summary:");

        this._ui.createImage(nomineeA.image, true);
        this._ui.createParagraph(`${nomineeA.getNick(true)} received ${votes.get(nomineeA)} votes.`, true);
        this._ui.createImage(nomineeB.image, true);
        this._ui.createParagraph(`${nomineeB.getNick(true)} received ${votes.get(nomineeB)} votes.`, true);

        let evicted;
        if (votes.get(nomineeA) > votes.get(nomineeB)) {
            evicted = nomineeA;
        } else if (votes.get(nomineeB) > votes.get(nomineeA)) {
            evicted = nomineeB;
        } else {
            this._ui.createHorizontal();
            this._ui.createItalic("It's a tie! The Head of Household will break the tie.");

            const hohVote = Math.random() < 0.5 ? nomineeA : nomineeB;
            evicted = hohVote;

            this._ui.createImage(hoh.image, true);
            this._ui.createImage(hohVote.image, true);
            this._ui.createParagraph(`${hoh.getNick()} has voted to evict ${hohVote.getNick()}.`, true);
        }

        this._ui.createHorizontal();
        this._ui.createImage(evicted.image, true);
        this._ui.createBold(`${evicted.getNick(true)} has been evicted from the house.`, "2");

        SimulatorGlobals.cast['currentCast'] = this._cast.filter(c => c !== evicted);
        SimulatorGlobals.cast['eliminatedContestants'].push(evicted);
        SimulatorGlobals.cast['nominatedContestants'] = [];
    }
}


// - SEASON TWELVE - //
const RachelEileenVillegas = new Contestant("Rachel Eileen Villegas", ["Rachel"], "27/Rachel");

// - SEASON TWENTY-FIVE - //
const JagBains = new Contestant("Jag Bains", ["Jag"], "25/Jag");
const MattKlotz = new Contestant("Matt Klotz", ["Matt"], "25/Matt");
const BowieJaneBall = new Contestant("Bowie Jane Ball", ["Bowie Jane", "Bowie"], "25/BowieJane");
const FeliciaCannon = new Contestant("Felicia Cannon", ["Felicia"], "25/Felicia");
const CirieFields = new Contestant("Cirie Fields", ["Cirie"], "25/Cirie");
const AmericaLopez = new Contestant("America Lopez", ["America"], "25/America");
const BlueKim = new Contestant("Blue Kim", ["Blue"], "25/Blue");
const CoryWuetenberger = new Contestant("Cory Wurtenberger", ["Cory"], "25/Cory");
const CameronHardin = new Contestant("Cameron Hardin", ["Cameron"], "25/Cameron");
const MecoleHayes = new Contestant("Mecole Hayes", ["Mecole", "Meme"], "25/Mecole");
const JaredFields = new Contestant("Jared Fields", ["Jared"], "25/Jared");
const IzzyGleicher = new Contestant("Izzy Gleicher", ["Izzy"], "25/Izzy");
const RedUtley = new Contestant("Red Utley", ["Red"], "25/Red");
const HisamGoueli = new Contestant("Hisam Goueli", ["Hisam"], "25/Hisam");
const ReillySmedley = new Contestant("Reilly Smedley", ["Reilly"], "25/Reilly");
const KirstenElwin = new Contestant("Kirsten Elwin", ["Kirsten"], "25/Kirsten");
const LukeValentine = new Contestant("Luke Valentine", ["Luke"], "25/Luke");
const US_Season25 = [JagBains, MattKlotz, BowieJaneBall, FeliciaCannon, CirieFields, AmericaLopez, BlueKim, CoryWuetenberger, CameronHardin, MecoleHayes, JaredFields, KirstenElwin, IzzyGleicher, RedUtley, HisamGoueli, ReillySmedley, KirstenElwin, LukeValentine];

// - SEASON TWENTY-SIX - //
const ChelsieBaham = new Contestant("Chelsie Baham", ["Chelsie"], "26/Chelsie");
const MakensyManbeck = new Contestant("Makensy Manbeck", ["Makensy", "MJ"], "26/Makensy");
const CamSullivanBrown = new Contestant("Cam Sullivan-Brown", ["Cameron", "Cam"], "26/Cam");
const RubinaBernabe = new Contestant("Rubina Bernabe", ["Rubina", "RB"], "26/Rubina");
const KimoApaka = new Contestant("Kimo Apaka", ["Kimo"], "26/Kimo");
const AngelaMurray = new Contestant("Angela Murray", ["Angela", "Mama"], "26/Angela");
const LeahPeters = new Contestant("Leah Peters", ["Leah"], "26/Leah");
const TkorClottley = new Contestant("T'kor Clottley", ["T'kor", "T"], "26/T'kor");
const QuinnMartin = new Contestant("Quinn Martin", ["Quinn"], "26/Quinn");
const JosephRodriguez = new Contestant("Joseph Rodriguez", ["Joseph"], "26/Joseph");
const TuckerDesLauriers = new Contestant("Tucker Des Lauriers", ["Tucker"], "26/Tucker");
const BrooklynRivera = new Contestant("Brookyln Rivera", ["Brooklyn"], "26/Brooklyn");
const CedricHodges = new Contestant("Cedric Hodges", ["Cedric", "Young Cedric"] ,"26/Cedric");
const KenneyKelley = new Contestant("Kenney Kelley", ["Kenney"], "26/Kenney");
const LisaWeintraub = new Contestant("Lisa Weintraub", ["Lisa"], "26/Lisa");
const MattHardeman = new Contestant("Matt Hardeman", ["Matt", "Crazy Eyes"], "26/Matt");
const US_Season26 = [ChelsieBaham, MakensyManbeck, CamSullivanBrown, RubinaBernabe, KimoApaka, AngelaMurray, LeahPeters, TkorClottley, QuinnMartin, JosephRodriguez, TuckerDesLauriers, BrooklynRivera, CedricHodges, KenneyKelley, LisaWeintraub, MattHardeman];

// - SEASON TWENTY-SEVEN - //
const AshleyHollis = new Contestant("Ashley Hollis", ["Ashley"], "27/Ashley");
const AvaPearl = new Contestant("Ava Pearl", ["Ava"], "27/Ava");
const KatherineWoodman = new Contestant("Katherine Woodman", ["Katherine", "Kat"], "27/Katherine");
const KeanuSoto = new Contestant("Keanu Soto", ["Keanu"], "27/Keanu");
const KelleyJorgensen = new Contestant("Kelley Jorgensen", ["Kelley"], "27/Kelley");
const LaurenDomingue = new Contestant("Lauren Domingue", ["Lauren"], "27/Lauren");
const MickeyLee = new Contestant("Mickey Lee", ["Mickey"], "27/Mickey");
const MorganPope = new Contestant("Morgan Pope", ["Morgan"], "27/Morgan");
const RylieJeffries = new Contestant("Rylie Jeffries", ["Rylie"], "27/Rylie");
const VincePanaro = new Contestant("Vince Panaro", ["Vince"], "27/Vince");
const WillWilliams = new Contestant("Will Williams", ["Will"], "27/Will");
const ZachCornell = new Contestant("Zach Cornell", ["Zach"], "27/Zach");
const JimmyHeagerty = new Contestant("Jimmy Heagerty", ["Jimmy"], "27/Jimmy");
const AdrianRocha = new Contestant("Adrian Rocha", ["Adrian"], "27/Adrian");
const AmyBingham = new Contestant("Amy Bingham", ["Amy"], "27/Amy");
const ZaeFrederich = new Contestant("Zae Frederich", ["Zae"], "27/Zae");
const US_Season27 = [AshleyHollis, AvaPearl, KatherineWoodman, KeanuSoto, KelleyJorgensen, LaurenDomingue, MickeyLee, MorganPope, RylieJeffries, VincePanaro, WillWilliams, ZachCornell, JimmyHeagerty, AdrianRocha, AmyBingham, ZaeFrederich, RachelEileenVillegas];

let SimulatorGlobals = {
    simulator : {
        "editing-mode" : false
    },
    season : {
        "format": "original",
        "jury-size": 7,
        "finale-size": 2,
        "active-twists": []
    },
    cast : {
        "all-contestants" : [AshleyHollis, AvaPearl, KatherineWoodman, KeanuSoto, KelleyJorgensen, LaurenDomingue, MickeyLee, MorganPope, RylieJeffries, VincePanaro, WillWilliams, ZachCornell, JimmyHeagerty, AdrianRocha, AmyBingham, ZaeFrederich, RachelEileenVillegas],
        "currentCast" : [],
        "headOfHousehold" : [],
        "nominatedContestants" : [],
        "eliminatedContestants" : [],
        "relationships" : new Map()
    }
};

function castOverZero() {
    return SimulatorGlobals.cast['currentCast'].length > 0;
}

// - PREDEFINED CASTS SCREEN - //
if (document.location.pathname.endsWith('/bb/casts.html')) {
    document.addEventListener("DOMContentLoaded", () => {
        const container = document.getElementById("seasons-container");

        if (!container) return;
        fetch("data/seasons.json")
            .then(response => response.json())
            .then(seasons => {
                seasons.forEach(season => {
                    const card = document.createElement("a");
                    card.className = "season-card";
                    card.href = `index.html?cast=${encodeURIComponent(season.id)}&format=${encodeURIComponent(season.format)}&twists=${encodeURIComponent(JSON.stringify(season.twists))}&jury=${encodeURIComponent(season["jury-size"])}&finale=${encodeURIComponent(season["finale-size"])}`;
                    card.innerHTML = `
                        <img src="${season.image}" loading="lazy" oncontextmenu="return false;">
                        <h3>${season.season}</h3>
                    `;
                    container.appendChild(card);
                });
            })
    });
}

// - HOME SCREEN - //
if (document.location.pathname.endsWith('/bb/index.html')) {
    document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const cast = params.get("cast");
        const format = params.get("format");
        const jury = params.get("jury");
        const finale = params.get("finale");
        const twistsParam = params.get("twists");
        let twists = [];

        if (twistsParam) {
            try {
                twists = JSON.parse(twistsParam);
                if (!Array.isArray(twists)) {
                    twists = [twists];
                }
            } catch {
                twists = [twistsParam];
            }
        }

        if (cast) {
            selectPredefinedCast(cast, format, jury, finale, twists);
        } else {
            updateContestants();
        }
    })
}

function selectPredefinedCast(cast, format, jury, finale, twists) {
    SimulatorGlobals.season['format'] = format;
    SimulatorGlobals.season['jury-size'] = jury;
    SimulatorGlobals.season['finale'] = finale;
    SimulatorGlobals.season['active-twists'] = twists;
    switch (cast) {
        case 'bb25':
            pushPredefinedCast(US_Season25);
            break;
        case 'bb26':
            pushPredefinedCast(US_Season26);
            break;
        case 'bb27':
            pushPredefinedCast(US_Season27);
            break;
    }
}

function pushPredefinedCast(cast) {
    //window.history.replaceState({}, document.title, "index.html");
    SimulatorGlobals.cast['currentCast'] = cast;

    updateContestants();
}

function updateContestants() {
    const container = document.getElementById("contestant-container");

    if (!container) return;
    container.innerHTML = '';
    const text = document.getElementById("contestant-text");
    const simulation = document.getElementById("simulation-settings");
    if (castOverZero()) {
        container.classList.remove("hidden");
        simulation.classList.remove("hidden");
        text.innerHTML = `Current Cast: ${SimulatorGlobals.cast['currentCast'].length}`;

        // - UPDATE CAST INTERFACE - //
        SimulatorGlobals.cast["currentCast"].forEach(c => {
            const card = document.createElement("div");
            card.className = "contestant-card";
            card.innerHTML = `
            <img src=${c.image} alt="${c.name}" oncontextmenu="return false;"></img>
            <p><b>${c.name}</b></p>
            <button class="contestant-remove">Remove</button>`;
            const button = card.querySelector("button");
            if (SimulatorGlobals.simulator['editing-mode'] === false) {
                button.classList.add("hidden");
            } else {
                button.classList.remove("hidden");
            }
            button.addEventListener("click", () => {
                SimulatorGlobals.cast["currentCast"] = SimulatorGlobals.cast["currentCast"].filter(q => q !== c);
                updateContestants();
            });
            container.appendChild(card);
        })
    } else {
        simulation.classList.add("hidden");
        container.classList.add("hidden");
        text.innerHTML = `It's looking quite empty here...`;
    }
}

// - CAST EDITING - //
function toggleEditing() {
    if (!castOverZero()) return;

    const relationshipToggleBtn = document.getElementById("relationships-toggle");
    const buttons = document.getElementsByClassName("contestant-remove");
    const inEditMode = !SimulatorGlobals.simulator['editing-mode'];

    SimulatorGlobals.simulator['editing-mode'] = inEditMode;

    for (let button of buttons) {
        button.classList.toggle("hidden", !inEditMode);
    }

    document.getElementById("cast-editor").classList.remove("hidden");

    relationshipToggleBtn.classList.toggle("hidden", inEditMode);
}

// - START SIMULATION - //
function startSimulation() {
    startEpisode();
}

function startEpisode() {
    const cast = SimulatorGlobals.cast['currentCast'];
    const fin = SimulatorGlobals.season['finale-size'];
    const interface = new Interface();
    interface.clean();
    if (cast.length !== fin) {
        houseEvents();
    } else {
        finaleCeremony();
    }
}

function houseEvents() {
    const ui = new Interface();
    const houseEvents = new HouseEvents(SimulatorGlobals.cast['currentCast'], ui);
    const cast = SimulatorGlobals.cast['currentCast'];

    let eventCount = 1;
    if (cast.length <= 4) {
        eventCount = 1;
    } else if (cast.length <= 6) {
        eventCount = 3;
    } else {
        eventCount = 5;
    }

    ui.createHeader("House Events", "3");

    for (let i = 0; i < eventCount; i++) {
        houseEvents.generateEvent();
    }

    ui.createButton("Proceed", "hohCompetition()");
}

function hohCompetition() {
    const ui = new Interface();
    ui.clean();

    const hoh = new HOHCompetition(SimulatorGlobals.cast['currentCast'], ui);
    hoh.generateHOH();

    ui.createButton("Proceed", "nominationCeremony()");
}

function nominationCeremony() {
    const ui = new Interface();
    ui.clean();

    const ceremony = new NominationCeremony(SimulatorGlobals.cast['currentCast'], ui);
    ceremony.generateVotes();

    if (SimulatorGlobals.season['format'] === 'regular') {
        ui.createButton("Proceed", "povCompetition()");
    } else {
        ui.createButton("Proceed", "votingCeremony()");
    }
}

function povCompetition() {
    const cast = SimulatorGlobals.cast['currentCast'];
    const ui = new Interface();
    ui.clean();

    if (cast.length <= 3) {
        votingCeremony();
        return;
    }

    const veto = new VetoCompetition(cast, ui);
    veto.generateVeto();

    ui.createButton("Proceed", "vetoUsage()");
}

function vetoUsage() {
    const ui = new Interface();
    ui.clean();

    const veto = new VetoCompetition(SimulatorGlobals.cast['currentCast'], ui);
    veto.generateUsage();
}

function secondChanceChallenge() {
    const ui = new Interface();
    ui.clean();

    const nominees = SimulatorGlobals.cast['nominatedContestants'];
    if (nominees.length < 3) {
        votingCeremony();
        return;
    }

    const twists = SimulatorGlobals.season['active-twists'] || [];
    let twistName;
    if (twists.includes("ai-arena")) {
        twistName = "AI Arena";
    } else if (twists.includes("bb-blockbuster")) {
        twistName = "BB Blockbuster";
    }

    ui.createHeader(`The ${twistName}`, "3");
    nominees.forEach(n => ui.createImage(n.image, true));
    ui.createParagraph("The three nominees will compete for a chance to save themselves from eviction!", true);

    const savedNomineeIndex = Math.floor(Math.random() * nominees.length);
    const savedNominee = nominees[savedNomineeIndex];

    savedNominee.sccWins++;
    ui.createImage(savedNominee.image, true);
    ui.createParagraph(`${savedNominee.getNick()} has won the ${twistName} and is safe from eviction!`, true);

    const remainingNominees = nominees.filter(n => n !== savedNominee);
    SimulatorGlobals.cast['nominatedContestants'] = remainingNominees;

    ui.createButton("Proceed", "votingCeremony()");
}

function votingCeremony() {
    const ui = new Interface();
    ui.clean();

    const voting = new VotingCeremony(SimulatorGlobals.cast['currentCast'], ui);
    voting.generateVoting();

    ui.createButton("Proceed", "memoryWall()");
}

function memoryWall() {
    const ui = new Interface();
    ui.clean();

    ui.createHeader("Memory Wall", "2");

    const current = SimulatorGlobals.cast['currentCast'];
    const evicted = SimulatorGlobals.cast['eliminatedContestants']

    const twists = SimulatorGlobals.season['active-twists'] || [];
    const activeTwist = "ai-arena" || "bb-blockbuster";

    const currentTitle = document.createElement("h3");
    currentTitle.innerHTML = "Current Houseguests";
    ui.main.appendChild(currentTitle);
    const currentDiv = document.createElement("div");
    currentDiv.classList.add("contestant-grid");
    current.forEach(c => {
        const card = document.createElement("div");
        card.classList.add("contestant-card");
        if (twists.includes(activeTwist)) {
            card.innerHTML = `
            <img src="${c.image}" alt="${c.name}" width="100">
            <p><b>${c.name}</b></p>
            <p>HOH Wins: ${c.hohWins}</p>
            <p>POV Wins: ${c.povWins}</p>
            <p>SCC Wins: ${c.sccWins}</p>
        `;
        } else {
            card.innerHTML = `
            <img src="${c.image}" alt="${c.name}" width="100">
            <p><b>${c.name}</b></p>
            <p>HOH Wins: ${c.hohWins}</p>
            <p>POV Wins: ${c.povWins}</p>
        `;
        }
        currentDiv.appendChild(card);
    });
    ui.main.appendChild(currentDiv);

    const evictedTitle = document.createElement("h3");
    evictedTitle.innerHTML = "Evicted Houseguests";
    ui.main.appendChild(evictedTitle);
    const evictedDiv = document.createElement("div");
    evictedDiv.classList.add("contestant-grid");
    evicted.forEach(c => {
        const card = document.createElement("div");
        card.classList.add("contestant-card");
        if (twists.includes(activeTwist)) {
            card.innerHTML = `
            <img src="${c.image}" alt="${c.name}" width="100">
            <p><b>${c.name}</b></p>
            <p>HOH Wins: ${c.hohWins}</p>
            <p>POV Wins: ${c.povWins}</p>
            <p>SCC Wins: ${c.sccWins}</p>
        `;
        } else {
            card.innerHTML = `
            <img src="${c.image}" alt="${c.name}" width="100">
            <p><b>${c.name}</b></p>
            <p>HOH Wins: ${c.hohWins}</p>
            <p>POV Wins: ${c.povWins}</p>
        `;
        }
        evictedDiv.appendChild(card);
    });
    ui.main.appendChild(evictedDiv);

    ui.createButton("Proceed", "startEpisode()");
}

function finaleCeremony() {
    const ui = new Interface();
    ui.clean();

    ui.createHeader("Finale", "2");
    const finalists = SimulatorGlobals.cast['currentCast'];
    const jury = SimulatorGlobals.cast['eliminatedContestants'].slice(-SimulatorGlobals.season['jury-size']);

    if (jury.length === 0) {
        ui.createItalic("No jury members available to vote.");
        return;
    }

    const votes = new Map();
    votes.set(finalists[0], 0);
    votes.set(finalists[1], 0);

    ui.createBold("The jury will now vote for the winner:");

    jury.forEach(juror => {
        const vote = Math.random() < 0.5 ? finalists[0] : finalists[1];
        votes.set(vote, votes.get(vote) + 1);

        ui.createImage(juror.image, true);
        ui.createImage(vote.image, true);
        ui.createParagraph(`${juror.getNick()} has voted for ${vote.getNick()} to win.`, true);
    });

    ui.createHorizontal();
    ui.createHeader("Final Vote Count", "3");

    finalists.forEach(finalist => {
        ui.createImage(finalist.image, true);
        ui.createParagraph(`${finalist.getNick(true)} received ${votes.get(finalist)} votes.`, true);
    });

    ui.createHorizontal();

    const winner = votes.get(finalists[0]) > votes.get(finalists[1]) ? finalists[0] : finalists[1];
    ui.createImage(winner.image, true);
    ui.createBold(`${winner.getNick(true)} is the winner of Big Brother!`, true);

    ui.createButton("Restart", "window.location.href='index.html'");
}