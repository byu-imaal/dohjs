const test = `{
            "id": 18715,
            "type": "response",
            "flags": 384,
            "flag_qr": true,
            "opcode": "QUERY",
            "flag_aa": false,
            "flag_tc": false,
            "flag_rd": true,
            "flag_ra": true,
            "flag_z": false,
            "flag_ad": false,
            "flag_cd": false,
            "rcode": "NOERROR",
            "questions": [
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "class": "IN"
                }
            ],
            "answers": [
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.130.233"
                },
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.133.233"
                },
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.135.233"
                },
                {
                    "name": "example.com",
                    "type": "AAAA",
                    "ttl": 10618,
                    "class": "IN",
                    "flush": false,
                    "data": "2606:2800:220:1:248:1893:25c8:1946"
                },
                {
                    "name": "example.com",
                    "type": "MX",
                    "ttl": 8988,
                    "class": "IN",
                    "flush": false,
                    "data": {
                        "preference": 0,
                        "exchange": "."
                    }
                },
                {
                    "name": "byu.edu",
                    "type": "SOA",
                    "ttl": 7199,
                    "class": "IN",
                    "flush": false,
                    "data": {
                        "mname": "EDNS1.byu.edu",
                        "rname": "dnsmaster.byu.edu",
                        "serial": 76807415,
                        "refresh": 1801,
                        "retry": 900,
                        "expire": 604800,
                        "minimum": 7200
                    }
                },
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.134.233",
                    "extra": "This is a test"
                }
            ],
            "authorities": [],
            "additionals": []
        }`;

data = JSON.parse(test);

const section_header_cls = "bg-light border-bottom border-top border-secondary pl-4 p-2 mb-0";
const list_item_flex_cls = "list-group-item d-flex justify-content-between flex-wrap";


const handle_generic_pair = function (key, val) {
    return json2html.transform({}, {"<>": "span", "text": ` ${val} `, "title": key});
};

const handle_generic_record = function(j) {
    console.log(j);
    let res = "";
    for (let [key, value] of Object.entries(j)) {
        res += handle_generic_pair(key, value);
    }
    console.log(res);
    return res;
};

const handle_answer_data = function (ans) {
    console.log(ans.type);
    switch (ans.type) {
        case 'A':
        case 'AAAA':
        case 'CNAME':
        case 'DNAME':
        case 'NS':
            return json2html.transform(ans, {"<>": "b", "text": " ${data} ", "title": 'Answer'});
        case 'MX':
            return json2html.transform(ans.data, {"<>": "span", "html": [
                    {"<>": "span", "text": " ${preference} ", "title": "Preference"},
                    {"<>": "b", "text": " ${exchange} ", "title": "Exchange"}
                ]});
        default:
            return handle_generic_record(ans.data);
    }
};

const prune = function reject(obj, keys) {
    return Object.keys(obj)
        .filter(k => !keys.includes(k))
        .map(k => Object.assign({}, {[k]: obj[k]}))
        .reduce((res, o) => Object.assign(res, o), {});
};

let transforms = {
    'root': {"<>": "div", "html": [
            {"<>": "div", "html": [
                    {"<>": "h5", "class": section_header_cls, "text": "Question Section"},
                    {"<>": "ul", "class": "list-group list-group-flush", "html":
                        (j) => json2html.transform(j.questions, transforms.question)
                    }
                ]
            },
            {"<>": "div", "html": [
                    {"<>": "h5", "class": section_header_cls, "text": "Answer Section"},
                    {"<>": "ul", "class": "list-group list-group-flush", "html":
                        (j) => json2html.transform(j.answers, transforms.answer)
                    }
                ]
            }
        ]
    },
    'answer': {"<>": "li", "class": list_item_flex_cls, "style": "white-space: pre;", "html": [
            {"<>": "i", "text": " ${name} ", "title": "Name"},
            {"<>": "i", "text": " ${ttl} ", "title": "TTL"},
            {"<>": "i", "text": " ${class} ", "title": "Class"},
            {"<>": "i", "text": " ${type} ", "title": "Type"},
            {"<>": "div", "class": "mb-2", "style": "flex-basis: 100%; height: 0;"}, // force newline
            {"<>": "span", "class": "d-flex justify-content-around flex-wrap", "html": d => handle_answer_data(d)},
            {"<>": "div", "style": "flex-basis: 100%; height: 0;"}, // force newline
            //TODO is this even a possibility or does dns-packet always include extras in `data`
            {"<>": "span", "html":
                (j) => handle_generic_record(prune(j, ['name', 'ttl', 'class', 'type', 'data', 'flush']))
            }
        ]

    },
    'question': {"<>": "li", "class": list_item_flex_cls, "style": "white-space: pre;", "html": [
            {"<>": "b", "text": " ${name} ", "title": "Question"},
            {"<>": "span", "text": " ${class} ", "title": "Class"},
            {"<>": "span", "text": " ${type} ", "title": "Type"},
        ]
    }
};


const atest = function (json) {
    console.log(json);
    document.getElementById('doh-response').innerHTML = json2html.transform(json, transforms.root);
};

