const questions = [
        {
            "id": 17,
            "question": "Which of these features do you use most?",
            "question_options": ["Option 1", "Option 2", "Option 3"],
            "question_type": "single",
            "survey_id": 2
        },
        {
            "id": 18,
            "question": "Select all that apply to your workflow:",
            "question_options": ["Option 1", "Option 2", "Option 3"],
            "question_type": "multiple",
            "survey_id": 2
        },
        {
            "id": 20,
            "question": "On a scale of 1-10, how likely are you to recommend us?",
            "question_options": { "max": 5, "min": 1, "step": 1 },
            "question_type": "scale",
            "survey_id": 2
        }
    ];

    let currentStep = 0;
    const answers = {};

    const container = document.getElementById('questions-container');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function initSurvey() {
        questions.forEach((q, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `question-step ${index === 0 ? 'active' : ''}`;
            stepDiv.id = `step-${index}`;

            const label = document.createElement('span');
            label.className = 'label';
            label.innerText = q.question;
            stepDiv.appendChild(label);

            if (q.question_type === 'single' || q.question_type === 'multiple') {
                const type = q.question_type === 'single' ? 'radio' : 'checkbox';
                q.question_options.forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'option-item';
                    item.innerHTML = `
                        <label>
                            <input type="${type}" name="q${q.id}" value="${opt}" onchange="handleInput(${index}, '${q.question_type}', this)">
                            <span>${opt}</span>
                        </label>
                    `;
                    stepDiv.appendChild(item);
                });
            } else if (q.question_type === 'scale') {
                const scaleGroup = document.createElement('div');
                scaleGroup.className = 'scale-group';
                const { min, max, step } = q.question_options;
                for (let i = min; i <= max; i += step) {
                    const btn = document.createElement('div');
                    btn.className = 'scale-item';
                    btn.innerText = i;
                    btn.onclick = () => handleScale(index, i, btn);
                    scaleGroup.appendChild(btn);
                }
                stepDiv.appendChild(scaleGroup);
            }

            container.appendChild(stepDiv);
        });
        updateUI();
    }

    window.handleInput = (index, type, input) => {
        const qId = questions[index].id;
        if (type === 'single') {
            answers[qId] = input.value;
        } else {
            if (!answers[qId]) answers[qId] = [];
            if (input.checked) answers[qId].push(input.value);
            else answers[qId] = answers[qId].filter(v => v !== input.value);
        }
        validate();
    };

    window.handleScale = (index, value, element) => {
        const qId = questions[index].id;
        const parent = element.parentElement;
        parent.querySelectorAll('.scale-item').forEach(i => i.classList.remove('selected'));
        element.classList.add('selected');
        answers[qId] = value;
        validate();
    };

    function validate() {
        const q = questions[currentStep];
        const answer = answers[q.id];
        let isValid = false;

        if (q.question_type === 'multiple') {
            isValid = answer && answer.length > 0;
        } else {
            isValid = answer !== undefined && answer !== null;
        }

        nextBtn.disabled = !isValid;
    }

    function updateUI() {
        document.querySelectorAll('.question-step').forEach((step, i) => {
            step.classList.toggle('active', i === currentStep);
        });

        const progress = (currentStep / questions.length) * 100;
        progressBar.style.width = progress + '%';

        prevBtn.disabled = currentStep === 0;
        nextBtn.innerText = currentStep === questions.length - 1 ? 'Submit' : 'Next';
        validate();
    }

    nextBtn.onclick = () => {
        if (currentStep < questions.length - 1) {
            currentStep++;
            updateUI();
        } else {
            console.log("Final Answers:", answers);
            progressBar.style.width = '100%';
            document.getElementById('survey-content').style.display = 'none';
            document.getElementById('success-screen').style.display = 'block';
        }
    };

    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    };

    initSurvey();
