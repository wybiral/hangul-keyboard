const INITIAL = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const MEDIAL = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

const FINAL = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const KEYS = [
    [
        {
            "qwerty": "Q",
            "hangul": "ㅂ",
            "shifted": "ㅃ"
        },
        {
            "qwerty": "W",
            "hangul": "ㅈ",
            "shifted": "ㅉ"
        },
        {
            "qwerty": "E",
            "hangul": "ㄷ",
            "shifted": "ㄸ"
        },
        {
            "qwerty": "R",
            "hangul": "ㄱ",
            "shifted": "ㄲ"
        },
        {
            "qwerty": "T",
            "hangul": "ㅅ",
            "shifted": "ㅆ"
        },
        {
            "qwerty": "Y",
            "hangul": "ㅛ"
        },
        {
            "qwerty": "U",
            "hangul": "ㅕ"
        },
        {
            "qwerty": "I",
            "hangul": "ㅑ"
        },
        {
            "qwerty": "O",
            "hangul": "ㅐ",
            "shifted": "ㅒ"
        },
        {
            "qwerty": "P",
            "hangul": "ㅔ",
            "shifted": "ㅖ"
        }
    ],
    [
        {
            "qwerty": "A",
            "hangul": "ㅁ"
        },
        {
            "qwerty": "S",
            "hangul": "ㄴ"
        },
        {
            "qwerty": "D",
            "hangul": "ㅇ"
        },
        {
            "qwerty": "F",
            "hangul": "ㄹ"
        },
        {
            "qwerty": "G",
            "hangul": "ㅎ"
        },
        {
            "qwerty": "H",
            "hangul": "ㅗ"
        },
        {
            "qwerty": "J",
            "hangul": "ㅓ"
        },
        {
            "qwerty": "K",
            "hangul": "ㅏ"
        },
        {
            "qwerty": "L",
            "hangul": "ㅣ"
        }
    ],
    [
        {
            "qwerty": "Z",
            "hangul": "ㅋ"
        },
        {
            "qwerty": "X",
            "hangul": "ㅌ"
        },
        {
            "qwerty": "C",
            "hangul": "ㅊ"
        },
        {
            "qwerty": "V",
            "hangul": "ㅍ"
        },
        {
            "qwerty": "B",
            "hangul": "ㅠ"
        },
        {
            "qwerty": "N",
            "hangul": "ㅜ"
        },
        {
            "qwerty": "M",
            "hangul": "ㅡ"
        }
    ]
];

function combine(parts) {
    if (parts.length == 0) {
        return '';
    } else if (parts.length == 1) {
        return parts[0];
    }
    const i = INITIAL.indexOf(parts[0]);
    const m = MEDIAL.indexOf(parts[1]);
    let code = 44032;
    code += i * MEDIAL.length * FINAL.length;
    code += m * FINAL.length;
    if (parts.length > 2) {
        const f = FINAL.indexOf(parts[2]);
        code += f;
    }
    return String.fromCodePoint(code);
}

let voice;

function say(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    speechSynthesis.speak(u);
}

window.onload = () => {
    speechSynthesis.getVoices();
    setTimeout(() => {
        speechSynthesis.getVoices().forEach(x => {
            if (x.lang == 'ko-KR') {
                voice = x;
            }
        });
    }, 1000);
    let current = [];
    const mapping = {};
    const inp = document.querySelector('#text');
    inp.value = '';
    inp.focus();
    inp.onkeydown = evt => {
        const c = evt.key;
        const key = mapping[c.toUpperCase()];
        console.log(c);
        if (!evt.ctrlKey && typeof key !== 'undefined') {
            evt.preventDefault();
            let h;
            if (evt.shiftKey && typeof key.shifted !== 'undefined') {
                h = key.shifted;
            } else {
                h = key.hangul;
            }
            if (current.length == 0) {
                current = [h];
                inp.value += combine(current);
            } else if (current.length < 3) {
                current.push(h);
                inp.value = inp.value.slice(0, inp.value.length - 1) + combine(current);
                if (current.length == 3) {
                    current = [];
                }
            } else {
                current = [h]
                inp.value += combine(current);
            }
        } else if (c == ' ') {
            if (current.length > 0) {
                evt.preventDefault();
                current = [];
            }
        } else if (c == 'Backspace') {
            if (current.length > 0) {
                current = [];
            }
        }
    };
    const keysEl = document.querySelector('.keys');
    KEYS.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'row';
        row.forEach(key => {
            mapping[key.qwerty] = key;
            const keyEl = document.createElement('div');
            keyEl.className = 'key';
            const qwertyEl = document.createElement('span');
            qwertyEl.className = 'qwerty';
            qwertyEl.innerText = key.qwerty;
            keyEl.appendChild(qwertyEl);
            if (key.shifted) {
                const shiftedEl = document.createElement('span');
                shiftedEl.className = 'shifted';
                shiftedEl.innerText = key.shifted;
                shiftedEl.onclick = evt => {
                    evt.stopPropagation();
                    inp.dispatchEvent(new KeyboardEvent('keydown',  {
                        'key': key.qwerty,
                        'shiftKey': true,
                    }));
                };
                keyEl.appendChild(shiftedEl);
            }
            const hangulEl = document.createElement('span');
            hangulEl.className = 'hangul';
            hangulEl.innerText = key.hangul;
            keyEl.appendChild(hangulEl);
            keyEl.onclick = evt => {
                inp.dispatchEvent(new KeyboardEvent('keydown',  {
                    'key': key.qwerty,
                }));
                inp.focus();
            };
            rowEl.appendChild(keyEl);
        });
        keysEl.appendChild(rowEl);
    });
    document.querySelector('#speak').onclick = evt => {
        say(inp.value);
    };
};
