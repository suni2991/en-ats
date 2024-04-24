const PsychometricQ = {
    topic: 'Psychometric',
    level: 'Beginner',
    totalQuestions: 10,
    perQuestionScore: 1,
    questions: [
       {
         question:
           'School (Identify the word with the strongest connection)',
         choices: ['Student', 'Report Card', 'Test', 'Learning'],
         type: 'MCQs',
         correctAnswer: 'Student',
       },
       {
         question:
           'Desert (Identify the word with the strongest connection)',
         choices: ['Cactus', 'Arid', 'Oasis', 'Flat'],
         type: 'MCQs',
         correctAnswer: 'Arid',
       },
       {
         question:
           'Statement:  If he is intelligent, he will pass the examination. Assumptions:               I. To pass, he must be intelligent.               II. He will pass the examination.',
         choices: [
           'Only assumption I is implicit',
           'Only assumption II is implicit',
           'Either I or II is implicit',
           'Neither I nor II is implicit',
           'Both I and II are implicit'
         ],
         type: 'MCQs',
         correctAnswer: 'Only assumption I is implicit',
       },
       {
         question: 'Choose the word which is different from the rest',
         choices: ['Volume', 'Size', 'Large', 'Shape'],
         type: 'MCQs',
         correctAnswer: 'Large',
       },
       {
         question: 'Which word does NOT belong with the others?',
         choices: ['Index', 'Glossary', 'Chapter', 'Book'],
         type: 'MCQs',
         correctAnswer: 'Book',
       },
       {
         question: 'Which word is the odd man out? ',
         choices: ['Hate', 'Fondness', 'Liking', 'Attachment'],
         type: 'MCQs',
         correctAnswer: 'Hate',
       },
       {
         question: 'Odometer is to mileage as compass is to',
         choices: ['Speed', 'Hiking', 'Needle', 'Direction'],
         type: 'MCQs',
         correctAnswer: 'Direction',
       },
       {
         question: 'Marathon is to race as hibernation is to ',
         choices: ['Winter', 'Bear', 'Dream', 'Sleep'],
         type: 'MCQs',
         correctAnswer: 'Sleep',
       },
      {
        question: 'MONK: DEVOTION (Choose the pair that best represents a similar relationship to the one expressed in the original pair of words)  ',
        choices: ['Maniac: pacifism', 'Explorer: contentment', 'Visionary: complacency', 'Rover: wanderlust'],
        type: 'MCQs',
        correctAnswer: 'Rover: wanderlust',
      },
      {
        question: 'Daisy: Flower plant   Bungalow:?  (Choose the pair that best represents a similar relationship to the one expressed in the original pair of words)',
        choices: ['Building', 'Cottage', 'Apartment','City'],
        type: 'MCQs',
        correctAnswer: 'Building',
      },
    ],
  }
export default PsychometricQ