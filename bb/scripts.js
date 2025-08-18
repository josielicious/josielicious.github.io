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

    createBold(txt) {
        const element = document.createElement("p");
        element.innerHTML = `<b>${txt}</b>`;
        this.main.appendChild(element);
    }

    createItalic(txt) {
        const element = document.createElement("p");
        element.innerHTML = `<i>${txt}</i>`;
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

        if (SimulatorGlobals.season['format'] === 'original') {
            this._cast.forEach((c) => {
                const others = this._cast.filter(q => q !== c);

                const shuffled = others.sort(() => 0.5 - Math.random());
                const votedCast1 = shuffled[0];
                const votedCast2 = shuffled[1];

                SimulatorGlobals.cast['nominatedContestants'].push(votedCast1);
                SimulatorGlobals.cast['nominatedContestants'].push(votedCast2);

                this._ui.createImage(c.image, true);
                this._ui.createImage(votedCast1.image, true);
                this._ui.createImage(votedCast2.image, true);
                this._ui.createParagraph(`${c.getNick()} has voted for ${votedCast1.getNick()} as his first option, and ${votedCast2.getNick()} as his second option.`, true);
            })
        } else {
            const hoh = SimulatorGlobals.cast['headOfHousehold'][0];
            const others = this._cast.filter(q => q !== hoh);

            const shuffled = others.sort(() => 0.5 - Math.random());
            const votedCast1 = shuffled[0];
            const votedCast2 = shuffled[1];

            SimulatorGlobals.cast['nominatedContestants'].push(votedCast1);
            SimulatorGlobals.cast['nominatedContestants'].push(votedCast2);

            this._ui.createImage(hoh.image, true);
            this._ui.createImage(votedCast1.image, true);
            this._ui.createImage(votedCast2.image, true);
            this._ui.createParagraph(`${hoh.getNick()} has nominated ${votedCast1.getNick()} and ${votedCast2.getNick()}`, true);

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

        this._ui.createImage(winner.image, true);
        this._ui.createParagraph(`${winner.getNick()} has won the Power of Veto!`, true);
    }
}

// - SEASON ONE - //
const EddieMcGee = new Contestant("Eddie McGee", ["Eddie"], "1/Eddie");
const JoshSouza = new Contestant("Josh Souza", ["Josh", "Sooz", "Sloshy"], "1/Josh");
const CurtisKin = new Contestant("Curtis Kin", ["Curtis"], "1/Curtis");
const JamieMarieKern = new Contestant("Jamie Marie Kern", ["Jamie"], "1/Jamie");
const GeorgeAllenBoswell = new Contestant("George Allen Boswell", ["George", "Chicken George"], "7/George");
const CassandraWaldon = new Contestant("Cassandra Waldon", ["Cassandra"], "1/Cassandra");
const BrittanyPetros = new Contestant("Brittany Petros", ["Brittany"], "1/Brittany");
const KarenFowler = new Contestant("Karen Fowler", ["Karen"], "1/Karen");
const JordanParker = new Contestant("Jordan Parker", ["Jordan"], "1/Jordan");
const WilliamCollins = new Contestant("William Collins", ["William", "Mega", "Will Mega"], "1/William");
const US_Season1 = [EddieMcGee, JoshSouza, CurtisKin, JamieMarieKern, GeorgeAllenBoswell, CassandraWaldon, BrittanyPetros, KarenFowler, JordanParker, WilliamCollins];

// - SEASON TWO - //
const WillKirby = new Contestant("Will Kirby", ["Will", "Dr. Will", "Dr. Delicious", "The Pupper Master"], "7/Will");
const NicoleMarieChristner = new Contestant("Nicole Marie Christner", ["Nicole"], "2/Nicole");
const MonicaBailey = new Contestant("Monica Bailey", ["Monica"], "2/Monica");
const HardyAmesHill = new Contestant("Hardy Ames-Hill", ["Hardy"], "2/Hardy");
const BunkyMiller = new Contestant("Bunky Miller", ["Bunky"], "2/Bunky");
const KristaStegall = new Contestant("Krista Stegall", ["Krista"], "2/Krista");
const KentBlackwelder = new Contestant("Kent Blackwelder", ["Kent"], "2/Kent");
const MikeBoogieMalin = new Contestant("Mike Malin", ["Mike","Boogie"], "14/Mike");
const ShannonDragoo = new Contestant("Shannon Dragoo", ["Shannon"], "2/Shannon");
const AutumnDaly = new Contestant("Autumn Daly", ["Autumn"], "2/Autumn");
const SherylBraxton = new Contestant("Sheryl Braxton", ["Sheryl"], "2/Sheryl");
const JustinSebik = new Contestant("Justin Sebik", ["Justin"], "2/Justin");
const US_Season2 = [WillKirby, NicoleMarieChristner, MonicaBailey, HardyAmesHill, BunkyMiller, KristaStegall, KentBlackwelder, MikeBoogieMalin, ShannonDragoo, AutumnDaly, SherylBraxton, JustinSebik];

// - SEASON TWELVE - //
const RachelEileenVillegas = new Contestant("Rachel Eileen Villegas", ["Rachel"], "27/Rachel");

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
        "finale-size": 2
    },
    cast : {
        "all-contestants" : [EddieMcGee, JoshSouza, CurtisKin, JamieMarieKern, GeorgeAllenBoswell, CassandraWaldon, BrittanyPetros, KarenFowler, JordanParker, WilliamCollins,
            WillKirby, NicoleMarieChristner, MonicaBailey, HardyAmesHill, BunkyMiller, KristaStegall, KentBlackwelder, MikeBoogieMalin, ShannonDragoo, AutumnDaly, SherylBraxton, JustinSebik,
            AshleyHollis, AvaPearl, KatherineWoodman, KeanuSoto, KelleyJorgensen, LaurenDomingue, MickeyLee, MorganPope, RylieJeffries, VincePanaro, WillWilliams, ZachCornell, JimmyHeagerty, AdrianRocha, AmyBingham, ZaeFrederich, RachelEileenVillegas],
        "current-cast" : [],
        "headOfHousehold" : [],
        "nominatedContestants" : [],
        "relationships" : new Map()
    }
};

function castOverZero() {
    return SimulatorGlobals.cast['current-cast'].length > 0;
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
                    card.href = `index.html?cast=${encodeURIComponent(season.id)}&format=${encodeURIComponent(season.format)}&jury=${encodeURIComponent(season["jury-size"])}&finale=${encodeURIComponent(season["finale-size"])}`;
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

        if (cast) {
            selectPredefinedCast(cast, format, jury, finale);
        } else {
            updateContestants();
        }
    })
}

function selectPredefinedCast(cast, format, jury, finale) {
    SimulatorGlobals.season['format'] = format;
    SimulatorGlobals.season['jury-size'] = jury;
    SimulatorGlobals.season['finale'] = finale;
    switch (cast) {
        case 'bb1':
            pushPredefinedCast(US_Season1);
            break;
        case 'bb2':
            pushPredefinedCast(US_Season2);
            break;
        case 'bb27':
            pushPredefinedCast(US_Season27);
            break;
    }
}

function pushPredefinedCast(cast) {
    //window.history.replaceState({}, document.title, "index.html");
    SimulatorGlobals.cast['current-cast'] = cast;

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
        text.innerHTML = `Current Cast: ${SimulatorGlobals.cast['current-cast'].length}`;

        // - UPDATE CAST INTERFACE - //
        SimulatorGlobals.cast["current-cast"].forEach(c => {
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
                SimulatorGlobals.cast["current-cast"] = SimulatorGlobals.cast["current-cast"].filter(q => q !== c);
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
    const cast = SimulatorGlobals.cast['current-cast'];
    const fin = SimulatorGlobals.season['finale-size'];
    const interface = new Interface();
    interface.clean();
    if (cast.length !== fin) {
        houseEvents()
    }
}

function houseEvents() {
    const ui = new Interface();
    const houseEvents = new HouseEvents(SimulatorGlobals.cast['current-cast'], ui);
    const cast = SimulatorGlobals.cast['current-cast'];

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

    if (SimulatorGlobals.season['format'] === 'original') {
        ui.createButton("Proceed", "nominationCeremony()");
    } else {
        ui.createButton("Proceed", "hohCompetition()");
    }
}

function hohCompetition() {
    const ui = new Interface();
    ui.clean();

    const hoh = new HOHCompetition(SimulatorGlobals.cast['current-cast'], ui);
    hoh.generateHOH();

    ui.createButton("Proceed", "nominationCeremony()");
}

function nominationCeremony() {
    const ui = new Interface();
    ui.clean();

    const ceremony = new NominationCeremony(SimulatorGlobals.cast['current-cast'], ui);
    ceremony.generateVotes();

    if (SimulatorGlobals.season['format'] === 'regular') {
        ui.createButton("Proceed", "povCompetition()");
    } else {
        ui.createButton("Proceed", "votingCeremony()");
    }
}

function povCompetition() {
    const ui = new Interface();
    ui.clean();

    const veto = new VetoCompetition(SimulatorGlobals.cast['current-cast'], ui);
    veto.generateVeto();
}