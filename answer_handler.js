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
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.129.233"
                },
                {
                    "name": "discordapp.com",
                    "type": "A",
                    "ttl": 156,
                    "class": "IN",
                    "flush": false,
                    "data": "162.159.134.233"
                }
            ],
            "authorities": [],
            "additionals": []
        }`;

data = JSON.parse(test);

const section_header_cls = "bg-light border-bottom border-top border-secondary pl-4 p-2 mb-0";
const list_item_flex_cls = "list-group-item d-flex justify-content-between flex-wrap";

let transforms = {
    'root': {"<>": "div", "html": [
            {"<>": "div", "html": [
                    {"<>": "h5", "class": section_header_cls, "text": "Question Section"},
                    {"<>": "ul", "class": "list-group list-group-flush", "html":
                        function () {
                            return json2html.transform(this.questions, transforms.question);
                        }
                    }
                ]
            },
            {"<>": "div", "html": [
                    {"<>": "h5", "class": section_header_cls, "text": "Answer Section"},
                    {"<>": "ul", "class": "list-group list-group-flush", "html":
                        function () {
                            return json2html.transform(this.answers, transforms.answer);
                        }
                    }
                ]
            }
        ]
    },
    'answer': {"<>": "li", "class": list_item_flex_cls, "style": "white-space: pre;", "html": [
            {"<>": "span", "text": " ${name} ", "title": "Name"},
            {"<>": "span", "text": " ${ttl} ", "title": "TTL"},
            {"<>": "span", "text": " ${class} ", "title": "Class"},
            {"<>": "span", "text": " ${type} ", "title": "Type"},
            {"<>": "b", "text": " ${data} ", "title": "Answer"}
        ]
    },
    'question': {"<>": "li", "class": list_item_flex_cls, "style": "white-space: pre;", "html": [
            {"<>": "b", "text": " ${name} ", "title": "Question"},
            {"<>": "span", "text": " ${class} ", "title": "Class"},
            {"<>": "span", "text": " ${type} ", "title": "Type"},
        ]
    }
};


const atest = function () {
    document.getElementById('doh-response').innerHTML = json2html.transform(data, transforms.root);
};

