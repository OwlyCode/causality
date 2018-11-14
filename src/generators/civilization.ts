import Random from "../core/Random";
import { ucfirst } from "../core/Utils";

const starter = [
    "Af", "Alb", "Alg", "And", "Ang", "Ant", "Bar", "Arg", "Ar", "Ar", "Aust", "Azer",
    "Baha", "Bah", "Bang", "Bar", "Bel", "Belg", "Bel", "Ben", "Bhut", "Boli", "Bos",
    "Herze", "Bots", "Bra", "Brun", "Bul", "Burki", "Bur", "Bur", "Camb", "Came", "Cana",
    "Ca", "Ch", "Chi", "Chi", "Co", "Como", "Con", "Cos", "Cote", "Croa", "Cu", "Cura",
    "Cyp", "Cze", "Den", "Dji", "Dom", "Ti", "Ecu", "Eg", "El", "Equa", "Eri", "Esto",
    "Eswa", "Ethi", "Fi", "Fin", "Fran", "Ga", "Gam", "Geo", "Ger", "Gha", "Gree", "Gren",
    "Gua", "Gui", "Gui", "Guy", "Hai", "Hond", "Hon", "Hung", "Ice", "Ind", "Indo", "Ir",
    "Ir", "Ire", "Isra", "Ita", "Jama", "Ja", "Jor", "Kaza", "Ke", "Kiri", "Kor", "Ko",
    "Kuw", "Kyrgy", "La", "Lat", "Leba", "Leso", "Libe", "Lib", "Liecht", "Lithu", "Luxem",
    "Ma", "Mace", "Mada", "Ma", "Ma", "Mal", "Ma", "Mal", "Mar", "Mauri", "Mauri", "Mex",
    "Mi", "Moldo", "Mo", "Mongo", "Mon", "Mor", "Mozam", "Nami", "Nau", "Ne", "Nether",
    "Zea", "Nica", "Ni", "Nor", "Om", "Paki", "Pa", "Pales", "Pan", "Pa", "Para", "Pe",
    "Phi", "Po", "Por", "Qa", "Rom", "Ru", "Rwan", "Luc", "Grena", "Sam", "San", "Sao",
    "Sau", "Sene", "Serb", "Seych", "Sier", "Singa", "Maar", "Slova", "Slove", "Solo",
    "Soma", "Afri", "Su", "Spa", "Sri", "Su", "Suri", "Swazi", "Swe", "Swit", "Syr", "Tai",
    "Taji", "Tanza", "Thai", "Ti", "To", "Ton", "Trini", "Tun", "Tur", "Tur", "Tuva", "Ugan",
    "Uk", "Uru", "Uzbe", "Van", "Vene", "Viet", "Yem", "Zam", "Zim",
];

const middle = [
    "ghan", "an", "er", "or", "ola", "igua", "buda", "enti", "men", "uba", "ra", "ria", "bai",
    "mas", "rain", "lad", "ba", "arus", "ium", "ize", "in", "an", "via", "nia", "gov", "wana",
    "zil", "ei", "gar", "na", "ma", "undi", "odia", "roon", "da", "bo", "ad", "le", "na", "lomb",
    "ros", "go", "ta", "ivoi", "tia", "ba", "cao", "rus", "chia", "mark", "bou", "ini", "mor",
    "ador", "ypt", "salva", "tor", "trea", "nia", "tini", "opia", "ji", "land", "ce", "bon", "bia",
    "gia", "many", "na", "ce", "ada", "te", "nea", "nea", "ana", "ti", "uras", "kong", "ary",
    "land", "ia", "ne", "an", "aq", "land", "el", "ly", "ica", "pan", "dan", "khstan", "nya", "bati",
    "ea", "so", "ait", "zstan", "os", "via", "non", "tho", "ria", "ya", "en", "ania", "bourg", "cau",
    "donia", "gas", "la", "lay", "dives", "li", "ta", "shall", "tania", "tius", "ico", "cro", "va",
    "naco", "lia", "tene", "occo", "bique", "bia", "ru", "pal", "lands", "land", "ragua", "ger", "way",
    "an", "stan", "lau", "tinian", "ama", "pua", "guay", "ru", "lippi", "land", "tugal", "tar", "ania",
    "ssia", "da", "ia", "dines", "oa", "Mar", "tome", "di", "gal", "ia", "elles", "ra", "pore", "ten",
    "kia", "nia", "mon", "lia", "ca", "dan", "in", "lan", "dan", "name", "land", "den", "zer", "ia",
    "wan", "kist", "nia", "land", "mor", "go", "ga", "dad", "isia", "key", "kmen", "lu", "da", "raine",
    "guay", "kist", "uatu", "zue", "nam", "en", "bia", "ba",
];

const ender = [
    "an", "bia", "au", "bwe", "ca", "car", "dor", "dos", "esh", "so", "gro", "ia", "nea", "ina", "ino",
    "istan", "jan", "ka", "la", "land", "ne", "te", "lia", "mala", "na", "nes", "nesia", "pe", "ra",
    "re", "rica", "sia", "stein", "ti", "go", "de", "vo", "wi",
];

export function generateCivilizationName(seed: string): string {
    const r = new Random(seed);

    if (r.between(0, 2) === 0) {
        return `${r.among(starter)}${r.among(ender)}`;
    }

    return `${r.among(starter)}${r.among(middle)}${r.among(ender)}`;
}
