const chatting = document.getElementById('chatting');
const input = document.getElementById('userInput');
const tag = [['Info', 4], ['Symptoms', 4], ['Disease', 2], ['Medicine', 2], ['Inherited', 1], ['LifeStyle', 3], ['Additional', 0]]

fetchQuestionsByTag(tag[tagNum][0]).then(fetchedQuestions => {
    questions = fetchedQuestions;
});
let userInfo = {
    Symtoms: [],
    Disease: [],
    Medicine: [],
    Inherited: [],
    LifeStyle: [],
    Additional: []
};


// start button
const startButton = document.getElementById('start');
if (startButton) {
startButton.addEventListener('click', async () => {
    console.log('Start button clicked');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    await fetch('/conversation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        //  Tìm hiểu vể stringify
        body: null 
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('data', data);
            conversationId = data.get('id');
            const newUrl = `/${conversationId}`;
            
            // Add new link to sidebar
            const conversations = document.getElementById('conversations');
            const newList = document.createElement('li');
            const newLink = document.createElement('a');

            newLink.href = newUrl;
            newLink.textContent = data.get('name');

            newList.className = 'nav-item';
            newList.appendChild(newLink);
            
            conversations.appendChild(newList);
    
            // Redirect to new URL
            window.location.href = newUrl;
        });
});
}

// button send message
const sendButton = document.getElementById('send');
sendButton.addEventListener('click', sendQuery);

// attach link button
// const linkButton = document.getElementById('link');
// const fileInput = document.getElementById('fileInput');

// linkButton.addEventListener('click', () => {
//     fileInput.click();
// });

// fileInput.addEventListener('change', () => {
//     const file = fileInput.files[0];
//     if (file) {
//         console.log('File selected:', file.name);

//         const formData = new FormData(document.getElementById('uploadForm'));
//         const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
//         formData.append('file', file);
//         console.log('formData:', formData);

//         fetch(`${conversationId}/upload`, {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': csrfToken,
//             },
//             body: formData
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//                 // Display the selected file in the chat area
//                 const fileMessage = document.createElement('div');
//                 fileMessage.className = 'file-message';
//                 fileMessage.innerHTML = `<p>File selected: ${file.name}</p>`;
//                 chatting.appendChild(fileMessage);
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     }
// });

// display message
function addMessage(content, sender) {
    const div = document.createElement('div');

    if (sender === 'User') {
        div.innerHTML = `<div><p>${content}</p></div>`;
        div.classList.add('ib_user');
    } else {
        div.innerHTML = `<p>${content}</p>`;
        div.classList.add('ib_bot');
    }

    chatting.appendChild(div);
    input.removeAttribute('readonly');
}

// check input ----------------------------------------------

function checkName(name) {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
}

function checkAge(age) {
    const regex = /^[0-9]+$/;
    return regex.test(age);
}

function checkGender(gender) {
    const regex = /^(nam|nữ|trai|gái)$/i;
    return regex.test(gender);
}

function checkContact(contact) {
    const phoneRegex = /^[0-9]{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(contact) || emailRegex.test(contact);
}

async function sendQuery(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        console.log('Send button clicked');
        const userMessage = input.value.trim();

        if (!userMessage) return;
        input.setAttribute('readonly', 'true');

        // await updateScript(userMessage, 'User', num);
        addMessage(userMessage, 'User');
        input.value = '';

        switch (num) {
            case 0:
                if (!checkName(userMessage)) {
                    console.log('Name: ', checkName(userMessage));
                    addMessage('Tên không hợp lệ, vui lòng nhập lại', 'Bot');
                    input.removeAttribute('readonly');

                    return;
                }
                userInfo.Name = userMessage;
                break;
            case 1:
                if (!checkAge(userMessage)) {
                    addMessage('Tuổi không hợp lệ, vui lòng nhập lại', 'Bot');
                    input.removeAttribute('readonly');

                    return;
                }
                userInfo.Age = userMessage;
                break;
            case 2:
                if (!checkGender(userMessage)) {
                    addMessage('Giới tính không hợp lệ, vui lòng nhập lại', 'Bot');
                    input.removeAttribute('readonly');

                    return;
                }
                userInfo.Gender = userMessage;
                break;
            case 3:
                if (!checkContact(userMessage)) {
                    addMessage('Liên hệ không hợp lệ, vui lòng nhập lại', 'Bot');
                    input.removeAttribute('readonly');

                    return;
                }
                userInfo.Contact = userMessage;
                break;
            case num >= 4 && num < 8:
                userInfo.Symtoms.push(userMessage);
                break;
            case num >= 8 && num < 12:
                userInfo.Disease.push(userMessage);
                break;
            case num >= 12 && num <= 13:
                userInfo.Medicine.push(userMessage);
                break;
            case 14:
                userInfo.Inherited.push(userMessage);
                break;
            case num >= 15 && num < 18:
                userInfo.LifeStyle.push(userMessage);
                break;
            case 18:
                userInfo.Additional.push(userMessage);
                break;
            default:

                break;
        }
        num += 1;
        
        await Question(num);
        console.log('userInfo:', userInfo);
    }
}

function sort(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

async function Question(num) {
    let number;
    console.log('Questionnaire:', questionnaire);
    console.log('questions:', questions);
    input.setAttribute('readonly', 'true');
    if (num < 4) {
        await updateScript(questions[num].content[0], 'Bot', num);
        addMessage(questions[num].content[0], 'Bot');
    } else if (num >= 4 && num < 8) {
        if (num === 4) {
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
            questions = sort(questions)
        }
        
        let randomQuestion;
        for (let i = 4;; i++) {
            if (!questionnaire.includes(questions[i - 4].num)) {
                randomQuestion = questions[i - 4].content[Math.floor(Math.random() * (questions[i-4].content.length))];
                number = questions[i-4].num;
                questionnaire.push(number);
                break;
            }
        }
        // console.log("questions: ", questions);
        // console.log('randomQuestion:', randomQuestion);
        // console.log('num:', Math.floor(Math.random() * (questions[num-4].content.length)));
        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else if (num >= 8 && num < 12) {
        if (num === 8) {
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
            questions = sort(questions)
        }

        let randomQuestion;
        for (let i = 8;; i++) {
            if (!questionnaire.includes(questions[i - 8].num)) {
                randomQuestion = questions[i - 8].content[Math.floor(Math.random() * (questions[i-8].content.length))];
                number = questions[i-8].num;
                questionnaire.push(questions[i-8].num);
                break;
            }
        }

        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else if (num >= 12 && num < 14) {
        if (num === 12) {
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
            questions = sort(questions)
        }

        let randomQuestion;
        for (let i = 12;; i++) {
            if (!questionnaire.includes(questions[i - 12].num)) {
                randomQuestion = questions[i - 12].content[Math.floor(Math.random() * (questions[i-12].content.length))];
                questionnaire.push(questions[i-12].num);
                number = questions[i-12].num;
                break;
            }
        }
        
        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else if (num === 14) {
        await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
            questions = fetchedQuestions;
        });
        questions = sort(questions)

        let randomQuestion;
        for (let i = 14;; i++) {
            if (!questionnaire.includes(questions[i - 14].num)) {
                randomQuestion = questions[i - 14].content[Math.floor(Math.random() * (questions[i-14].content.length))];
                questionnaire.push(questions[i-14].num);
                number = questions[i-14].num;
                break;
            }
        }
        
        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else if (num >= 15 && num < 18) {
        if (num === 15) {
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
            questions = sort(questions)
        }

        let randomQuestion;
        for (let i = 15;; i++) {
            if (!questionnaire.includes(questions[i - 15].num)) {
                randomQuestion = questions[i - 15].content[Math.floor(Math.random() * (questions[i-15].content.length))];
                questionnaire.push(questions[i-15].num);
                number = questions[i-15].num;
                break;
            }
        }
        
        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else if (num === 18) {
        await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
            questions = fetchedQuestions;
        });
        questions = sort(questions)
        
        let randomQuestion;
        for (let i = 18;; i++) {
            if (!questionnaire.includes(questions[i - 18].num)) {
                randomQuestion = questions[i - 18].content[Math.floor(Math.random() * (questions[i-18].content.length))];
                questionnaire.push(questions[i-18].num);
                number = questions[i-18].num;
                break;
            }
        }

        // await updateScript(randomQuestion, 'Bot', number);
        addMessage(randomQuestion, 'Bot');
    } else {
        addMessage('Cảm ơn bạn đã cung cấp thông tin', 'Bot');

    }
    console.log('num_Question:', num);

}

function updateScript(message, sender, num) {

    console.log('update script:', message, sender, num, conversationId);
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    fetch('/updateScript', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            sender: sender,
            message: message,
            num: num,
            conId: conversationId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('update script success:', data);
    })
}

async function fetchQuestionsByTag(tag) {
    const response = await fetch('/static/website/question.json');
    const data = await response.json();
    const tagData = data.questions.find(q => q.tag === tag);
    return tagData ? tagData.questions : [];
}              

console.log('Script loaded ', num, conversationId);