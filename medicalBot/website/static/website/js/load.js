
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded");
    if ('{{conversation}}') {
        startConversation();
    }
});

async function startConversation() {
    console.log("num: " + num);
    if (num < 4) {
        tagNum = 0;
        await fetchQuestionsByTag(tag[tagNum][0]).then(fetchedQuestions => {
            questions = fetchedQuestions;
        });
    } else if (num >= 4 && num < 8) {
        tagNum = 0;
        if(num != 4)
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
    } else if (num >= 8 && num < 12) { 
        tagNum = 1;
        if(num != 8)
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
        questions = sort(questions)
    } else if (num >= 12 && num < 14) {
        tagNum = 2;
        if(num != 12)
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
        questions = sort(questions)
    } else if (num >= 15 && num < 18) {
        tagNum = 4;
        if(num != 15)
            await fetchQuestionsByTag(tag[++tagNum][0]).then(fetchedQuestions => {
                questions = fetchedQuestions;
            });
       
    } else if (num === 14) {
        tagNum = 3;
    }
    if (chat && num != 0) {
        Question(num);
    }
}