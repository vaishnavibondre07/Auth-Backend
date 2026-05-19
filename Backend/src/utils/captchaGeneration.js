export const generateCaptcha = () => {

    const number1 = Math.floor(Math.random() * 10);
    const number2 = Math.floor(Math.random() * 10);

    const operators = ['+', '-', '*'];

    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question, answer;

    switch(operator) {
        case '+':
            answer = number1 + number2;
            question = `${number1} + ${number2}`;
            break;

        case '-':
            answer = number1 - number2;
            question = `${number1} - ${number2}`;
            break;

        case '*':
            answer = number1 * number2;
            question = `${number1} * ${number2}`;
            break;
    }

    return {
        question, 
        answer
    }
}
 