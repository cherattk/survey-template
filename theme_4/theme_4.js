const surveyData = [
        {
            "id": 17,
            "question": "Question 1 : choisir une seule option",
            "question_options": ["Option 1", "Option 2", "Option 3"],
            "question_type": "single",
            "survey_id": 2
        },
        {
            "id": 18,
            "question": "Question 2 : Choisir une ou plusieurs options",
            "question_options": ["Option 1", "Option 2", "Option 3"],
            "question_type": "multiple",
            "survey_id": 2
        },
        {
            "id": 20,
            "question": "Question 3 : sur une echelle de 1 a 10 comment etait votre derniere experience dans notre boutique",
            "question_options": { "max": 10, "min": 1, "step": 1 },
            "question_type": "scale",
            "survey_id": 2
        }
    ];

    function renderSurvey() {
        const app = document.getElementById('app');
        
        let html = `
            <div class="survey-page">
                <div class="survey-header">      
                    <h1 class="survey-title">Customer Survey</h1>
                    <p class="survey-description">
                        Please take a moment to fill out this survey. Your feedback is valuable to us.
                    </p>
                </div>
                <div class="question-list">
        `;

        surveyData.forEach(q => {
            html += `<div class="question">
                        <p class="question-text"><span>${q.question}</span></p>`;

            if (q.question_type === 'single' || q.question_type === 'multiple') {
                html += `<ul class="question-options">`;
                const inputType = q.question_type === 'single' ? 'radio' : 'checkbox';
                
                q.question_options.forEach((opt, index) => {
                    const optionId = `${q.id}-option-${index}`;
                    html += `
                        <li class="question-list-option">
                            <input type="${inputType}" class="question-${inputType}" name="${q.id}" id="${optionId}" value="${opt}">
                            <label for="${optionId}">${opt}</label>
                        </li>`;
                });
                html += `</ul>`;
            } 
            else if (q.question_type === 'scale') {
                html += `<div class="question-scale">
                            <div class="question-scale-content">`;
                const { min, max, step } = q.question_options;
                for (let i = min; i <= max; i += step) {
                    const scaleId = `scale-${q.id}-${i}`;
                    html += `
                        <div class="question-scale-value">
                            <input id="${scaleId}" type="radio" name="scale-${q.id}" value="${i}" />
                            <label for="${scaleId}">${i}</label>
                        </div>`;
                }
                html += `</div></div>`;
            }

            html += `</div>`;
        });

        html += `
                </div>
                <div class="submit-container">
                    <button class="btn-submit" onclick="handleSubmit()">Submit Feedback</button>
                </div>
            </div>`;

        app.innerHTML = html;
    }

    window.handleSubmit = () => {
        const results = {};
        surveyData.forEach(q => {
            if (q.question_type === 'multiple') {
                const checked = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`)).map(el => el.value);
                results[q.id] = checked;
            } else if (q.question_type === 'single') {
                const checked = document.querySelector(`input[name="${q.id}"]:checked`);
                results[q.id] = checked ? checked.value : null;
            } else if (q.question_type === 'scale') {
                const checked = document.querySelector(`input[name="scale-${q.id}"]:checked`);
                results[q.id] = checked ? checked.value : null;
            }
        });
        console.log("Collected Data:", results);
        alert("Check console for results!");
    };

    window.onload = renderSurvey;
    